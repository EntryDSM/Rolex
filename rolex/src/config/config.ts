export const port = Number(process.env.PORT) || 3000;
export const jwtSecret = process.env.JWTSECRET;
export const redisHost = process.env['REDIS_HOST'];
export const redisPassword = process.env['REDIS_PASSWORD'];
export const redisPort = Number(process.env['REDIS_PORT']);