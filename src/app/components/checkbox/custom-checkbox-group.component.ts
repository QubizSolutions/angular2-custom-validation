import { Component, Input, Output, EventEmitter, forwardRef, QueryList, OnInit} from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service';
import { Field } from '../../models/field.model';
import { InputGroup } from '../../models/input-group.model';
import { CheckboxItem } from '../../models/checkbox-item.model';
import { CheckboxField } from '../../models/checkbox-field.model';
import { LocalStorageStatus } from '../../services/local-storage-status.service';

@Component({
  selector: 'custom-checkbox-group',
  template: `
      <h5 [ngClass]="{'required_field': validationObject.required}">{{validationObject.title}}</h5>
      <div *ngFor="let item of validationObject.items">
          <label>
            <input type="checkbox"
            [disabled]="validationObject.disabled" (change)="choice($event, item.val)" [checked]="item.checked">
            <span [ngClass]="{'error': errorMessage}">{{item.val}}</span>
          </label>
      </div>
      <div class="error">{{errorMessage}}</div>
    `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => CustomCheckboxGroup) }]
})

export class CustomCheckboxGroup extends InputGroup implements OnInit {

  pickedItems: Array<string>;

  constructor(_validationMessages: ValidationMessages, private lStorage: LocalStorageStatus) {
    super();
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
    this.pickedItems = new Array;
  }

  ngOnInit() {
    if (this.lStorage.localStorageStatus) {
      this.validationObject.items.forEach((item) => {
        if (localStorage.getItem(this.validationObject.title + ' ' + item.val) == 'checked'){
          item.checked = true;
          if (item.checked) {
            this.pickedItems.push(item.val);
            this.validationObject.checkedItems = this.pickedItems;
          }
        }
      })
    }
  }

  @Input() validationObject: CheckboxField;
  
  private errorMessage: string;
  private validationMessages: ValidationMessages;

  // Methods

  choice(event, item: string) {
    let localKey = this.validationObject.title + ' ' + item;
    if (event.target.checked) {
      this.pickedItems.push(item);
      this.lStorage.localStorageStatus ? localStorage.setItem(localKey, 'checked') : null
    } else {
      let itemNo = this.pickedItems.indexOf(item);
      this.lStorage.localStorageStatus ? localStorage.removeItem(localKey) : null
      if (itemNo !== -1) {
        this.pickedItems.splice(itemNo, 1);
      }
    }
    this.validationObject.checkedItems = this.pickedItems;

    if (this.errorMessage) {
      this.errorMessage = undefined;
    }
  }

  forceValidation = function () {
    if (
      this.validationObject.required &&
      this.validationObject.value == undefined && 
      !this.validationObject.disabled &&
      this.validationObject.checkedItems == undefined
    ) {
      this.errorMessage = "Please select something";
      return false;
    }
    return true;
  }
}

