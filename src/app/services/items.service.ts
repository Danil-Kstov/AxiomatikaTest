import { Injectable } from '@angular/core';
import {Item} from '../../types/types';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'https://67c52448c4649b9551b55778.mockapi.io/items';

  private itemsSubject = new BehaviorSubject<Item[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadItems(): void {
    this.http.get<Item[]>(this.apiUrl).subscribe(items => {
      this.itemsSubject.next(items);
    });
  }

  addItem(item: Item): void {
    this.http.post<Item>(this.apiUrl, item).subscribe(
      newItem => {
        const currentItems = this.itemsSubject.getValue();
        this.itemsSubject.next([...currentItems, newItem]);
      }
    );
  }

  moveItem(oldIndex: number, newIndex: number): void {
    const items = this.itemsSubject.getValue();

    if (newIndex < 0 || newIndex >= items.length) {
      return;
    }

    const updatedItems = [...items];
    [updatedItems[oldIndex], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[oldIndex]];

    this.itemsSubject.next(updatedItems);

    this.updateItemPosition(updatedItems[oldIndex]);
    this.updateItemPosition(updatedItems[newIndex]);
  }

  updateItemPosition(item: Item): void {
    this.http.put(`${this.apiUrl}/${item.id}`, item).subscribe();
  }

  deleteItem(itemId: string): void {
    this.http.delete<void>(`${this.apiUrl}/${itemId}`).subscribe(
      () => {
        const currentItems = this.itemsSubject.getValue();
        this.itemsSubject.next(currentItems.filter(item => item.id !== itemId));
      }
    );
  }
}
