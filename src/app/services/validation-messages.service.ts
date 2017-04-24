import { Injectable } from '@angular/core';

@Injectable()
export class ValidationMessages {

  constructor() {
    //set language
  }

  public IsRequired(value: string, errors: Array<string>) {
    if (value == undefined || value == "") {
      errors.push("Reqired")
    }
  }

  public MaxLength(maxLength: number, value: string, errors: Array<string>) {
    if (value.length > maxLength) {
      errors.push("Too long");
    }
  }

  public MinLength(minLength: number, value: string, errors: Array<string>) {
    if (value.length <= minLength) {
      errors.push("Too short");
    }
  }
}
