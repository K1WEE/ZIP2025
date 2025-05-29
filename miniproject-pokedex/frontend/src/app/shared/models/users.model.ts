import { pokemonList } from "./pokemon.model"

export interface User {
  accessToken: string
  refreshToken: string
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  gender: string
  image: string
}

export interface UserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_active?: boolean;
  favorite_pokemon_ids?: number[];

}

export interface PokemonWithFavorite extends pokemonList {
  isFavorite: boolean;
}