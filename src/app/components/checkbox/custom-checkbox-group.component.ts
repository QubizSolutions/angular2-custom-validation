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

  constructor(private validationMessages: ValidationMessages, private lStorage: LocalStorageStatus) {
    super();
    this.errorMessage = "";
    this.pickedItems = new Array;
  }

  ngOnInit() {
      this.validationObject.items.forEach((item) => {
        if (this.validationObject.saveStorage == undefined) {
          this.populateFromStorage(this.lStorage.localStorageStatus, item);
        } else {
          this.populateFromStorage(this.validationObject.saveStorage, item);
      }
    })

  }

  populateFromStorage(value, item) {
    if (this.lStorage.getLocalStorageItem(value, this.validationObject.title + ' ' + item.val) == 'checked'){
        item.checked = true;
        if (item.checked) {
          this.pickedItems.push(item.val);
          this.validationObject.checkedItems = this.pickedItems;
        }
    }
  }

  @Input() validationObject: CheckboxField;
  
  private errorMessage: string;

  // Methods

  choice(event, item: string) {
    let localKey = this.validationObject.title + ' ' + item;
    if (event.target.checked) {
      this.pickedItems.push(item);
      if (this.validationObject.saveStorage == undefined) {
        this.lStorage.setLocalStorageItem(this.lStorage.localStorageStatus, 'checked', localKey);
      } else {
        this.lStorage.setLocalStorageItem(this.validationObject.saveStorage, 'checked', localKey);
      }
    } else {
      let itemNo = this.pickedItems.indexOf(item);
      if (itemNo !== -1) {
        this.pickedItems.splice(itemNo, 1);
      }
      this.lStorage.removeLocalStorageItem(localKey);
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

