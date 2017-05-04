import { Component, Input, Output, EventEmitter, forwardRef, QueryList} from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service';
import { Field } from '../../models/field.model';
import { InputGroup } from '../../models/input-group.model';
import { RadioItem } from '../../models/radio-item.model';
import { RadioField } from '../../models/radio-field.model';
@Component({
  selector: 'custom-radio-group',
  template: `
    <div *ngFor="let item of validationObject.items">
      <input type="radio" [name]="item.name" id="{{item.value}}"
      [disabled]="validationObject.disabled" (change)="choice(item.value)">
      <label for="{{item.value}}">{{item.value}}</label>
    </div>
    <div *ngIf="errorMessage" class="form-control-feedback">{{errorMessage}}</div>
    `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => CustomRadioGroup) }]
})

export class CustomRadioGroup extends InputGroup {

  private errorMessage: string;
  private validationMessages: ValidationMessages;

  constructor(_validationMessages: ValidationMessages) {
    super();
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
  }

  // Optional fields
  @Input() validationObject: RadioField;

  choice(value: string) {
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

