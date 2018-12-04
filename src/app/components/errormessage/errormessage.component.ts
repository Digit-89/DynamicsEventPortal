import { Component, OnInit } from '@angular/core';
import { Input, Inject, ElementRef } from '@angular/core';

@Component({
  selector: 'app-errormessage',
  templateUrl: './errormessage.component.html',
  styleUrls: ['./errormessage.component.css']
})
export class ErrorMessageComponent implements OnInit {
  @Input() serverErrorMessage: string;
  @Input() translatedErrorMessage: string;
  public errorMessage: string;
  public translatedError: string;

  constructor() { 
  }

  ngOnInit() {
    console.error("server error: " + this.serverErrorMessage);
    
    console.error("translated error: " + this.translatedErrorMessage);

    this.errorMessage = this.serverErrorMessage;
    this.translatedError = this.translatedErrorMessage;
  }

}
