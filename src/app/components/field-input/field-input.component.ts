import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service'
import { Field } from '../../models/field.model'
import { InputGroup } from '../../models/input-group.model'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'field-input',
  template: `
      <div class="form-group" [ngClass]="{ 'has-danger': errorMessage && myPrivateValue !== undefined, 'has-success': !errorMessage && myPrivateValue !== undefined && myPrivateValue !== emptyString && !validationObject.disabled}">
        <label class="form-control-label" [ngClass]="{'required_field': validationObject.required}" *ngIf="validationObject.label" for="nickname" >{{validationObject.label}}</label>
        <input 
          type="text" 
          class="form-control form-control-danger form-control-success"
          [disabled]="validationObject.disabled" 
          [value]="customText" 
          (input)="customText = $event.target.value">
        <div class="error_msg form-control-feedback">{{errorMessage}}</div>
      </div>
      `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => FieldInput) }]
})

export class FieldInput extends InputGroup {
  constructor(_validationMessages: ValidationMessages) {
    super();
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
  }

  private errorMessage: string;
  private validationMessages: ValidationMessages;
  private emptyString: string = "";
  private myPrivateValue: string;

  @Input() validationObject: Field;

  // customText getter
  get customText() {
    if (this.myPrivateValue == undefined) {
      return "";
    }
    return this.myPrivateValue;
  }

  // customText setter
  set customText(val: string) {
    this.myPrivateValue = val;
    var errors = new Array<string>();
    if (this.validationObject.required && !this.validationObject.disabled) {
      this.validationMessages.IsRequired(val, errors);
    }

    if (this.validationObject.customRule != undefined) {
      errors = errors.concat(this.validationObject.customRule(val));
    }

    if (errors.length > 0) {
      this.errorMessage = errors.join(" | ");
    }
    else {
      this.validationObject.value = this.myPrivateValue;
      this.errorMessage = "";
    }
  }

  // Methods

  forceValidation = function () {
    if (this.myPrivateValue == undefined) {
      this.myPrivateValue = "";
    }
    this.customText = this.myPrivateValue;
    return this.errorMessage == "";
  }
}

