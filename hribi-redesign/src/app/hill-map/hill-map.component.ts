import { Component, AfterViewInit, signal, inject, Input } from '@angular/core'; // ADD signal
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import 'leaflet.markercluster';
import { hills, forecastPoints, Hill } from '../../assets/hills'; // ADD Hill interface
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Define a custom marker type that includes our hill data for easier type casting
type HillMarker = L.Marker & { 
    options: L.MarkerOptions & { hillData: Hill } 
};

// Use this for modern Angular component structure
@Component({
  selector: 'app-hill-map',
  standalone: true, // Assuming standalone for simplicity
  imports: [CommonModule],
  templateUrl: './hill-map.component.html',
    styleUrls: ['./hill-map.component.css']
})
export class HillMapComponent implements AfterViewInit {
    @Input() showPlaceholder = true;
    private router = inject(Router);
    // ... existing properties ...
    hills = hills;
    forecastPoints = forecastPoints;

    private map!: L.Map;
    private readonly OWM_API_KEY = '4ef79803c9b25f6b5dc3bc61922ae0c5'; 

    // NEW: Signal to hold the list of hills to display in the sidebar
    selectedHills = signal<Hill[]>([]);

    private weatherIconGroup: L.LayerGroup = L.layerGroup(); 
    
    ngAfterViewInit(): void {
        this.initMap();
    }

    // NEW: Clears the selected hills list, closing the sidebar
    clearSelection() {
        this.selectedHills.set([]);
    }

    // NEW: Zooms/Pans the map to the selected hill location
    flyToHill(hill: Hill) {
        if (this.map) {
            this.map.flyTo([hill.lat, hill.lon], 13);
        }
    }
    
    goToHillPage(hillId: number) {
        // Use the router to navigate to the desired path, inserting the ID
        this.router.navigate(['/hill', hillId]);
    }

    private addWeatherIconsToMap() {
        this.forecastPoints.forEach(point => {
            // ... (rest of the addWeatherIconsToMap function remains the same)
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${point.lat}&lon=${point.lon}&appid=${this.OWM_API_KEY}&units=metric`;

            this.fetchWeatherAndAddMarker(apiUrl, point);
        });
    }

    // NEW helper function to separate weather fetching logic
    private fetchWeatherAndAddMarker(apiUrl: string, point: Hill) {
        // Implementation for weather fetching remains the same
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    console.error(`Failed to fetch weather for ${point.name}. Status: ${response.status}`);
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.cod === 200) {
                    const iconCode = data.weather[0].icon; 
                    const description = data.weather[0].description;
                    const temperature = Math.round(data.main.temp);
                    
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                    
                    const weatherIcon = L.icon({
                        iconUrl: iconUrl,
                        iconSize: [60, 60],
                        iconAnchor: [30, 30],
                        popupAnchor: [0, -30]
                    });

                    const marker = L.marker([point.lat, point.lon], { icon: weatherIcon })
                        .bindPopup(`
                            <div style="text-align: center; font-weight: bold; padding: 5px;">
                                ${point.name}
                            </div>
                            <div style="text-align: center; font-size: 1.2em;">
                                ${temperature}°C
                            </div>
                            <div style="text-align: center; font-size: 0.9em; text-transform: capitalize;">
                                ${description}
                            </div>
                        `);
                    
                    this.weatherIconGroup.addLayer(marker); 
                }
            })
            .catch(error => console.error(`Error processing weather data for ${point.name}:`, error));
    }


    private initMap() {
        // --- 1. ICON FIX for Leaflet Default Markers ---
        const hillIcon = L.icon({
            iconUrl: 'assets/icons/marker.svg',
            iconSize: [24, 38],
            iconAnchor: [19, 46],
            popupAnchor: [0, -42]
            });
        const iconRetinaUrl = 'assets/marker-icon-2x.png';
        const iconUrl = 'assets/marker-icon.png';
        const shadowUrl = 'assets/marker-shadow.png';
        const iconDefault = L.icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;

        // --- 2. MAP INITIALIZATION & BASE LAYERS ---
        const osmBaseLayer = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; OpenStreetMap contributors'
        });

        this.map = L.map('map', {
            layers: [osmBaseLayer] 
        }).setView([46.15, 14.99], 8);

        this.addWeatherIconsToMap(); 
        
        // --- 3. DEFINE OVERLAY LAYERS ---
        const weatherUrl = `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${this.OWM_API_KEY}`;
        const temperatureLayer = L.tileLayer(weatherUrl, {
            maxZoom: 18,
            opacity: 0.8,
            attribution: 'Weather data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>'
        });

        const weatherForecastGroup = L.layerGroup([
            temperatureLayer, 
            this.weatherIconGroup 
        ]);

        const baseLayers = {}; 
        const overlayLayers = {
            "Current Weather Forecast (Icons & Temp)": weatherForecastGroup, 
        };
        
        L.control.layers(baseLayers, overlayLayers).addTo(this.map);

        // --- 4. MARKER CLUSTERING SETUP AND CLICK LISTENERS ---
        const markers = L.markerClusterGroup({
            chunkedLoading: true 
        });

        this.hills.forEach(hill => {
            // Create a custom marker with the full hill object in its options
            const marker = L.marker([hill.lat, hill.lon], { 
                // Store the hill data directly in the marker's options for retrieval on click
                hillData: hill,
                icon: hillIcon
            } as any); 

            marker.bindPopup(hill.name);

            // Add click listener for individual markers
            marker.on('click', (e) => {
                // Cast e.target (the marker) to our custom type to access hillData
                const clickedMarker = e.target as HillMarker;
                this.selectedHills.set([clickedMarker.options.hillData]); // Set only the clicked hill
            });
            
            markers.addLayer(marker);
        });

        // Add cluster click listener
        markers.on('clusterclick', (a: any) => {
            // a.layer is the cluster object
            const childMarkers: HillMarker[] = a.layer.getAllChildMarkers();
            
            // Extract the hillData from all markers in the cluster
            const hillsInCluster: Hill[] = childMarkers.map(m => m.options.hillData);
            
            this.selectedHills.set(hillsInCluster);

            // If a cluster is clicked, zoom in to see the individual points unless there are many
            if (hillsInCluster.length <= 5) {
                a.layer.zoomToBounds();
            }
        });

        this.map.addLayer(markers);
    }

    alert(message: string) {
        window.alert(message);
    }
}