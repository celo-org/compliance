import {
  SANCTIONED_ADDRESSES,
  OFAC_SANCTIONS_LIST_URL,
  COMPLIANT_ERROR_RESPONSE,
} from "@celo/compliance";
import assert from "node:assert";

console.log("@celo/compliance can be imported in typescript");
assert(Array.isArray(SANCTIONED_ADDRESSES) && SANCTIONED_ADDRESSES.length > 0);
assert(
  SANCTIONED_ADDRESSES.every((address) => /(0x[a-f0-9]{40})/.test(address))
);
assert((URL.parse || URL.canParse)(OFAC_SANCTIONS_LIST_URL));
assert(COMPLIANT_ERROR_RESPONSE);

console.log("@celo/compliance is typed correctly");
type Expect<T extends true> = T;
type TypesMatch<T, U> = T extends U ? true : false;

type Tests = [
  Expect<TypesMatch<typeof SANCTIONED_ADDRESSES, readonly string[]>>,
  Expect<TypesMatch<typeof OFAC_SANCTIONS_LIST_URL, string>>,
  Expect<TypesMatch<typeof COMPLIANT_ERROR_RESPONSE, string>>
];
