import { Component, Input, OnInit } from '@angular/core';
import { Hill, hills } from '../../assets/hills';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hill-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './hill-page.component.html',
  styleUrl: './hill-page.component.css'
})
export class HillPageComponent {
  hillID!: number;
  hillData!: Hill;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.hillID = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.hillData = hills.find(h => h.id === this.hillID)!;
    console.log(this.hillData);
  }
}