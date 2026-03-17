// @ts-nocheck

import {
  TronSignRequest,
  CryptoKeypath,
  PathComponent,
  DataType
} from "../src";
import * as uuid from "uuid";

describe("tron-sign-request", () => {
  it("should generate tron-sign-request", () => {
    const tronData = Buffer.from(
      "0a0207902208e1b9de559665c6714080c49789bb2c5aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541c79f045e4d48ad8dae00e6a6714dae1e000adfcd1215410d292c98a5eca06c2085fff993996423cf66c93b2244a9059cbb0000000000000000000000009bbce520d984c3b95ad10cb4e32a9294e6338da300000000000000000000000000000000000000000000000000000000000f424070c0b6e087bb2c90018094ebdc03",
      "hex"
    );

    const signKeyPath = new CryptoKeypath(
      [
        new PathComponent({ index: 44, hardened: true }),
        new PathComponent({ index: 195, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
      ],
      Buffer.from("12121212", "hex")
    );

    const tronRequestId = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
    const idBuffer = uuid.parse(tronRequestId) as Uint8Array;

    const tronSignRequest = new TronSignRequest({
      requestId: Buffer.from(idBuffer),
      signData: tronData,
      dataType: DataType.transaction,
      derivationPath: signKeyPath,
      address: "",
      origin: "tron wallet",
    });

    const cborHex = tronSignRequest.toCBOR().toString("hex");
    const ur = tronSignRequest.toUREncoder(1000).nextPart();

    expect(ur).toBe(
      "ur:tron-sign-request/onadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaohdtybkaoatmhcpayvyrhuegomtihswjsfzlassmsldrkdwhtpladayctbgptadbkehjykkjoihdmiojljliojzihhsjoinjkdmiajljndljojpjljyjliajljzdmghjpinioioihjpgujnhsjpjyfxjljtjyjphsiajybgjybkbzfpstneaahygtfdpmlgplaevaoljsgtplckaebkursnbgbzfpbtdtdwmkonwpnbjzcxlpzmytmunliecntkiysofrcpfyptahnsrkaeaeaeaeaeaeaeaeaeaeaeaendrfvwcxtalrsrrhhtttbnqzvldrmomwvaeolgotaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaebsfwfzjortrpvtltrkdwmhadlamwwmuoaxaxadaataaddyoeadlocsdwykcssrykaeykaeykaocybgbgbgbgamjejyjpjljtcxkthsjzjzihjyjtrnneiy"
    );
    const tronSignRequestDecoded = TronSignRequest.fromCBOR(
      Buffer.from(cborHex, "hex")
    );
    expect(uuid.stringify(tronSignRequest.getRequestId())).toBe(
      tronRequestId
    );
    expect(tronSignRequest.getOrigin()).toBe("tron wallet");
    expect(tronSignRequestDecoded.getDataType()).toBe(1);
    expect(tronSignRequestDecoded.getSignData().toString("hex")).toEqual(
      "0a0207902208e1b9de559665c6714080c49789bb2c5aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541c79f045e4d48ad8dae00e6a6714dae1e000adfcd1215410d292c98a5eca06c2085fff993996423cf66c93b2244a9059cbb0000000000000000000000009bbce520d984c3b95ad10cb4e32a9294e6338da300000000000000000000000000000000000000000000000000000000000f424070c0b6e087bb2c90018094ebdc03"
    );
    expect(
      tronSignRequestDecoded.getDerivationPath()
    ).toEqual("44'/195'/0'/0'");
    expect(tronSignRequestDecoded.getAddress()).toEqual(undefined);
  });

  it("should construct an tronSignRequest object from string", () => {
    const derivationHdPath = "m/44'/195'/0'/0'";
    const xfp = "12121212";
    const tronData = Buffer.from(
      "0a0207902208e1b9de559665c6714080c49789bb2c5aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541c79f045e4d48ad8dae00e6a6714dae1e000adfcd1215410d292c98a5eca06c2085fff993996423cf66c93b2244a9059cbb0000000000000000000000009bbce520d984c3b95ad10cb4e32a9294e6338da300000000000000000000000000000000000000000000000000000000000f424070c0b6e087bb2c90018094ebdc03",
      "hex"
    );
    const requestID = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";

    const request = TronSignRequest.constructTronRequest(
      tronData,
      DataType.transaction,
      derivationHdPath,
      xfp,
      requestID,
      "",
      "tron wallet"
    );
    const ur = request.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      "ur:tron-sign-request/onadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaohdtybkaoatmhcpayvyrhuegomtihswjsfzlassmsldrkdwhtpladayctbgptadbkehjykkjoihdmiojljliojzihhsjoinjkdmiajljndljojpjljyjliajljzdmghjpinioioihjpgujnhsjpjyfxjljtjyjphsiajybgjybkbzfpstneaahygtfdpmlgplaevaoljsgtplckaebkursnbgbzfpbtdtdwmkonwpnbjzcxlpzmytmunliecntkiysofrcpfyptahnsrkaeaeaeaeaeaeaeaeaeaeaeaendrfvwcxtalrsrrhhtttbnqzvldrmomwvaeolgotaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaebsfwfzjortrpvtltrkdwmhadlamwwmuoaxaxadaataaddyoeadlocsdwykcssrykaeykaeykaocybgbgbgbgamjejyjpjljtcxkthsjzjzihjyjtrnneiy"
    );
  });
});
