import { Component } from '@angular/core';
import {BehaviorSubject, interval, Observable, Subscription} from 'rxjs';
import {Item} from '../../types/types';
import {ItemService} from '../services/items.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {InfoItemComponent} from '../info-item/info-item.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {isBefore, parse} from 'date-fns';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-view',
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    MatButton,
    TranslatePipe,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
    MatIconButton
  ],
  standalone: true,
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  items$: Observable<Item[]>;
  openMenuIndex: number | null = null;
  length: number = 0;
  openFilteredMenu: boolean = false
  private sub!: Subscription;
  private checkInterval!: Subscription;
  private shownTasks = new Set(JSON.parse(localStorage.getItem('shownTasks') || '[]'));
  filteredItems$ = new BehaviorSubject<Item[]>([]);

  searchTerm: string = '';
  dateFrom: string = '';
  dateTo: string = '';

  constructor(
    public dialog: MatDialog,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.items$ = this.itemService.items$;
  }

  ngOnInit(): void {
    this.itemService.loadItems();
    this.sub = this.itemService.items$.subscribe(items => {
      this.length = items.length;
      this.filteredItems$.next(items);
      this.checkExpiredTasks(items);
    });

    this.checkInterval = interval(60000).subscribe(() => {
      this.items$.subscribe(items => this.checkExpiredTasks(items));
    });
  }

  checkExpiredTasks(items: Item[]): void {
    const now = new Date();
    let updated = false;

    items.forEach(item => {
      const taskDate = parse(item.executionDate, "dd.MM.yyyy, HH:mm:ss", new Date());


      if (isBefore(taskDate, now) && !this.shownTasks.has(item.id)) {
        this.showNotification(`${this.translate.instant('EXPIRED_TASK')}: ${item.title}`);
        this.shownTasks.add(item.id);
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('shownTasks', JSON.stringify(Array.from(this.shownTasks)));
    }
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'ОК', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  applyFilters(): void {
    this.items$.subscribe(items => {
      if (!this.searchTerm && !this.dateFrom && !this.dateTo) {
        this.filteredItems$.next(items);
        return;
      }});

    this.items$.subscribe(items => {
      const filtered = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(this.searchTerm.toLowerCase());
        const taskDate = parse(item.executionDate, "dd.MM.yyyy, HH:mm:ss", new Date());
        const matchesDateFrom = this.dateFrom ? taskDate >= new Date(this.dateFrom) : true;
        const matchesDateTo = this.dateTo ? taskDate <= new Date(this.dateTo) : true;

        return matchesSearch && matchesDateFrom && matchesDateTo;
      });

      this.filteredItems$.next(filtered);
    });
  }

  openInfoItemComponent(item: Item) : void{
    this.dialog.open(InfoItemComponent, {data: item});
  }

  toggleMenu(index: number, event: Event): void {
    event.stopPropagation();
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  moveUp(index: number, event: Event): void {
    event.stopPropagation();
    this.itemService.moveItem(index, index - 1);
    this.openMenuIndex = null;
  }

  moveDown(index: number, event: Event): void {
    event.stopPropagation();
    this.itemService.moveItem(index, index + 1);
    this.openMenuIndex = null;
  }

  toggleFiltersMenu(): void {
    this.openFilteredMenu = !this.openFilteredMenu;

    if (!this.openFilteredMenu) {
      this.searchTerm = '';
      this.dateFrom = '';
      this.dateTo = '';
      this.applyFilters();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.checkInterval.unsubscribe();
  }
}
