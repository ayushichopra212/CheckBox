import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  userForm: FormGroup;
  showMessages: Array<any> = ["Please check one"];
  result: any;
  errorMessage: string;
  possibleString : string = "";
 

  constructor() { }

  ngOnInit() {
    this.userForm = new FormGroup({
      url : new FormControl(),
      random : new FormControl(),
      grantTypes: new FormGroup({
        authorization_code: new FormControl(false, []),
        client_credentials: new FormControl(false, []),
        extension: new FormControl(false, []),
        refresh_token: new FormControl(false, []),
        resource_owner_credentials: new FormControl(false, []),
      }),
      restrictToScope: new FormGroup({
        open_id: new FormControl(false, []),
        profile: new FormControl(false, []),
        read: new FormControl(false, []),
      }),
    });

  //valueChanges 
    this.userForm.valueChanges.subscribe(data => {
      this.result = data;
      console.log(this.result);
      this.checkBoxValidation();
    })
  }
  
  //generate random string
  getRandomString() {
    let randomString :string = "";
    this.possibleString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    let length = 16;
    for(let i = length; i > 0; --i)
    randomString += this.possibleString[Math.floor(Math.random() * this.possibleString.length)];
    this.userForm.get('random').setValue(randomString); // since we have to set formControl value
}
 
  checkBoxValidation() {
    this.showMessages = [];
    let grantTypes = this.userForm.get('grantTypes').value;
    let restrictToScope = this.userForm.get('restrictToScope').value;

    // first pairing
    if (grantTypes.authorization_code || grantTypes.refresh_token) {
      this.showMessages.push("Authorization and Refresh grant types must be selected together")
    }
    if (grantTypes.authorization_code && grantTypes.refresh_token) {
      this.showMessages = ["Selected successfully"];
      this.errorMessage = "URL is required"
    }
    // second pairing
    if (grantTypes.client_credentials || grantTypes.extension || restrictToScope.profile) {
      this.showMessages.push("Client and extension must be selected together with profile");
    }
    if (grantTypes.client_credentials && grantTypes.extension && restrictToScope.profile) {
      this.showMessages = ["Selected successfully"]
    }
    //third pairing
    if (restrictToScope.read || grantTypes.resource_owner_credentials) {
      this.showMessages.push("Resource credentials must be selected with READ Scope");
    }
    if (restrictToScope.read && grantTypes.resource_owner_credentials) {
      this.showMessages = ["Selected successfully"]
    }
    if (!grantTypes.authorization_code &&
      !grantTypes.client_credentials &&
      !grantTypes.refresh_token &&
      !grantTypes.resource_owner_credentials &&
      !grantTypes.extension &&
      !restrictToScope.open_id &&
      !restrictToScope.profile &&
      !restrictToScope.read
    ) {
      this.showMessages.push("Please check one");
    }
  }
}