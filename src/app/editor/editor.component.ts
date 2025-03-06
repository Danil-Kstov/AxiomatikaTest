import { Component } from '@angular/core';
import {AddItemComponent} from '../add-item/add-item.component';
import {Item} from '../../types/types';
import {MatDialog} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {ItemService} from '../services/items.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-editor',
  imports: [AddItemComponent, MatButton, NgForOf, NgIf, AsyncPipe, TranslatePipe],
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
  items$: Observable<Item[]>;

  constructor(public dialog: MatDialog, private itemService: ItemService) {
    this.items$ = this.itemService.items$;
  }

  ngOnInit(): void {
    this.itemService.loadItems();
  }

  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(AddItemComponent);

    dialogRef.afterClosed().subscribe((result : Item)   => {
      if (result) {
        this.itemService.addItem(result);
      }
    });
  }

  copyItem(item: Item): void {
    const copiedItem : Item = { ...item, createdDate: new Date().toLocaleString(),  id: crypto.randomUUID()};
    this.itemService.addItem(copiedItem);
  }

  deleteItem(index: string): void {
    this.itemService.deleteItem(index);
  }
}
