import { Controller, Get, Query } from '@nestjs/common';

@Controller('pokemon')
export class PokemonController {
  @Get()
  searchPokemon(@Query() query: string): string {
    return 'Pikachu' + query;
  }
}
