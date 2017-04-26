import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service'

@Component({
  selector: 'custom-input',
  template: `
      <div class="form-group" [ngClass]="{ 'has-danger': errorMessage, 'has-success': !errorMessage}">
        <label class="form-control-label">{{label}}</label>
        <input 
          type="text" 
          class="form-control" 
          [ngClass]="{ 
            'form-control-danger': errorMessage, 
            'form-control-success': !errorMessage}" 
          [value]="customText" 
          (input)="customText = $event.target.value"/>
        <div *ngIf="errorMessage" class="form-control-feedback">{{errorMessage}}</div>
      </div>

      `
})

export class CustomInput {

  private errorMessage: string;
  private validationMessages: ValidationMessages;
  constructor(_validationMessages: ValidationMessages) {
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
  }

  // Optional fields
  @Input() validationRule: Function;
  @Input() required: boolean;
  @Input() label: string;

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
    if (this.required) {
      this.validationMessages.IsRequired(val, errors);
    }

    if (this.validationRule != undefined) {
      errors = errors.concat(this.validationRule(val));
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

