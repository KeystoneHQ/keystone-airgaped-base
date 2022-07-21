import * as uuid from "uuid";
import { InteractionProvider } from "./InteractionProvider";
import { NearSignRequest } from "@keystonehq/bc-ur-registry-near";

const keyringType = "QR Hardware Wallet Device";

export interface HDKey {
  hdPath: string;
  pubKey: string;
}

interface KeyringInitData {
  xfp: string;
  keys: HDKey[];
  name?: string;
  device?: string;
}

export class BaseKeyring {
  getInteraction = (): InteractionProvider => {
    throw new Error(
      "KeystoneError#invalid_extends: method getInteraction not implemented, please extend BaseKeyring by overwriting this method."
    );
  };
  static type = keyringType;
  protected xfp: string;
  protected type = keyringType;
  protected initialized: boolean;
  protected keys: HDKey[];
  protected name: string;
  protected device: string;

  constructor() {
    //common props
    this.keys = [];
    this.name = "QR Hardware";
    this.initialized = false;
    this.device = "";
    this.xfp = "";
  }

  protected requestSignature = async (
    _requestId: string,
    signRequest: NearSignRequest
  ): Promise<Buffer[]> => {
    const nearSignature = await this.getInteraction().requestSignature(
      signRequest
    );
    const requestIdBuffer = nearSignature.getRequestId();
    const signature = nearSignature.getSignature();
    if (requestIdBuffer) {
      const requestId = uuid.stringify(requestIdBuffer);
      if (requestId !== _requestId) {
        throw new Error(
          "KeystoneError#invalid_data: read signature error: mismatched requestId"
        );
      }
    }
    return signature;
  };

  public getName = (): string => {
    return this.name;
  };

  public syncKeyringData({
    xfp,
    keys,
    name = "QR Hardware",
    device,
  }: KeyringInitData): void {
    this.xfp = xfp;
    this.name = name;
    this.keys = keys;
    this.device = device;
    this.initialized = true;
  }

  getAccounts() {
    if (!this.initialized) {
      return [];
    }
    return this.keys;
  }

  async signTransaction(
    txData: Buffer[],
    pubKey: string
  ): Promise<Buffer[]> {
    const requestId = uuid.v4();
    const account = this.getAccounts().find(
      (account) => account.pubKey == pubKey
    );
    const nearSignRequest = NearSignRequest.constructNearRequest(
      txData,
      account.hdPath,
      this.xfp,
      requestId
    );
    return this.requestSignature(
      requestId,
      nearSignRequest
    );
  }
}
