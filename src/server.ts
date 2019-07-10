import 'dotenv/config'
import App from './app'

(async () => {
  const app = new App()

  await app.listen(3000)

  const redisClient = await app.getRedisClient()

  // how to use redisClient
  // console.log(await redisClient.getKey('testKey'))
  // redisClient.setKey('testKey', 'testValue')
  // redisClient.delKey('testKey')
})()
