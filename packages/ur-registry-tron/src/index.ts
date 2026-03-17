import { patchTags } from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";
export * from "@keystonehq/bc-ur-registry";

patchTags(
  Object.values(ExtendedRegistryTypes)
    .filter(rt => !!rt.getTag())
    .map(rt => rt.getTag()) as number[]
);

export { TronSignRequest, DataType } from "./TronSignRequest";
export { TronSignature } from "./TronSignature";
