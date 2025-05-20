import { Component, input } from '@angular/core';
import {ActivatedRoute, RouterLink } from '@angular/router';


@Component({
  selector: 'app-infomation',
  imports: [RouterLink],
  templateUrl: './infomation.component.html',
  styleUrl: './infomation.component.css'
})
export class InfomationComponent {
  id: string = '0';
  pokemon: any;
  types: string[] = [];

  info = [
    {
      id: '001',
      name: "bulbasaur",
      height: 70,
      weight: 6.9,
      type: ['Green', 'Poison'],
      background: 'bg-green-400',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
    },
    {
      id: '002',
      name: "Ivysaur",
      height: 100,
      weight: 6.9,
      type: ['Green', 'Poison'],
      background: 'bg-green-400',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg',
    },
    {
      id: '003',
      name: "Venusaur",
      height: 200,
      weight: 100,
      type: ['Green'],
      background: 'bg-green-400',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/3.svg',
    },
    {
      id: '004',
      name: "Charmander",
      height: 60,
      weight: 8.5,
      type: ['Fire'],
      background: 'bg-red-400',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/4.svg',
    },
    {
      id: '005',
      name: "Charmeleon",
      height: 110,
      weight: 19,
      type: ['Fire'],
      background: 'bg-red-400',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/5.svg',
    },
    {
      id: '006',
      name: "Charizard",
      height: 170,
      weight: 90.5,
      type: ['Fire', 'Flying'],
      background: 'bg-red-400',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/6.svg',
    },
    {
      id: '007',
      name: "Squirtle",
      height: 50,
      weight: 9,
      type: ['water'],
      background: 'bg-blue-400',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/7.svg',
    },
    {
    id:'008',
    name: "Wartortle",
    height: 100,
    weight: 22.5,
    type: ['water'],
    background: 'bg-blue-400' ,
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/8.svg',
    }
  ]
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        const index = parseInt(idParam)-1;
        
        if (index >= 0 && index < this.info.length) {
          this.pokemon = this.info[index];
        } else {
          this.pokemon = this.info[0];
        }
        
        this.id = idParam;
        this.types = this.pokemon.type;
      }
    });
  }
}
