import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
@Component({
  selector: 'form-validation',
  template : `
    
    <div [formGroup]="complexForm" class="col-md-12">
        <div class="row">
            <div div class="col-12">
                <br>
                <h1>Reactive Form Validation Example</h1>
            </div>

            <div class="col-6">
                <div class="form-group" [ngClass]="{'error has-danger':!complexForm.controls['firstName'].valid && complexForm.controls['firstName'].touched || !complexForm.controls['firstName'].valid && submitAttempt}">
                    <label>First Name</label>
                    <input class="form-control" type="text" [formControl]="complexForm.controls['firstName']">
                    <div *ngIf="complexForm.controls['firstName'].hasError('required') && !complexForm.controls['firstName'].pristine || complexForm.controls['firstName'].hasError('required') && submitAttempt" class="alert alert-danger">You must include a first name.</div>
                    <div *ngIf="complexForm.controls['firstName'].hasError('minlength') && !complexForm.controls['firstName'].pristine || complexForm.controls['firstName'].hasError('minlength') && submitAttempt" class="alert alert-danger">Your first name must be at least 3 characters long.</div>
                    <div *ngIf="complexForm.controls['firstName'].hasError('maxlength') && !complexForm.controls['firstName'].pristine || complexForm.controls['firstName'].hasError('maxlength') && submitAttempt" class="alert alert-danger">Your first name cannot exceed 8 characters.</div>
                    
                </div>
            </div>

            <div class="col-6" >
                <div class="form-group" [ngClass]="{'error has-danger':!complexForm.controls['lastName'].valid && complexForm.controls['lastName'].touched || !complexForm.controls['lastName'].valid && submitAttempt}">
                    <label>Last Name</label>
                    <input class="form-control" type="text" [formControl]="complexForm.controls['lastName']">
                    <div *ngIf="complexForm.controls['lastName'].hasError('required') && !complexForm.controls['lastName'].pristine || complexForm.controls['lastName'].hasError('required') && submitAttempt" class="alert alert-danger">You must include a last name.</div>
                </div>
            </div>
            <div class="col-6" >
                <div class="form-group" [ngClass]="{'error has-danger':!complexForm.controls['occupation'].valid && complexForm.controls['occupation'].touched || !complexForm.controls['occupation'].valid && submitAttempt}">
                    <label>Occupation</label>
                    <input class="form-control" type="text" [formControl]="complexForm.controls['occupation']">
                    <div *ngIf="complexForm.controls['occupation'].hasError('required') && !complexForm.controls['occupation'].pristine || complexForm.controls['occupation'].hasError('required') && submitAttempt" class="alert alert-danger">You must include a occupation.</div>
                </div>
            </div>
            <div class="col-6" >
                <div class="form-group" [ngClass]="{'error has-danger':!complexForm.controls['nickName'].valid && complexForm.controls['nickName'].touched || !complexForm.controls['nickName'].valid && submitAttempt}">
                    <label>Nick name</label>
                    <input class="form-control" type="text" [formControl]="complexForm.controls['nickName']">
                    <div *ngIf="complexForm.controls['nickName'].hasError('required') && !complexForm.controls['nickName'].pristine || complexForm.controls['nickName'].hasError('required') && submitAttempt" class="alert alert-danger">You must include a nick name.</div>
                    <div *ngIf="complexForm.controls['nickName'].hasError('startsWithLetter') && !complexForm.controls['nickName'].pristine || complexForm.controls['nickName'].hasError('startsWithLetter') && submitAttempt" class="alert alert-danger">First letter has to start with a.</div>
                </div>
            </div>

            <div class="col-6">
                <h5>Please select gender:</h5>
                <div class="alert alert-danger" *ngIf="!complexForm.controls['gender'].valid && !complexForm.controls['gender'].pristine || complexForm.controls['gender'].hasError('required') && submitAttempt">You must select a gender.</div>
                <div class="radio" [ngClass]="{'error has-danger':!complexForm.controls['gender'].valid && complexForm.controls['gender'].touched || !complexForm.controls['gender'].valid && submitAttempt}">
                    <label>
                        <input type="radio" name="gender" value="Male" [formControl]="complexForm.controls['gender']">
                        Male
                    </label>
                </div>
                <div class="radio" [ngClass]="{'error has-danger':!complexForm.controls['gender'].valid && complexForm.controls['gender'].touched || !complexForm.controls['gender'].valid && submitAttempt}">
                    <label>
                        <input type="radio" name="gender" value="Female" [formControl]="complexForm.controls['gender']">
                        Female
                    </label>
                </div>
            </div>

            <div class="form-group col-6">
                <h5>Pick your favorite food:</h5>
                <div>
                    <label class="checkbox-inline">
                        <input type="checkbox" value="pizza" name="pizza" [formControl]="complexForm.controls['pizza']"> Pizza
                    </label>
                </div>
                <div>
                    <label class="checkbox-inline">
                        <input type="checkbox" value="hamburger" name="hamburger" [formControl]="complexForm.controls['hamburger']"> Hamburger
                    </label>
                </div>
                <div>
                    <label class="checkbox-inline">
                        <input type="checkbox" value="pasta" name="pasta" [formControl]="complexForm.controls['pasta']"> Pasta
                    </label>
                </div>
            </div>

            <div class="form-group col-12">
                <button type="submit" (click)="submitForm(complexForm.value)" class="btn btn-outline-primary">Submit</button>
                <span *ngIf="isValid !== undefined">{{ isValid ? 'Valid' : 'Not Valid' }}</span>
            </div>

        </div>
    </div>

  `
})

@Injectable()
export class FormValidationComponent implements OnInit {
  complexForm : FormGroup;
  submitAttempt: boolean;
  isValid: boolean;
  validateNickname: Observable<string>

  constructor(private fb: FormBuilder){
    this.complexForm = fb.group({
    //   "singleSelection": ['Rio', [FormValidationComponent.validateNickname]],
      "firstName" : [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(8)])],
      "lastName": [null, Validators.required],
      "occupation": [null, Validators.required],
      "nickName": ['', Validators.required, FormValidationComponent.validateNickname],
      "gender" : [null, Validators.required],
      "pizza" : [true, Validators.required],
      "hamburger": [null, Validators.required],
      "pasta" : [null, Validators.required]
    })
  }


// custom validation rule for the nick name
// validateNickname(control: FormControl) {
//             console.log(control);
//         if(!control.value.startsWith('a')){
//             return {startsWithLetter:true}
//         } 
//         return null



//   }
public static validateNickname(control: FormControl): Observable<string> {
      console.log("validate nickname")
      return new Observable<string>(observer => {
        if(!control.value.startsWith('a')){
            observer.next({startsWithLetter:true})
        } else {
            observer.next(null)
        }
        observer.complete()
    })
  }

  ngOnInit() {}

  submitForm() {
    if (this.complexForm.controls['firstName'].valid &&
    this.complexForm.controls['lastName'].valid &&
    this.complexForm.controls['gender'].valid && 
    this.complexForm.controls['nickName'].valid) {
        this.isValid = true;
    } else {
        this.isValid = false;
    }
    this.submitAttempt = true;
  }
}