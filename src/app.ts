import express from 'express'
import nodeSchedule from 'node-schedule';
import errorMiddleware from './middlewares/error'
import { connectToVault, ConnectToRedis } from './utils/connectService';
import VaultData from './interfaces/VaultData';
import RedisClient from './utils/redisClient';

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.initializeMiddleware()
    this.initializeErrorHandler()
  }

  public listen(port: number, listener: () => void) {
    this.app.set('PORT', port)
    this.app.listen(this.app.get('PORT'), () => {
      console.log(`server is listening on ${this.app.get('PORT')}`)
    })
  }

  private initializeMiddleware(): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
  }

  private initializeErrorHandler(): void {
    this.app.use(errorMiddleware)
  }
}

const createApp = async () => {
  connectServices();
  console.log(new Date().getMinutes());
  const startMinute = new Date().getMinutes();
  const rule = new nodeSchedule.RecurrenceRule();
  rule.minute = startMinute - 1;
  const batchJob = nodeSchedule.scheduleJob(rule, () => {
    connectServices();
  })
  return new App();
};

const connectServices = async () =>{
  const vaultConnection:VaultData = await connectToVault();
  const redisConnection:RedisClient = await ConnectToRedis(vaultConnection);
}

export default createApp;
