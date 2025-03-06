import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Item} from '../../types/types';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-item',
  standalone: true,
  templateUrl: './add-item.component.html',
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatLabel,
    MatInput,
    MatError,
    FormsModule,
    MatDialogTitle,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe
  ],
  styleUrl: './add-item.component.scss'
})
export class AddItemComponent {
  titleControl = new FormControl('', [
    Validators.required,
    this.titleValidator.bind(this),
  ]);

  description: string = '';
  createdDate: Date = new Date();

  executionDateControl = new FormControl('', [
    Validators.required,
    this.dateValidator.bind(this),
  ]);

  executionDateMin = this.createdDate;
  executionDateMinString = this.executionDateMin.toLocaleString('sv-SE').slice(0, 16);
  executionDateMax = new Date("2080-12-31T23:59:59");
  executionDateMaxString = this.executionDateMax.toLocaleString('sv-SE').slice(0, 16);

  titleErrorText: string = '';
  dateErrorText: string = '';

  constructor(public dialogRef: MatDialogRef<AddItemComponent>,
              private translate: TranslateService) {}

  dateValidator(control: FormControl): { [key: string]: boolean } | null {
    const executionDate = new Date(control.value);

    if (executionDate < this.executionDateMin) {
      this.dateErrorText = 'DATE_TOO_EARLY';
      return { dateError: true };
    }
    if (executionDate > this.executionDateMax) {
      this.dateErrorText = 'DATE_TOO_LATE';
      return { dateError: true };
    }
    return null;
  }

  getErrorDateMessage() : string {
    if (this.executionDateControl.hasError('required')) {
      return this.translate.instant('DATE_REQUIRED');
    }
    if (this.executionDateControl.hasError('dateError')) {
      return this.translate.instant(this.dateErrorText);
    }
    return '';
  }

  titleValidator(control: FormControl): { [key: string]: boolean } | null {
    const title = control.value;
    if (title.length > 30) {
      this.titleErrorText = 'TITLE_TOO_LONG';
      return {titleError: true};
    }
    if (!this.isAlphanumericWithSpaces(title)) {
      this.titleErrorText = 'TITLE_INVALID';
      return {titleError: true};
    }
    return null;
  }

  isAlphanumericWithSpaces(input: string): boolean {
    return /^[A-Za-zА-Яа-яЁё0-9 ]+$/.test(input);
  }

  getErrorTitleMessage(): string {
    if (this.titleControl.hasError('required')) {
      return this.translate.instant('TITLE_REQUIRED');
    }
    if (this.titleControl.hasError('titleError')) {
      return this.translate.instant(this.titleErrorText);
    }
    return ''
  }

  onSubmit(): void {
    this.executionDateControl.markAllAsTouched();
    this.executionDateControl.updateValueAndValidity();
    this.titleControl.markAllAsTouched();
    this.titleControl.updateValueAndValidity();

    if(this.executionDateControl.value == null || this.titleControl.value == null) {
      return;
    }
    if (this.executionDateControl.invalid) {
      return;
    }

    if (this.titleControl.invalid) {
      return;
    }

    this.titleErrorText = '';
    this.dateErrorText = '';

    const newItem : Item = {
      id: crypto.randomUUID(),
      title: this.titleControl.value,
      description: this.description,
      executionDate: new Date(this.executionDateControl.value).toLocaleString(),
      createdDate: this.createdDate.toLocaleString(),
    };

    this.dialogRef.close(newItem);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
