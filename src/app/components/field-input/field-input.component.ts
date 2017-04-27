import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service'
import { Field } from '../../models/field.model'
import { InputGroup } from '../../models/input-group.model'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'field-input',
  template: `
      <div class="form-group" [ngClass]="{ 'has-danger': errorMessage && myPrivateValue != undefined, 'has-success': !errorMessage && myPrivateValue != undefined}">
        <label class="form-control-label" [ngClass]="{'required_field': validationProperty.required}" *ngIf="validationProperty.label" for="nickname" >{{validationProperty.label}}</label>
        <input 
          type="text" 
          class="form-control form-control-danger form-control-success"
          [disabled]="validationProperty.disabled"
          id="nickname" 
          [value]="customText" 
          (input)="customText = $event.target.value">
        <div *ngIf="errorMessage" class="form-control-feedback">{{errorMessage}}</div>
      </div>
      `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => FieldInput) }]

})

export class FieldInput extends InputGroup {

  private errorMessage: string;
  private validationMessages: ValidationMessages;
  constructor(_validationMessages: ValidationMessages) {
    super();
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
  }

  private myPrivateValue: string;
  @Input() validationProperty: Field;

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
    if (this.validationProperty.required) {
      this.validationMessages.IsRequired(val, errors);
    }

    if (this.validationProperty.customRule != undefined) {
      errors = errors.concat(this.validationProperty.customRule(val));
    }

    if (errors.length > 0) {
      this.errorMessage = errors.join(" | ");
    }
    else {
      this.validationProperty.value = this.myPrivateValue;
      this.errorMessage = "";
    }
  }

  forceValidation = function () {
    if (this.myPrivateValue == undefined) {
      this.myPrivateValue = "";
    }
    this.customText = this.myPrivateValue;
    return this.errorMessage == "";
  }
}

