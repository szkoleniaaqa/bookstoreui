import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {Author} from "./author";

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
  }

  public getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.apiServerUrl}/authors`);
  }

  public createAuthor(author: Author): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/authors`, author)
  }

  public editAuthor(id: number, author: Author): Observable<any> {
    return this.http.put(`${this.apiServerUrl}/authors/${id}`, author)
  }

  public deleteAuthor(id: number): Observable<any> {
    return this.http.delete(`${this.apiServerUrl}/authors/${id}`)
  }
}
