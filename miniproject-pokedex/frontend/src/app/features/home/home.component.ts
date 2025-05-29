import { Component, inject, input, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PokemonService } from '../../shared/services/pokemon/pokemon.service';
import { pokemonList, ResourceList } from '../../shared/models/pokemon.model';
import { firstValueFrom } from 'rxjs';
import { UserData, PokemonWithFavorite } from '../../shared/models/users.model';




@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  accessToken = localStorage.getItem('access_token');
  pokemonList = signal<PokemonWithFavorite[]>([]);
  loading = signal<boolean>(false);
  userData = signal<UserData | null>(null);
  favoritePokemonIds = signal<number[]>([]);
  
  private pokemonService = inject(PokemonService);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  ngOnInit(): void {
    if (this.accessToken) {
      this.loadUserData().then(() => {
        this.loadPokemonList(10, 0);
      });
    } else {
      this.loadPokemonList(10, 0);
    }
  }

  // โหลดข้อมูล user จาก API
  async loadUserData(): Promise<void> {
    if (!this.accessToken) return;

    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      });

      const userData = await firstValueFrom(
        this.http.get<UserData>(`${this.apiUrl}/users/me`, { headers })
      );

      this.userData.set(userData);
      this.favoritePokemonIds.set(userData.favorite_pokemon_ids || []);
      console.log('User data loaded:', userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
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

  async getpokemon(basicPokemonList: any[]): Promise<void> {
    try {
      const pokemonPromises = basicPokemonList.map(async (pokemon) => {
        const pokemonId = this.extractIdFromUrl(pokemon.url);
        const details = await firstValueFrom(this.pokemonService.getPokemonById(pokemonId));
        const isFavorite = this.favoritePokemonIds().includes(pokemonId);
        
        return {
          name: details.name,
          id: details.id,
          types: details.types.map((type: any) => type.type.name),
          img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${details.id}.svg`,
          className: details.types.map(({ type }: any) => 'type-' + type.name).join(' '),
          isFavorite: isFavorite
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

  async toggleFavorite(pokemonId: number, event: Event): Promise<void> {
    event.stopPropagation();
    if (!this.accessToken) {
      console.warn('User not authenticated');
      return;
    }

    const currentFavorites = [...this.favoritePokemonIds()];
    const isFavorite = currentFavorites.includes(pokemonId);

    let updatedFavorites: number[];
    if (isFavorite) {
      updatedFavorites = currentFavorites.filter(id => id !== pokemonId);
    } else {
      updatedFavorites = [...currentFavorites, pokemonId];
    }
    
    this.favoritePokemonIds.set(updatedFavorites);
    this.updatePokemonFavoriteStatus(pokemonId, !isFavorite);

    try {
      await this.updateFavoriteOnServer(updatedFavorites);
      console.log(`Pokemon ${pokemonId} ${isFavorite ? 'removed from' : 'added to'} favorites`);
    } catch (error) {
      console.error('Error updating favorites:', error);
      this.favoritePokemonIds.set(currentFavorites);
      this.updatePokemonFavoriteStatus(pokemonId, isFavorite);
    }
  }

  private async updateFavoriteOnServer(favoriteIds: number[]): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      favorite_pokemon_ids: favoriteIds
    };

    await firstValueFrom(
      this.http.patch(`${this.apiUrl}/users`, payload, { headers })
    );
  }

  private updatePokemonFavoriteStatus(pokemonId: number, isFavorite: boolean): void {
    const currentList = this.pokemonList();
    const updatedList = currentList.map(pokemon => 
      pokemon.id === pokemonId ? { ...pokemon, isFavorite } : pokemon
    );
    this.pokemonList.set(updatedList);
  }

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
  }

  getFavoriteCount(): number {
    return this.favoritePokemonIds().length;
  }

  getFavoritePokemon(): PokemonWithFavorite[] {
    return this.pokemonList().filter(pokemon => pokemon.isFavorite);
  }

  getUserName(): string {
    const user = this.userData();
    return user ? `${user.first_name} ${user.last_name}` : 'Guest';
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.userData();
  }
}