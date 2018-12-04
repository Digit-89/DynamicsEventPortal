import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MyRegistration } from '../../models/MyRegistration';

@Component({
  selector: 'app-myregistrations',
  templateUrl: './myregistrations.component.html',
  styleUrls: ['./myregistrations.component.css']
})
export class MyRegistrationsComponent implements OnInit {
  registrations: MyRegistration[];
  errorMessage: string;
  loading: boolean;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loading = true;
    this.loadRegistrationsForUser();
  }

  private loadRegistrationsForUser(): void {
    this.userService.getRegistrationsForUser().subscribe(registrations => {
        this.registrations = registrations;
        this.loading = false;
    }, error =>  {
      this.errorMessage = error.message
      this.loading = false;
    });
  }

  private cancelRegistration(eventRegistrationId: string): void {
    this.loading = true;
    this.userService.cancelRegistration(eventRegistrationId).subscribe(isRegistrationCanceled => {
      if (isRegistrationCanceled) {
        this.loadRegistrationsForUser();
      } else {
        this.errorMessage = " ";
      }
      this.loading = false;
    }, error => {
      this.errorMessage = error.message
      this.loading = false;
    });
  }

  public dataLoaded(): boolean {
    return this.registrations !== undefined;
  }
}
