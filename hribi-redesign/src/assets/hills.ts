import gpsManifest from './gps_manifest.json';
import imgManifest from './img_manifest.json';

export interface Comment {
    id: number;
    time: Date;          // Time of the comment
    user: string;        // The user who posted the comment
    text: string;
}


export interface Image {
    name: string;
    url: string;
    alt: string;
}

export interface Webcam {
    id: number;
    url: string;
    name: string;
}


export interface Route {
    id: number;
    start: string;
    end: string;
    name: string;
    time: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    heightDiff: number;
    summerGear: string;
    winterGear: string;
    images: Image[];
    comments: Comment[];
    descriptionOfStart: string;
    descriptionOfPath: string;
    gps?: string;
}


export interface Hill {
    id: number;
    name: string;
    lat: number;
    lon: number;
    country: string;
    mountainRange: string;
    height: number;
    type: string;
    popularity: number;
    images: Image[];
    routes: Route[];
    description: string;
    webcams: Webcam[];
    comments: Comment[];
    gps: string[];
}

// --- HELPER FUNCTION TO INFER PROPERTIES AND ADD PLACEHOLDER DATA ---
function createHillData(simpleHill: { name: string, lat: number, lon: number }, index: number, mountainRange: string, routes: Route[] = []): Hill {
    let name = simpleHill.name.replace(/\s*\(.*\)/, ''); // Clean up name
    let alt = 0;

    // Assign a reasonable height based on some known peaks to make the data more realistic
    if (name.includes('Triglav')) alt = 2864;
    else if (name.includes('Mangart')) alt = 2679;
    else if (name.includes('Grintovec')) alt = 2558;
    else if (name.includes('Snežnik')) alt = 1796;
    else if (name.includes('Stol')) alt = 2236;
    else if (name.includes('Peca')) alt = 2125;
    else if (name.includes('Vogel')) alt = 1922;
    else if (name.includes('Šmarna gora')) alt = 669;
    else alt = Math.round(1000 + Math.random() * 1500); // Random height for others

    return {
        id: index + 1,
        name: simpleHill.name,
        lat: simpleHill.lat,
        lon: simpleHill.lon,
        country: 'Slovenia',
        mountainRange: mountainRange,
        height: alt,
        type: simpleHill.name.includes('Peak') || simpleHill.name.includes('Vrh') ? 'Peak' : 'Hill',
        description: `This is the description for ${simpleHill.name}. Located in the ${mountainRange}.`,
        popularity: Math.floor(Math.random() * 5) + 1, // 1 to 5 stars
        images: (() => {
            const matches = imgManifest.filter(file => {
                const firstDashIndex = file.indexOf('-');
                if (firstDashIndex === -1) return false;
                const hillPartInFile = file.substring(0, firstDashIndex).toLowerCase();
                const normalize = (s: string) => s.replace(/[\s_]/g, '').toLowerCase();
                return normalize(hillPartInFile) === normalize(name);
            });
            if (matches.length > 0) {
                return matches.map(file => {
                    const suffix = file.substring(file.indexOf('-') + 1, file.lastIndexOf('.'));
                    return {
                        name: `${name} ${suffix}`,
                        url: `/assets/img/${file}`,
                        alt: `${name} ${suffix}`
                    };
                });
            }  // default image if no match
            return [{
                name: `${name} View`,
                url: '/assets/img/default.jpg',
                alt: `Default view of ${name}`
            }];
        })(),
        webcams: [],
        comments: [],
        routes: (() => {
            if (routes.length > 0) return routes;
            return [
                // Add one placeholder route for complexity
                {
                    id: 1,
                    name: `Standard Route to ${name}`,
                    start: 'Base Camp',
                    end: `Summit of ${name}`,
                    time: alt > 1500 ? '4-5 hours' : '1-2 hours',
                    difficulty: alt > 2000 ? 'Hard' : alt > 1000 ? 'Medium' : 'Easy',
                    heightDiff: alt,
                    summerGear: 'Hiking boots',
                    winterGear: 'Crampons (if snowy)',
                    images: [],
                    comments: [],
                    descriptionOfStart: 'Parking lot at the base.',
                    descriptionOfPath: 'A well-marked path, moderate incline.'
                }
            ];
        })(),
        gps: gpsManifest.filter(file => {
            const firstDashIndex = file.indexOf('-');
            if (firstDashIndex === -1) return false;
            const hillPartInFile = file.substring(0, firstDashIndex).toLowerCase();
            const normalize = (s: string) => s.replace(/[\s_]/g, '').toLowerCase();
            return normalize(hillPartInFile) === normalize(name);
        })
    };
}


