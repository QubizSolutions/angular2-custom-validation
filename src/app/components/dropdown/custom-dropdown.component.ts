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
      <label class="form-control-label">{{label}}</label>
      <button class="btn btn-outline-primary form-control" id="dropdownBasic1" ngbDropdownToggle>{{selectedItem ? selectedItem : "None"}}</button>
      <div class="dropdown-menu dropdown-content" aria-labelledby="dropdownBasic1"
            infinite-scroll
            [infiniteScrollDistance]="scrollDistance"
            [infiniteScrollThrottle]="throttle"
            [scrollWindow]="false"
            (scrolled)="onScrollDown()">
          <button class="dropdown-item" *ngFor="let i of array" (click)="setSelected(i)">
            {{ i }}
          </button>
      </div>
      <div *ngIf="errorMessage" class="form-control-feedback">{{errorMessage}}</div>
    </div>
  `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => CustomDropdown) }]
})

export class CustomDropdown extends InputGroup{
  array: Array<string>;
  throttle = 30;
  scrollDistance = 1;
  dbProvider: MyService;
  increment = 0;
  selectedItem: string;
  private errorMessage: string;

  // Optional fields
  @Input() required: boolean;
  @Input() label: string;

  constructor(myService: MyService) {
    super();
    this.dbProvider = myService;
    this.array = new Array<string>();
    this.addItems();
  }

  setSelected(selected: string){
    this.selectedItem = selected;
    if (this.errorMessage){
      this.errorMessage = undefined;
    }
  }

  addItems() {
    var items = this.dbProvider.getItems(this.increment);
    this.array = this.array.concat(items);
    this.increment++;
  }

  onScrollDown() {
    console.log('scrolled!!');
    this.addItems();
  }

  forceValidation = function () {
    if (this.required && this.selectedItem == undefined) {
      this.errorMessage = "Please select something";
    }
  }
}

