import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service'
import { Field } from '../../models/field.model'

@Component({
  selector: 'field-input',
  template: `
      <br/>
      <span *ngIf="validationProperty.label">{{validationProperty.label}}</span>
      <br/>
      <input [value]="customText" (input)="customText = $event.target.value">
      <span *ngIf="errorMessage" style="color:red">{{errorMessage}}</span>
      <br/>
      `
})

export class FieldInput {

  private errorMessage: string;
  private validationMessages: ValidationMessages;
  constructor(_validationMessages: ValidationMessages) {
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
  }

  @Input() validationProperty: Field;

  // customText property change event
  private myPrivateValue: string;
  @Output() customTextChange = new EventEmitter();

  // customText getter
  @Input()
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
      this.customTextChange.emit(this.myPrivateValue);
      this.errorMessage = "";
    }
  }

  public forceValidation = function () {
    if (this.myPrivateValue == undefined) {
      this.myPrivateValue = "";
    }
    this.customText = this.myPrivateValue;
  }
}

