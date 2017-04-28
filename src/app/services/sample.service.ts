import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
var SERIES_API: string = 'http://localhost:3000/series';

@Injectable()
export class MyService {
  baseUrl: string = 'http://localhost:3000/series';
  searchByName: string = '?name_like=';
  Items: Array<string>;

  constructor(private http: Http) {}

  public getItems(takeNext: number, incrementPage: number): Observable<Array<string>> {
    var takeOnce = 15;
    return this.http.get(SERIES_API+'?_page='+incrementPage+'&_limit='+takeOnce)
        .map(function(response: Response) {
            return response.json();
        })
  }
  
  public getItemsSearch(stringField: string): Observable<Array<string>> {
    return this.http.get(SERIES_API+'?name_like='+stringField)
        .map(function(response: Response) {
            return response.json();
        })
  }
}