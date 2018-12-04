import { FinalizeRegistrationRequest } from './../../../models/FinalizeRegistrationRequest';
import { CaptchaService } from './../../../services/captcha.service';
import { HipObject } from './../../../models/HipObject';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-payment-demo',
  templateUrl: './payment.demo.html',
  styleUrls: ['./payment.demo.css']
})
export class PaymentDemoComponent implements OnInit {

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private eventService: EventService,
      private captchaService: CaptchaService,
      private sessionService: SessionService
    ) { }

  total: number;
  currencySymbol: string;
  errorMessage: string;
  registrationInProgress: boolean;

  private readableEventId: string;
  private purchaseId: string;

  ngOnInit() {
    this.total = this.route.snapshot.queryParams['total'];
    this.currencySymbol = this.route.snapshot.queryParams['currencySymbol'];
    this.purchaseId = this.route.snapshot.queryParams['purchaseId'];
    this.readableEventId = this.route.snapshot.queryParams['id'];
  }

  cancel(): void {
    this.router.navigate(['/event', this.readableEventId], {
        queryParams: {
            event: this.readableEventId
        }
    });
  }

  finalizePurchase(): void {
    this.registrationInProgress = true;

    const captcha = this.sessionService.getCaptcha();
    const requestData: FinalizeRegistrationRequest = {
        purchaseId: this.purchaseId,
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
    }, error => this.errorMessage = error.message)
    .add(() => {
        this.registrationInProgress = false;
    });
  }
}
