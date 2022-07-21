import { Purpose } from "./types";

export const purposeToURType: Record<Purpose, string[]> = {
  [Purpose.SYNC]: ["crypto-hdkey", "crypto-account"],
  [Purpose.SIGN]: ["eth-signature"],
  [Purpose.SOL_SYNC]: ["crypto-multi-accounts"],
  [Purpose.SOL_SIGN]: ["sol-signature"],
  [Purpose.NEAR_SYNC]: ["crypto-multi-accounts"],
  [Purpose.NEAR_SIGN]: ["near-signature"],
};
