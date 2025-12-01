import { Routes } from '@angular/router';
import { RouteName } from '../models/enums';
import { HomePageComponent } from './home-page/home-page.component';
import { HillPageComponent } from './hill-page/hill-page.component';
import { HillMapComponent } from './hill-map/hill-map.component';
import { MapPageComponent } from './map-page/map-page.component';
import { WeatherPageComponent } from './weather-page/weather-page.component';
import { CamerasComponent } from './cameras/cameras.component';
import { NewsComponent } from './news/news.component';

export const routes: Routes = [
    // Redirect root to /home and map /home to the component
    { path: "", redirectTo: RouteName.home, pathMatch: 'full' },
    { path: RouteName.home, component: HomePageComponent },
    { path: 'news', component: NewsComponent },
    {path: "map", component: MapPageComponent},
    {path: "weather", component: WeatherPageComponent},
    {path: "cameras", component: CamerasComponent},
    {path: "hill/:id", component: HillPageComponent},
    { path: '**', redirectTo: RouteName.home }
];
