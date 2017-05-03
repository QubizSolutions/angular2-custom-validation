import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MyService } from '../../services/sample.service';
import { InputGroup } from '../../models/input-group.model'
import 'rxjs/add/operator/debounceTime';
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
      <label class="form-control-label" [ngClass]="{'required_field': required}">{{label}}</label>
      <button class="btn btn-outline-primary form-control" id="dropdownBasic1" [disabled]="disabled" ngbDropdownToggle>{{selectedItem ? selectedItem.name : "None"}}</button>
      <div class="dropdown-menu">
        <input
          id="searchDropdown" 
          type="text" 
          placeholder="Search..."
          [formControl]="controlSearch"
          (ngModelChange)="searchByChangedTerm()"
          (click)="$event.stopPropagation()">
          
        <div class="dropdown-content" aria-labelledby="dropdownBasic1"
              infinite-scroll
              [infiniteScrollDistance]="scrollDistance"
              [infiniteScrollThrottle]="throttle"
              [scrollWindow]="false"
              (scrolled)="onScrollDown()">
              <div class="dropdown-item series" *ngFor="let i of array" (click)="setSelected(i)">
                {{ i.name }}
              </div>
        </div>
      </div>
      <div *ngIf="errorMessage" class="form-control-feedback">{{errorMessage}}</div>
    </div>
  `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => CustomDropdown) }]
})

export class CustomDropdown extends InputGroup {
  array: Array<any> = new Array<any>();
  throttle = 30;
  scrollDistance = 1;
  incrementPage: number = 1;
  selectedItem: string;
  private errorMessage: string;
  searchTerm: string = "";
  controlSearch = new FormControl();

  // Optional fields
  @Input() required: boolean;
  @Input() label: string;
  @Input() disabled: boolean;

  constructor(private dbProvider: MyService) {
    super();
    this.initialItemsLoad(this.searchTerm);
  }

  initialItemsLoad(term) {
    this.dbProvider
      .searchEntries(term, this.incrementPage)
      .subscribe((data: Array<any>) => {
        this.array = data
    });
  }

  searchByChangedTerm() {
    this.controlSearch.valueChanges
      .debounceTime(400)
      .subscribe(term => {
        this.incrementPage = 1;
        this.initialItemsLoad(term);
      });
  }

  setSelected(selected: string) {
    this.selectedItem = selected;
    if (this.errorMessage) {
      this.errorMessage = undefined;
    }
  }

  loadItems(term) {
    this.dbProvider
      .searchEntries(term, this.incrementPage)
      .subscribe((data: Array<any>) => {
        this.array = this.array.concat(data);
      });
  }

  lazyLoadItems() {
    if (this.controlSearch.value !== null) {
      this.loadItems(this.controlSearch.value);
    } else {
      this.loadItems(this.searchTerm);
    }
  }

  onScrollDown() {
    this.lazyLoadItems();
    this.incrementPage++;
  }

  forceValidation = function () {
    if (this.required && this.selectedItem == undefined) {
      this.errorMessage = "Please select something";
      return false;
    }
    return true;
  }
}

