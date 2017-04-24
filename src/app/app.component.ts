import { Component } from '@angular/core';
import { ValidationMessages } from './services/validation-messages.service'
import { Field } from './models/field.model'

@Component({
    selector: 'my-app',
    templateUrl: './app/app.component.html'
})
export class AppComponent {
    customForm = {
        firstName: new Field,
        lastName: new Field,
        nickName: new Field,
        gender: Boolean,
        //...
        favoritSerial: String
    };

    lengthValidationEnabled: boolean;
    validationRule: Function;

    private validationMessages: ValidationMessages;
    constructor(_validationMessages: ValidationMessages) {
        this.validationMessages = _validationMessages;
        var _this = this;
        this.customForm.firstName.label = "First name"
        this.customForm.firstName.required = true;
        this.customForm.firstName.customRule = function (value: string) {
            var errors = new Array<string>();
            if (value != undefined) {
                if (_this.lengthValidationEnabled) {
                    _this.validationMessages.MaxLength(8, value, errors);
                }

                _this.validationMessages.MinLength(3, value, errors);
            }
            return errors;
        }
        this.customForm.lastName.label = "Last name";

        this.customForm.nickName.label = "Nick name";
        this.customForm.nickName.required = true;
        this.customForm.nickName.customRule = function (value: string) {
            var errors = new Array<string>();
            if (_this.customForm.firstName.value != undefined && !_this.customForm.firstName.value.startsWith(value)) {
                errors.push("Fake nickname");
            }
            return errors;
        };


        this.lengthValidationEnabled = true;
    }
}
