export interface Camera {
  id: number;
  name: string;
  location?: string;
  url: string;
  embed?: boolean;
  description?: string;
}

export const cameras: Camera[] = [
  {
    id: 1,
    name: 'Triglav Summit Cam',
    location: 'Triglav',
    url: 'https://www.meteo.si/uploads/app/image.html?/uploads/probase/www/observ/webcam/KREDA-ICA_dir/siwc_KREDA-ICA_e_latest.jpg',
    embed: true,
    description: 'Kreda-ica camera (from meteo.si) - placeholder image URL.'
  },
  {
    id: 2,
    name: 'Kranjska Gora Ski Cam',
    location: 'Kranjska Gora',
    url: 'https://www.meteo.si/uploads/app/image.html?/uploads/probase/www/observ/webcam/KOPER_MARKOVEC_dir/siwc_KOPER_MARKOVEC_n_latest.jpg',
    embed: true,
    description: 'Koper Markovec camera (from meteo.si) - placeholder image URL.'
  },
  {
    id: 3,
    name: 'Vršič Pass Cam',
    location: 'Vršič',
    url: 'https:www.meteo.si/uploads/app/image.html?/uploads/probase/www/observ/webcam/LJUBL-ANA_BEZIGRAD_dir/siwc_LJUBL-ANA_BEZIGRAD_s-zoom1_latest.jpg',
    embed: true,
    description: 'Velenje / Vršič area camera (from meteo.si) - placeholder image URL.'
  }
];
