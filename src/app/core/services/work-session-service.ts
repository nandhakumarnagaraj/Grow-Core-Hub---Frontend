import { Injectable } from '@angular/core';
import { WorkSession } from '../models/work-session';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WorkSessionStartRequest } from '../models/work-session-start-request';
import { WorkSessionStopRequest } from '../models/work-session-stop-request';

@Injectable({
  providedIn: 'root',
})
export class WorkSessionService {
  private apiUrl = `${environment.apiUrl}/work`;
  private activeSessionSubject = new BehaviorSubject<WorkSession | null>(null);
  private timerSubject = new BehaviorSubject<string>('00:00:00');

  public activeSession$ = this.activeSessionSubject.asObservable();
  public timer$ = this.timerSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadActiveSession();
    this.startTimer();
  }

  startWorkSession(request: WorkSessionStartRequest): Observable<WorkSession> {
    return this.http.post<WorkSession>(`${this.apiUrl}/start`, request);
  }

  stopWorkSession(request: WorkSessionStopRequest): Observable<WorkSession> {
    return this.http.post<WorkSession>(`${this.apiUrl}/stop`, request);
  }

  getUserWorkSessions(projectId?: number): Observable<WorkSession[]> {
    let params = new HttpParams();
    if (projectId) {
      params = params.set('projectId', projectId.toString());
    }
    return this.http.get<WorkSession[]>(`${this.apiUrl}/sessions`, { params });
  }

  getActiveSession(): Observable<WorkSession> {
    return this.http.get<WorkSession>(`${this.apiUrl}/active`);
  }

  getTodayHours(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/today-hours`);
  }

  private loadActiveSession(): void {
    this.getActiveSession().subscribe({
      next: (session) => this.activeSessionSubject.next(session),
      error: () => this.activeSessionSubject.next(null),
    });
  }

  private startTimer(): void {
    timer(0, 1000).subscribe(() => {
      const activeSession = this.activeSessionSubject.value;
      if (activeSession) {
        const now = new Date().getTime();
        const start = new Date(activeSession.startTime).getTime();
        const elapsed = now - start;
        this.timerSubject.next(this.formatTime(elapsed));
      } else {
        this.timerSubject.next('00:00:00');
      }
    });
  }

  private formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
}
