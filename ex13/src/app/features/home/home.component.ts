import { Component, inject, input, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../shared/services/pokemon/pokemon.service';
import { pokemonList, ResourceList } from '../../shared/modes/pokemon.model';
import { httpResource } from '@angular/common/http';
import { DecimalPipe, JsonPipe, NgClass, NgForOf } from '@angular/common';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    JsonPipe,
    NgClass,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  pokemonList = signal<pokemonList[]>([]); 

  private pokemonService = inject(PokemonService);

  ngOnInit(): void {
    this.loadPokemonList();
  }

  loadPokemonList(): void {
    this.pokemonService.getPokemonList().subscribe({
      next: (response) => {
        const basicPokemonList = response.results; 
        const detailedPokemonList: { name: string; id: number; types: string[] ;img: string;}[] = [];

        basicPokemonList.forEach((pokemon) => {
          const pokemonId = this.extractIdFromUrl(pokemon.url); 
          this.pokemonService.getPokemonById(pokemonId).subscribe({
            next: (details) => {
              detailedPokemonList.push({
                name: details.name,
                id: details.id,
                types: details.types.map((type) => type.type.name), 
                img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/"+details.id+".svg"
              });

              if (detailedPokemonList.length === basicPokemonList.length) {
                this.pokemonList.set(detailedPokemonList);
                console.log('Detailed Pokémon List:', this.pokemonList());
              }
            },
            error: (err) => {
              console.error(`Error fetching details for ${pokemon.name}:`, err);
            },
          });
        });
      },
      error: (err) => {
        console.error('Error fetching Pokémon list:', err);
      },
    });
  }

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10); 
  }

  getTypeClass(types: string[]): string {
    const type = types[0].toLowerCase(); 
    switch (type) {
      case 'grass':
        return 'bg-green-500';
      case 'fire':
        return 'bg-red-500';
      case 'water':
        return 'bg-blue-500';
      case 'electric':
        return 'bg-yellow-500';
      case 'psychic':
        return 'bg-pink-500';
      case 'ice':
        return 'bg-cyan-500';
      case 'dragon':
        return 'bg-indigo-500';
      case 'dark':
        return 'bg-gray-800';
      case 'fairy':
        return 'bg-pink-300';
      case 'fighting':
        return 'bg-orange-500';
      case 'poison':
        return 'bg-purple-500';
      case 'ground':
        return 'bg-yellow-700';
      case 'flying':
        return 'bg-blue-300';
      case 'bug':
        return 'bg-green-300';
      case 'rock':
        return 'bg-yellow-600';
      case 'ghost':
        return 'bg-purple-700';
      case 'steel':
        return 'bg-gray-400';
      case 'normal':
        return 'bg-gray-300';
      default:
        return 'bg-gray-200'; // Default background if type is not recognized
    }
  }
}