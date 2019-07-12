import redis from 'redis'
import VaultData from '../interfaces/VaultData'

class RedisClient {
  private redisClient: redis.RedisClient

  constructor (data: VaultData) {
    this.redisClient = redis.createClient({
      port: data.REDIS_PORT,
      host: data.REDIS_HOST,
      password: data.REDIS_PASSWORD
    })
  }

  public async getKey (key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (err,data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }

  public setKey (key: string, value: string): void {
    this.redisClient.set(key, value, (err, data) => {
      if (err) console.log(err)
    })
  }

  public delKey (key: string): void {
    this.redisClient.del(key, (err, res) => {
      if (err) console.log(err)
    })
  }
}

export default RedisClient
