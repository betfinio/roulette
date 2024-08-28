# Template for betfin.io applications

## Setup

Rename:

`.env.production.local.example` -> `.env.production.local`

`.env.development.local.example` -> `.env.development.local`

Install the dependencies:

```bash
bun i
```

## Get Started

Run application with connection to the testnet network(currently Polygon Amoy - 80002):

```bash
bun run dev
```

Run application with connection to the mainnet network(Polygon - 137):

```bash
bun run build
```

## Testnet Faucet

To get testnet BET tokens, please send your address to the following telegram
account: [@bf_monster](https://t.me/bf_monster)
or write to email: [bf.monster@proton.me](mailto:bf.monster@proton.me)

To get testnet MATIC tokens, please use the following
faucet: [https://faucet.polygon.technology/](https://faucet.polygon.technology/)

## UI components and shared functions/utils/hooks

To use basic UI components, you can import them from the `betfin_app` package:

```tsx
import {Select, SelectItem, SelectContent, SelectTrigger, SelectValue} from "betfinio_app/select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from 'betfinio_app/tabs';
import {
	useTotalProfitStat,
	useTotalStakedStat,
	useTotalStakersStat,
} from 'betfinio_app/lib/query/dynamic';
```

List of all available components and hooks are located and updated in [components](APP.md) .