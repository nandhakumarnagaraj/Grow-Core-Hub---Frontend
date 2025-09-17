import { Injectable } from '@angular/core';
import { Application } from '../models/application';
import { ApplicationStatus } from '../models/application-status';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  getUserApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  getApplication(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  getProjectApplications(projectId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/project/${projectId}`);
  }

  signAgreement(id: number): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/${id}/sign-agreement`, {});
  }

  updateApplicationStatus(id: number, status: ApplicationStatus): Observable<Application> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Application>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  getApplicationsByStatus(status: ApplicationStatus): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/status/${status}`);
  }
}
