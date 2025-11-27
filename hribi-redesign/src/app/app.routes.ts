import { Routes } from '@angular/router';
import { RouteName } from '../models/enums';
import { HomePageComponent } from './home-page/home-page.component';
import { HillPageComponent } from './hill-page/hill-page.component';

export const routes: Routes = [
    {path: "", redirectTo: RouteName.home, pathMatch: "full"},
    {path: RouteName.home, component: HomePageComponent},
    {path: "hill/:id", component: HillPageComponent}

];
