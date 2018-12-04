import { CaptchaService } from './services/captcha.service';
import { IsAuthenticatedGuard } from './guards/is.authenticated.guard';
import { AppRoutes } from './routes';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { EventComponent } from './components/event/event.component';
import { EventRegistrationComponent } from './components/eventregistration/eventregistration.component';
import { AttendeeComponent } from './components/eventregistration/attendee/attendee.component';
import { SpeakersComponent } from './components/event/speakers/speakers.component';
import { SessionsComponent } from './components/event/sessions/sessions.component';
import { SessiontracksComponent } from './components/event/sessiontracks/sessiontracks.component';
import { ConfirmationComponent } from './components/eventregistration/confirmation/confirmation.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ErrorMessageComponent } from './components/errormessage/errormessage.component';
import { SponsorsComponent } from './components/event/sponsors/sponsors.component';
import { PassesComponent } from './components/event/passes/passes.component';
import { ListofsessionspertrackComponent } from './components/event/listofsessionspertrack/listofsessionspertrack.component';
import { CaptchaComponent } from './components/eventregistration/captcha/captcha.component';
import { UserService } from './services/user.service';
import { HttpHelper } from './helpers/HttpHelper';
import { EventService } from './services/event.service';
import { LabelsService } from './services/labels.service';
import { TranslateDirective } from './directives/translate.directive';
import { ExternalLoginUrlResolver } from './resolvers/external.login.url.resolver';
import { ExternalProfileUrlResolver } from 'src/app/resolvers/external.profile.url.resolver';
import { ExternalLogoutUrlResolver } from './resolvers/external.logout.url.resolver';
import { MyRegistrationsComponent } from './components/myregistrations/myregistrations.component';
import { ImageHelper } from './helpers/ImageHelper';
import { PaymentDemoComponent } from 'src/app/components/eventregistration/paymentdemo/payment.demo';
import { SuccessPaymentComponent } from 'src/app/components/eventregistration/successpayment/success.payment';
import { SessionService } from './services/session.service';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FooterComponent,
    EventComponent,
    EventRegistrationComponent,
    AttendeeComponent,
    SpeakersComponent,
    SessionsComponent,
    SessiontracksComponent,
    ConfirmationComponent,
    SpinnerComponent,
    ErrorMessageComponent,
    SponsorsComponent,
    PassesComponent,
    ListofsessionspertrackComponent,
    CaptchaComponent,
    TranslateDirective,
    MyRegistrationsComponent,
    PaymentDemoComponent,
    SuccessPaymentComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [
    IsAuthenticatedGuard,
    ExternalLoginUrlResolver,
    ExternalLogoutUrlResolver,
    ExternalProfileUrlResolver,
    HttpClient,
    HttpHelper,
    ImageHelper,
    UserService,
    EventService,
    LabelsService,
    CaptchaService,
    SessionService
  ],
})

export class AppModule {
}
