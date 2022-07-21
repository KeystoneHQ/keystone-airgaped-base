import {
  NearSignature,
  NearSignRequest,
} from "@keystonehq/bc-ur-registry-near";

import { CryptoMultiAccounts } from "@keystonehq/bc-ur-registry"
export interface InteractionProvider {
  readCryptoMultiAccounts: () => Promise<CryptoMultiAccounts>;
  requestSignature: (
    signRequest: NearSignRequest,
    requestTitle?: string,
    requestDescription?: string
  ) => Promise<NearSignature>;
}
