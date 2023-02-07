# compliance sdk
A simple package to help ensure compliance with OFAC sanctions by updating code bases (e.g. front-ends, other applicable products)
with the latest no-fly addresses list. 

## Purpose
The Compliance SDK aims to simplify the process of staying up-to-date with the latest OFAC sanctioned addresses by centralizing them in one place.

## Update Cadence
Please note that there is currently no SLA for how quickly the repository will be updated to reflect the most recent OFAC sanctioned addresses. Updates will be done on a best-effort basis.

## Usage
To get started, [import the SDK](https://www.npmjs.com/package/compliance-sdk) into your project. Then, choose one of the following options:

### Option One: Import the SANCTIONED_ADDRESSES list
You can import the SANCTIONED_ADDRESSES list directly into your code. 
**Please note** that when the list is updated and published to the NPM registry, you will need to update your dependency accordingly.

### Option Two: Make an API call
Alternatively, you can make an API call to retrieve the latest OFAC sanctions list. Here's an example in TypeScript:

```typescript
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
```

**note**: No changes to your code will be necessary when the list is updated as this API will always return the latest version.  