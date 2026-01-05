import gpsManifest from './gps_manifest.json';
import imgManifest from './img_manifest.json';
import { cameras, Camera } from './cameras'; // IMPORT CAMERAS

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
function createHillData(simpleHill: { name: string, lat: number, lon: number }, index: number, mountainRange: string, description: string = '', routes: Route[] = []): Hill {
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

    // Match cameras
    const matchedCameras = cameras.filter(cam =>
        (cam.location && cam.location.includes(name)) || cam.name.includes(name)
    ).map(cam => ({
        id: cam.id,
        url: cam.url,
        name: cam.name
    }));

    const hillData: Hill = {
        id: index + 1,
        name: simpleHill.name,
        lat: simpleHill.lat,
        lon: simpleHill.lon,
        country: 'Slovenia',
        mountainRange: mountainRange,
        height: alt,
        type: simpleHill.name.includes('Peak') || simpleHill.name.includes('Vrh') ? 'Peak' : 'Hill',
        description: description,
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
        webcams: matchedCameras,
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

    // Add specific comments for certain hills
    if (name.includes('Triglav')) {
        hillData.comments = [
            {
                id: 1,
                user: 'gorski_kralj',
                time: new Date('2024-08-15T10:00:00'),
                text: 'Vzpon čez Prag je bil naporen, a razgled na vrhu poplača ves trud. Gužva pri Aljaževem stolpu je bila pričakovana.'
            },
            {
                id: 2,
                user: 'hribovc88',
                time: new Date('2023-09-02T09:30:00'),
                text: 'Pot čez Plemenice je res zahtevna, priporočam samo izkušenim. Vreme je zdržalo, super tura!'
            },
            {
                id: 3,
                user: 'mateja_s',
                time: new Date('2024-07-20T11:15:00'),
                text: 'Najlepši občutek je stati na strehi Slovenije. Obvezno s čelado in samovarovanjem.'
            }
        ];
    } else if (name.includes('Stol')) {
        hillData.comments = [
            {
                id: 1,
                user: 'karavanke_lover',
                time: new Date('2024-06-10T12:00:00'),
                text: 'Iz Valvasorja gor je kar strmo, ampak se splača. Razgled na Gorenjsko in Julijce je fantastičen.'
            },
            {
                id: 2,
                user: 'vikend_pohodnik',
                time: new Date('2024-05-25T13:45:00'),
                text: 'Prešernova koča je bila odprta, super jota! Veter na vrhu pa kot vedno močan.'
            }
        ];
    } else if (name.includes('Grintovec')) {
        hillData.comments = [
            {
                id: 1,
                user: 'kamniski_gams',
                time: new Date('2024-08-05T08:20:00'),
                text: 'Streha je dolga in vroča, ampak vrh je veličasten. Razgledi na Kočno in Skuto so neverjetni.'
            },
            {
                id: 2,
                user: 'anja_p',
                time: new Date('2023-10-12T10:50:00'),
                text: 'Vzpon iz Konca je dolg, a lepo speljan. Kljub megli v dolini smo imeli na vrhu sonce.'
            }
        ];
    } else if (name.includes('Snežnik')) {
        hillData.comments = [
            {
                id: 1,
                user: 'burja_piha',
                time: new Date('2024-02-14T09:00:00'),
                text: 'Najlepši razglednik na Primorskem! Ob jasnem vremenu se vidi vse do morja in Alp.'
            },
            {
                id: 2,
                user: 'sviscaki_start',
                time: new Date('2024-01-20T11:30:00'),
                text: 'Lahka pot s Sviščakov, primerna tudi za otroke in pse. Koča na vrhu ima dober čaj.'
            }
        ];
    }

    return hillData;
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
        'Triglav je 2864 m visoka gora, ki se nahaja v osrčju Julijskih Alp. Z omenjeno višino je Triglav najvišja gora na ozemlju Slovenije, hkrati pa je tudi najvišja gora v Julijskih Alpah. Na vrhu stoji Aljažev stolp, katerega je leta 1895 postavil Jakob Aljaž, takratni župnik na Dovjem. V Aljaževem stolpu lahko v primeru nevihte vedri do 5 ljudi. Sicer pa je danes Aljažev stolp zaščiten kot kulturni spomenik in kot tak zelo pomemben pri ohranjanju kulturne dediščine. Triglav je svoj prvi obisk dočakal 26.8.1778, ko so se na vrh povzpeli štirje srčni možje, katerih spomenik stoji v Bohinju. Ti srčni možje so bili Luka Korošec, Matevž Kos, Štefan Rožič in Lovrenc Willomitzer. Sicer pa se nam z vrha Triglava odpre lep razgled, ki seže vse od Jadranskega morja, prek Dolomitov in Visokih Tur do Karavank, Kamniško Savinjskih Alp, Pohorja, prek skoraj celotne Slovenije do najvišjih vrhov Julijskih Alp.',
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
                descriptionOfStart: "Gorenjsko avtocesto zapustimo na izvozu Hrušica in cesti naprej sledimo v smeri Kranjske Gore. Le malo pred vasjo Dovje pa se z glavne ceste v levo odcepi cesta, ki pelje v Mojstrano (Vrata, Kot in Krmo). Cesti naprej sledimo v smeri doline Vrata in se po njej peljemo do velikega parkirišča v bližini Aljaževega doma.",
                descriptionOfPath: "S parkirišča nadaljujemo po makadamski cesti, ki nas po 3 minutah hoje pripelje do razpotja pri Aljaževem domu. Nadaljujemo naravnost v smeri Triglava, Luknje in Pogačnikovega doma (desno Škrlatica) po široki poti, ki gre za kapelico (na desni strani) in Aljaževim dom (na levi strani) v pas gozda. Široka turistično - sprehajalna pot pa nas mimo zimskega bivaka pripelje iz gozda, kjer pred seboj zagledamo znamenit klin (spomenik posvečen padlim partizanom gornikom). Tu nas planinska oznaka za Tominškovo pot usmeri levo in nas čez pas grušča popelje v gozd. Dobro nadelana pot se začne vzpenjati po gozdu navzgor. Ker je pot po gozdu mestoma precej strma so na njej postavili nekaj stopnic, ki nam olajšajo hojo. Po uri in pol hoje gozd postane redkejši, pot pa nas pripelje do začetka plezalnega dela poti. Med vzponom po plezalnem delu so nam v pomoč varovala, ki so v dobrem stanju (obnovljena leta 2006). Pot naprej postaja vse bolj vrtoglava in se strmo dviga po severnih ostenjih Begunjskega vrha. Ker je plezalni del poti izpostavljen padajočemu kamenju je obvezna čelada! Po dobrih treh urah hoje strmina popusti in pot se priključi običajni poti čez Prag. Le nekaj korakov naprej pa ob poti zagledamo prijeten studenček pri katerem si lahko odpočijemo. Pot naprej pa nas kmalu pripelje na naslednje razpotje, kjer nadaljujemo desno v smeri Kredarice (levo Staničev dom). Pot naprej poteka po Triglavskih podih, kjer imamo lahko nekaj težav z orientacijo (predvsem v megli). Strmina poti pa se postopoma spet stopnjuje in mestoma nam je v pomoč jeklenica. Strmina nato ponovno popusti, pot pa nas pripelje do Triglavskega doma na Kredarici do katerega se moramo rahlo povzpeti. Pri domu nas oznake za Triglav usmerijo desno rahlo navzdol do manjšega sedelca med Kredarico in Triglavom. Tu lahko na desni strani opazimo ostanke Triglavskega ledenika (Zeleni sneg). Naprej se povzpnemo ob ledeniku navzgor do vstopa v plezalni del poti. Pot se takoj strmo vzpne, v pomoč pa so nam varovala predvsem klini. Po pol urnem vzponu se nam z leve priključi nekoliko lažja pot s Planike. Le nekaj korakov naprej pa stopimo na neizrazit vrh Malega Triglava s katerega se rahlo spustimo. Sledi izpostavljena a odlično zavarovana pot po grebenu. V zadnjem delu se pot strmeje vzpne in nas pripelje do Staničevega zavetišča, ki je s poti oddaljeno 30m. Do vrha pa strmina popusti in razgledna pot nas pripelje na vrh Triglava, kjer stoji Aljažev stolp. Vrata - Begunjski studenec 3.20, Begunjski studenec - Kredarica 1:30, Kredarica - Triglav 1:15.",
                gps: "triglav-aljažev_dom_v_vratih_(po_tominškovi_poti).gpx"
            },
            {
                id: 2,
                start: "Konec ceste na Pokljuki",
                end: "Triglav",
                name: "čez Planiko in Mali Triglav",
                time: "6 h",
                difficulty: "Hard",
                heightDiff: 1524,
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "a) Gorenjsko avtocesto zapustimo na izvozu za Lesce, nato pa sledimo oznakam za Bled in Pokljuko. Naprej se peljemo skozi Gorje in mimo smučišča Zatrnik do Rudnega polja na Pokljuki, kjer je veliko plačljivo parkirišče, v bližini pa tudi vojašnica in strelišče. Od tu nadaljujemo naravnost po makadamski cesti, ki nas nekoliko naprej pripelje do križišča, kjer nadaljujemo desno (levo Uskovnica). Tej cesti nato sledimo do nekdanjega parkirišča Za Ribnico, ki se nahaja na koncu ceste (v bližini so planinske oznake za planino Konjščico). Po novem je parkiranje na koncu ceste prepovedano, zato parkiramo že na Rudnem polju, kar nam pot podaljša za približno 40 minut, primerneje pa je, da za pot izberemo markirano pot, ki se prične že na Rudnem polju. b) Iz Železnikov ali Podbrda se zapeljemo v Bohinjsko Bistrico, nato pa z vožnjo nadaljujemo v smeri Bleda. Kmalu za Petrolovo bencinsko črpalko, ki se nahaja le malo za Bohinjsko Bistrico, pa z vožnjo nadaljujemo levo v smeri Pokljuke in Jereke. V nadaljevanju se cesta najprej strmo vzpne, nato pa se za Koriti postopoma položi in nas pripelje do križišča ob avtobusni postaji, kjer nadaljujemo desno v smeri Pokljuke, Koprivnika in Jereke (naravnost Srednja vas). Takoj za križiščem prispemo v Jereko, mi pa iz križišča pred cerkvijo nadaljujemo naravnost proti Pokljuki (levo Podjelje). Za Jereko se cesta ponovno prične strmeje vzpenjati, višje pa se položi in se nadaljuje ob Mrzlem potoku. Ko se priključimo cesti z Bleda gremo levo ter se zapeljemo do Rudnega polja, kjer je veliko plačljivo parkirišče, v bližini pa tudi vojašnica in strelišče. Od tu nadaljujemo naravnost po makadamski cesti, ki nas nekoliko naprej pripelje do križišča, kjer nadaljujemo desno (levo Uskovnica). Tej cesti nato sledimo do nekdanjega parkirišča Za Ribnico, ki se nahaja na koncu ceste (v bližini so planinske oznake za planino Konjščico). Po novem je parkiranje na koncu ceste prepovedano, zato parkiramo že na Rudnem polju, kar nam pot podaljša za približno 40 minut, primerneje pa je, da za pot izberemo markirano pot, ki se prične že na Rudnem polju.",
                descriptionOfPath: "Z nekdanjega parkirišča na koncu ceste nadaljujemo po širokem in sprva vzpenjajočem kolovozu v smeri planine Konjščice. Kolovoz, ki gre takoj v strnjen gozd, se hitro položi in se po nekaj minutah lahkotne hoje spremeni v peš pot, ki se nadaljuje ob levem bregu potoka Ribnica. Ko se pot povsem približa omenjenemu potoku zavije rahlo v desno in se strmeje vzpne. Višje se pot položi in nas iz gozda pripelje na spodnji rob prostrane Konjščice. Tu pot zavije rahlo v levo, preči potoček in nas po nekaj nadaljnjih korakih pripelje do sirarne na planini Konjščica. Od sirarne nadaljujemo po prijetni poti, ki nas v nekaj minutah rahlega vzpona pripelje na zgornji rob planine. Tu gre pot v pas rušja in grmičevja in se postopoma začne strmeje vzpenjati. V zgornjem delu vzpona proti Jezercam se nam z desne priključi pot z Rudnega polja, mi pa nadaljujemo naravnost po zmerno strmi poti, ki nas v nekaj minutah nadaljnje hoje pripelje do Jezerc, kjer se pot položi in zavije v levo. Sledi lahkotna hoja do table, ki označuje osrednje območje TNP-ja, nato pa se pot prične zmerno vzpenjati ob hudourniku (sprva studenček). Pot višje preide na desno stran hudournika (gledano iz smeri vzpona) in se nato prečno vzpne do Studorskega prevala. S prevala, od koder se nam odpre lep pogled na Bohinjsko stran, nadaljujemo naravnost (levo Ablanca, desno Veliki Draški vrh in ostro desno Srenjski preval) po poti, ki se prične spuščati in se po nekaj korakih spusta obrne v desno. Sledi še kratek spust, nato pa se pot nadaljuje v prečenju, sprva pobočij pod Velikim Draškim vrhom in kasneje Toscem. Ko pridemo na neporaščena južna pobočja Tosca bomo prišli do manjšega razpotja, kjer se v desno odcepi nemarkirana pot na Tosc (odcep je označen). Le nekaj korakov naprej, pa se nam z leve skoraj neopazno priključi pot z Uskovnice. Nadaljujemo naravnost po razgledni poti, ki se prične obračati vse bolj v desno, pri tem pa preide na vse bolj strma pobočja Tosca. Naprej pridemo do umetno izklesane skalne police, preko katere vodi široka in padajočemu kamenju izpostavljena pot (pozor - aktiven podor!). Omenjeno polico prehodimo v rahlem spustu, nato pa pot zavije v levo in se za kratek čas vzpne po nekoliko ožji poti. Naprej se pot položi in preide na manj strma pobočja. Le malo naprej pridemo na označeno razpotje, kjer se nam z leve priključi pot iz doline Voje. Nadaljujemo naravnost v smeri Vodnikovega doma (rahlo levo Velo polje) po zložni poti, s katere se nam kmalu odpre lep pogled na Triglav. Pot naprej se vrne pod pobočja Tosca in nas ob prečenju melišč v nekaj minutah pripelje do Vodnikovega doma na Velem polju. Od doma nadaljujemo naravnost v smeri Triglava (desno navzgor Bohinjska vratca). Pot naprej se zmerno vzpenja in preči pobočja pod Vernarjem. Že kmalu pa naletimo na prvo jeklenico, ki nam pomaga premagati kratko polico. Pot naprej se vzpenja po melišču in nas nato pripelje do strmega skalnega skoka. Dobro zavarovana pot nas po strmih stopnicah pripelje na vrh tega skoka. Sledi nekaj metrov prečenja po strmem pobočju, nato pa nas pot pripelje na prostrana območja v bližini Konjskega sedla, le tega pa dosežemo po krajšem spustu. S sedla nadaljujemo levo v smeri Planike (naravnost Kredarica in Staničev dom, desno Krma) po razmeroma strmi poti, ki se prečno vzpenja proti zahodu. Višje nas vse bolj razgledna pot pripelje na neizrazit greben, kjer le ta zavije v desno in se prehodno nekoliko položi. Naprej markirana pot po desni strani obide večjo vrtačo, nato pa se začne obračati proti levi. Sledi še približno 10 minut vzpona in pot nas pripelje do doma Planika pod Triglavom. Od Planike nadaljujemo po desni strani planinskega doma po markirani poti v smeri Triglava (levo Triglav čez Triglavsko škrbino, desno Kredarica). Pot naprej se najprej rahlo spusti, nato pa se postopoma začne vzpenjati. Po nekaj minutah lahkotne hoje, pridemo do kratkega skalnatega dela, kjer se prečno vzpnemo po rahlo izpostavljeni polici. Pot naprej zavije nekoliko v desno in s skalnih pečin preide v gruščnat svet, preko katerega se vzpnemo do vstopa v plezalni del. Že od daleč vidna markacija nas usmeri v izrazito grapo, skozi katero se s pomočjo jeklenice povzpnemo na lepo razgledno točko. Pot naprej zavije levo, se najprej strmo vzpne, nato pa se nadaljuje po razčlenjenem skalovju. Občasno zelo strma in na vseh težjih mestih tudi dobro varovana pot, pa nas višje pripelje na greben Malega Triglava, kjer se nam z desne priključi nekoliko težavnejša pot s Kredarice. Nadaljujemo naravnost po grebenski poti, le ta pa nas v nekaj 10 korakih nadaljnje hoje pripelje na vrh Malega Triglava. Z Malega Triglava, od koder se nam odpre lep pogled na vrh in večji del poti, ki je pred nami, se pot rahlo spusti, nato pa nas pripelje na neizrazito sedelce med obema vrhovoma. Pot naprej se ponovno prične vzpenjati, po dobro varovani grebenski poti. Tej zelo razgledni in na posameznih delih tudi zelo strmi poti, nato sledimo vse do vrha Triglava. Izhodišče - Konjščica 30 minut, Konjščica - Studorski preval 1:30, Studorski preval - Vodnikov dom 1:00, Vodnikov dom - Planika 1:30, Planika - Triglav 1:30.",
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
                descriptionOfStart: "a) Gorenjsko avtocesto zapustimo na izvozu Hrušica in cesti naprej sledimo v smeri Kranjske Gore. Le malo pred vasjo Dovje pa se z glavne ceste v levo odcepi cesta, ki pelje v Mojstrano (Vrata, Kot in Krmo). Cesti naprej sledimo v smeri vasi Radovna in doline Krma in Kot. Razmeroma strma cesta nas nato pelje mimo table TNP, za katero se cesta kmalu položi in nas pripelje do križišča, kjer se desno odcepi makadamska cesta v dolino Kot. Nadaljujemo naravnost po cesti, ki se začne spuščati. Sredi spusta pa se desno odcepi cesta v dolino Krmo (naravnost Radovna). Nekoliko naprej pridemo na naslednje križišče, kjer nadaljujemo desno v smeri Krme. Makadamska cesta nas nato pripelje do Kovinarske koče, mi pa ji sledimo še naprej. Občasno nekoliko slabša cesta nas nato pripelje do parkirišča pred zapornico. b) Zapeljemo se v Kranjsko Goro, nato pa z vožnjo nadaljujemo v smeri Jesenic. Pri Dovjem zapustimo glavno cesto in nadaljujemo desno v smeri Mojstrana ter dolin Vrata, Kot in Krma, na naslednjih križiščih pa sledimo oznakam za Krmo. Razmeroma strma cesta nas nato pelje mimo table TNP, za katero se cesta kmalu položi in nas pripelje do križišča, kjer se desno odcepi makadamska cesta v dolino Kot. Nadaljujemo naravnost po cesti, ki se začne spuščati. Sredi spusta pa se desno odcepi cesta v dolino Krmo (naravnost Radovna). Nekoliko naprej pridemo na naslednje križišče, kjer nadaljujemo desno v smeri Krme. Makadamska cesta nas nato pripelje do Kovinarske koče, mi pa ji sledimo še naprej. Občasno nekoliko slabša cesta nas nato pripelje do parkirišča pred zapornico.",
                descriptionOfPath: "Z zadnjega parkirišča v dolini Krme, imenovanega Pri lesi nadaljujemo po slabši cesti, ki se nadaljuje po dolini in nas kmalu pripelje do jase, kjer po levi strani obidemo bližnji objekt. Nadaljujemo po prodnati poti, ki se približa hudourniku in ga nekoliko naprej tudi preči. Na drugi strani hudournika pot preide v gozd ter se sprva še zložno, nato pa nekaj časa dokaj strmo vzpenja. Višje iz gozda preidemo v pas rušja in grmičevja, s poti pa se nam odpirajo lepi pogledi na bližnja ostenja vrhov, ki se na drugo stran zložneje spuščajo proti Pokljuki. Višje, nekje na nadmorski višini nekaj več kot 1400 m se pot prehodno položi in nas pripelje v lepo travnato ravnico Vrtača. Za travnatim delom se pot ponovno prične vzpenjati po na tem delu pogosto dokaj spolzki poti, ki se položi na ravnici Malo polje. Tu pot zavije v desno ter se razcepi. V levo se odcepi pot proti Bohinjskim vratcem in Vodnikovemu domu na Velem polju, mi pa nadaljujemo naravnost ter ob vznožju Vernarja lahkotno nadaljujemo do izvira s koritom. Za koritom se pot razcepi, mi pa nadaljujemo naravnost po markirani poti (levo neoznačena bližnjica do planine Zgornja Krma). Sledi nekaj zmernega, višjega tudi nekoliko bolj strmega vzpona skozi redek, deloma macesnov gozd. Višje pot zavije levo ter se položi, z leve pa se nam priključi tudi prej omenjena bližnjica. Za združitvijo obeh poti hitro prispemo do pastirske koče na planini Zgornja Krma, imenovana Prgarca. Od tu se pot v zmernem vzponu nadaljuje proti zahodu ter nas pripelje še do zadnjega izvira ob poti, nad izvirom pa se pot ponovno razcepi. V levo se nadaljuje pot čez Kurico, ki vodi na Konjsko sedlo in dalje proti Domu Planika pod Triglavom, mi pa gremo desno na pot, ki vodi dalje v smeri Kredarice in Staničevega doma. Le nekaj korakov naprej pa se z običajne poti proti Kredarici v levo odcepi stara pot proti Kredarici. Tu so ob poti edine oznake za Kredarico v tej smeri, mi pa nadaljujemo naravnost po zložni markirani poti, ob kateri pa ni oznak za Kredarico (september 2025), ki nas nekaj minut naprej pripelje na označeno razpotje, kjer se ločita poti proti Kredarici in Staničevemu domu. Tu gremo levo v smeri Triglavskega doma na Kredarici in Triglava (naravnost Dom Valentina Staniča) ter se najprej strmo vzpnemo nad ravnico Murava, nato pa postopoma prispemo v hudourniško dolinico imenovano Ulice. Malo naprej, na Vrhu Ulic se nam z leve priključi prej omenjena, precej strma stara pot, še kako minuto naprej pa se s poti proti Kredarici rahlo v levo odcepi pot, ki vodi proti Konjskemu sedlu (to je daljša varianta, ki se ogne strmemu vzponu preko Kurice), mi pa nadaljujemo rahlo desno po bolje uhojeni poti. Pot naprej se kratek čas še zmerno vzpenja večinoma proti severozahodu, oz. v smeri proti ostenjem Vrha Snežne konte. Na tem delu prečimo pot Konjsko sedlo - Dom Valentina Staniča, mi pa nadaljujemo naravnost ter preidemo na strma melišča Kalvarije. Tu se v nekaj okljukih strmo vzpenjamo po vse bolj razglednih pobočjih. Ko se višje pot prehodno nekoliko položi se združimo s potjo s Pokljuke, ki vodi mimo Vodnikovega doma na Velem polju in čez Konjsko sedlo, mi pa nadaljujemo rahlo desno v smeri Kredarice in Triglava. Ko se nekaj minut naprej pot še dodatno položi se v levo odcepi pot mimo Snežne konte in čez Štapce proti Domu Planika pod Triglavom, mi pa nadaljujemo desno ter sprva nadaljujemo dokaj zložno, nato pa se vzpnemo na greben nad Vrhom Snežne konte, vrha, katerega smo med vzponom preko Kalvarije gledali še od spodaj navzgor. Tu pot ponovno postane bolj strma, mi pa takšni poti sledimo vse do Triglavskega doma na Kredarici. Pred domom, pri kapeli Marije Snežne se nam z desne priključi pot iz doline Kot, ki vodi mimo Doma Valentina Staniča, mi pa nadaljujemo po levi strani doma in za domom se nam z desne priključi še pot iz doline Vrata in sicer poti čez Prag in Tominškova pot. Nadaljujemo levo v smeri Triglava in po tehnično še nezahtevni poti se spustimo na Ledeniški preval, od koder pa se pričnemo vzpenjati proti ostenju Malega Triglava. Tu sledimo markacijam in večji že od daleč vidni markaciji, v bližini katere se prične zelo zahtevna pot na Triglav. Sprva se vzpenjamo po še ne zelo strmem pobočju s pomočjo nekaj klinov in posameznih jeklenic, ko pa prispemo v ostenje Malega Triglava pa se pričnemo prečno vzpenjati proti levi, kjer so klinom pred leti dodali še jeklenice, da se je možno tudi samovarovati s pomočjo samovarovalnega kompleta. Sledi nekaj precej strmin in izpostavljenih vzponov, kjer pazimo, da ne zdrsnemo, na delu, kjer je na poti kamenje pa moramo biti pazljivi tudi pri tem, da ne prožimo kamenja saj je to lahko smrtno nevarno za pohodnike pod nami. Pot naprej je dokaj ozka in pri večjem številu obiskovalcev lahko nastajajo tudi zastoji zaradi oteženega srečevanja med planinci. Višje strmina popusti in z leve se nam priključi še pot od Doma Planika pod Triglavom in sicer pot preko Malega Triglava, katerega le malo naprej tudi dosežemo. Z Malega Triglava sledi nekaj rahlega spusta po občasno manj izpostavljenem grebenu, ko se ponovno pričnemo vzpenjati pa se greben zoži, pot pa postane prepadna na obe strani. V nadaljevanju sledi še nekaj precej strmih vzponov, pot pa je v glavnem dobro varovana z jeklenicami in posameznimi klini, vse do vrha pa so ob lepih dneh možni zastoji zaradi srečevanja. Pod vrhom pot postane manj zahtevna, še vedno pa je prepadna. Le malo pod vrhom se rahlo v levo odcepi poti proti Staničevemu zavetišču (zasilni bivak vklesan v masiv Triglava), mi pa ob še naprej previdni, a zadnjih nekaj metrov manj strmi poti sledimo do Aljaževega stolpa, ki se nahaja na vrhu Triglava, najvišji gori Julijskih Alp in Slovenije. Krma - Zgornja Krma 2:30, Zgornja Krma - Kredarica 2:30, Kredarica - Ledeniški preval 0:05, Ledeniški preval - Mali Triglav 0:35, Mali Triglav - Triglav 0:35. Opis se nanaša na stanje septembra 2025, slike pa so iz različnih obdobij.",
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
                descriptionOfStart: "Gorenjsko avtocesto zapustimo na izvozu Hrušica in cesti naprej sledimo v smeri Kranjske Gore. Le malo pred vasjo Dovje pa se z glavne ceste v levo odcepi cesta, ki pelje v Mojstrano (Vrata, Kot in Krmo). Cesti naprej sledimo v smeri doline Vrata in se po njej peljemo do velikega parkirišča v bližini Aljaževega doma.",
                descriptionOfPath: "S parkirišča nadaljujemo po makadamski cesti, ki nas po 3 minutah hoje pripelje do razpotja pri Aljaževem domu. Nadaljujemo naravnost v smeri Triglava, Luknje in Pogačnikovega doma (desno Škrlatica) po široki poti, ki gre za kapelico (na desni strani) in Aljaževim dom (na levi strani) v pas gozda. Široka turistično - sprehajalna pot pa nas mimo zimskega bivaka pripelje iz gozda, kjer pred seboj zagledamo znamenit klin (spomenik posvečen padlim partizanom gornikom). Nadaljujemo naravnost (levo Tominškova pot) po poti, ki se vrne v gozd in nas pripelje na naslednje razpotje, kjer nadaljujemo naravnost (desno Stenar, Pogačnikov dom). Pot naprej se vzpenja ob hudourniku in nas kmalu pripelje na razpotje, kjer nadaljujemo naravnost v smeri Luknje (levo pot čez Prag). Pot naprej preči kratek pas grmičevja, nato pa preide pod melišča okoliških sten. Tu se desno odcepi pot k bivaku pod Luknjo (5 minut), mi pa nadaljujemo naravnost po vse bolj strmi poti. Zadnje metre pod Luknjo pa se pot še strmeje vzpne in nas pripelje do meje s Primorsko. Tu se nam odpre lep razgled na gore nad dolino reke Soče. Na sedlu, kjer je razpotje nadaljujemo levo v smeri Triglava. desno vodi pot na Bovški Gamsovec, naravnost navzdol pa proti Zadnjici in Trenti. Pot v nadaljevanju postane zelo zahtevna in se že v začetku prične skoraj navpično vzpenjati ob jeklenici. Ko preplezamo začetno steno se pot rahlo položi kar pa ne pomeni, da je konec težav. Od tu naprej varoval skoraj ni in občasno hodimo po stezi nad globokim prepadom. V mokrem velika nevarnost zdrsa! Težave nato počasi popustijo in pot zavije rahlo v levo ter nas pripelje do grebena od koder se nam odpre pogled proti vzhodu. Nadaljujemo po razglednem grebenu in pot kmalu postane ponovno nekoliko zahtevnejša. S pomočjo jeklenice in številnih klinov se nekajkrat strmo vzpnemo, nato pa sledi še kratek strm spust. Tu se nam na levo odpre pogled proti znameniti Sfingi (najstrmejši triglavski steber). V nadaljevanju pot postane manj strma in nas vodi po škrapljastem terenu. Steza je na tem delu nekoliko slabše vidna, poteka pa levo od Glave v Zaplanji in Morbegne, ki jo vidimo pred seboj. Na tem delu poti je lahko tudi v poletnem času še kakšno snežišče, ki pa ni strmo, tako da cepin ni potreben. Pot nas nato pripelje do razpotja na Zahodni Triglavski planoti. Nadaljujemo levo navzgor v smeri Triglava (desno Dolič, ostro desno Morbegna) čez melišče do vstopa v naslednji plezalni del poti. Ta del je bistveno lažji od tistega čez Plemenice tako, da nam ne bo povzročal večjih težav (le gneča zna biti precejšnja). Pot naprej se s pomočjo številnih varoval prečno vzpne in nas pripelje pod Triglavsko škrbino. Naprej se povzpnemo do škrbine, kjer pridemo na razpotje. Nadaljujemo levo navzgor (naravnost navzdol Planika) po strmi a dobro zavarovani poti. Po nekaj vzponih strmina popusti in do vrha nas čaka samo še nekaj minut vzpona po vršnem pobočju Triglava. Vrata - Luknja 2:30, Luknja - Zahodna Triglavska planota 3:00 Zahodna Triglavska planota - Triglav 1:00.",
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
                descriptionOfStart: "Gorenjsko avtocesto zapustimo na izvozu Hrušica in cesti naprej sledimo v smeri Kranjske Gore. Le malo pred vasjo Dovje pa se z glavne ceste v levo odcepi cesta, ki pelje v Mojstrano (Vrata, Kot in Krmo). Cesti naprej sledimo v smeri doline Vrata in se po njej peljemo do velikega parkirišča v bližini Aljaževega doma.",
                descriptionOfPath: "S parkirišča nadaljujemo po makadamski cesti, ki nas po 3 minutah hoje pripelje do razpotja pri Aljaževem domu. Nadaljujemo naravnost v smeri Triglava, Luknje in Pogačnikovega doma (desno Škrlatica) po široki poti, ki gre za kapelico (na desni strani) in Aljaževim dom (na levi strani) v pas gozda. Široka turistično - sprehajalna pot pa nas mimo zimskega bivaka pripelje iz gozda, kjer pred seboj zagledamo znamenit klin (spomenik posvečen padlim partizanom gornikom). Nadaljujemo naravnost (levo Tominškova pot) po poti, ki se vrne v gozd in nas pripelje na naslednje razpotje, kjer nadaljujemo naravnost (desno Stenar, Pogačnikov dom). Pot naprej se vzpenja ob hudourniku do razpotja, kjer se usmerimo levo na pot čez Prag (naravnost Luknja in Plemenice) in po nekaj korakih spusta prečimo hudournik. Na drugi strani nas pot hitro pripelje do strmega dela poti, kjer so nam v pomoč klini. S pomočjo varoval nas pot hitro pripelje stopnjo višje v manj zahteven del poti. Naprej se vzpenjamo ob vse lepših razgledih po poti, ki je občasno obdana z rušjem. Lahkoten del poti kmalu ponovno postane zahtevnejši in v pomoč so nam jeklenice, ki nam nudijo varnejšo hojo. Sledi najtežji del poti na poti čez Prag. S pomočjo skob in jeklenice se povzpnemo po 15m visokem skoraj navpičnem kaminu. Težave nato počasi izginejo in z leve se nam priključi Tominškova pot. Le nekaj korakov naprej pa ob poti zagledamo prijeten studenček pri katerem si lahko odpočijemo. Pot naprej pa nas kmalu pripelje na naslednje razpotje, kjer nadaljujemo desno v smeri Kredarice (levo Staničev dom). Pot naprej poteka po Triglavskih podih, kjer imamo lahko nekaj težav z orientacijo (predvsem v megli). Strmina poti pa se postopoma spet stopnjuje in mestoma nam je v pomoč jeklenica. Strmina nato ponovno popusti, pot pa nas pripelje do Triglavskega doma na Kredarici do katerega se moramo rahlo povzpeti. Pri domu nas oznake za Triglav usmerijo desno rahlo navzdol do manjšega sedelca med Kredarico in Triglavom. Tu lahko na desni strani opazimo ostanke Triglavskega ledenika (Zeleni sneg). Naprej se povzpnemo ob ledeniku navzgor do vstopa v plezalni del poti. Pot se takoj strmo vzpne, v pomoč pa so nam varovala predvsem klini. Po pol urnem vzponu se nam z leve priključi nekoliko lažja pot s Planike. Le nekaj korakov naprej pa stopimo na neizrazit vrh Malega Triglava s katerega se rahlo spustimo. Sledi izpostavljena a odlično zavarovana pot po grebenu. V zadnjem delu se pot strmeje vzpne in nas pripelje do Staničevega zavetišča, ki je s poti oddaljeno 30 m. Do vrha pa strmina popusti in razgledna pot nas pripelje na vrh Triglava, kjer stoji Aljažev stolp. Vrata - Begunjski studenec 3.30, Begunjski studenec - Kredarica 1:30, Kredarica - Triglav 1:15.",
                gps: "triglav-aljažev_dom_v_vratih_(čez_prag).gpx"
            },
            {
                id: 6,
                start: "Koča pri Savici",
                end: "Triglav",
                name: "čez Triglavska jezera",
                time: "8 h 45 min",
                difficulty: "Hard",
                heightDiff: 2211, // typical for this long route
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Z avtoceste Ljubljana - Jesenice se usmerimo na izvoz Lesce in cesti sledimo proti Bledu in naprej proti Bohinjski Bistrici. Z vožnjo nadaljujemo proti Bohinjskemu jezeru (Ribčev laz), pri katerem pridemo na križišče, kjer nadaljujemo naravnost po levi (južni) strani jezera v smeri Ukanca in slapa Savice. Tej vse bolj ozki cesti, nato sledimo do velikega parkirišča pri koči Savica. Parkirišče je plačljivo.",
                descriptionOfPath: "S parkirišča se usmerimo desno v smeri Črnega jezera, Koče pri Triglavskih jezerih in Hotela Zlatorog. Pot nas sprva vodi po makadamski cesti, ki preko mostu preči reko Savico. Le malo za mostom, nas oznake za Komarčo usmerijo levo (naravnost Hotel Zlatorog) na sprva še precej široko in razmeroma zložno gozdno pot. Pot pa se že kmalu prične strmeje vzpenjati ter nas nekoliko višje pripelje do mesta, kjer se v levo odcepi pot k izviru Savice, mi pa nadaljujemo desno po vse bolj strmi poti. Dobro vzdrževana in razmeroma široka planinska pot, pa kmalu preide na zelo strma in za zdrs nevarna pobočja Komarče (velika je tudi nevarnost padajočega kamenja). Pot naprej se strmo vzpenja po večinoma gozdnati steni Komarče, kjer so nam na težjih mestih v pomoč varovala (predvsem jeklenice). Višje se nam s poti odpre nekaj razgledov proti Bohinju, pot pa nas pripelje do kratkega tehnično zahtevnega mesta, kjer s pomočjo skob in jeklenice prečimo sicer ne tako zelo izpostavljeno grapo. Pot naprej se še nekaj časa strmo vzpenja in nas ob pomoči nekaj varoval pripelje na vrh Komarče, od koder se nam odpre lep razgled na naše izhodišče. Sledi še kratek zmerno strm vzpon, nato pa se pot prične zložno spuščati proti Črnemu jezeru, katerega dosežemo po manj kot 5 minutah nadaljnje hoje. V bližini jezera je označeno razpotje, kjer se v desno odcepi pot proti planini Viševnik, mi pa nadaljujemo rahlo levo ter pot nadaljujemo po markirani poti, ki po desni strani obide Črno jezero. Na drugi strani jezera se nam z leve priključi še pot od Doma na Komni, mi pa nadaljujemo po razmeroma zložni poti, ki se nadaljuje ob robu Lopučniške doline. Višje se pot prične zmerno vzpenjati ter nas ob robu previsnih pečin, pripelje do manjšega studenčka, ki pa v sušnih obdobjih presahne. Nadaljujemo po markirani poti, le ta pa v bližini Bele skale zavije ostro v desno ter se strmo vzpne. Sledi nekaj minut strmega vzpona, nato pa se pot položi in nas pripelje na označeno razpotje, kjer se nam z desne priključi pot s planine Blato. Nadaljujemo levo v smeri Koče pri Triglavskih jezerih in pot nadaljujemo po razmeroma zložni poti, po kateri v 10 minutah nadaljnje hoje prispemo do Dvojnega jezera. Markirana pot jezero obide po desni strani in nas še preden pridemo na drugo stran pripelje na razpotje, kjer se v desno odcepi pot proti Štapcam. Tu nadaljujemo naravnost in v nekaj minutah nadaljnje hoje prispemo do Koče pri Triglavskih jezerih. Od koče nadaljujemo v smeri Prehodavcev in Hribaric ter pot nadaljujemo mimo umetnega jezera Močivec. Že takoj za jezerom se pot prične zmerno vzpenjati po vse manj porasli dolini. Prijetna in razgledna pot nas naprej vodi po Dolini Triglavskih jezer, le ta pa nas hitro pripelje na označeno razpotje, kjer se v levo odcepi pot na Veliko oz. Lepo Špičje. Nadaljujemo v smeri Prehodavcev ter pot nadaljujemo po razmeroma zložni poti, ki najprej preči pas redkega macesnovega gozda, nato pa nadaljujemo po prijetni dolinici. Pot naprej se zmerno vzpne in nas pripelje na manjši preval, s katerega se nam odpre lep pogled na Jezero v Ledvicah. Markirana pot omenjeno jezero obide po desni strani, kjer se nadaljuje po obsežnih meliščih ob vznožju obeh Zelnaric. Za jezerom se pot z melišča vrne v Dolino Triglavskih jezer, po kateri nadaljujemo razmeroma zložen vzpon. Že povsem visokogorska pot, se višje za kratek čas strmeje vzpne, nato pa se povsem položi in nas po nekaj minutah nadaljnje hoje pripelje do Zelenega jezera. za jezerom pa nas oznake za Hribarice usmerijo desno navzgor (levo Prehodavci). Naprej se vzpenjamo po melišču proti Hribaricam. Po približno pol urnem vzponu od jezera se nam z desne priključi pot iz doline Za Kopico. Nadaljujemo naravnost navzgor po kamniti poti, ki nas pripelje na prostrana območja Hribaric. Na Hribaricah sta dve razpotji v obeh pa gremo naravnost (obe levo Kanjavec). Sledi prečenje planote Hribaric do sedla Čez Hribarice. Pot naprej se začne spuščati po melišču navzdol proti sedlu Dolič. Po pol urnem spustu sledi rahel vzpon do sedla, kjer je naslednje razpotje. Nadaljujemo levo proti Koči na Doliču, katero že vidimo pred seboj (desno Velo polje), do nje pa pridemo po lahkotnem 5 minutnem spustu. Od koče nadaljujemo desno proti zahodu in vzpon nadaljujemo po mulatjeri, ki se kar strmo vzpenja. Po pol ure hoje od koče se svet zravna in pot ne pridobiva več na višini. Sedaj pred seboj lepo vidimo Triglav. Naprej hodimo v smeri Triglava po podih, kjer je potrebna previdnost, da ne stopimo v kakšno luknjo in si pri tem zvijemo noge. Naprej pridemo na razpotje, kjer se nam priključi pot s Plemenic. Nadaljujemo desno po melišču navzgor vse do stene. Pot naprej se s pomočjo številnih varoval prečno vzpne in nas pripelje pod Triglavsko škrbino. Naprej se povzpnemo do škrbine, kjer pridemo na razpotje. Nadaljujemo levo navzgor (naravnost navzdol Planika) po strmi, a dobro zavarovani poti. Po nekaj minutah strmina popusti in do vrha nas čaka samo še nekaj minut vzpona po vršnem pobočju Triglava. Koča pri Savici - Črno jezero 1:30, Črno jezero - Dvojno jezero 1:30, Dvojno jezero - Ledvica 1:00, Ledvica - Zeleno jezero 30 minut, Zeleno jezero - Hribarice 1:00, Hribarice - Dolič 45 minut, Dolič - Triglav 2:30.",
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
                descriptionOfStart: "Iz Kranjske Gore se čez prelaz Vršič peljemo proti Bovcu ali obratno, a le do 50. serpentine vršiške oz. Ruske ceste (v bližini vasi Trenta). Tu zavijemo na stransko cesto, ob kateri nato pa nekaj 100 metrih parkiramo na parkirišču ob cesti.",
                descriptionOfPath: "S parkirišča nadaljujemo po cesti, le ta pa nas mimo nekaj hiš (predvsem vikendi) v približno 15 minutah pripelje do mesta, kjer se cesta razcepi na dva dela (ob križišču je bilo nekoč parkirišče, danes pa je parkiranje prepovedano). Nadaljujemo po spodnji desni cesti (po zgornji cesti prispemo do tovorne žičnice, ki pelje na Pogačnikov dom) v smeri Doliča, Luknje in Prehodavcev. Sprva zložni cesti, ki nas vodi čez razgledne travnike, višje pa skozi gozd, sledimo skoraj do njenega konca, oz. točneje do označenega razpotja, kjer se v desno odcepi markirana pešpot proti Prehodavcem (do sem potrebujemo približno 1 uro). Z razpotja na predelu imenovanem Utro nadaljujemo naravnost, cesta pa se tu dokončno spremeni v pešpot oz. mulatjero. Vzpon nadaljujemo po stari mulatjeri, katera se v nadaljevanju zmerno vzpenja čez občasno bolj strma pobočja. V nadaljevanju se že kmalu v desno odcepi plezalna pot čez Komar, mi pa nadaljujemo naravnost ter vzpon še naprej nadaljujemo po široki poti. Razgledna pot, ki občasno poteka čez zelo strma pobočja, pa nas višje pripelje na naslednje označeno razpotje. Z razpotja se usmerimo desno (levo Luknja in Triglav čez Plemenice) in pot nadaljujemo v smeri Koče na Doliču. Še naprej široka pot se v nadaljevanju prične vzpenjati proti jugu, pri tem pa preči pobočja Vrha Zelenic (2468 m). Ko se pobočje nekoliko položi se nam z desne priključi pot čez Komar, mi pa mulatjeri sledimo do naslednjega razpotja, kjer se v desno odcepi pot proti Zasavski koči (pot Mire Marko Debelakove čez Kanjavčeve police). Tu nadaljujemo levo, nas pa vse bolj razgledna in občasno prepadna pot pripelje do razpotja v bližini Koče na Doliču. Od razpotja v bližini Koče na Doliču nadaljujemo levo proti zahodu in vzpon nadaljujemo po mulatjeri, ki se kar strmo vzpenja. Po pol ure hoje od koče se svet zravna in pot ne pridobiva več na višini. Sedaj pred seboj lepo vidimo Triglav. Naprej hodimo v smeri Triglava po podih, kjer je potrebna previdnost, da ne stopimo v kakšno luknjo in si pri tem zvijemo noge. Naprej pridemo na razpotje, kjer se nam priključi pot s Plemenic. Nadaljujemo desno po melišču navzgor vse do stene. Pot naprej se s pomočjo številnih varoval prečno vzpne in nas pripelje pod Triglavsko škrbino. Naprej se povzpnemo do škrbine, kjer pridemo na razpotje. Nadaljujemo levo navzgor (naravnost navzdol Planika) po strmi, a dobro zavarovani poti. Po nekaj minutah strmina popusti in do vrha nas čaka samo še nekaj minut vzpona po vršnem pobočju Triglava. Zadnjica - Dolič 4:45, Dolič - Triglav 2:30. zemljevid poti - Triglav"
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
                descriptionOfStart: "Z avtoceste Ljubljana - Jesenice se usmerimo na izvoz Lesce in cesti naprej sledimo proti Bledu. Na Bledu pa nas pri semaforju oznake za Pokljuko usmerijo desno. Naprej se peljemo skozi Gorje in mimo opuščenega smučišča Zatrnik do Rudnega polja na Pokljuki (veliko parkirišče, vojašnica in strelišče).",
                descriptionOfPath: "Na koncu parkirišča se desno odcepi makadamska cesta ob kateri so kažipoti za Triglav. Usmerimo se na to cesto, ki se rahlo vzpenja in nas po desetih minutah pripelje do smučišča. Naprej nadaljujemo po cesti s katere se kmalu levo odcepi markirana pot proti Triglavu. Po nekaj minutah zmernega vzpona nas pot pripelje na gozdno cesto, kateri sledimo le nekaj metrov (do sem lahko pridemo z avtomobilom kar nam pot skrajša za 20 minut). Markirana pot se nato usmeri desno in se za krajši čas strmeje vzpne. Po desetih minutah strmina popusti, pot pa počasi preide na strma pobočja. Čez ta strma pobočja se pot po večini rahlo spušča in se vse bolj obrača desno. Nekoliko naprej bomo levo pod nami opazili planino Konjščico. Naša pot se nato neha spuščati in preide iz gozda med rušje. Pot, ki se ponovno vzpenja nas nato pelje pod strmimi skalnimi pečinami in nas kmalu za tem pripelje na razpotje, kjer se priključimo poti s planine Konjščica. Sledi še krajši vzpon in pot nas pripelje v lepo dolinico imenovano Jezerce. Tu pot zavije levo in nas po nekaj korakih pripelje v ožje območje TNP-ja. Naprej se vzpnemo ob studenčku proti Studorskemu prevalu. Nekoliko višje prečimo hudournik, pot pa se usmeri nekoliko desno v travnata z rušjem obdana pobočja. Pot se nato prečno vzpne do Studorskega prevala, s katerega se nam odpre lep razgled na Bohinjsko stran. Pot naprej se sprva nekoliko spusti, nato pa preči pobočja Velikega Draškega vrha in Tosca z nekaj rahlimi vzponi in spusti. Čez čas nas pot pripelje do travnatega južnega pobočja Tosca. Tu se desno odcepi pot na Tosc, le nekaj metrov naprej pa se nam z leve priključi pot z Uskovnice. Nadaljujemo naravnost, pot naprej pa še vedno preči pobočja Tosca. Pot nato v rahlem spustu preči krajši pas redkega gozda nato pa nas pripelje na strma pobočja. Še nekoliko naprej pa pot po umetno narejeni široki polici v rahlem spustu preči prepadna pobočja Tosca. Ker je pot precej široka ne povzroča težav (previdno zaradi padajočega kamenja, skalni podor v letu 2008). Pot se nato ponovno rahlo vzpne in nas pripelje na razpotje, kjer nadaljujemo desno v smeri Vodnikovega doma. Sledi še približno deset minut hoje brez večjih vzponov ali spustov do Vodnikovega doma. Od doma nadaljujemo naravnost v smeri Triglava (desno navzgor Bohinjska vratca). Pot naprej se zmerno vzpenja in preči pobočja pod Vernarjem. Že kmalu pa naletimo na prvo jeklenico, ki nam pomaga premagati kratko polico. Pot naprej se vzpenja po melišču in nas nato pripelje do strmega skalnega skoka. Dobro zavarovana pot nas po strmih stopnicah pripelje na vrh tega skoka. Sledi nekaj metrov prečenja po strmem pobočju, nato pa nas pot pripelje na prostrana območja v bližini Konjskega prevala. Le tega dosežemo po krajšem spustu. S Konjskega prevala nadaljujemo naravnost v smeri Kredarice (levo Planika, desno Krma) po poti, ki nas že po nekaj korakih pripelje na naslednje razpotje, kjer pa nadaljujemo levo (desno Staničev dom). Pot naprej se prečno vzpenja, pri tem pa preči večje število manjših grap, katerih pa prečenje ni zahtevno. Nekoliko naprej pot s pomočjo varoval preči nekaj tehnično zahtevnih mest. Za tem se nam z desne priključi pot iz doline Krme, le nekaj metrov naprej pa pridemo na naslednje razpotje, kjer nadaljujemo po desni poti v smeri Kredarice (levo Planika). Sledi vzpon proti domu na Kredarici, katerega pa že lepo vidimo pred seboj. Po pol ure hoje od razpotja za Planiko pridemo do doma na Kredarici, kjer se nam odpre pogled na vrhove na severni strani doline Vrat. Pri domu se usmerimo proti ledeniku v smeri Triglava. Pot se sprva rahlo spusti nato pa nas v vzponu pripelje do začetka plezalnega dela poti. Dobro zavarovana pot nas s pomočjo klinov in nekaj jeklenic pripelje na greben, kjer se nam priključi pot s Planike. Naprej skoraj neopazno prečimo vrh Malega Triglava. Pot po grebenu je razgledna in mestoma zelo prepadna a je zelo dobro zavarovana. Pot po grebenu se po večini zmerno vzpenja, le zadnji vzpon je bolj strm. Nekaj metrov pod vrhom se levo navzdol odcepi pot k Staničevem zavetišču, mi pa nadaljujemo po grebenu do vrha, kjer že lepo vidimo Aljažev stolp katerega dosežemo v nekaj korakih. Rudno polje - Vodnikov dom 3:20, Vodnikov dom - Kredarica 2:00, Kredarica - Triglav 1:15.",
                gps: "triglav-rudno_polje.gpx"
            },
            {
                id: 9,
                start: "Srednja vas",
                end: "Triglav",
                name: "Za Ribnico in čez Triglavsko škrbino",
                time: "7 h 45 min",
                difficulty: "Hard",
                heightDiff: 2281, // hribi.net route stats
                summerGear: "čelada, komplet za samovarovanje",
                winterGear: "čelada, komplet za samovarovanje, cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Z avtoceste Ljubljana - Jesenice se usmerimo na izvoz Lesce in cesti sledimo proti Bledu in naprej proti Bohinjski Bistrici. Le malo pred Bohinjsko Bistrico, pri naselju Bitnje, nadaljujemo ostro desno v smeri Pokljuke. Po krajšem vzponu se cesta položi in nas hitro pripelje v Zgornjo Bohinjsko dolino. Tu v križišču nadaljujemo levo (desno Pokljuka) in cesti naprej sledimo do Srednje vasi. Tu v drugem delu vasi opazimo oznake za cerkev sv. Martina, ki nas usmerijo desno na ožjo in precej strmo cesto, po kateri nato hitro prispemo do cerkve in osnovne šole. Parkiramo na primernem mestu ob šoli ali cerkvi.",
                descriptionOfPath: "S parkirišča pri cerkvi se v nekaj korakih spustimo do osnovne šole, od tam pa nadaljujemo v smeri razglednika na Kresu. Pot naprej nas vodi po ožji asfaltni cesti, po kateri hitro prispemo do večjega vodohrana, kjer opazimo oznake za Uskovnico. Nadaljujemo po kolovozu, ki preide v gozd, na desnem ovinku pa prehodno stopimo iz gozda in odpre se nam lep pogled na Rudnico in del Zgornje Bohinjske doline. Nadaljujemo po kolovozu, ki nas vodi skozi nekoliko ožji prehod, nato pa v prečnem vzponu do mesta, kjer dosežemo cesto, ki vodi na Uskovnico. Cesto dosežemo ravno na lepo urejenem razgledišču na Kresu, s katerega se nam odpre pogled proti Srednji vasi, Zgornji Bohinjski dolini ter Spodnjim Bohinjskim goram v ozadju. Kratek čas nadaljujemo po cesti, nato pa nas na koncu blagega levega ovinka oznake za Uskovnico usmerijo desno na kolovoz, ki nas vodi skozi gozd, pas grmičevja, višje pa ponovno skozi gozd. Nekaj minut višje ponovno dosežemo makadamsko cesto, a tokrat jo takoj zapustimo, saj še naprej nadaljujemo v smeri pešpoti na Uskovnico. Kolovoz se kmalu razcepi, mi pa nadaljujemo po levem, kjer na drogu el. napeljave opazimo markacijo. Nekaj časa nadaljujemo ob el. napeljavi ter sledimo markacijam. Kmalu se v levo odcepi pot, ki vodi na Uskovnico čez Lom, mi pa nadaljujemo po poti, ki zavije nekoliko desno in preide na strma pobočja predela imenovanega Za Ribnico (Ribnica je potok globoko pod nami). Višje dosežemo novejši kolovoz oz. vlako ter ji sledimo desno. Novejša vlaka se po nekaj minutah konča pot pa še naprej preči pobočja proti desni. Nekoliko naprej na manjšem razpotju nadaljujemo po levi zgornji poti, ob kateri so oznake za Uskovnico in katera je vidno bolj uhojena. V nadaljevanju se nekoliko strmeje vzpenjamo po poti, s katere se nekoliko višje odcepi neoznačena pot proti Lomu (na tabli piše sir, skuta, mleko in še). Ponovno nadaljujemo v smeri Uskovnice, nato pa v nekaj minutah dosežemo makadamsko cesto (cesto dosežemo na delu, kjer je že zaprta za javni promet), kateri sledimo v desno. Ko stopimo na cesto se priključimo poti iz Stare Fužine, poti iz Srednje vasi čez Lom in poti od izhodišča oz. parkirišča Lom. Zložna makadamska cesta nas hitro pripelje do vikendic na Uskovnici, nato pa jo le malo za koritom z vodo zapustimo in nadaljujemo levo na kolovoz v smeri Koče na Uskovnici. Po približno 50 metrih vzpona po kolovozu dosežemo Kočo na Uskovnici. Od koče nadaljujemo v smeri Tosca, Draškega vrha, Viševnika, Vodnikovega doma, Rudnega polja in Praprotnice po poti, ki najprej preči pašno ograjo, nato pa se hitro priključi makadamski cesti, kateri sledimo v desno. Cesta nas nato vodi med grbinastimi travniki, nato pa za prečenjem naslednje ograje hitro prispemo do križišča oz. razpotja ob kapelici Marije Kraljice Miru na Uskovnici. Za kapelico nadaljujemo levo (naravnost planina Konjščica, desno Rudno polje) po položni cesti, ki nas vodi čez obsežne travnike Uskovnice, nato pa nas pot pripelje ob rob gozda, kjer se le ta začne spreminjati v sprva širok kolovoz. Kolovoz, ki se naprej prične zmerno vzpenjati ima nekaj razpotij, mi pa mu sledimo v smeri Vodnikovega doma in Triglava. Višje se kolovoz, ki večji del poteka skozi gozd spremeni v pešpot, le ta pa nas hitro pripelje do prijetnega studenčka. Pri studenčku nadaljujemo naravnost (desno lovska koča) in vzpon nadaljujemo po zložni poti, ki nas nekoliko naprej pripelje na strma pobočja. Že kmalu za tem, ko smo prispeli do strmih pobočij, so nam pri prehodu preko strme grape v pomoč varovala. Pot naprej se nadaljuje po razmeroma strmih in predvsem v mokrem za zdrs nevarnih pobočjih. Med prečenjem strmih pobočij, se pot večkrat za krajši čas strmo vzpne in nato spet spusti. V zadnjem delu prečenja prekoračimo nekaj zelo strmih grap, preko katerih vodi mestoma povsem uničena pot (velika nevarnost zdrsa). Prečenje se konča pri večjem hudourniku (običajno studenček) za katerim stopimo v mehkejši svet trav. Sledi nekaj minut lahkotne hoje in pot nas pripelje do opuščene planine Spodnji Tosc. Pot naprej se prične zmerno vzpenjati in nas že kmalu pripelje na manjše razpotje, kjer nadaljujemo ostro desno (naravnost stara, deloma opuščena pot) po lepo sledljivi poti. Pot naprej se prične vse strmeje vzpenjati in nas iz pasa redkega gozda hitro pripelje med rušje, kjer se le ta začne obračati vse bolj v levo. Pot se kmalu položi in iz rušja nas pripelje na travnata pobočja, preko katerih se v nekaj minutah nadaljnje hoje povzpnemo do poti Pokljuka - Triglav, kateri sledimo v levo. Pot naprej preči južna pobočja Tosca. Pot nato v rahlem spustu preči krajši pas redkega gozda nato pa nas pripelje na strma pobočja. Še nekoliko naprej pa pot po umetno narejeni široki polici v rahlem spustu preči prepadna pobočja Tosca. Ker je pot precej široka ne povzroča težav (previdno zaradi padajočega kamenja, skalni podor v letu 2008). Pot se nato ponovno rahlo vzpne in nas pripelje na razpotje, kjer nadaljujemo desno v smeri Vodnikovega doma. Sledi še približno deset minut hoje brez večjih vzponov ali spustov do Vodnikovega doma. Od doma nadaljujemo naravnost v smeri Triglava (desno navzgor Bohinjska vratca). Pot naprej se zmerno vzpenja in preči pobočja pod Vernarjem. Že kmalu pa naletimo na prvo jeklenico, ki nam pomaga premagati kratko polico. Pot naprej se vzpenja po melišču in nas nato pripelje do strmega skalnega skoka. Dobro zavarovana pot nas po strmih stopnicah pripelje na vrh tega skoka. Sledi nekaj metrov prečenja po strmem pobočju, nato pa nas pot pripelje na prostrana območja v bližini Konjskega prevala. Le tega dosežemo po krajšem spustu. Naprej nadaljujemo levo v smeri doma Planika (naravnost Kredarica, desno Krma). Pot naprej se vzpenja po meliščih v cik cak ovinkih (v ključih) do neizrazitega stranskega grebena. Tu se pot obrne desno in po desni strani obide večjo kraško vrtačo v kateri se večji del leta zadrži sneg. Sledi še nekaj minut vzpona in pot nas pripelje do Doma Planika pod Triglavom. Pri domu se usmerimo na pot v smeri Triglava čez Triglavsko oz. Bovško škrbino (Gorjanska pot). Pot sprva skoraj vodoravno preči visokogorsko krnico Triglavski kot v kateri se večji del leta zadrži sneg. Na drugi strani krnice pa se pot vzpne po melišču do začetka plezalnega dela poti. Pot se strmo vzpne s pomočjo klinov in jeklenic. Dobro zavarovana pot pa je izpostavljena padajočemu kamenju, zato je obvezna čelada! Zadnji metri pod Triglavsko škrbino pa so manj strmi, a nič manj nevarni. Vzpon po drsečem pesku zahteva od nas veliko previdnost, da ne zdrsnemo. Na škrbini, kjer se nam priključi pot z Doliča in Plemenic nadaljujemo desno navzgor po strmi, a dobro zavarovani poti. Po nekaj minutah strmina popusti in do vrha nas čaka samo še nekaj minut vzpona po vršnem pobočju Triglava. Srednja vas - Koča na Uskovnici 1:40, Koča na Uskovnici - Vodnikov dom na Velem polju 3:20, Vodnikov dom na Velem polju - Dom planika pod Triglavom 1:30, Dom planika pod Triglavom - Triglav 1:15.",
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
    createHillData(
        {
            name: "Stol",
            lat: 46.4422,
            lon: 14.1500
        },
        20,
        'Karavanke Alps',
        'Stol je z višino 2236 m najvišji vrh Karavank. Z vrha, ki ima vpisno skrinjico in žig se nam tako odpre lep razgled na Julijske Alpe, zahodne Karavanke, Visoke in Nizke Ture, osrednje Karavanke, Kamniško Savinjske Alpe in na del Gorenjske.',
        [
            {
                id: 1,
                start: "Valvasorjev dom pod Stolom",
                end: "Stol",
                name: "Žirovniška pot",
                time: "3 h",
                difficulty: "Easy",
                heightDiff: 1055,
                summerGear: "",
                winterGear: "cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Z avtoceste Ljubljana - Jesenice se usmerimo na izvoz Lesce in cesti naprej sledimo v smeri Žirovnice in Jesenic. Po nekaj km vožnje, pa bomo prišli do križišča, kjer se v desno odcepi cesta v Žirovnico in Moste (iz smeri Jesenic levo). Le nekaj metrov naprej pa v naslednjem križišču zavijemo levo v Moste (desno Žirovnica). Naprej se peljemo mimo spomenika padlim borcem, kjer se cesta prične dvigati v klanec pod železniško progo. Na vrhu klanca zavijemo desno (pri tabli Vila Karin), mi pa se naprej peljemo proti Završniškem jezeru in Valvasorjevem domu. Cesta se nato položi in nas pripelje do križišča, kjer se v levo odcepi cesta proti Valvasorjevemu domu. Usmerimo se na omenjeno cesto (naravnost koča pri izviru Završnice), ki se začne najprej zložno, nato pa vse strmeje vzpenjati po občasno precej razriti cesti (najbolj strmi deli so asfaltirani). Višje nas cesta pripelje do nekoliko večjega križišča, kjer nadaljujemo levo v smeri Potoške planine (desno Doslovška planina). Cesta se nato položi in nas nekoliko naprej pripelje na naslednje križišče. Tokrat nadaljujemo rahlo desno v smeri Valvasorjevega doma (rahlo levo Ajdna in Potoška planina) in se po spet bolj strmi cesti peljemo vse do omenjenega doma. Parkiramo na enem od parkirišč ob cesti v bližini planinskega doma, parkiranje pred domom pa je dovoljeno le gostom. Od Poljane (križišče pred Završniškim jezerom) do Valvasorjevega doma je 5 km.",
                descriptionOfPath: "Od Valvasorjevega doma se usmerimo desno na peš pot v smeri Stola. Pot gre že kmalu v gozd, kjer se rahlo vzpne in nas pripelje do manjšega razpotja, kjer nadaljujemo desno. Pot nas nato pripelje iz gozda, kjer preči pobočja pod Monštranco. Tej zložni in deloma razgledni poti, ki nekoliko naprej preči kratek pas gozda sledimo do razpotja na Žirovniški planini. Nadaljujemo levo v smeri »Stol - Žirovniška pot« (rahlo desno Stol Zabreška pot) po poti, ki le nekoliko višje preide v strnjen gozd, kjer se nadaljuje naslednjih 10 minut. Gozd se nato razredči, pot pa preide med grmičevje, skozi katerega se nato vzpenja vse do prihoda v naslednji pas gozda. Ko ponovno stopimo v gozd, bomo prišli do kupa zloženih polen in nad njimi table, ki nas naproša, da če le moremo, katerega nesemo seboj do Prešernove koče. Nekoliko naprej stopimo iz gozda, ob robu katerega se nato strmeje vzpenjamo. Višje pot zavije nekoliko v levo in preči kratko rahlo izpostavljeno travnato pobočje. Pot se nato za kratek čas rahlo položi in nas pripelje do prijetnega počivališča, s katerega se nam odpre lep razgled na Gorenjsko. Pot se naprej ponovno strmo vzpenja, tokrat po pobočju, ki je večinoma poraslo z rušjem. Višje se pot obrača rahlo v desno in nas iz rušja pripelje na travnata pobočja, kjer tudi pridemo na manj opazno razpotje. Nadaljujemo rahlo desno (levo Potoški Stol in Vajnež) po še naprej razmeroma strmi poti, ki kmalu preide na greben Malega Stola. Tej vse bolj razgledni poti, ki nas višje vodi mimo spominskega obeležja, sledimo vse do Prešernove koče na Stolu. Od koče nadaljujemo rahlo desno, kjer se mimo znamenje v nekaj korakih povzpnemo na vrh Malega Stola. Sledi kratek spust in pot nas pripelje na sedelce med obema Stoloma, kjer je tudi označeno razpotje. Nadaljujemo v smeri Stola (desno Celovška koča in Zelenica) po prečni poti, ki nas po 10 minutah nadaljnje hoje pripelje na najvišji vrh Karavank. Valvasorjev dom - Žirovniška planina 20 minut, Žirovniška planina - Prešernova koča 2:25, Prešernova koča - Stol 15 minut.",
                gps: "stol-valvasorjev_dom.gpx"
            },
            {
                id: 2,
                start: "Valvasorjev dom pod Stolom",
                end: "Stol",
                name: "Zabreška pot",
                time: "3 h 20 min",
                difficulty: "Easy",
                heightDiff: 1055,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "lahka označena pot",
                gps: "stol-valvazorjev_dom_(krožna_pot_čez_vajneževo_sedlo).gpx"
            },
            {
                id: 3,
                start: "Trate / Johannsenruhe",
                end: "Stol",
                name: "Plezalna pot",
                time: "3 h 20 min",
                difficulty: "Hard",
                heightDiff: 1055,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "zelo zahtevna označena pot"
            },
            {
                id: 4,
                start: "Ljubelj",
                end: "Stol",
                name: "Ljubelj – Stol (zgornja pot)",
                time: "4 h 50 min",
                difficulty: "Medium",
                heightDiff: 1055,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "zahtevna označena pot"
            },
            {
                id: 5,
                start: "Ljubelj",
                end: "Stol",
                name: "Ljubelj – Stol (spodnja pot)",
                time: "4 h 50 min",
                difficulty: "Easy",
                heightDiff: 1055,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "lahka označena pot"
            },
            {
                id: 6,
                start: "Trate / Johannsenruhe",
                end: "Stol",
                name: "Trate – Stol (mimo Celovške koče)",
                time: "3 h 45 min",
                difficulty: "Medium",
                heightDiff: 1055,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "zahtevna označena pot"
            },
            {
                id: 7,
                start: "Poljana (Završnica)",
                end: "Stol",
                name: "Poljana – Stol (Žirovniška pot)",
                time: "4 h 20 min",
                difficulty: "Easy",
                heightDiff: 1055,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "lahka označena pot",
                gps: "stol-završnica.gpx"
            },
            {
                id: 8,
                start: "Dom Trilobit",
                end: "Stol",
                name: "Dom Trilobit – Stol (čez Rido (Medji dol))",
                time: "4 h 30 min",
                difficulty: "Easy",
                heightDiff: 1055,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "lahka označena pot"
            },
            {
                id: 9,
                start: "Podnar / Bodenbauer",
                end: "Stol",
                name: "Podnar / Bodenbauer – Stol",
                time: "4 h 30 min",
                difficulty: "Hard",
                heightDiff: 1055,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "zelo zahtevna označena pot",
                gps: "stol-podnar.gpx"
            }
        ]
    ),

    createHillData({ name: "Košuta", lat: 46.4517, lon: 14.5350 }, 21, 'Karavanke Alps'),
    createHillData({ name: "Begunjščica", lat: 46.4022, lon: 14.1685 }, 22, 'Karavanke Alps'),
    createHillData({ name: "Kepa", lat: 46.4861, lon: 13.9782 }, 23, 'Karavanke Alps'),
    createHillData({ name: "Vrtača", lat: 46.4402, lon: 14.1105 }, 24, 'Karavanke Alps'),
    createHillData({ name: "Trupejevo poldne", lat: 46.4678, lon: 13.9765 }, 25, 'Karavanke Alps'),
    createHillData({ name: "Golica", lat: 46.4471, lon: 14.0729 }, 26, 'Karavanke Alps'),

    // --- Kamnik–Savinja Alps (N-C) ---
    createHillData(
        {
            name: "Grintovec",
            lat: 46.3686,
            lon: 14.5317
        },
        27,
        'Kamnik–Savinja Alps',
        'Grintovec je najvišji vrh Kamniških in Savinjskih Alp. Nahaja se nad dolino Kamniške Bistrice, Suhega dola in nad dolino Ravenske Kočne. Razgled z vrha je najlepši proti Jezerski in Kokrski Kočni na zahodni strani, na severu se lepo vidi Jezerska dolina in vrhovi nad Jezerskim proti vzhodu pa se vidi greben Grintovcev od Dolgega Hrbta, čez Štruco do Skute. Proti jugu pa se vidi Kalški greben in v ozadju Ljubljanska kotlina. Vrh ima vpisno knjigo in žig.',
        [
            {
                id: 1,
                start: "V Koncu",
                end: "Grintovec",
                name: "V Koncu - Grintovec (čez Streho)",
                time: "4 h 30 min",
                difficulty: "Medium",
                heightDiff: 1658,
                summerGear: "",
                winterGear: "cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "Zapeljemo se v Kamnik in cesti naprej sledimo proti dolini Kamniške Bistrice. Od doma v Kamniški Bistrici z vožnjo nadaljujemo po gozdni cesti, ki nas višje pripelje do križišča, kjer nadaljujemo naravnost (desno Jermanca, izhodišče za Kamniško sedlo). Cesta nas nato mimo Žagane peči pripelje do parkirišča pri spodnji postaji tovorne žičnice na Kokrsko sedlo. Po novem je vožnja od Koče v Kamniški Bistrici do parkirišča V Koncu prepovedana (prometni znak), to nam pot podaljša za slabo uro.",
                descriptionOfPath: "S parkirišča pri tovorni žičnici se usmerimo na sprva zložno peš pot v smeri Kokrskega sedla. Pot najprej preči pas grmičevja, nato pa preide v strnjen gozd, kjer se začne strmeje vzpenjati. Višje gozd postane nekoliko redkejši, tako da se nam odpre nekaj razgleda na okoliške vrhove. Pot, ki se še naprej strmo vzpenja, pa nas višje pripelje do dveh zaporednih jeklenic (v suhem povsem nezahtevno), za katerima pridemo do prijetnega počivališča s klopco. Pot naprej se vrne v strnjen gozd, nato pa se začne obračati proti desni, kjer za krajši čas popusti tudi strmina poti. Pot nekoliko naprej preide iz gozda, preči neizrazit graben in nas za tem pripelje na plazovita pobočja pod Kokrskim sedlom. Tu pot zavije nekoliko v levo in se začne strmo vzpenjati po večinoma kamnitem pobočju. Precej naporna pot (zaradi grušča), ki poteka pod ostenji Kalške gore na levi in manj znanim Malim vrhom na desni, pa nas ob vse lepših razgledih, naposled le pripelje do Cojzove koče na Kokrskem sedlu. S sedla nadaljujemo desno v smeri Grintovca in Kočne (levo Kalški greben, naravnost navzdol Kokra) po poti, ki se za krajši čas strmo vzpne. Strmina kmalu popusti in pot nas po nekaj minutah nadaljnje hoje pripelje na označeno razpotje, kjer nadaljujemo naravnost v smeri Grintovca (rahlo desno Skuta). Sledi nekaj minutno prečenje pobočij, po poti, ki se obrača vse bolj proti levi. Po rahlem spustu nas pot pripelje v bolj raven svet (spodnji del Jam), nato pa se začne prečno vzpenjati proti Strehi Grintovca. Na vrhu prečnega vzpona pridemo na označeno razpotje, kjer nadaljujemo rahlo desno v smeri Grintovca (naravnost Kočna). Pot naprej se še nekaj časa vzpenja čez travnata pobočja, nato pa postopoma preide v bolj kamnit svet. Razmeroma strma pot nas višje pripelje na južni greben Grintovca, po in ob katerem se nato vzpenjamo. Tej vse bolj razgledni poti, ki tehnično ni zahtevna, sledimo vse do vrha Grintovca, le tega pa dosežemo po nekaj 10 minutah nadaljnje hoje. V zimskem času je pot izpostavljena plazovom, velika pa je tudi nevarnost zdrsa. V Koncu - Kokrsko sedlo 2:15, Kokrsko sedlo - Grintovec 2:15.",
                gps: "grintovec-v_koncu_(čez_streho).gpx"
            },
            {
                id: 2,
                start: "V Koncu",
                end: "Grintovec",
                name: "V Koncu - Grintovec (čez Kokrsko in Mlinarsko sedlo)",
                time: "5 h 30 min",
                difficulty: "Hard",       // "zelo zahtevna označena pot" :contentReference[oaicite:2]{index=2}
                heightDiff: 0,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "",
                gps: "grintovec-kokrsko_sedlo.gpx"
            },
            {
                id: 3,
                start: "Suhadolnik",
                end: "Grintovec",
                name: "Suhadolnik - Grintovec (čez Streho)",
                time: "4 h 45 min",
                difficulty: "Medium",     // "zahtevna označena pot" :contentReference[oaicite:3]{index=3}
                heightDiff: 0,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: ""
            },
            {
                id: 4,
                start: "Suhadolnik",
                end: "Grintovec",
                name: "Suhadolnik - Grintovec (čez Kokrsko in Mlinarsko sedlo)",
                time: "5 h 45 min",
                difficulty: "Hard",
                heightDiff: 0,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: ""
            },
            {
                id: 5,
                start: "Ravenska Kočna",
                end: "Grintovec",
                name: "Ravenska Kočna - Grintovec (mimo žičnice in po Frischaufovi poti)",
                time: "5 h 15 min",
                difficulty: "Hard",
                heightDiff: 0,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: ""
            },
            {
                id: 6,
                start: "Ravenska Kočna",
                end: "Grintovec",
                name: "Ravenska Kočna - Grintovec (umik Žrela in po Frischaufovi poti)",
                time: "5 h 20 min",
                difficulty: "Hard",
                heightDiff: 0,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: ""
            },
            {
                id: 7,
                start: "Ravenska Kočna",
                end: "Grintovec",
                name: "Ravenska Kočna - Grintovec (po ferati in Frischaufovi poti)",
                time: "5 h 45 min",
                difficulty: "Hard",
                heightDiff: 0,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: ""
            }
        ]
    ),

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
    createHillData(
        {
            name: "Snežnik",
            lat: 45.5818,
            lon: 14.4485
        },
        57,
        'Dinaric Alps',
        'Snežnik oz. Veliki Snežnik je z višino 1796 m najvišji vrh v bližnji in daljni okolici, zato je z njega lep razgled po večjem delu Slovenije in bližnje sosednje Hrvaške. Ob lepem vremenu tako vidimo najvišje vrhove Gorskega Kotarja in Istre, kjer izstopajo Risnjak, Snježnik in Učka. Na slovensko stran pa prek prostranih gozdov Notranjske vidimo tudi najvišje vrhove Julijskih Alp, Kamniško Savinjskih Alp in Karavank. Le nekaj metrov pod vrhom pa se nahaja tudi zavetišče Draga Karolina na Velikem Snežniku. ',
        [
            {
                id: 1,
                start: "Sviščaki",
                end: "Snežnik",
                name: "Sviščaki - Snežnik (peš pot)",
                time: "2 h",
                difficulty: "Easy",
                heightDiff: 554,
                summerGear: "",
                winterGear: "cepin, dereze",
                images: [],
                comments: [],
                descriptionOfStart: "a) Iz Cerknice ali Nove vasi na Blokah se najprej zapeljemo do Bloške Police, od tam pa z vožnjo nadaljujemo v smeri Loža in Babnega Polja. V naselju Pudob zavijemo desno v smeri Snežnika, Ilirske Bistrice, Knežaka in bližnjega naselja Kozarišče. V Kozariščah nadaljujemo rahlo levo v smeri Snežnika ter tudi v naslednjih križiščih sledimo cesti v smeri Snežnika. Ko se Kozarišče končajo, se konča tudi asfalt, mi pa takoj za mostom preko Malega Obrha nadaljujemo levo v smeri Mašuna in Knežaka. Sledi dolgotrajna vožnja po makadamski cesti, po kateri po približno 19 km od Kozarišč prispemo do križišča, kjer se nam z desne priključi cesta z Mašuna. Tu nadaljujemo levo v smeri Sviščakov, do kamor imamo še približno 10 km makadama, v križiščih pa sledimo oznakam za Sviščake. Po približno 29 km makadamske ceste prispemo do Planinskega doma na Sviščakih, kjer parkiramo. b) Zapeljemo se v Pivko, od tam pa z vožnjo nadaljujemo proti Knežaku. V Knežaku na označenem križišču nadaljujemo levo v smeri Mašuna ter naselja Bač in Koritnice. Malo naprej gremo desno v smeri Mašuna in Koritnic (naravnost Bač). Za Koritnicami se cesta prične vidneje vzpenjati, nato pa nas po 18 km od glavnega križišča v Knežaku pripelje do Mašuna, od koder z vožnjo nadaljujemo desno v smeri Sviščakov, do kamor imamo še približno 12 km makadamske ceste. Ko prispemo do Planinskega doma na Sviščakih parkiramo. c) Najprej se zapeljemo v Ilirsko Bistrico, nato pa z vožnjo nadaljujemo proti Sviščakom (odcep je sredi Ilirske Bistrice ter je označen, morda je le malo slabše opazen). Sprva se vzpenjamo po asfaltni cesti, nato pa po slabih 12 km vzpona asfalt zamenja makadam. Sledi še približno 7 km makadama, nato pa prispemo do križišča v neposredni bližini Planinskega doma na Sviščakih, kjer nadaljujemo naravnost proti bližnjemu planinskemu domu, kjer parkiramo.",
                descriptionOfPath: "S parkirišča pri Planinskem domu na Sviščakih nadaljujemo po cesti, ki gre čez travnik. Na drugi strani travnika zapustimo cesto in se vzpnemo po travnatem pobočju v smeri Snežnika. Že po nekaj minutah hoje ponovno pridemo na cesto in ji sledimo do križišča, kjer nadaljujemo po levi cesti. Cesta nas nato po nekaj deset korakih pripelje do parkirišča pri kapelici. Tu nas smerokaz za Snežnik usmeri na kolovoz, ki se zmerno vzpenja skozi gozd. Po 15 minutah se kolovoz nekoliko spusti in preči gozdno cesto. Na drugi strani ceste se ponovno začne vzpenjati, nato pa strmina popusti. Kolovoz nas nato mimo križa pripelje na gozdno cesto, kjer je razpotje. Nadaljujemo po slabši cesti v smeri Snežnika, ki nas po 15 minutah pripelje do mesta, kjer se cesta konča. Tu se nam odpre lep pogled proti vrhu Snežnika. Smerokaz nas nato usmeri na lepo stezico, ki se vzpenja med rušjem v prečnici pod Malim Snežnikom. Vse bolj razgledna pot nas pripelje na greben, kjer se levo odcepi pot na Mali Snežnik. Mi nadaljujemo desno in v desetih minutah dosežemo zavetišče na Snežniku. Od zavetišča do vrha pa imamo le nekaj korakov.",
                gps: "snežnik-sviščaki.gpx"
            },
            {
                id: 2,
                start: "Snežniška Grda jama",
                end: "Snežnik",
                name: "Snežniška Grda jama - Snežnik (čez Mali Snežnik)",
                time: "1 h 25 min",
                difficulty: "Easy",
                heightDiff: 387,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "lahka označena pot",
                gps: "snežnik-grda_draga.gpx"
            },
            {
                id: 3,
                start: "Sežanje",
                end: "Snežnik",
                name: "Sežanje - Snežnik",
                time: "1 h 40 min",
                difficulty: "Easy",
                heightDiff: 479,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "lahka označena pot",
                gps: "snežnik-sežanje.gpx"
            },
            {
                id: 4,
                start: "Gašperjev hrib",
                end: "Snežnik",
                name: "Gašperjev hrib - Snežnik",
                time: "1 h 30 min",
                difficulty: "Easy",
                heightDiff: 415,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "lahka označena pot"
            },
            {
                id: 5,
                start: "Leskova dolina",
                end: "Snežnik",
                name: "Leskova dolina - Snežnik",
                time: "", // hribi.net list shows, but no detail page text
                difficulty: "Easy",
                heightDiff: 0,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "lahka označena pot",
                gps: "snežnik-leskova_dolina.gpx"
            },
            {
                id: 6,
                start: "Kapetanova bajta",
                end: "Snežnik",
                name: "Kapetanova bajta - Snežnik",
                time: "", // no explicit time on list page
                difficulty: "Easy",
                heightDiff: 0,
                summerGear: "",
                winterGear: "",
                images: [],
                comments: [],
                descriptionOfStart: "",
                descriptionOfPath: "lahka označena pot"
            }
        ]
    ),

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
