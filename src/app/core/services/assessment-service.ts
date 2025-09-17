import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assessment } from '../models/assessment';
import { Observable } from 'rxjs';
import { AssessmentSubmissionRequest } from '../models/assessment-submission-request';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private apiUrl = `${environment.apiUrl}/assessments`;

  constructor(private http: HttpClient) {}

  getAssessment(id: number): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.apiUrl}/${id}`);
  }

  startAssessment(id: number): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.apiUrl}/${id}/start`, {});
  }

  submitAssessment(id: number, request: AssessmentSubmissionRequest): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.apiUrl}/${id}/submit`, request);
  }

  getAssessmentResult(id: number): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.apiUrl}/${id}/result`);
  }
}
