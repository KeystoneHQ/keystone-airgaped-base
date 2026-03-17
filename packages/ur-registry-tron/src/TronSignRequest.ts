import {
  CryptoKeypath,
  extend,
  DataItem,
  PathComponent,
  RegistryItem,
  DataItemMap
} from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";
import { parse as uuidParse} from "uuid";

const { decodeToDataItem, RegistryTypes } = extend;

enum Keys {
  requestId = 1,
  signData,
  dataType,
  derivationPath,
  address,
  origin,
}

export enum DataType {
  transaction = 1,
  personalMessage = 2,
}

type SignRequestProps = {
  requestId?: Buffer;
  signData: Buffer;
  dataType: DataType;
  derivationPath: CryptoKeypath;
  address?: Buffer;
  origin?: string;
};

export class TronSignRequest extends RegistryItem {
  private requestId?: Buffer;
  private signData: Buffer;
  private dataType: DataType;
  private derivationPath: CryptoKeypath;
  private address?: Buffer;
  private origin?: string;

  getRegistryType = () => ExtendedRegistryTypes.TRON_SIGN_REQUEST;

  constructor(args: SignRequestProps) {
    super();
    this.requestId = args.requestId;
    this.signData = args.signData;
    this.dataType = args.dataType;
    this.derivationPath = args.derivationPath;
    this.address = args.address;
    this.origin = args.origin;
  }

  public getRequestId = () => this.requestId;
  public getSignData = () => this.signData;
  public getDataType = () => this.dataType;
  public getDerivationPath = () => this.derivationPath.getPath();
  public getAddress = () => this.address;
  public getOrigin = () => this.origin;

  public toDataItem = () => {
    const map: DataItemMap = {};
    map[Keys.signData] = this.signData;
    map[Keys.dataType] = this.dataType;

    const derivationPath = this.derivationPath.toDataItem();
    derivationPath.setTag(this.derivationPath.getRegistryType().getTag());
    map[Keys.derivationPath] = derivationPath;

    if (this.requestId) {
      map[Keys.requestId] = new DataItem(
        this.requestId,
        RegistryTypes.UUID.getTag()
      );
    }

    if (this.address) {
      map[Keys.address] = this.address;
    }

    if (this.origin) {
      map[Keys.origin] = this.origin;
    }

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();

    const requestId = map[Keys.requestId]
      ? map[Keys.requestId].getData()
      : undefined;

    return new TronSignRequest({
      requestId,
      signData: map[Keys.signData],
      dataType: map[Keys.dataType],
      derivationPath: CryptoKeypath.fromDataItem(map[Keys.derivationPath]),
      address: map[Keys.address],
      origin: map[Keys.origin],
    });
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return TronSignRequest.fromDataItem(dataItem);
  };

  public static parsePath(path: string, xfp: string) {
    const paths = path.replace(/[m|M]\//, "").split("/");
    const pathComponent = paths.map(path => {
      const index = parseInt(path.replace("'", ""));
      let isHardened = false;
      if (path.endsWith("'")) {
        isHardened = true;
      }
      return new PathComponent({ index, hardened: isHardened });
    });
    return new CryptoKeypath(pathComponent, Buffer.from(xfp, "hex"));
  }

  public static constructTronRequest(
    signData: Buffer,
    dataType: DataType,
    derivationHDPath: string,
    xfp: string,
    uuidString?: string,
    address?: Buffer,
    origin?: string
  ) {
    return new TronSignRequest({
      requestId: uuidString ? Buffer.from(uuidParse(uuidString) as Uint8Array) : undefined,
      signData,
      dataType,
      derivationPath: TronSignRequest.parsePath(derivationHDPath, xfp),
      address,
      origin,
    });
  }
}

