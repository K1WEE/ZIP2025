import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Resource } from '@angular/core';
import { ApiResponse } from '../../modes/response.model';
import { Pokemon, ResourceList } from '../../modes/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private httpClient = inject(HttpClient);

  
  getPokemonList(limit:number = 20,offset: number = 0){
    return this.httpClient.get<ApiResponse<ResourceList>>(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonById(id: number){
    return this.httpClient.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`);
  }

}
