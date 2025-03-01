import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlPage } from 'app/models/UrlPage';

@Injectable({
  providedIn: 'root',
})
export class ProgContentService {
  constructor(private http: HttpClient) {}

  getContent(urlPage: string) {
    return this.http.get<UrlPage>(urlPage);
  }
}
