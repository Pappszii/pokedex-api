/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { GetPokemonQueryDto } from 'src/models/dto/getPokemonsDto';
import { PokemonDto } from 'src/models/dto/pokemonDto';

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/';
const POKEMON_ENDPOINT = 'pokemon';
const DEFAULT_LIMIT = 20;
const MAXIMUM_LIMIT = 1257;
const DEFAULT_OFFSET = 0;

@Injectable()
export class PokeapiService {
  constructor(private readonly httpService: HttpService) { }

  getPokemon(query: GetPokemonQueryDto): Promise<PokemonDto[]> {
    return firstValueFrom(
      this.searchPokemons(query?.limit, query?.offset, query?.filter)
    ).then(async (resp) => {
      return await Promise.all(
        resp.map((url) => firstValueFrom(this.httpService.get(url)))
      ).then((responseArray) =>
        responseArray.map((pokeResponse) => this.mapPokemon(pokeResponse.data))
      );
    });
  }

  // eslint-disable-next-line prettier/prettier
  searchPokemons(limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET, filter = ''): Observable<string[]> {
    const searchLimit = filter.length > 0 ? MAXIMUM_LIMIT : limit;
    const lowerFilter = filter.toLowerCase();
    return this.httpService
      .get(this.buildUrl(POKEMON_ENDPOINT, searchLimit, offset))
      .pipe(
        map((response) => {
          return response.data.results
            .filter((result) => result.name.includes(lowerFilter))
            .slice(offset, +offset + +limit)
            .map((item) => item.url);
        })
      );
  }

  private buildUrl(endpoint: string, limit: number, offset: number) {
    return `${POKEMON_API_BASE_URL}${endpoint}/?offset=${offset}&limit=${limit}`;
  }

  private mapPokemon(pokemonData: any): PokemonDto {
    return {
      id: pokemonData.id,
      name: pokemonData.name,
      type: pokemonData.types[0].type.name,
      frontSprite: pokemonData.sprites.front_default,
      backSprite: pokemonData.sprites.back_default,
      hp: pokemonData.stats.find((item) => item.stat.name === 'hp').base_stat,
      att: pokemonData.stats.find((item) => item.stat.name === 'attack').base_stat,
      def: pokemonData.stats.find((item) => item.stat.name === 'defense').base_stat,
      speed: pokemonData.stats.find((item) => item.stat.name === 'speed').base_stat,
    };
  }
}
