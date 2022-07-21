import {
  CryptoKeypath,
  extend,
  DataItem,
  PathComponent,
  RegistryItem,
  DataItemMap,
} from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";
import * as uuid from "uuid";

const { decodeToDataItem, RegistryTypes } = extend;

enum Keys {
  requestId = 1,
  signData,
  derivationPath,
  account,
  origin,
}

type signRequestProps = {
  requestId?: Buffer;
  signData: Buffer[];
  derivationPath: CryptoKeypath;
  account?: string;
  origin?: string;
};

export class NearSignRequest extends RegistryItem {
  private requestId?: Buffer;
  private signData: Buffer[];
  private derivationPath: CryptoKeypath;
  private account?: string;
  private origin?: string;

  getRegistryType = () => ExtendedRegistryTypes.NEAR_SIGN_REQUEST;

  constructor(args: signRequestProps) {
    super();
    this.requestId = args.requestId;
    this.signData = args.signData;
    this.derivationPath = args.derivationPath;
    this.account = args.account;
    this.origin = args.origin;
  }

  public getRequestId = () => this.requestId;
  public getSignData = () => this.signData;
  public getDerivationPath = () => this.derivationPath.getPath();
  public getSignRequestAccount = () => this.account;
  public getOrigin = () => this.origin;

  public toDataItem = () => {
    const map: DataItemMap = {};
    if (this.requestId) {
      map[Keys.requestId] = new DataItem(
        this.requestId,
        RegistryTypes.UUID.getTag()
      );
    }
    if (this.account) {
      map[Keys.account] = this.account;
    }

    if (this.origin) {
      map[Keys.origin] = this.origin;
    }

    map[Keys.signData] = this.signData;

    const keyPath = this.derivationPath.toDataItem();
    keyPath.setTag(this.derivationPath.getRegistryType().getTag());
    map[Keys.derivationPath] = keyPath;

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    const signData = map[Keys.signData];
    const derivationPath = CryptoKeypath.fromDataItem(map[Keys.derivationPath]);
    const account = map[Keys.account] ? map[Keys.account] : undefined;
    const requestId = map[Keys.requestId]
      ? map[Keys.requestId].getData()
      : undefined;
    const origin = map[Keys.origin] ? map[Keys.origin] : undefined;

    return new NearSignRequest({
      requestId,
      signData,
      derivationPath,
      account,
      origin,
    });
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return NearSignRequest.fromDataItem(dataItem);
  };

  public static constructNearRequest(
    signData: Buffer[],
    hdPath: string,
    xfp: string,
    uuidString?: string,
    account?: string,
    origin?: string
  ) {
    const paths = hdPath.replace(/[m|M]\//, "").split("/");
    const hdpathObject = new CryptoKeypath(
      paths.map((path) => {
        const index = parseInt(path.replace("'", ""));
        let isHardened = false;
        if (path.endsWith("'")) {
          isHardened = true;
        }
        return new PathComponent({ index, hardened: isHardened });
      }),
      Buffer.from(xfp, "hex")
    );

    return new NearSignRequest({
      requestId: uuidString
        ? Buffer.from(uuid.parse(uuidString) as Uint8Array)
        : undefined,
      signData,
      derivationPath: hdpathObject,
      account: account || undefined,
      origin: origin || undefined,
    });
  }
}
