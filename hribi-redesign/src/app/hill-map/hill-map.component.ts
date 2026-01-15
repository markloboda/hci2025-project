import { Component, AfterViewInit, signal, inject, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import 'leaflet.markercluster';
import { hills, forecastPoints, Hill } from '../../assets/hills';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';
import JSZip from 'jszip';

// Define a custom marker type that includes our hill data for easier type casting
type HillMarker = L.Marker & {
  options: L.MarkerOptions & { hillData: Hill }
};

@Component({
  selector: 'app-hill-map',
  standalone: true, // Assuming standalone for simplicity
  imports: [CommonModule],
  templateUrl: './hill-map.component.html',
  styleUrls: ['./hill-map.component.css']
})
export class HillMapComponent implements AfterViewInit, OnChanges {
  @Input() showPlaceholder = true;
  @Input() autoSelectAll = false; // New input to control auto-selection behavior
  private router = inject(Router);

  @Input() hills: Hill[] = hills; // Default to all hills
  forecastPoints = forecastPoints;

  private map!: L.Map;
  private markerClusterGroup!: L.MarkerClusterGroup;
  private readonly OWM_API_KEY = '4ef79803c9b25f6b5dc3bc61922ae0c5';

  @Input() isFilterOpen = false;
  @Output() toggleHillsSidebar = new EventEmitter<boolean>();
  showList = false;
  // Signal to hold the list of hills to display in the sidebar
  selectedHills = signal<Hill[]>([]);

  private weatherIconGroup: L.LayerGroup = L.layerGroup();

  isSidebarOpen() {
    return this.showList && !this.isFilterOpen;
  }

  shouldShowButton() {
    return this.selectedHills().length > 0 && !this.showList && !this.isFilterOpen;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  toggleList() {
    this.showList = !this.showList;
    this.toggleHillsSidebar.emit(this.showList);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hills']) {
      if (this.autoSelectAll) {
        this.selectedHills.set(this.hills); // Sync selection with input
      }

      if (!changes['hills'].isFirstChange()) {
        this.updateMarkers();
      }
    }
  }

  clearSelection() {
    this.selectedHillId = null;
    this.updateMarkerIcons();
    this.showList = false;
    this.toggleHillsSidebar.emit(this.showList);
  }

  // NEW: Zooms/Pans the map to the selected hill location
  flyToHill(hill: Hill) {
    if (this.map) {
      this.selectedHillId = hill.id;
      this.showList = false;
      this.toggleHillsSidebar.emit(this.showList);

      this.map.flyTo([hill.lat, hill.lon], 13);

      // Wait for fly animation to settle slightly or just open it
      setTimeout(() => {
        this.updateMarkerIcons();
      }, 300);
    }
  }

  private updateMarkerIcons() {
    if (!this.markerClusterGroup) return;

    const hillIcon = L.icon({
      iconUrl: 'assets/icons/marker.svg',
      iconSize: [24, 38],
      iconAnchor: [19, 46],
      popupAnchor: [0, -42]
    });

    const redHillIcon = L.icon({
      iconUrl: 'assets/icons/marker.svg',
      iconSize: [24, 38],
      iconAnchor: [19, 46],
      popupAnchor: [0, -42],
      className: 'marker-red-filter'
    });

    this.markerClusterGroup.eachLayer((layer: any) => {
      if (layer instanceof L.Marker && (layer as any).options.hillData) {
        const marker = layer as HillMarker;
        if (marker.options.hillData.id === this.selectedHillId) {
          marker.setIcon(redHillIcon);
          marker.openPopup();
        } else {
          marker.setIcon(hillIcon);
          // marker.closePopup(); // Optional: close others
        }
      }
    });
  }

  // Adding of GPX files: in assets/gps folder .gpx files with hill name from start of file to first '-'
  // When adding the GPX files, make sure to add the hill name to the start of the file, following by '-' and
  // name of the path.
  // Do not forget to add the file to the gps_manifest.json file.
  downloadGPX(hill: Hill) {
    // Collect all unique GPX files from all routes
    const allGpsFiles: string[] = Array.from(new Set(hill.routes.flatMap(r => r.gps || [])));

    if (allGpsFiles.length === 0) {
      alert('No GPX files found for ' + hill.name);
      return;
    }

    const zip = new JSZip();

    // Fetch all files and add to zip
    const fetchPromises = allGpsFiles.map((file: string) =>
      fetch(`assets/gps/${file}`)
        .then(res => res.blob())
        .then(blob => {
          zip.file(file, blob);
        })
    );

    Promise.all(fetchPromises)
      .then(async () => {
        const cleanHillName = hill.name.replace(/\s*\(.*\)/, '').trim().toLowerCase();
        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${cleanHillName.replace(/\s+/g, '_')}_gpx.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch(error => {
        console.error('Error downloading/zipping GPX files:', error);
        alert('Error processing GPX files.');
      });
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


  selectedHillId: number | null = null;

  private initMap() {
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
      layers: [osmBaseLayer],
      maxBounds: [
        [42.421, 13.375], // South-West (Portorož/Istria)
        [48.92, 16.610]  // North-East (Goričko/Lendava)
      ],
      maxBoundsViscosity: 1.0, // Hard stop at bounds
      minZoom: 7, // Allow zooming out slightly more
      zoomSnap: 0.1,
      zoomDelta: 0.1
    }).fitBounds([
      [45.421, 13.375], // South-West
      [46.920, 16.610]  // North-East
    ], { padding: [30, 30] });

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

    this.markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true
    });

    this.updateMarkers();

    this.markerClusterGroup.on('clusterclick', (a: any) => {
      const childMarkers: HillMarker[] = a.layer.getAllChildMarkers();
      const hillsInCluster: Hill[] = childMarkers.map(m => m.options.hillData);
      this.selectedHills.set(hillsInCluster);

      if (hillsInCluster.length <= 5) {
        a.layer.zoomToBounds();
      }
    });

    this.map.addLayer(this.markerClusterGroup);

    // Force recalculation of container size and center after init
    setTimeout(() => {
      this.syncMapView();
    }, 400);
  }

  // NEW: Robust method to ensure map is centered and Slovenia is visible
  public syncMapView() {
    if (!this.map) return;

    // Slovenia Bounding Box
    const sloBounds: L.LatLngBoundsExpression = [
      [45.421, 13.375],
      [46.87, 16.610]
    ];

    this.map.invalidateSize();
    this.map.fitBounds(sloBounds, {
      padding: [40, 40],
      animate: false
    });
  }

  private updateMarkers() {
    if (!this.map || !this.markerClusterGroup) return;

    this.markerClusterGroup.clearLayers();

    const hillIcon = L.icon({
      iconUrl: 'assets/icons/marker.svg',
      iconSize: [24, 38],
      iconAnchor: [19, 46],
      popupAnchor: [0, -42]
    });

    // Create the Red Pin Icon using the same image but with CSS filter
    const redHillIcon = L.icon({
      iconUrl: 'assets/icons/marker.svg',
      iconSize: [24, 38],
      iconAnchor: [19, 46],
      popupAnchor: [0, -42],
      className: 'marker-red-filter'
    });


    this.hills.forEach(hill => {
      const isSelected = this.selectedHillId === hill.id;

      // Create a custom marker with the full hill object in its options
      const marker = L.marker([hill.lat, hill.lon], {
        // Store the hill data directly in the marker's options for retrieval on click
        hillData: hill,
        icon: isSelected ? redHillIcon : hillIcon
      } as any);

      // Bind popup with custom class for better styling
      marker.bindPopup(`<div class="custom-popup-content">${hill.name}</div>`, {
        className: 'custom-popup'
      });

      // Open popup if selected
      if (isSelected) {
        // We need to defer opening popup slightly to ensure marker is added to map/cluster
        setTimeout(() => marker.openPopup(), 100);
      }

      // Add click listener for individual markers
      marker.on('click', (e) => {
        const clickedMarker = e.target as HillMarker;
        const hillData = clickedMarker.options.hillData;

        // Update ID
        this.selectedHillId = hillData.id;

        // We need to visually update ALL markers because we don't track the 'previous' marker object purely
        // However, iterating all markers is expensive.
        // A better UX for this specific map library usage might be to just swap the icon of the clicked one
        // and reset the others?
        // ACTUALLY: Since we want robustness, let's just trigger a lightweight re-render or
        // handle the icon swap manually if we can.
        // For now, let's try manual swap for performance, if we can find the old one?
        // No, simplest robust way:
        // 1. Reset *all* visible markers to blue? No, too many.
        // 2. Just relying on `updateMarkers` is safe but maybe flickering?
        // Let's do the manual swap pattern which is faster.

        // Fix: Since we lost reference to "previous marker object" from the previous render,
        // we can't easily reset it if we just clicked.
        // BUT, if we are inside the SAME render cycle, we can iterate the cluster group layers?
        this.markerClusterGroup.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            layer.setIcon(hillIcon);
            layer.closePopup();
          }
        });

        // Set this one to Red
        clickedMarker.setIcon(redHillIcon);
        clickedMarker.openPopup();

        // Auto-open sidebar on selection
        this.showList = true;
        this.toggleHillsSidebar.emit(this.showList);

        if (this.autoSelectAll) {
          // Scroll to the card instead of filtering
          setTimeout(() => {
            const cardElement = document.getElementById('hill-card-' + hillData.id);
            if (cardElement) {
              cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

              // Add highlight effect
              cardElement.classList.add('highlight-card');
              setTimeout(() => cardElement.classList.remove('highlight-card'), 2000);
            }
          }, 100);
        } else {
          // Default behavior: reset selection to just this hill
          this.selectedHills.set([hillData]);
        }
      });

      this.markerClusterGroup.addLayer(marker);
    });
  }

  alert(message: string) {
    window.alert(message);
  }
}