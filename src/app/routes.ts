import { ConfirmationComponent } from './components/eventregistration/confirmation/confirmation.component';
import { EventRegistrationComponent } from './components/eventregistration/eventregistration.component';
import { EventComponent } from './components/event/event.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './components/home/home.component';
import { Routes } from '@angular/router';
import { ExternalLoginUrlResolver } from './resolvers/external.login.url.resolver';
import { ExternalLogoutUrlResolver } from './resolvers/external.logout.url.resolver';
import { ExternalProfileUrlResolver } from './resolvers/external.profile.url.resolver';
import { MyRegistrationsComponent } from './components/myregistrations/myregistrations.component';
import { IsAuthenticatedGuard } from 'src/app/guards/is.authenticated.guard';
import { PaymentDemoComponent } from 'src/app/components/eventregistration/paymentdemo/payment.demo';
import { SuccessPaymentComponent } from 'src/app/components/eventregistration/successpayment/success.payment';

export const AppRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'spinner', component: SpinnerComponent },
    { path: 'event', component: EventComponent },
    { path: 'event/registration', component: EventRegistrationComponent },
    { path: 'event/confirmation', component: ConfirmationComponent },
    { path: 'event/payment', component: PaymentDemoComponent },
    { path: 'event/successpayment', component: SuccessPaymentComponent },
    {
        path: 'externalLogin',
        resolve: { url: ExternalLoginUrlResolver },
        component: HomeComponent
    },
    {
        path: 'externalLogout',
        resolve: { url: ExternalLogoutUrlResolver },
        component: HomeComponent
    },
    {
        path: 'externalProfile',
        resolve: { url: ExternalProfileUrlResolver },
        component: HomeComponent
    },
    {
        path: 'myregistrations',
        canActivate: [IsAuthenticatedGuard],
        component: MyRegistrationsComponent
    },
    { path: '**', redirectTo: 'home' }
];

