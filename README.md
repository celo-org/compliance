# @celo/compliance

A simple package to help you stay compliant with OFAC sanctioned addresses (e.g. front-ends, other
applicable products).

## Purpose

This package simplifies the process of staying up-to-date with the latest OFAC sanctioned addresses
by providing them in a JSON format via an API (recommended) or direct import (discouraged).

## Update Cadence

> [!IMPORTANT] Please note that there is currently no SLA for how quickly the repository will be
> updated to reflect the most recent OFAC sanctioned addresses. Updates will be done on a
> best-effort basis.

## Usage

### Option 1: Make an API call (recommended)

You can make an API call to retrieve the latest OFAC sanctions list from

```sh
https://celo-org.github.io/compliance/ofac.sanctions.json
```

For example:

```typescript
export async function getSanctionedAddresses(): Promise<string[]> {
    return await fetch("https://celo-org.github.io/compliance/ofac.sanctions.json")
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            console.log(err);
        });
}
```

> [!TIP] No changes to your code will be necessary when the list is updated as this API will always
> return the latest version.

### Option 2: Import the SANCTIONED_ADDRESSES list (discouraged)

[import the SDK](https://www.npmjs.com/package/@celo/compliance)

If you really want to, you can explicitly import the `SANCTIONED_ADDRESSES` list exported in the 
[`@celo/compliance`](https://www.npmjs.com/package/@celo/compliance) package directly into your code.

> [!WARNING] 
> Although, please note that this is not recommended as it will require you to update your dependency
> every time the list is updated.

```typescript
import { SANCTIONED_ADDRESSES } from "@celo/compliance";

export function getSanctionedAddresses(): string[] {
    return SANCTIONED_ADDRESSES;
}
```
