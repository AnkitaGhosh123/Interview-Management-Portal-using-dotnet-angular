
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InterviewerService {

    private baseUrl = 'http://localhost:5152/api/Interviewer'; // Adjust if your controller route differs

    constructor(private http: HttpClient) { }

    /**
     * Login interviewer
     * @param credentials { email: string, password: string }
     */
    loginInterviewer(credentials: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.baseUrl}/login-interviewer`, credentials);
    }

    /**
     * Reset password for interviewer
     * @param email Interviewer's email
     * @param newPassword New password
     */
    resetPassword(data: { email: string; newPassword: string }): Observable<any> {
        return this.http.post(`${this.baseUrl}/reset-password`, data);
    }

    /**
     * Optional: Fetch interviewer profile after login
     */
    //   getProfile(interviewerId: number): Observable<any> {
    //     return this.http.get(`${this.baseUrl}/profile/${interviewerId}`);
    //   }


    getProfile(interviewerId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get(`${this.baseUrl}/profile/${interviewerId}`, { headers });
    }


    getFeedback(interviewerId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        return this.http.get<any>(`${this.baseUrl}/see-all-feedback`, {
            headers,
            params: { interviewerId }
        });
    }


    getAssignedCandidates(interviewerId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        return this.http.get<any>(`${this.baseUrl}/assigned-candidates/${interviewerId}`, { headers });
    }

    updateProfile(interviewerId: number, profileData: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });

        return this.http.put<any>(`${this.baseUrl}/update-profile/${interviewerId}`, profileData, { headers });
    }


    rescheduleInterview(candidateId: number, newDate: string) {
        const token = localStorage.getItem('token');
        return this.http.put<any>(`${this.baseUrl}/reschedule-interview/${candidateId}`, `"${newDate}"`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
    }


    markInterviewsComplete(candidateIds: number[]) {
        const token = localStorage.getItem('token');
        return this.http.put<any>(`${this.baseUrl}/complete-interviews`, candidateIds, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
    }



    getCompletedCandidates(interviewerId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/completed-candidates/${interviewerId}`);
    }

    // Give decision (Accept/Reject)
    giveDecision(candidateId: number, interviewerId: number, status: string): Observable<any> {
        const body = {
            candidateId: candidateId,
            interviewerId: interviewerId,
            resultStatus: status
        };
        return this.http.put<any>(`${this.baseUrl}/decision/${candidateId}`, body);
    }


    downloadResume(candidateId: number) {
        return this.http.get(`${this.baseUrl}/candidate/${candidateId}/resume`, { responseType: 'blob' });
    }

}