export const hills: Hill[] = [
    // --- Julian Alps (NW) - High Mountains ---
    createHillData(
        {
            name: "Triglav",
            lat: 46.3768,
            lon: 13.8378
        },
        0,
        'Julian Alps',
        [
            {
                id: 1,
                start: "Aljažev dom v Vratih",
                end: "Triglav",
                name: "Tominškova pot",
                time: "6 h 5 min",
                difficulty: "Hard",
                heightDiff: 1849, // hribi.net detailed page
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Aljažev dom v Vratih",
                descriptionOfPath: "Zelo zahtevna označena pot – Tominškova pot na Triglav",
                gps: "triglav-aljažev_dom_v_vratih_(po_tominškovi_poti).gpx"
            },
            {
                id: 2,
                start: "Konec ceste na Pokljuki",
                end: "Triglav",
                name: "čez Planiko in Mali Triglav",
                time: "6 h",
                difficulty: "Hard",
                heightDiff: 1860, // approximate typical
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Konec ceste na Pokljuki",
                descriptionOfPath: "Zelo zahtevna označena pot čez Planiko in Mali Triglav",
                gps: "triglav-dolina_krma_(čez_planiko_in_mali_triglav).gpx"
            },
            {
                id: 3,
                start: "Dolina Krma",
                end: "Triglav",
                name: "čez Kredarico",
                time: "6 h 15 min",
                difficulty: "Hard",
                heightDiff: 1934, // approximate typical
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Dolina Krma",
                descriptionOfPath: "Zelo zahtevna označena pot čez Kredarico",
                gps: "triglav-dolina_krma_(triglav_krma_planika_kredarica_(krožna)).gpx"
            },
            {
                id: 4,
                start: "Aljažev dom v Vratih",
                end: "Triglav",
                name: "čez Plemenice",
                time: "6 h 30 min",
                difficulty: "Hard",
                heightDiff: 1849, // approximate typical
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Aljažev dom v Vratih",
                descriptionOfPath: "Zelo zahtevna označena pot čez Plemenice",
                gps: "triglav-vrata_(čez_plemenice).gpx"
            },
            {
                id: 5,
                start: "Aljažev dom v Vratih",
                end: "Triglav",
                name: "čez Prag",
                time: "6 h 15 min",
                difficulty: "Hard",
                heightDiff: 1849, // approximate typical
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Aljažev dom v Vratih",
                descriptionOfPath: "Zelo zahtevna označena pot čez Prag",
                gps: "triglav-aljažev_dom_v_vratih_(čez_prag).gpx"
            },
            {
                id: 6,
                start: "Koča pri Savici",
                end: "Triglav",
                name: "čez Triglavska jezera",
                time: "8 h 45 min",
                difficulty: "Hard",
                heightDiff: 2530, // typical for this long route
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Koča pri Savici",
                descriptionOfPath: "Zelo zahtevna označena pot preko Triglavskih jezer",
                gps: "triglav-koča_pri_savici.gpx"
            },
            {
                id: 7,
                start: "Zadnjica",
                end: "Triglav",
                name: "čez Dolič",
                time: "7 h 15 min",
                difficulty: "Hard",
                heightDiff: 2215, // typical for this valley route
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Zadnjica",
                descriptionOfPath: "Zelo zahtevna označena pot čez Dolič"
            },
            {
                id: 8,
                start: "Rudno polje",
                end: "Triglav",
                name: "čez Kredarico",
                time: "6 h 35 min",
                difficulty: "Hard",
                heightDiff: 1860, // estimated
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Rudno polje",
                descriptionOfPath: "Zelo zahtevna označena pot čez Kredarico",
                gps: "triglav-rudno_polje.gpx"
            },
            {
                id: 9,
                start: "Srednja vas",
                end: "Triglav",
                name: "Za Ribnico in čez Triglavsko škrbino",
                time: "7 h 45 min",
                difficulty: "Hard",
                heightDiff: 2485, // hribi.net route stats
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Srednja vas",
                descriptionOfPath: "Zelo zahtevna označena pot za Ribnico in čez Triglavsko škrbino",
                gps: "triglav-dolina_krma_(čez_planiko_in_triglavsko_škrbino).gpx"
            }
        ]
    ),


    createHillData({ name: "Mangart", lat: 46.4258, lon: 13.6331 }, 1, 'Julian Alps'),
    createHillData({ name: "Jalovec", lat: 46.4385, lon: 13.7171 }, 2, 'Julian Alps'),
    createHillData({ name: "Razor", lat: 46.3986, lon: 13.7663 }, 3, 'Julian Alps'),
    createHillData({ name: "Krn", lat: 46.2573, lon: 13.6841 }, 4, 'Julian Alps'),
    createHillData({ name: "Vogel", lat: 46.2625, lon: 13.8055 }, 5, 'Julian Alps'),
    createHillData({ name: "Rodica", lat: 46.2238, lon: 13.8767 }, 6, 'Julian Alps'),
    createHillData({ name: "Viševnik", lat: 46.3533, lon: 13.9168 }, 7, 'Julian Alps'),
    createHillData({ name: "Veliki Draški vrh", lat: 46.3475, lon: 13.9392 }, 8, 'Julian Alps'),
    createHillData({ name: "Mali Draški vrh", lat: 46.3458, lon: 13.9317 }, 9, 'Julian Alps'),
    createHillData({ name: "Debela peč", lat: 46.3551, lon: 13.9511 }, 10, 'Julian Alps'),
    createHillData({ name: "Prisojnik", lat: 46.4170, lon: 13.7844 }, 11, 'Julian Alps'),
    createHillData({ name: "Špik", lat: 46.4522, lon: 13.7711 }, 12, 'Julian Alps'),
    createHillData({ name: "Komna Plateau", lat: 46.2415, lon: 13.7725 }, 13, 'Julian Alps'),
    createHillData({ name: "Planina pri Jezeru", lat: 46.3134, lon: 13.8458 }, 14, 'Julian Alps'),
    createHillData({ name: "Osojnica", lat: 46.3650, lon: 14.0750 }, 15, 'Julian Alps'),
    createHillData({ name: "Straža", lat: 46.3680, lon: 14.1000 }, 16, 'Julian Alps'),
    createHillData({ name: "Vitranec", lat: 46.4900, lon: 13.7900 }, 17, 'Julian Alps'),
    createHillData({ name: "Vršič pass", lat: 46.4020, lon: 13.7590 }, 18, 'Julian Alps'),
    createHillData({ name: "Špik", lat: 46.3050, lon: 13.8750 }, 19, 'Julian Alps'),

    // --- Karavanke Alps (N) ---
    createHillData({ name: "Stol", lat: 46.4422, lon: 14.1500 }, 20, 'Karavanke Alps'),
    createHillData({ name: "Košuta", lat: 46.4517, lon: 14.5350 }, 21, 'Karavanke Alps'),
    createHillData({ name: "Begunjščica", lat: 46.4022, lon: 14.1685 }, 22, 'Karavanke Alps'),
    createHillData({ name: "Kepa", lat: 46.4861, lon: 13.9782 }, 23, 'Karavanke Alps'),
    createHillData({ name: "Vrtača", lat: 46.4402, lon: 14.1105 }, 24, 'Karavanke Alps'),
    createHillData({ name: "Trupejevo poldne", lat: 46.4678, lon: 13.9765 }, 25, 'Karavanke Alps'),
    createHillData({ name: "Golica", lat: 46.4471, lon: 14.0729 }, 26, 'Karavanke Alps'),

    // --- Kamnik–Savinja Alps (N-C) ---
    createHillData({ name: "Grintovec", lat: 46.3686, lon: 14.5317 }, 27, 'Kamnik–Savinja Alps'),
    createHillData({ name: "Skuta", lat: 46.3601, lon: 14.5377 }, 28, 'Kamnik–Savinja Alps'),
    createHillData({ name: "Ojstrica", lat: 46.3534, lon: 14.6300 }, 29, 'Kamnik–Savinja Alps'),
    createHillData({ name: "Storžič", lat: 46.3463, lon: 14.3644 }, 30, 'Kamnik–Savinja Alps'),
    createHillData({ name: "Velika planina", lat: 46.2825, lon: 14.6110 }, 31, 'Kamnik–Savinja Alps'),
    createHillData({ name: "Menina planina", lat: 46.3015, lon: 14.8112 }, 32, 'Kamnik–Savinja Alps'),
    createHillData({ name: "Raduha", lat: 46.3600, lon: 14.7800 }, 33, 'Kamnik–Savinja Alps'),
    createHillData({ name: "Krvavec", lat: 46.2890, lon: 14.4920 }, 34, 'Kamnik–Savinja Alps'),
    createHillData({ name: "Potočka zijalka", lat: 46.3980, lon: 14.6600 }, 35, 'Kamnik–Savinja Alps'),
    createHillData({ name: "Veliki vrh", lat: 46.3150, lon: 14.8100 }, 36, 'Kamnik–Savinja Alps'),
    createHillData({ name: "Golte", lat: 46.3300, lon: 14.9300 }, 37, 'Kamnik–Savinja Alps'),

    // --- Pohorje, Drava Valley & Koroška (NE) ---
    createHillData({ name: "Peca", lat: 46.5186, lon: 14.7770 }, 38, 'Pohorje'),
    createHillData({ name: "Uršlja gora", lat: 46.4589, lon: 14.9926 }, 39, 'Pohorje'),
    createHillData({ name: "Črni Vrh", lat: 46.5057, lon: 15.3411 }, 40, 'Pohorje'),
    createHillData({ name: "Velika Kopa", lat: 46.5292, lon: 15.3619 }, 41, 'Pohorje'),
    createHillData({ name: "Rogla", lat: 46.4385, lon: 15.3524 }, 42, 'Pohorje'),
    createHillData({ name: "Boč", lat: 46.2801, lon: 15.5898 }, 43, 'Pohorje'),
    createHillData({ name: "Donačka gora", lat: 46.2828, lon: 15.7478 }, 44, 'Pohorje'),
    createHillData({ name: "Ptujska Gora", lat: 46.3888, lon: 15.7725 }, 45, 'Haloze'),
    createHillData({ name: "Jezerski Vrh", lat: 46.5592, lon: 15.6322 }, 46, 'Pohorje'),
    createHillData({ name: "Pohorski maršal", lat: 46.5000, lon: 15.1500 }, 47, 'Pohorje'),
    createHillData({ name: "Sveta Trojica", lat: 46.6690, lon: 16.1400 }, 48, 'Goričko'),

    // --- Julian Pre-Alps & Škofja Loka Hills (W) ---
    createHillData({ name: "Stari vrh", lat: 46.1770, lon: 14.1568 }, 49, 'Škofja Loka Hills'),
    createHillData({ name: "Lubnik", lat: 46.1666, lon: 14.0763 }, 50, 'Škofja Loka Hills'),
    createHillData({ name: "Blegoš", lat: 46.1648, lon: 14.0042 }, 51, 'Škofja Loka Hills'),
    createHillData({ name: "Ratitovec", lat: 46.2163, lon: 14.0706 }, 52, 'Škofja Loka Hills'),
    createHillData({ name: "Porezen", lat: 46.1645, lon: 13.9167 }, 53, 'Julian Pre-Alps'),
    createHillData({ name: "Matajur", lat: 46.2205, lon: 13.5658 }, 54, 'Julian Pre-Alps'),
    createHillData({ name: "Kolovrat Ridge", lat: 46.1360, lon: 13.7250 }, 55, 'Julian Pre-Alps'),
    createHillData({ name: "Vrh nad Škofjo Loko", lat: 46.1790, lon: 14.0322 }, 56, 'Škofja Loka Hills'),

    // --- Dinaric Alps & Karst (S & SW) ---
    createHillData({ name: "Snežnik", lat: 45.5818, lon: 14.4485 }, 57, 'Dinaric Alps'),
    createHillData({ name: "Nanos", lat: 45.7725, lon: 14.0083 }, 58, 'Dinaric Alps'),
    createHillData({ name: "Slavnik", lat: 45.5401, lon: 13.9877 }, 59, 'Dinaric Alps'),
    createHillData({ name: "Vremščica", lat: 45.7360, lon: 14.0620 }, 60, 'Karst'),
    createHillData({ name: "Kojnik", lat: 45.5975, lon: 13.9220 }, 61, 'Karst'),
    createHillData({ name: "Košanski vrh", lat: 45.6980, lon: 14.0410 }, 62, 'Karst'),
    createHillData({ name: "Kokoš", lat: 45.6706, lon: 13.9026 }, 63, 'Karst'),
    createHillData({ name: "Lipovec", lat: 45.6558, lon: 14.9354 }, 64, 'Kočevski Rog'),
    createHillData({ name: "Goteniški Snežnik", lat: 45.6720, lon: 14.6950 }, 65, 'Dinaric Alps'),
    createHillData({ name: "Mali Golak", lat: 45.9890, lon: 13.8820 }, 66, 'Trnovski Gozd'),
    createHillData({ name: "Hrib", lat: 45.4386, lon: 13.8684 }, 67, 'Karst Edge'),
    createHillData({ name: "Dvorina", lat: 45.4492, lon: 13.8403 }, 68, 'Karst Edge'),
    createHillData({ name: "Kucelj", lat: 45.8200, lon: 14.1500 }, 69, 'Javorniki'),
    createHillData({ name: "Slavina", lat: 45.7800, lon: 14.0400 }, 70, 'Javorniki'),
    createHillData({ name: "Vrabče", lat: 45.9100, lon: 13.7100 }, 71, 'Vipava Hills'),
    createHillData({ name: "Cigoj", lat: 45.8950, lon: 13.9800 }, 72, 'Vipava Hills'),

    // --- Central Hills (Ljubljana Basin & Posavje/Zasavje) ---
    createHillData({ name: "Šmarna gora", lat: 46.1265, lon: 14.4646 }, 73, 'Ljubljana Basin Hills'),
    createHillData({ name: "Rašica", lat: 46.1221, lon: 14.5422 }, 74, 'Ljubljana Basin Hills'),
    createHillData({ name: "Polhograjska gora", lat: 46.0691, lon: 14.3051 }, 75, 'Polhov Gradec Hills'),
    createHillData({ name: "Krim", lat: 45.9616, lon: 14.4721 }, 76, 'Dinaric Alps'),
    createHillData({ name: "Sv. Ana", lat: 46.2314, lon: 14.5778 }, 77, 'Savinja Hills'),
    createHillData({ name: "Slivnica", lat: 45.8078, lon: 14.3980 }, 78, 'Inner Carniola'),
    createHillData({ name: "Mala gora", lat: 45.7650, lon: 14.7350 }, 79, 'Ribnica-Kočevje Plateau'),
    createHillData({ name: "Polica", lat: 45.9520, lon: 14.6540 }, 80, 'Grosuplje Hills'),
    createHillData({ name: "Golovec", lat: 46.0460, lon: 14.5320 }, 81, 'Ljubljana Basin Hills'),
    createHillData({ name: "Sv. Katarina nad Medvodami", lat: 46.1150, lon: 14.3315 }, 82, 'Polhov Gradec Hills'),
    createHillData({ name: "Malič", lat: 46.1390, lon: 14.2380 }, 83, 'Polhov Gradec Hills'),
    createHillData({ name: "Sv. Lovrenc", lat: 46.0825, lon: 14.2888 }, 84, 'Polhov Gradec Hills'),
    createHillData({ name: "Jernejev hrib", lat: 46.1642, lon: 14.2911 }, 85, 'Polhov Gradec Hills'),
    createHillData({ name: "Golaš", lat: 46.2202, lon: 14.5922 }, 86, 'Kamnik Hills'),
    createHillData({ name: "Kum", lat: 46.0465, lon: 15.0118 }, 87, 'Zasavje Hills'),
    createHillData({ name: "Mrzli hrib", lat: 46.0623, lon: 14.3771 }, 88, 'Ljubljana Basin Hills'),
    createHillData({ name: "Grmada", lat: 46.2420, lon: 15.2285 }, 89, 'Celje Hills'),
    createHillData({ name: "Konikve", lat: 46.0922, lon: 14.7163 }, 90, 'Dolenjska Hills'),
    createHillData({ name: "Javor", lat: 46.0300, lon: 14.6500 }, 91, 'Dolenjska Hills'),
    createHillData({ name: "Debenec", lat: 46.0000, lon: 14.8000 }, 92, 'Dolenjska Hills'),
    createHillData({ name: "Veliki Rob", lat: 46.0280, lon: 14.9950 }, 93, 'Zasavje Hills'),
    createHillData({ name: "Mala gora", lat: 46.1300, lon: 15.2200 }, 94, 'Posavje Hills'),
    createHillData({ name: "Sv. Vid", lat: 45.9605, lon: 14.8680 }, 95, 'Dolenjska Hills'),
    createHillData({ name: "Trojane", lat: 46.1550, lon: 14.8900 }, 96, 'Zasavje Hills'),

    // --- Dolenjska / Krka River Region & Posavje (SE) ---
    createHillData({ name: "Gorjanci", lat: 45.7485, lon: 15.3406 }, 97, 'Gorjanci'),
    createHillData({ name: "Tombolovica", lat: 45.7420, lon: 15.4199 }, 98, 'Gorjanci'),
    createHillData({ name: "Plešivica", lat: 45.8502, lon: 15.1235 }, 99, 'Dolenjska Hills'),
    createHillData({ name: "Sveti Peter", lat: 45.9820, lon: 15.4850 }, 100, 'Posavje Hills'),
    createHillData({ name: "Mali Lipovec", lat: 45.9220, lon: 15.0500 }, 101, 'Dolenjska Hills'),
    createHillData({ name: "Brezovica pri Trebelnem", lat: 45.9080, lon: 15.0650 }, 102, 'Dolenjska Hills'),
    createHillData({ name: "Vrh", lat: 45.6980, lon: 15.1850 }, 103, 'Bela Krajina'),
    createHillData({ name: "Mirna gora", lat: 45.7562, lon: 15.0864 }, 104, 'Dolenjska Hills'),
    createHillData({ name: "Kup", lat: 45.8900, lon: 15.2000 }, 105, 'Dolenjska Hills'),
    createHillData({ name: "Straža", lat: 45.8640, lon: 14.8650 }, 106, 'Dolenjska Hills'),
    createHillData({ name: "Turiška vas", lat: 45.8900, lon: 15.3400 }, 107, 'Posavje Hills'),

    // --- Miscellaneous Peaks (Across Regions) ---
    createHillData({ name: "Ostri vrh", lat: 45.6897, lon: 13.8869 }, 108, 'Karst'),
    createHillData({ name: "Sv. Uršula", lat: 46.2806, lon: 15.4140 }, 109, 'Zasavje Hills'),
    createHillData({ name: "Gora Oljka", lat: 46.3115, lon: 15.0060 }, 110, 'Savinja Hills'),
    createHillData({ name: "Mrzlica", lat: 46.1264, lon: 15.0450 }, 111, 'Zasavje Hills'),
    createHillData({ name: "Lisca", lat: 46.0465, lon: 15.2415 }, 112, 'Posavje Hills'),
    createHillData({ name: "Goli vrh", lat: 46.1350, lon: 15.2280 }, 113, 'Posavje Hills'),
    createHillData({ name: "Sv. Andrej", lat: 46.3900, lon: 15.0900 }, 114, 'Šalek Valley Hills'),
    createHillData({ name: "Pungert", lat: 46.3500, lon: 15.0500 }, 115, 'Šalek Valley Hills'),
    createHillData({ name: "Mačkov hrib", lat: 45.9789, lon: 14.8752 }, 116, 'Dolenjska Hills'),
    createHillData({ name: "Strmica", lat: 46.2730, lon: 14.5020 }, 117, 'Kamnik Hills'),
    createHillData({ name: "Stolp", lat: 45.8670, lon: 13.8470 }, 118, 'Vipava Hills'),
    createHillData({ name: "Mačkov hrib", lat: 45.9789, lon: 14.8752 }, 119, 'Dolenjska Hills'),
    createHillData({ name: "Stolp", lat: 45.8670, lon: 13.8470 }, 120, 'Vipava Hills'),
];

