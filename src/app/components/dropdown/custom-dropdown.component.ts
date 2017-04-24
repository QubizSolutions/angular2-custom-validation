import { Component } from '@angular/core';
import { MyService } from '../../services/sample.service';

@Component({
  selector: 'custom-dropdown',
  styles: [`
    .dropdown {
      max-height: 200px;
      overflow: auto;
    }
  `],
  template: `
    <div class="dropdown"
         infinite-scroll
         [infiniteScrollDistance]="scrollDistance"
         [infiniteScrollThrottle]="throttle"
         [scrollWindow]="false"
         (scrolled)="onScrollDown()">
      <p *ngFor="let i of array">
        {{ i }}
      </p>
    </div>
  `
})

/*  `
  <div ngbDropdown class="d-inline-block">
      <button class="btn btn-outline-primary" id="dropdownBasic1" ngbDropdownToggle>Toggle dropdown</button>
      <div class="dropdown-menu" aria-labelledby="dropdownBasic1"
      infinite-scroll
         [infiniteScrollDistance]="scrollDistance"
         [infiniteScrollThrottle]="throttle"
         [scrollWindow]="false"
         (scrolled)="onScrollDown()">
        <button *ngFor="let i of array">
        {{ i }}
      </button>
      </div>
    </div>` */
export class CustomDropdown {
  array: Array<string>;
  throttle = 30;
  scrollDistance = 1;
  dbProvider: MyService;
  increment = 0;

  constructor(myService: MyService) {
    this.dbProvider = myService;
    this.array = new Array<string>();
    this.addItems();
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
}

