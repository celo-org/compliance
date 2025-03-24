export { default as SANCTIONED_ADDRESSES } from "../ofac.sanctions.json" with { type: "json" };
export const OFAC_SANCTIONS_LIST_URL =
  "https://celo-org.github.io/compliance/ofac.sanctions.json";
export const COMPLIANT_ERROR_RESPONSE =
  "'The wallet address has been sanctioned by the U.S. Department of the Treasury.'" +
  "'All U.S. persons are prohibited from accessing, receiving, accepting, or facilitating any property " +
  "'and interests in property (including use of any technology, software or software patch(es)) of these" +
  "'designated digital wallet addresses.  These prohibitions include the making of any contribution or'" +
  "'provision of funds, goods, or services by, to, or for the benefit of any blocked person and the '" +
  "'receipt of any contribution or provision of funds, goods, or services from any such person and ' " +
  "'all designated digital asset wallets.'";
