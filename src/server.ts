import 'dotenv/config'
import App from './app'

(async () => {
  const app = new App()

  await app.listen(3000)

  const redisClient = await app.getRedisClient()
})()
