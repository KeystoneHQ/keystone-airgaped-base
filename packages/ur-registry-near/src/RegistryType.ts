import { RegistryType } from "@keystonehq/bc-ur-registry";

export const ExtendedRegistryTypes = {
  NEAR_SIGN_REQUEST: new RegistryType("near-sign-request", 2101),
  NEAR_SIGNATURE: new RegistryType("near-signature", 2102),
  CRYPTO_MULTI_ACCOUNTS: new RegistryType("crypto-multi-accounts", 2103)
};
