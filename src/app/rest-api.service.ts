import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/json'
  })
};

//const apiUrl = "http://localhost:1337/localhost:3000/api/classroom";
const apiUrl = "http://192.168.220.22:8100/api/classroom";

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http:HttpClient) { }

  private handleError(error: HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.error('An error occured:',error.error.message);
    }
    else{
      console.error(`Backend returned code ${error.status},`+`body was ${error.error}`);
    }
    return throwError('Something bad happened, please try again later.');
  }

  private extractData(res:Response){
    let body = res;
    return body || { };
  }

  getClassroom(): Observable<any> {
    return this.http.get(apiUrl, httpOptions)
          .pipe(
            map(this.extractData),
            catchError(this.handleError)
          );
  }

  getClassroomById(id: string): Observable<any>{
    const url = `${apiUrl}/${id}`;
    return this.http.get(url, httpOptions)
          .pipe(
            map(this.extractData),
            catchError(this.handleError)
          );
  }

  postClassroom(data): Observable<any>{
    const url = `${apiUrl}/add_with_students`;

    return this.http.post(url,data,httpOptions)
            .pipe(
              catchError(this.handleError)
            );

  }

  updateClassroom(id: string, data): Observable<any>{
    const url = `${apiUrl}/${id}`;

    return this.http.put(url,data,httpOptions)
            .pipe(
              catchError(this.handleError)
            );

  }

  deleteClassroom(id: string): Observable<{}>{
    const url = `${apiUrl}/${id}`;

    return this.http.delete(url,httpOptions)
            .pipe(
              catchError(this.handleError)
            );

  }
}
