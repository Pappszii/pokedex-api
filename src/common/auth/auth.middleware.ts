import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as serviceAccount from './serviceAccount.json';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private defaultApp: firebase.app.App;

  constructor() {
    // parameter a firebase app..
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      //databaseURL
    });
  }

  async use(req: Request, res: Response, next: () => void) {
    const token = req.headers['authorization'];
    if (token) {
      try {
        const decodedToken = await this.defaultApp
          .auth()
          .verifyIdToken(token.replace('Bearer', ''));
        req['user'] = {
          email: decodedToken.email,
          roles: decodedToken.roles || [],
          type: decodedToken.type,
        };
        next();
      } catch {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
