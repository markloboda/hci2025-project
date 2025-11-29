import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    day: string;
    icon: string;
    highTemp: number;
    lowTemp: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly OWM_API_KEY = environment.weatherApiKey;

  async getCurrentWeather(lat: number, lon: number): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.OWM_API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Weather fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
    }
  }

  async getForecast(lat: number, lon: number): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.OWM_API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Forecast fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return null;
    }
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  processForecastData(forecastData: any): Array<{day: string, icon: string, highTemp: number, lowTemp: number}> {
    if (!forecastData || !forecastData.list) return [];

    const days = ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'];
    const dailyData = new Map();

    // Group forecast by day
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();

      if (!dailyData.has(dayKey)) {
        dailyData.set(dayKey, {
          day: days[date.getDay()],
          temps: [],
          icons: []
        });
      }

      dailyData.get(dayKey).temps.push(item.main.temp);
      dailyData.get(dayKey).icons.push(item.weather[0].icon);
    });

    // Process each day
    const result: Array<{day: string, icon: string, highTemp: number, lowTemp: number}> = [];

    dailyData.forEach((data, dateKey) => {
      if (result.length < 5) { // Only next 5 days
        const highTemp = Math.round(Math.max(...data.temps));
        const lowTemp = Math.round(Math.min(...data.temps));
        const mostFrequentIcon = this.getMostFrequentIcon(data.icons);

        result.push({
          day: data.day,
          icon: mostFrequentIcon,
          highTemp,
          lowTemp
        });
      }
    });

    return result;
  }

  private getMostFrequentIcon(icons: string[]): string {
    const iconCount = icons.reduce((acc: any, icon: string) => {
      acc[icon] = (acc[icon] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(iconCount).reduce((a, b) => iconCount[a] > iconCount[b] ? a : b);
  }
}