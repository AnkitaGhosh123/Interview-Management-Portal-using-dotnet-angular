import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {

  private baseUrl = 'http://localhost:5152/api/SuperAdmin';

  constructor(private http: HttpClient) { }


  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.baseUrl}/login-superadmin`, body);
  }


  // ---------- Admin Requests ----------

  getAdminRequests(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin-requests`);
  }

  // approveAdmin(email: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/approve-admin`, {email});
  // }

  // rejectAdmin(email: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/reject-admin`, {email});
  // }

  getAdminRequestsApproved(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin-requests-approved`);
  }

  getAdminRequestsRejected(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin-requests-rejected`);
  }

  // ---------- Interviewer Requests ----------

  getInterviewerRequests(): Observable<any> {
    return this.http.get(`${this.baseUrl}/interviewer-requests`);
  }

  // approveInterviewer(email: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/approve-interviewer`, {Email: email});
  // }

  // rejectInterviewer(email: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/reject-interviewer`, {Email: email});
  // }

  getInterviewerRequestsApproved(): Observable<any> {
    return this.http.get(`${this.baseUrl}/interviewer-requests-approved`);
  }

  getInterviewerRequestsRejected(): Observable<any> {
    return this.http.get(`${this.baseUrl}/interviewer-requests-rejected`);
  }

  // ---------- Pending Count ----------

  getPendingCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pending-count`);
  }


  approveAdmin(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve-admin`, { Email: email });
  }

  rejectAdmin(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reject-admin`, { Email: email });
  }

  approveInterviewer(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve-interviewer`, { Email: email });
  }

  rejectInterviewer(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reject-interviewer`, { Email: email });
  }

}
