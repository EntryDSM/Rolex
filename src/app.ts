import express from 'express'
import errorMiddleware from './middlewares/error'
import VaultClient from './utils/vaultClient'
import RedisClient from './utils/redisClient'

class App {
  public app: express.Application
  private vaultClient?: VaultClient
  private redisClient?: RedisClient

  constructor () {
    this.app = express()
    this.initializeMiddleware()
    this.initializeErrorHandler()
  }

  public async listen (port: number) {
    if (!this.redisClient) {
      this.vaultClient = new VaultClient()
      this.redisClient = new RedisClient(await this.vaultClient.connectVault())
    }
    this.app.set('PORT', port)
    this.app.listen(this.app.get('PORT'), () => {
      console.log(`server is listening on ${this.app.get('PORT')}`)
    })
  }

  private initializeMiddleware (): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
  }

  private initializeErrorHandler (): void {
    this.app.use(errorMiddleware)
  }

  public async getRedisClient (): Promise<RedisClient> {
    if (!this.redisClient) {
      this.vaultClient = new VaultClient()
      this.redisClient = new RedisClient(await this.vaultClient.connectVault())
    }
    return this.redisClient
  }
}

export default App
