import { NextResponse } from 'next/server';

// Cache for responses to avoid hitting rate limits
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 60 * 1000; // 1 minute cache

/**
 * API route that serves as a proxy to DexScreener API
 * Handles caching and error handling
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    
    // Get parameters from the request
    const chainId = params.get('chainId');
    const tokenAddress = params.get('tokenAddress');
    const pairAddress = params.get('pairAddress');
    
    // Validate required parameters
    if (!chainId && !tokenAddress && !pairAddress) {
      return NextResponse.json(
        { error: 'Either tokenAddress or pairAddress parameter is required' },
        { status: 400 }
      );
    }

    // Construct the cache key based on parameters
    const cacheKey = `${chainId || ''}-${tokenAddress || ''}-${pairAddress || ''}`;
    
    // Check if we have a valid cached response
    const now = Date.now();
    if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
      return NextResponse.json(cache[cacheKey].data);
    }

    // Construct the DexScreener API URL based on the parameters
    let dexScreenerUrl: string;
    if (pairAddress) {
      dexScreenerUrl = `https://api.dexscreener.com/latest/dex/pairs/${chainId}/${pairAddress}`;
    } else if (tokenAddress) {
      dexScreenerUrl = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
    } else {
      dexScreenerUrl = `https://api.dexscreener.com/latest/dex/pairs/${chainId}`;
    }

    // Fetch data from DexScreener API
    const response = await fetch(dexScreenerUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DexScreener API error:', response.status, errorText);
      return NextResponse.json(
        { error: `DexScreener API error: ${response.status}` },
        { status: response.status }
      );
    }

    // Parse and cache the response
    const data = await response.json();
    cache[cacheKey] = { data, timestamp: now };
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in DexScreener API proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}