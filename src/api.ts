import axios from "axios";

export async function SanctionedAddressAPI(): Promise<string[]> {
  return await axios
    .get(
      "https://celo-org.github.io/compliance/ofac.sanctions.json"
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
