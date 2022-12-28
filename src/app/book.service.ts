import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {Book} from "./book";
import {Author} from "./author";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
  }

  public getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiServerUrl}/books`);
  }

  public admin_getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiServerUrl}/books/admin_books`);
  }

  public deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiServerUrl}/books/${id}`)
  }

  public createBook(book: Book): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/books`, book)
  }

  public editBook(id: number, book: Book): Observable<any> {
    return this.http.put(`${this.apiServerUrl}/books/${id}`, book)
  }
}
