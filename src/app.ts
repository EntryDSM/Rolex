import express from "express";
import errorMiddleware from "./middlewares/error";

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.initializeMiddleware();
        this.initializeErrorHandler();
    }

    public listen(port:number) {
        this.app.set('PORT',port);
        this.app.listen(this.app.get('PORT'), ()=>{
            console.log(`server is listening on ${this.app.get('PORT')}`);
        })
    }

    private initializeMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false}));
    }

    private initializeErrorHandler(): void {
        this.app.use(errorMiddleware)
    }
}

export default App;
