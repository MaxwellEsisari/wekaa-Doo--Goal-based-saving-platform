import { Component, Inject, Input } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  templateUrl: './auth-modal.html',
  styleUrls: ['./auth-modal.scss']
})
export class AuthModal {
  constructor(
    public dialogRef: DialogRef<AuthModal>,
    @Inject(DIALOG_DATA) public data: { mode: 'login' | 'signup' }
  ) {}

  close() {
    this.dialogRef.close();
  }
}
