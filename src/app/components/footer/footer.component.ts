import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @ViewChild('walletAddressCopied') walletAddressCopied: ElementRef;
  public donationWallet = '0x863E5Cd3F747bB3e0DB223E50184965355A10682';

  constructor(protected _snackBar: MatSnackBar) {}
  // TODO: DRY
  public copyLink(): void {
    void navigator.clipboard.writeText(this.donationWallet).then(() => {
      this._snackBar.open(this.walletAddressCopied.nativeElement.textContent, '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 600,
      });
    });
  }
}
