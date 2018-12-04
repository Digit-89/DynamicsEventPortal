import { FinalizeRegistrationRequest } from './../../../models/FinalizeRegistrationRequest';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-success-payment',
  templateUrl: './success.payment.html',
  styleUrls: ['./success.payment.css']
})
export class SuccessPaymentComponent implements OnInit {

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private eventService: EventService,
      private sessionService: SessionService
    ) { }

  errorMessage: string;

  private readableEventId: string;

  ngOnInit() {
    this.readableEventId = this.route.snapshot.queryParams['id'];
    this.finalizePurchase();
  }

  private finalizePurchase(): void {
    const purchaseId = this.sessionService.getPurchaseId();
    const captcha = this.sessionService.getCaptcha();
    const requestData: FinalizeRegistrationRequest = {
        purchaseId: purchaseId,
        hipObject: captcha
    };

    this.eventService.finalizeRegistration(this.readableEventId, requestData).subscribe(registrationResult => {
        if (registrationResult.status === 'Success') {
            this.router.navigate(['../confirmation'], {
                relativeTo: this.route
            });
        } else {
            this.errorMessage = registrationResult.errorMessage;
        }
    }, error => this.errorMessage = error.message);
  }
}
