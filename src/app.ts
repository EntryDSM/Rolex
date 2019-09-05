import express from 'express'
import errorMiddleware from './middlewares/error'
import Controller from './interfaces/controller.interface'
import { port } from './config';

class App {
  public app: express.Application;

  constructor (controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandler();
  }

  public listen () {
    this.app.set('PORT', port);
    this.app.listen(this.app.get('PORT'), () => {
      console.log(`server is listening on ${this.app.get('PORT')}`);
    })
  }

  private initializeMiddlewares (): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private initializeControllers (controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })
  }

  private initializeErrorHandler (): void {
    this.app.use(errorMiddleware);
  }
}

export default App;
