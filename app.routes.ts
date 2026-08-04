import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CandidateRegister } from './Candidate/register-candidate/register-candidate';
import { CandidateLogin } from './Candidate/candidate-login/candidate-login';
import { InterviewStatusComponent } from './Candidate/check-interview-status/check-interview-status';
import { CandidateFeedbackComponent } from './Candidate/give-feedback/give-feedback';
import { InterviewResult } from './Candidate/check-interview-result/check-interview-result';
import { CandidateOfferDecision } from './Candidate/offer-letter-decision/offer-letter-decision';
import { CandidateHome } from './Candidate/candidate-home/candidate-home';
import { ResetPasswordComponent } from './Candidate/candidate-reset-password/candidate-reset-password';
import { superAdminGuard } from './superadminauth.guard';
import { CandidateDashboardComponent } from './Candidate/candidate-dashboard/candidate-dashboard';
import { HomeComponent } from './home/home';
import { AdminHome } from './admin/adminhome/adminhome';
import { AdminFrontPage } from './admin/admin-frontpage/admin-frontpage';
import { AdminRegister } from './admin/admin-register/admin-register';
import { SuperAdminLogin } from './superadmin/superadmin-login/superadmin-login';
import { SuperAdminDashboard } from './superadmin/superadmin-dashboard/superadmin-dashboard';
import { AdminRequestsComponent } from './superadmin/admin-requests/admin-requests';
// import { ApprovedRequestsComponent } from './superadmin/approved-requests/approved-requests';
// import { RejectedRequestsComponent } from './superadmin/rejected-requests/rejected-requests';
import { candidateGuard } from './candidate.guard';
import { InterviewerHome } from './interviewer/home-page/home-page';
import { InterviewerLogin } from './interviewer/login/login';
import { RegisterInterviewerComponent } from './interviewer/register/register';
import { InterviewerRequestsComponent } from './superadmin/interviewer-requests/interviewer-requests';
import { ApprovedRequestsComponent } from './superadmin/approved-requests/approved-requests';
import { RejectedRequestsComponent } from './superadmin/rejected-requests/rejected-requests';
import { InterviewerResetPassword } from './interviewer/interviewer-reset-password/interviewer-reset-password';
import { InterviewerDashboard } from './interviewer/interviewer-dashboard/interviewer-dashboard';
import { interviewerGuard } from './interviewer.guard';
import { InterviewerProfile } from './interviewer/profile/profile';
import { SeeAllFeedback } from './interviewer/see-all-feedback/see-all-feedback';
import { AssignedCandidates } from './interviewer/assigned-candidates/assigned-candidates';
import { UpdateProfile } from './interviewer/update-profile/update-profile';
import { RescheduleInterview } from './interviewer/reschedule-interview/reschedule-interview';
import { CompleteInterview } from './interviewer/completed-interview/completed-interview';
import { GiveDecision } from './interviewer/decision/decision';
import { AdminLogin } from './admin/admin-loginfirst/admin-loginfirst';
import { AdminSecondLoginComponent } from './admin/admin-loginsecond/admin-loginsecond';
import { adminGuard } from './admin.guard';
import { GetEligibleCandidates } from './admin/get-eligible-candidates/get-eligible-candidates';
import { OfferLetter } from './admin/generate-offer/generate-offer';
import { SetMaxCandidates } from './admin/set-max-candidates/set-max-candidates';
import { SetMaxCandidateForm } from './admin/set-max-candidates-form/set-max-candidates-form';
import { SendFinalResultComponent } from './admin/send-final-results/send-final-results';
import { CheckAllResumesComponent } from './admin/check-all-resumes/check-all-resumes';
import { CandidateListComponent } from './admin/candidate-list/candidate-list';
import { AssignInterviewerComponent } from './admin/assign-interviewer/assign-interviewer';
import { SearchInterviewersComponent } from './admin/search-interviewers/search-interviewers';
import { SuccessResultComponent } from './admin/success-results/success-results';
import { RejectedCandidatesComponent } from './admin/rejected-candidates/rejected-candidates';
import { OfferRejectedComponent } from './admin/offer-rejected/offer-rejected';
import { FeedbacksComponent } from './admin/feedback/feedback';
import { ForwardFeedbackComponent } from './admin/forward-feedback/forward-feedback';
import { RescheduleInterviewComponent } from './admin/reschedule-interview/reschedule-interview';
import { About } from './about/about';
import { Contact } from './about/contact/contact';
import { Manage } from './manage/manage';
import { Use } from './use/use';
export const routes: Routes = [


    {path: 'about', component: About},
    {path: 'about-contact', component: Contact},
    { path: '', component: HomeComponent },
    {path:'manage',component:Manage},
    {path:'use',component:Use},

    { path: 'superadmin-login', component: SuperAdminLogin },
    { path: 'superadmin-dashboard', component: SuperAdminDashboard , canActivate: [superAdminGuard]},
    { path: 'admin-requests', component: AdminRequestsComponent},
    { path: 'interviewer-requests', component: InterviewerRequestsComponent},
    { path: 'approved-requests', component: ApprovedRequestsComponent},
    { path: 'rejected-requests', component: RejectedRequestsComponent},


    { path: 'admin', component: AdminFrontPage },
    { path: 'admin/admin-register', component: AdminRegister },
    { path: 'admin/admin-loginfirst', component: AdminLogin },
    { path: 'admin-loginsecond', component: AdminSecondLoginComponent },
    { path: 'admin-dashboard', component: AdminHome, canActivate: [adminGuard] },
    { path: 'get-eligible-candidates', component: GetEligibleCandidates },
    { path: 'generate-offer', component: OfferLetter },
    { path: 'send-final-result', component: SendFinalResultComponent },
    { path: 'see-interviewers', component: SetMaxCandidates },
    { path: 'set-max-candidate/:id', component: SetMaxCandidateForm },
    { path: 'check-all-resumes', component: CheckAllResumesComponent },
    { path: 'search-interviewer', component: SearchInterviewersComponent },
    { path: 'search-selected-candidates', component: SuccessResultComponent },
    { path: 'candidate-list', component: CandidateListComponent },
    { path: 'assign-interviewer', component: AssignInterviewerComponent },
    { path: 'record-rejected', component: RejectedCandidatesComponent },
    { path: 'offer-rejected', component: OfferRejectedComponent },
    { path: 'feedback-list', component: FeedbacksComponent },
    { path: 'forward-feedback', component: ForwardFeedbackComponent },
    {path: 'reschedule-interview', component:RescheduleInterviewComponent},
    { path: 'candidate', component: CandidateHome },
    { path: 'register-candidate', component: CandidateRegister },
    { path: 'candidate-login', component: CandidateLogin },
    { path: 'candidate-reset-password', component: ResetPasswordComponent },
    { path: 'dashboard', component: CandidateDashboardComponent, canActivate: [candidateGuard] },
    { path: 'check-interview-status', component: InterviewStatusComponent},
    { path: 'give-feedback', component: CandidateFeedbackComponent},
    { path: 'check-interview-result', component: InterviewResult},
    { path: 'offer-letter-decision', component: CandidateOfferDecision},
    { path: 'interviewer', component: InterviewerHome },
    { path: 'register-interviewer', component: RegisterInterviewerComponent },
    { path: 'interviewer-login', component: InterviewerLogin },
    { path: 'interviewer-reset-password', component: InterviewerResetPassword },
    { path: 'interviewer-dashboard', component: InterviewerDashboard, canActivate: [interviewerGuard] },
    { path: 'profile', component: InterviewerProfile },
    { path: 'see-all-feedback', component: SeeAllFeedback },
    { path: 'assigned-candidates', component: AssignedCandidates },
    { path: 'update-profile', component: UpdateProfile },
    { path: 'reschedule/:candidateId', component: RescheduleInterview },
    { path: 'completed-interview', component: CompleteInterview },
    { path: 'decision', component: GiveDecision }
];


