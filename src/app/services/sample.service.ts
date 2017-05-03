import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
var SERIES_API: string = 'http://localhost:3000/series';

@Injectable()
export class MyService {
    constructor(private http: Http) { }

    public searchEntries(stringField: Observable<string>, incrementPage: number): Observable<Array<string>> {
        var takeOnce = 15;
        return this.http.get(SERIES_API + '?name_like=' + stringField + '&_page=' + incrementPage + '&_limit=' + takeOnce)
            .map(function (response: Response) {
                return response.json();
            })
    }
}