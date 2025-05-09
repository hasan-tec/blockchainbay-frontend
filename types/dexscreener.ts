export interface DexScreenerPairData {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string | null;
  txns?: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    m5: number | null;
    h1: number | null;
    h6: number | null;
    h24: number | null;
  };
  priceChange: {
    m5: number | null;
    h1: number | null;
    h6: number | null;
    h24: number | null;
  };
  liquidity?: {
    usd: number | null;
    base: number;
    quote: number;
  };
  fdv?: number | null;
  url: string;
}

export interface DexScreenerTokenPairsResponse {
  schemaVersion: string;
  pairs: DexScreenerPairData[];
}

export interface DexScreenerPairResponse {
  schemaVersion: string;
  pair: DexScreenerPairData;
}