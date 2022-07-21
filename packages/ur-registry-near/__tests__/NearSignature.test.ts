// @ts-nocheck

import { NearSignature } from "../src";
import * as uuid from "uuid";

describe("near-signature", () => {
  it("test should generate near-signature", () => {
    const signature = Buffer.from(
      "47e7b510784406dfa14d9fd13c3834128b49c56ddfc28edb02c5047219779adeed12017e2f9f116e83762e86f805c7311ea88fb403ff21900e069142b1fb310e",
      "hex"
    );
    const nearRequestId = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
    const idBuffer = uuid.parse(nearRequestId) as Uint8Array;

    const nearSignature = new NearSignature([signature,signature], Buffer.from(idBuffer));

    const cborHex = nearSignature.toCBOR().toString("hex");
    const ur = nearSignature.toUREncoder(1000).nextPart();
    expect(ur).toBe(
      "ur:near-signature/oeadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaolfhdfzflvdrebeksfyamuroygtnettfneteebglugaskjnursamnuyaoskaajpcfktnyuewebgadkbdlnebyjtlskodmlnyaahstehckpdmyqzaxzmclmhbaammefwpazoehbahdfzflvdrebeksfyamuroygtnettfneteebglugaskjnursamnuyaoskaajpcfktnyuewebgadkbdlnebyjtlskodmlnyaahstehckpdmyqzaxzmclmhbaammefwpazoehbarnladwpy"
    );
    const nearSignatureDecoded = NearSignature.fromCBOR(
      Buffer.from(cborHex, "hex")
    );
    expect(uuid.stringify(nearSignatureDecoded.getRequestId())).toBe(
      nearRequestId
    );
    expect(nearSignatureDecoded.getSignature()[0].toString("hex")).toEqual(
      "47e7b510784406dfa14d9fd13c3834128b49c56ddfc28edb02c5047219779adeed12017e2f9f116e83762e86f805c7311ea88fb403ff21900e069142b1fb310e"
    );
    expect(nearSignatureDecoded.getSignature()[1].toString("hex")).toEqual(
        "47e7b510784406dfa14d9fd13c3834128b49c56ddfc28edb02c5047219779adeed12017e2f9f116e83762e86f805c7311ea88fb403ff21900e069142b1fb310e"
    );
  });
});
