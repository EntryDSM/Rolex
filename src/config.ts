import { config } from 'dotenv';
config();

export const port: number = Number(process.env.port);
export const vaultEndpoint: string = String(process.env.VAULT_ENDPOINT);
export const vaultToken: string = String(process.env.VAULT_TOKEN);
export const vaultPath: string = String(process.env.VAULT_PATH);
