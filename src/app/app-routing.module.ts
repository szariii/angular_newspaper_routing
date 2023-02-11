import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewspapersYearsComponent } from './newspapers-years/newspapers-years.component';
import { NewspaperComponent } from './newspaper/newspaper.component';

const routes: Routes = [
  { path: ':name/:year', component: NewspapersYearsComponent },
  { path: ':name', component: NewspapersYearsComponent },
  { path: '', component: NewspaperComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
