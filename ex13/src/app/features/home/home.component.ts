import { Component, inject, input, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../shared/services/pokemon/pokemon.service';
import { pokemonList, ResourceList } from '../../shared/modes/pokemon.model';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  pokemonList = signal<pokemonList[]>([]); 
  loading = signal<boolean>(false);

  private pokemonService = inject(PokemonService);

  ngOnInit(): void {
    this.loadPokemonList(10,0);
  }



  loadPokemonList(limit: number, offset = 0): void {
    this.loading.set(true);
    this.pokemonService.getPokemonList(limit, offset).subscribe({
      next: (response) => {
        this.getpokemon(response.results);
      },
      error: (err) => {
        console.error('Error fetching Pokémon list:', err);
        this.loading.set(false);
      },
    });
  }

  async getpokemon(basicPokemonList:any[]): Promise<void>{
    try {
      const pokemonPromises = basicPokemonList.map(async (pokemon) => {
        const pokemonId = this.extractIdFromUrl(pokemon.url);
        const details = await firstValueFrom(this.pokemonService.getPokemonById(pokemonId));
        
        return {
          name: details.name,
          id: details.id,
          types: details.types.map((type: any) => type.type.name),
          img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${details.id}.svg`,
          className: details.types.map(({ type }: any) => 'type-' + type.name).join(' ')
        };
      });

      const detailedPokemonList = await Promise.all(pokemonPromises);
      
      detailedPokemonList.sort((a, b) => a.id - b.id);
      
      this.pokemonList.set(detailedPokemonList);
      console.log('Detailed Pokémon List:', this.pokemonList());
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10); 
  }

}