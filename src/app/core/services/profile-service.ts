import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FreelancerProfile } from '../models/freelancer-profile';
import { ProfileUpdateRequest } from '../models/profile-update-request';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<FreelancerProfile> {
    return this.http.get<FreelancerProfile>(this.apiUrl);
  }

  updateProfile(request: ProfileUpdateRequest): Observable<FreelancerProfile> {
    return this.http.put<FreelancerProfile>(this.apiUrl, request);
  }
}
