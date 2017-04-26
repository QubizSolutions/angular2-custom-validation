import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service'
import { Field } from '../../models/field.model'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'field-input',
  template: `
      <div class="form-group" [ngClass]="{ 'has-danger': errorMessage}">
        <label class="form-control-label" *ngIf="validationProperty.label" for="nickname">{{validationProperty.label}}</label>
        <input 
          type="text" 
          class="form-control" 
          [ngClass]="{ 
            'form-control-danger': errorMessage}"  
          id="nickname" 
          [value]="customText" 
          (input)="customText = $event.target.value">
        <div *ngIf="errorMessage" class="form-control-feedback">{{errorMessage}}</div>
      </div>
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

