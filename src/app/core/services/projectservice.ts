import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectType } from '../models/project-type';
import { Project } from '../models/project';
import { Observable } from 'rxjs';
import { ProjectCreateRequest } from '../models/project-create-request';

@Injectable({
  providedIn: 'root'
})
export class Projectservice {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getAllProjects(projectType?: ProjectType, eligibleOnly = false): Observable<Project[]> {
    let params = new HttpParams();
    if (projectType) {
      params = params.set('projectType', projectType);
    }
    if (eligibleOnly) {
      params = params.set('eligibleOnly', 'true');
    }

    return this.http.get<Project[]>(this.apiUrl, { params });
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(request: ProjectCreateRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, request);
  }

  updateProject(id: number, request: ProjectCreateRequest): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, request);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  applyToProject(id: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/${id}/apply`, {});
  }
}
