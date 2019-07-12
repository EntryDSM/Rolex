import vault, * as NodeVault from 'node-vault'
import VaultData from '../interfaces/VaultData'

class VaultClient {
  private vaultClient: NodeVault.client
  private connection?: VaultData

  constructor () {
    const {
      VAULT_ENDPOINT,
      VAULT_TOKEN
    } = process.env

    this.vaultClient = vault({
      apiVersion: 'v1',
      endpoint: VAULT_ENDPOINT,
      token: VAULT_TOKEN
    })
  }

  public async connectVault (): Promise<VaultData> {
    const { VAULT_PATH } = process.env
    this.connection = (await this.vaultClient.read(VAULT_PATH as string)).data as VaultData
    return this.connection
  }
}

export default VaultClient
