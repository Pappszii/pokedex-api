/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

export class GetPokemonQueryDto {

  @ApiProperty({
    type: 'number',
    description: 'The maximum number of the results',
    example: '20',
    required: false,
    default: DEFAULT_LIMIT
  })
  limit: number;

  @ApiProperty({
    type: 'number',
    description: 'The offset of the response',
    example: '0',
    required: false,
    default: DEFAULT_OFFSET
  })
  offset: number;

  @ApiProperty({
    type: 'string',
    description: 'Filter the results. Only those Pokemons will appear in the result which name contains the query string.',
    example: 'pika',
    required: false,
    default: ''
  })
  filter: string;
}
