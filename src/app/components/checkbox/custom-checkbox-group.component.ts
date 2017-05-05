import { Component, Input, Output, EventEmitter, forwardRef, QueryList} from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service';
import { Field } from '../../models/field.model';
import { InputGroup } from '../../models/input-group.model';
import { CheckboxItem } from '../../models/checkbox-item.model';
import { CheckboxField } from '../../models/checkbox-field.model';

@Component({
  selector: 'custom-checkbox-group',
  template: `
      <h5 [ngClass]="{'required_field': validationObject.required}">{{validationObject.title}}</h5>
      <div *ngFor="let item of validationObject.items">
          <label>
            <input type="checkbox"
            [disabled]="validationObject.disabled" (click)="choice(item.val)">
            <span [ngClass]="{'error': errorMessage}">{{item.val}}</span>
          </label>
      </div>
      <div class="has-error">{{errorMessage}}</div>
    `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => CustomCheckboxGroup) }]
})

export class CustomCheckboxGroup extends InputGroup {
  constructor(_validationMessages: ValidationMessages) {
    super();
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
  }

  @Input() validationObject: CheckboxField;
  
  private errorMessage: string;
  private validationMessages: ValidationMessages;

  // Methods

  choice(value: string) {
    this.validationObject.value = value
    console.log(value);
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

