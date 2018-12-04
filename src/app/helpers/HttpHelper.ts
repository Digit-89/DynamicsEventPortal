import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpHelper {
  refreshPage: string = "The session has expired. Please refresh the page to continue.";

  constructor(private httpClient: HttpClient) {
  }

  public get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(this.addTimestamp(url)).pipe(map(this.checkForError));
  }

  public post<T>(url: string, body: any): Observable<T> {
    const httpOptions = this.buildHttpOptions();
    return this.httpClient.post<T>(this.addTimestamp(url), this.encodeBody(body), httpOptions).pipe(map(value => this.checkForError(value)));
  }

  private extractValidationToken(): string {
    let validationToken = '';
    const metaTags = document.getElementsByTagName('meta');
    if (metaTags) {
        for (let i = 0; i < metaTags.length; i++) {
            const metaTag = metaTags[i];
            const nameAttribute = metaTag.getAttribute('name');
            const contentAttribute = metaTag.getAttribute('content');
            if (nameAttribute === 'token' && contentAttribute) {
                validationToken = contentAttribute;
            }
        }
    }

    return validationToken;
  }

  private addTimestamp(url: string): string {
    const separator = url.indexOf('?') === -1 ? '?' : '&';
    return `${url}${separator}ts=${Date.now()}`;
  }

  private buildHttpOptions(): {} {
    const contentType = environment.useFormUrlEncodedContentType ? 'application/x-www-form-urlencoded' : 'application/json';
    let headers = new HttpHeaders({
        'Content-Type': contentType
    });

    if (environment.usePortalCsrfToken) {
        headers = headers.append('validation', this.extractValidationToken());
    }

    return {
        headers: headers
    };
  }

  private encodeBody(body: any): string {
    if (environment.encodeBody) {
        return `json=${encodeURIComponent(JSON.stringify(body))}`;
    } else {
        return body;
    }
  }

  private checkForError<T>(result: T): T {
      if (result && (typeof result === 'object') && 'errorMessage' in result && result['errorMessage']) {
        const correlationId = result['correlationId'];
        let errorMessage = result['errorMessage'];
        if(correlationId == 0){
          errorMessage = this.refreshPage;
        }
        console.error(`API call resulted with an error: '${errorMessage}'. Correlation id: ${correlationId}`);
        throw(Error(errorMessage));
      } else {
        return result;
      }
  }
}
