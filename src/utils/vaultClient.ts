import vault, * as NodeVault from 'node-vault'
import VaultData from '../interfaces/VaultData'
import { vaultEndpoint, vaultPath, vaultToken } from '../config'

class VaultClient {
  private vaultClient: NodeVault.Client;
  private connection?: VaultData;

  constructor () {
    this.vaultClient = vault({
      apiVersion: 'v1',
      endpoint: vaultEndpoint,
      token:  vaultToken
    })
  }

  public async connectVault (): Promise<VaultData> {
    this.connection = (await this.vaultClient.read(vaultPath)).data as VaultData;
    return this.connection;
  }
}

export default VaultClient;
