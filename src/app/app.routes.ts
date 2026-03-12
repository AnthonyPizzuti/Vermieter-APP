import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { HausDetail } from './components/haus-detail/haus-detail';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'haus/:id', component: HausDetail },
  { path: '**', redirectTo: '' }
];