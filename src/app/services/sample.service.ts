import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const API_HOST = 'http://localhost:3000/';

@Injectable()
export class MyService {
    constructor(private http: Http) {}

    searchEntries(stringField: Observable<string>, incrementPage: number, api: string): Observable<Array<string>> {
        var takeOnce = 15;
        return this.http.get(API_HOST + api + '?name_like=' + stringField + '&_page=' + incrementPage + '&_limit=' + takeOnce)
            .map(function (response: Response) {
                return response.json();
            })
    }
}