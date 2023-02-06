import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './common/auth/auth.middleware';
import { PokemonController } from './controllers/pokemon/pokemon.controller';
import { PokeapiService } from './services/pokeapi/pokeapi.service';

@Module({
  imports: [],
  controllers: [AppController, PokemonController],
  providers: [AppService, PokeapiService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
