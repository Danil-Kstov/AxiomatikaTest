import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Item} from '../../types/types';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-info-item',
  imports: [
    MatCardTitle,
    MatCardSubtitle,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatDivider,
    TranslatePipe
  ],
  standalone: true,
  templateUrl: './info-item.component.html',
  styleUrl: './info-item.component.scss'
})
export class InfoItemComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
