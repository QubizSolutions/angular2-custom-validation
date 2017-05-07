import { Component, Input, Output, EventEmitter, forwardRef, QueryList} from '@angular/core';
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
            [disabled]="validationObject.disabled" (change)="choice(item.value)">
            <span [ngClass]="{'error': errorMessage}">{{item.value}}</span>
          </label>
      </div>
      <div class="error">{{errorMessage}}</div>
    `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => CustomRadioGroup) }]
})

export class CustomRadioGroup extends InputGroup {
  constructor(_validationMessages: ValidationMessages) {
    super();
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
  }

  @Input() validationObject: RadioField;
  
  private errorMessage: string;
  private validationMessages: ValidationMessages;

  // Methods

  choice(value: string) {
    if (this.validationObject.changeDesign != undefined) {
      this.validationObject.changeDesign(value);
    }
    
    this.validationObject.value = value;
    if (this.errorMessage) {
      this.errorMessage = undefined;
    }
  }

  forceValidation = function () {
    if (this.validationObject.required && this.validationObject.value == undefined && !this.validationObject.disabled) {
      this.errorMessage = "Please select something";
      return false;
    }
    return true;
  }
}

