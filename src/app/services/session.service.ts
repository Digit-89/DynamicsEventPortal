import { Injectable } from '@angular/core';
import { HipObject } from './../models/HipObject';

@Injectable()
export class SessionService {
    private readonly captchaKey: string = 'captcha';
    private readonly purchaseIdKey: string = 'purchase-id';

    constructor() {
    }

    public setCaptcha(captcha: HipObject) {
      sessionStorage.setItem(this.captchaKey, JSON.stringify(captcha));
    }

    public getCaptcha(): HipObject {
        return JSON.parse(sessionStorage.getItem(this.captchaKey));
    }

    public setPurchaseId(purchaseId: string) {
      sessionStorage.setItem(this.purchaseIdKey, purchaseId);
    }

    public getPurchaseId(): string {
        return sessionStorage.getItem(this.purchaseIdKey);
    }
}
