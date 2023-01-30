import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class CrudService<T> {

  protected jsonHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  protected constructor(protected url: string, protected http: HttpClient) { }

  get(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  post(item: T): Observable<T> {
    return this.http.post<T>(this.url, item, this.jsonHeader);
  }

  put(item: T | T[]): Observable<T> {
    return this.http.put<T>(`${this.url}`, item, this.jsonHeader);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, this.jsonHeader);
  }
}
