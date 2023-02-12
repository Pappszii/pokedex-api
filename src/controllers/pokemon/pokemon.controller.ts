import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPokemonQueryDto } from 'src/models/dto/getPokemonsDto';
import { PokemonDto } from 'src/models/dto/pokemonDto';
import { PokeapiService } from 'src/services/pokeapi/pokeapi.service';

@ApiTags('Pokemon operations')
@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokeService: PokeapiService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PokemonDto,
    description: 'The list of the pokemons',
  })
  search(@Query() searchQuery: GetPokemonQueryDto) {
    return this.pokeService.getPokemon(searchQuery);
  }
}
