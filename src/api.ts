import axios from "axios";

export async function SanctionedAddressAPI(): Promise<string[]> {
  return await axios
    .get(
      "https://raw.githubusercontent.com/celo-org/compliance/main/ofac.sanctions.json?token=GHSAT0AAAAAAB5WK5QXU253UPDZXXMMON7YY64DONA"
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
