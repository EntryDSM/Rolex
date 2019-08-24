import VaultClient from './vaultClient';
import VaultData from '../interfaces/VaultData';
import RedisClient from './redisClient';

export const connectToVault = async (): Promise<VaultData> => {
    const vaultConnection = new VaultClient();
    return await vaultConnection.connectVault();
}

export const ConnectToRedis = async (vaultConnection: VaultData): Promise<RedisClient> => {
    const redisClient = new RedisClient(vaultConnection);
    return redisClient;
}