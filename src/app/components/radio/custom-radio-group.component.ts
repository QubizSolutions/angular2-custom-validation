import { Component, Input, Output, EventEmitter, forwardRef, QueryList, OnInit} from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service';
import { Field } from '../../models/field.model';
import { InputGroup } from '../../models/input-group.model';
import { RadioItem } from '../../models/radio-item.model';
import { RadioField } from '../../models/radio-field.model';

@Component({
  selector: 'custom-radio-group',
  template: `
      <h5 [ngClass]="{'required_field': validationObject.required}">{{validationObject.title}}</h5>
      <div *ngFor="let item of validationObject.items">
          <label>
            <input type="radio" [name]="validationObject.radioButtonIdentifier"
            [disabled]="validationObject.disabled" (change)="choice(item.value)" [checked]="item.checked">
            <span [ngClass]="{'error': errorMessage}">{{item.value}}</span>
          </label>
      </div>
      <div class="error">{{errorMessage}}</div>
    `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => CustomRadioGroup) }]
})

export class CustomRadioGroup extends InputGroup implements OnInit {
  constructor(_validationMessages: ValidationMessages) {
    super();
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
  }

  @Input() validationObject: RadioField;
  private errorMessage: string;
  private validationMessages: ValidationMessages;
  isValid: boolean;

  ngOnInit() {
    // check localStorage in order to know how to set the values
    this.validationObject.items.forEach((item) => {
      if (localStorage.getItem(item.value) == 'checked'){
        item.checked = true;
        this.isValid = true;
      }
    })
    
  }

  // Methods

  choice(value: string) {
    this.validationObject.items.forEach((item) => {
        if (value == item.value){
          item.checked = true;
          if (item.checked == true) {
            localStorage.setItem(item.value, 'checked');
          }
        } else {
           item.checked = false;
           localStorage.removeItem(item.value);
        }
    })

    if (this.validationObject.changeDesign != undefined) {
      this.validationObject.changeDesign(value);
    }
    
    this.validationObject.value = value;
    if (this.errorMessage) {
      this.errorMessage = undefined;
    }
  }

  forceValidation = function () {
    if (
      this.validationObject.required && 
      this.validationObject.value == undefined && 
      !this.validationObject.disabled && 
      !this.isValid
    ) {
      this.errorMessage = "Please select something";
      return false;
    }
    return true;
  }
}

