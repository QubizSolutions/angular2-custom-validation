import { Component, forwardRef, Input, Output, OnChanges, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaginatedSearch } from '../../services/paginated-search.service';
import { InputGroup } from '../../models/input-group.model'
import { Field } from '../../models/field.model';
import { DropdownField } from '../../models/dropdown-field.model';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { LocalStorageStatus } from '../../services/local-storage-status.service';
@Component({
  selector: 'custom-dropdown',
  styles: [`
    .dropdown-content {
      max-height: 200px;
      overflow: auto;
    }
  `],
  template: `
    <div ngbDropdown [ngClass]="{ 'has-danger': errorMessage}">
      <label class="form-control-label" [ngClass]="{'required_field': validationObject.required}">{{validationObject.label}}</label>
      <button class="btn btn-outline-primary form-control" id="dropdownBasic1" [disabled]="validationObject.disabled" ngbDropdownToggle>{{validationObject.value ? validationObject.value : "None"}}</button>
      <div class="dropdown-menu">
        <input
          id="searchDropdown" 
          type="text" 
          placeholder="Search..."
          [formControl]="controlSearch"
          (click)="$event.stopPropagation()">
          
        <div class="dropdown-content" aria-labelledby="dropdownBasic1"
              infinite-scroll
              [infiniteScrollDistance]="scrollDistance"
              [infiniteScrollThrottle]="throttle"
              [scrollWindow]="false"
              (scrolled)="onScrollDown()">
              <div class="dropdown-item series" *ngFor="let i of array" (click)="setSelected(i.name)">
                {{ i.name }}
              </div>
        </div>
      </div>
    </div>
    <div class="error_msg form-control-feedback">{{errorMessage}}</div>
  `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => CustomDropdown) }]
})

export class CustomDropdown extends InputGroup implements OnInit {
   constructor(private dbProvider: PaginatedSearch, private lStorage: LocalStorageStatus) {
    super();
  }
  
  array: Array<string> = new Array<string>();
  throttle = 30;
  scrollDistance = 1;
  incrementPage: number = 1;
  searchTerm: string = "";
  controlSearch = new FormControl();

  private errorMessage: string;

  // Optional field
  @Input() validationObject: DropdownField;

  ngOnInit() {
    this.initialItemsLoad(this.searchTerm);
    this.controlSearch.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(term => {
        this.incrementPage = 1;
        return this.initialItemsLoad(term)
      });
      if (this.lStorage.localStorageStatus && localStorage.getItem(this.validationObject.label)){
        let lsDropdownValue = localStorage.getItem(this.validationObject.label);
        this.setSelected(lsDropdownValue);
      }
  }

  // Methods
  
  initialItemsLoad(term) {
    this.dbProvider
      .searchEntries(term, this.incrementPage, this.validationObject.dropdownItem)
      .subscribe((data: Array<string>) => this.array = data);
  }

  setSelected(selected: string) {
    this.validationObject.value = selected;
    if (this.lStorage.localStorageStatus && this.validationObject.value !== null) {
      localStorage.setItem(this.validationObject.label, this.validationObject.value)
    }
    if (this.errorMessage) {
      this.errorMessage = undefined;
    }
  }

  loadItems() {
    this.dbProvider
      .searchEntries(this.controlSearch.value !== null ? this.controlSearch.value : "", this.incrementPage, this.validationObject.dropdownItem)
      .subscribe((data: Array<string>) => this.array = this.array.concat(data));
  }

  onScrollDown() {
    this.loadItems();
    this.incrementPage++;
  }

  forceValidation = function () {
    if (this.validationObject.required && this.validationObject.value == undefined) {
      this.errorMessage = "Please select something";
      return false;
    }
    return true;
  }
}

