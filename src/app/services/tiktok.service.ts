import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TikTokService {

  private apiUrl = 'https://widipe.com/download/v2/ttdl';

  constructor(private http: HttpClient) { }

  downloadVideo(url: string): Observable<any> {
    const requestUrl = `${this.apiUrl}?url=${encodeURIComponent(url)}`;
    return this.http.get(requestUrl, { headers: { 'accept': 'application/json' } });
  }
}