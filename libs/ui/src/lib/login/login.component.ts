import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

interface LoginSubmitEvent {
  username: string;
  room: string;
}

@Component({
  selector: 'ui-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LoginComponent {
  @Output() login = new EventEmitter<LoginSubmitEvent>();

  loginForm = new FormGroup({
    username: new FormControl('', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.minLength(4)],
    }),
    room: new FormControl('', {
      validators: [Validators.required, tableNameValidator(/^\w+$/i)],
    }),
  });

  get username() {
    return this.loginForm.get('username');
  }

  get room() {
    return this.loginForm.get('room');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.username.value;
      const room = this.room.value;
      this.login.emit({ username, room });
    }
  }
}

function tableNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const allowed = nameRe.test(control.value);
    return allowed ? null : { forbiddenName: { value: control.value } };
  };
}
