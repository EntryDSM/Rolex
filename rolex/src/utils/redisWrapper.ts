import * as redis from "redis";
import { redisHost, redisPassword, redisPort} from "../config/config";

export let redisClient = redis.createClient({
        port: Number(process.env['REDIS_PORT']),
        host: process.env['REDIS_HOST'],
        password: process.env['REDIS_PASSWORD']
    }
);

export function getValue (key:string): Promise<string> {
    return new Promise((resolve, reject)=>{
        redisClient.get(key, (err, data)=>{
            if (err) {
                reject(err);
                return;
            } else {
                resolve(data);
            }
        })
    })
}