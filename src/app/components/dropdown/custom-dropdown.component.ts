import { Component, forwardRef, Input } from '@angular/core';
import { MyService } from '../../services/sample.service';
import { InputGroup } from '../../models/input-group.model'

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
          [ngModel]="searchTerm"
          (keyup)="search($event)"
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
  array: Array<any>;
  throttle = 30;
  scrollDistance = 1;
  dbProvider: MyService;
  searchTerm: string = '';
  incrementPage: number = 1;
  selectedItem: string;
  private errorMessage: string;

  // Optional fields
  @Input() required: boolean;
  @Input() label: string;
  @Input() disabled: boolean;

  constructor(myService: MyService) {
    super();
    this.dbProvider = myService;
    this.array = new Array<any>();
    this.addItems();
  }

  setSelected(selected: string) {
    this.selectedItem = selected;
    if (this.errorMessage) {
      this.errorMessage = undefined;
    }
  }

  addItems() {
    // this.dbProvider
    //   .getItems(this.incrementPage)
    //   .subscribe((data: Array<any>) => {
    //     this.array = this.array.concat(data);
    //   })
    this.dbProvider
      .getItemsSearch(this.searchTerm, this.incrementPage)
      .subscribe((data: Array<any>) => {
         this.array = this.array.concat(data);
    });
  }

  onScrollDown() {
    this.addItems();
    this.incrementPage++;
  }

  search(event) {
    this.searchTerm = event.target.value;
    this.incrementPage = 1;
    this.dbProvider
      .getItemsSearch(this.searchTerm, this.incrementPage)
      .subscribe((data: Array<any>) => {
      this.array = data
    });
  }
  forceValidation = function () {
    if (this.required && this.selectedItem == undefined) {
      this.errorMessage = "Please select something";
      return false;
    }
    return true;
  }
}

