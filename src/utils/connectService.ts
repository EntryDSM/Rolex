import VaultClient from './vaultClient';
import VaultData from '../interfaces/VaultData';
import RedisClient from './redisClient';

const connectToVault = async (): Promise<VaultData> => {
  const vaultConnection = new VaultClient();
  return vaultConnection.connectVault();
}

const ConnectToRedis = async (vaultConnection: VaultData): Promise<RedisClient> => {
  const redisClient = new RedisClient(vaultConnection);
  return redisClient;
}

export const connectServices = async () => {
  const vaultConnection: VaultData = await connectToVault();
  const redisConnection: RedisClient = await ConnectToRedis(vaultConnection);
}
