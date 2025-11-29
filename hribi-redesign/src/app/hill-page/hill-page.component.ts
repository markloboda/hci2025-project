import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Hill, hills } from '../../assets/hills';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-hill-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hill-page.component.html',
  styleUrls: ['./hill-page.component.css']
})
export class HillPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private weatherService = inject(WeatherService);

  hillID!: number;
  hillData: any = null;
  weatherForecast: any[] = [];
  currentWeather: any = null;
  expandedRoutes: boolean[] = [];
  selectedRouteIndex: number | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.hillID = +params['id'];
      this.loadHillData();
      this.loadWeatherData();
    });
  }

  loadHillData() {
    this.hillData = hills.find(hill => hill.id === this.hillID);
    // Initialize expanded routes array
    if (this.hillData) {
      this.expandedRoutes = new Array(this.hillData.routes.length).fill(false);
    }
  }

  toggleRoute(index: number): void {
    this.expandedRoutes[index] = !this.expandedRoutes[index];
  }

  async loadWeatherData() {
    if (this.hillData) {
      try {
        const currentWeather = await this.weatherService.getCurrentWeather(
          this.hillData.lat,
          this.hillData.lon
        );

        if (currentWeather) {
          this.currentWeather = {
            temp: Math.round(currentWeather.main.temp),
            description: currentWeather.weather[0].description,
            icon: currentWeather.weather[0].icon
          };
        }

        const forecastData = await this.weatherService.getForecast(
          this.hillData.lat,
          this.hillData.lon
        );

        if (forecastData) {
          this.weatherForecast = this.weatherService.processForecastData(forecastData);
        }
      } catch (error) {
        console.error('Error loading weather data:', error);
      }
    }
  }

  getWeatherEmoji(iconCode: string): string {
    const weatherMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return weatherMap[iconCode] || '🌤️';
  }

  openInGoogleMaps(): void {
    if (this.hillData) {
      const url = `https://www.google.com/maps?q=${this.hillData.lat},${this.hillData.lon}`;
      window.open(url, '_blank');
    }
  }

  selectRoute(index: number): void {
    this.selectedRouteIndex = index;
    // TODO: Here you'll add map highlighting logic later
    console.log('Selected route:', this.hillData.routes[index].name);
  }

  deselectRoute(): void {
    this.selectedRouteIndex = null;
    // TODO: Here you'll add map unhighlighting logic later
  }
}