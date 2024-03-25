import { Routes } from '@angular/router';
import { authGuard } from './utils/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CadSurveyComponent } from './survey/cad-survey.component';
import { UsersComponent } from './users/users.component';
import { CadUserComponent } from './cad-user/cad-user.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'surveys/:id',
    component: CadSurveyComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users/:id',
    component: CadUserComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