// Key points for forecast icons over Slovenia
export const forecastPoints: Hill[] = [
    // Major Cities (Existing)
    createHillData({ name: 'Ljubljana', lat: 46.0569, lon: 14.5058 }, 121, 'Ljubljana Basin'),
    createHillData({ name: 'Maribor', lat: 46.5547, lon: 15.6459 }, 122, 'Drava Plain'),
    createHillData({ name: 'Koper', lat: 45.5463, lon: 13.7295 }, 123, 'Slovenian Coast'),
    createHillData({ name: 'Celje', lat: 46.2238, lon: 15.2638 }, 124, 'Celje Basin'),
    createHillData({ name: 'Novo Mesto', lat: 45.8037, lon: 15.1687 }, 125, 'Krka Valley'),
    createHillData({ name: 'Jesenice', lat: 46.4358, lon: 14.0531 }, 126, 'Upper Carniola'),

    // Added Cities (New 9)
    createHillData({ name: 'Kranj', lat: 46.2393, lon: 14.3551 }, 127, 'Upper Carniola'),
    createHillData({ name: 'Velenje', lat: 46.3934, lon: 15.1051 }, 128, 'Šalek Valley'),
    createHillData({ name: 'Murska Sobota', lat: 46.6617, lon: 16.1517 }, 129, 'Pannonian Plain'),
    createHillData({ name: 'Nova Gorica', lat: 45.9555, lon: 13.6496 }, 130, 'Soča Valley'),
    createHillData({ name: 'Ptuj', lat: 46.4172, lon: 15.8711 }, 131, 'Drava Plain'),
    createHillData({ name: 'Trbovlje', lat: 46.1557, lon: 15.0441 }, 132, 'Zasavje'),
    createHillData({ name: 'Izola', lat: 45.5398, lon: 13.6668 }, 133, 'Slovenian Coast'),
    createHillData({ name: 'Postojna', lat: 45.7733, lon: 14.2127 }, 134, 'Inner Carniola'),
    createHillData({ name: 'Kamnik', lat: 46.2272, lon: 14.6181 }, 135, 'Kamnik Basin'),
];