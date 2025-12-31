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
  selectedImage: any = null;

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
    // Wait for the next tick to ensure the DOM has updated with the route details section
    setTimeout(() => {
      const element = document.getElementById('map');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
    // TODO: Here you'll add map highlighting logic later
    console.log('Selected route:', this.hillData.routes[index].name);
  }

  deselectRoute(): void {
    this.selectedRouteIndex = null;
    // TODO: Here you'll add map unhighlighting logic later
  }

  openImageModal(image: any): void {
    this.selectedImage = image;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }

  getDifficultyIcons(difficulty: string): boolean[] {
    switch (difficulty) {
      case 'Easy': return [true, false, false];
      case 'Medium': return [true, true, false];
      case 'Hard': return [true, true, true];
      default: return [false, false, false];
    }
  }

  downloadRouteGPX(gpsFile: string | undefined): void {
    if (!gpsFile) return;

    const filePath = `assets/gps/${gpsFile}`;
    fetch(filePath)
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = gpsFile;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(err => {
        console.error('Download failed:', err);
        alert('Prenos GPX datoteke ni uspel. Datoteka morda ne obstaja na strežniku.');
      });
  }
}