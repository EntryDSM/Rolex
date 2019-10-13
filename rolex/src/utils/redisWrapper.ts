import * as redis from "redis";
import { redisHost, redisPassword, redisPort} from "../config/config";

export let redisClient = redis.createClient({
        port: redisPort,
        host: redisHost,
        password: redisPassword
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

export function zrevrange (key: string): Promise<Array<string>> {
    return new Promise((resolve, reject)=>{
        redisClient.zrevrange(key, 0, -1, 'WITHSCORES', (err, result)=>{
            if (err) {
                reject(err);
                return;
            } else {
                resolve(result);
            }
        })
    })
}