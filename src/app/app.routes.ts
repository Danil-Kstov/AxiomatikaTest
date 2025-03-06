import { Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { ViewComponent } from './view/view.component';

export const routes: Routes = [
  { path: 'editor', component: EditorComponent },
  { path: 'view', component: ViewComponent },
  { path: '', redirectTo: '/view', pathMatch: 'full' },
];
