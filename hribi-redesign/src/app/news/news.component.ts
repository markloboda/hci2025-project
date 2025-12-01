import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  news = [
    {
      title: 'Anketa: Vošca',
      location: 'Vošca (1737 m)',
      date: '2025-11-12',
      excerpt: 'Vprašanje na minulo anketo je bilo: Kje se nahaja Vošca (1737 m)? Pravilen odgovor je: v Karavankah',
      details: 'Rezultati ankete: 75 % V Karavankah · 13 % Ne vem · 9 % V Julijskih Alpah · 2 % V Kamniško Savinjskih Al...'
    },
    {
      title: 'Pastirski stan na Krasjem vrhu',
      date: '2025-10-22',
      excerpt: 'Pastirski stan na Krasjem vrhu - vračanje človeka v gorsko krajino. V oktobru je na Krasjem vrhu po...'
    },
    {
      title: 'Odpoklic plezalnih kompletov - Mammut',
      date: '2025-09-30',
      excerpt: 'Mammut je izdal previdnostni odpoklic plezalnih kompletov Skywalker Pro Via Ferrata in Skywalker Pro...'
    },
    {
      title: 'Anketa: Kojca',
      date: '2025-08-18',
      excerpt: 'Vprašanje na minulo anketo je bilo: Ali ste že bili na Kojci (1303 m)? Kojca je gora, ki se dviga n...'
    },
    {
      title: 'Svet je lep - potepuške zgodbe Andreja Stritarja...',
      date: '2025-07-05',
      excerpt: 'Svet je lep - potepuške zgodbe Andreja Stritarja z gora in iz sveta. "Svet je lep!" brezkompromisno...'
    },
    {
      title: 'Planinski vestnik, november 2025',
      date: '2025-11-01',
      excerpt: 'V novembrski številki Planinskega vestnika v temi meseca pišemo o kratki, a bogati življenjski poti alpinista Bogumila Brinška. Brinšek je verjel, da so gore prostor ustvarjalnega duha, ne le fizičneg...'
    },
    {
      title: 'Anketa: pogled s Košutice',
      date: '2025-06-30',
      excerpt: 'Vprašanje na minulo anketo je bilo: Ali se s Košutice (1968 m), vidi Dom na Kofcah (1488 m)? Pravil...'
    },
    {
      title: 'Začela se je prenova Koče na Golici',
      date: '2025-04-14',
      excerpt: 'Planinsko društvo Jesenice se je lotilo prenove Koče na Golici. "Koča bo čez dve leti tako rekoč čis...'
    },
    {
      title: 'Planinska koča na Ermanovcu zaprta zaradi prenove',
      date: '2025-03-02',
      excerpt: 'Dragi obiskovalci in prijatelji naše koče, obveščamo vas, da bo koča na Ermanovcu zaradi prenove za...'
    },
    {
      title: 'Anketa: Sabotin',
      date: '2025-02-20',
      excerpt: 'Vprašanje na minulo anketo je bilo: Ali ste že bili na Sabotinu (609 m)? Sabotin je razgledna gora ...'
    }
  ];
}
