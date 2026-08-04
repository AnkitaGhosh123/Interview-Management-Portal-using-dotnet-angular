import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CandidateService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5152/api/Candidate'; // Adjust backend URL



  loginCandidate(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  resetPassword(data: { email: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }


  getInterviewStatus(candidateId: number) {
    return this.http.get(`${this.baseUrl}/${candidateId}/interview-status`);
  }

  submitFeedback(candidateId: number, feedbackData: any) {
    return this.http.post(`${this.baseUrl}/${candidateId}/feedback`, feedbackData);
  }

  checkFeedbackStatus(candidateId: number) {
    return this.http.get(`${this.baseUrl}/${candidateId}/feedback-status`);
  }

  getInterviewResult(candidateId: number) {
    return this.http.get(`${this.baseUrl}/${candidateId}/result`);
  }

  
getAssignedInterview(candidateId: number) {
  return this.http.get(`${this.baseUrl}/${candidateId}/assigned-interview`);
}


  offerDecision(request: { CandidateId: number; Decision: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/offer-decision`, request);
  }
}
