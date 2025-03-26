import {
  SANCTIONED_ADDRESSES,
  OFAC_SANCTIONS_LIST_URL,
  COMPLIANT_ERROR_RESPONSE,
} from "@celo/compliance";
import assert from "node:assert";

console.log("@celo/compliance can be imported as a ESM module");
assert(Array.isArray(SANCTIONED_ADDRESSES) && SANCTIONED_ADDRESSES.length > 0);
assert(
  SANCTIONED_ADDRESSES.every((address) => /(0x[a-f0-9]{40})/.test(address))
);
assert((URL.parse || URL.canParse)(OFAC_SANCTIONS_LIST_URL));
assert(COMPLIANT_ERROR_RESPONSE);
