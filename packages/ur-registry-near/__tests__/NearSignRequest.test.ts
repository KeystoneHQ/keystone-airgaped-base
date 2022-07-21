// @ts-nocheck

import { NearSignRequest } from "../src";
import { CryptoKeypath, PathComponent } from "../src";
import * as uuid from "uuid";

describe("near-sign-request", () => {
  it("test should generate near-sign-request", () => {
    const nearData = Buffer.from(
      "8e53e7b10656816de70824e3016fc1a277e77825e12825dc4f239f418ab2e04e",
      "hex"
    );

    const signKeyPath = new CryptoKeypath(
      [
        new PathComponent({ index: 44, hardened: true }),
        new PathComponent({ index: 397, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
        new PathComponent({ index: 1, hardened: true }),
      ],
      Buffer.from("78230804", "hex")
    );

    const nearRequestId = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
    const idBuffer = uuid.parse(nearRequestId) as Uint8Array;

    const nearSignRequest = new NearSignRequest({
      signData: [nearData, nearData],
      derivationPath: signKeyPath,
      requestId: Buffer.from(idBuffer),
      origin: "nearwallet",
    });

    const cborHex = nearSignRequest.toCBOR().toString("hex");
    const ur = nearSignRequest.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      "ur:near-sign-request/oxadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaolfhdcxmnguvdpaamhflyjnvdaydkvladjlseoektvdksdavydedauogwcnnefpleprvtglhdcxmnguvdpaamhflyjnvdaydkvladjlseoektvdksdavydedauogwcnnefpleprvtglaxtaaddyoeadlecsdwykcfadlgykaeykaeykadykaocykscnayaaahimjtihhsjpkthsjzjzihjyrdahdssk"
    );
    const nearSignRequestDecoded = NearSignRequest.fromCBOR(
      Buffer.from(cborHex, "hex")
    );
    expect(uuid.stringify(nearSignRequest.getRequestId())).toBe(nearRequestId);
    expect(nearSignRequest.getOrigin()).toBe("nearwallet");
    expect(nearSignRequestDecoded.getSignData()[0].toString("hex")).toEqual(
      "8e53e7b10656816de70824e3016fc1a277e77825e12825dc4f239f418ab2e04e"
    );
    expect(nearSignRequestDecoded.getSignData()[1].toString("hex")).toEqual(
      "8e53e7b10656816de70824e3016fc1a277e77825e12825dc4f239f418ab2e04e"
    );
  });

  it("should construct an nearSignRequest object from string", () => {
    const hdPath = "M/44'/397'/0'/0'/1'";
    const xfp = "78230804";
    const nearData = Buffer.from(
      "8e53e7b10656816de70824e3016fc1a277e77825e12825dc4f239f418ab2e04e",
      "hex"
    );
    const requestID = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";

    const request = NearSignRequest.constructNearRequest(
      nearData,
      hdPath,
      xfp,
      requestID,
      undefined,
      "nearwallet"
    );
    const ur = request.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      "ur:near-sign-request/oxadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaohdcxmnguvdpaamhflyjnvdaydkvladjlseoektvdksdavydedauogwcnnefpleprvtglaxtaaddyoeadlecsdwykcfadlgykaeykaeykadykaocykscnayaaahimjtihhsjpkthsjzjzihjyosgaaxlp"
    );
  });
});
