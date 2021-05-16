import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { GameFacade } from '@trial-nerror/game';

@Component({
  selector: 'trial-nerror-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.minLength(4)]
    }),
    room: new FormControl('', {
      validators: [
        Validators.required,
        tableNameValidator(/^\w+$/i)]
    })
  });


  get username() {
    return this.loginForm.get('username');
  }

  get room() {
    return this.loginForm.get('room');
  }


  constructor(private gameFacade: GameFacade) {}

  ngOnInit(): void {

  }

  joinGame() {
    if (this.loginForm.valid) {
      const username = this.username.value;
      const room = this.room.value;
      this.gameFacade.loadRoom(username, room);
    }
  }
}

function tableNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const allowed = nameRe.test(control.value);
    return allowed ? null : { forbiddenName: { value: control.value } };
  };
}
