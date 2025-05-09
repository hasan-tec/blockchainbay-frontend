import { useState, useEffect } from 'react';
import { DexScreenerTokenPairsResponse, DexScreenerPairData } from '@/types/dexscreener';

interface UseDexScreenerOptions {
  tokenAddress?: string;
  chainId?: string;
  enabled?: boolean;
}

interface UseDexScreenerResult {
  data: DexScreenerPairData[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  mostLiquidPair: DexScreenerPairData | null;
}

// Mapping of common blockchain names to DexScreener chainIds
const chainMapping: Record<string, string[]> = {
  'Ethereum': ['ethereum'],
  'BSC': ['bsc'],
  'Polygon': ['polygon'],
  'Avalanche': ['avalanche'],
  'Arbitrum': ['arbitrum'],
  'Optimism': ['optimism'],
  'Fantom': ['fantom'],
  'Solana': ['solana'],
  'Base': ['base'],
};

/**
 * Custom hook to fetch token data from DexScreener API
 */
export function useDexScreener({
  tokenAddress,
  chainId,
  enabled = true,
}: UseDexScreenerOptions): UseDexScreenerResult {
  const [data, setData] = useState<DexScreenerPairData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [fetchId, setFetchId] = useState<number>(0);

  // Find the most liquid pair from all pairs
  const mostLiquidPair = data?.reduce((prev, current) => {
    const prevLiquidity = prev?.liquidity?.usd || 0;
    const currentLiquidity = current?.liquidity?.usd || 0;
    return currentLiquidity > prevLiquidity ? current : prev;
  }, data[0] || null) || null;

  // Function to trigger a refetch
  const refetch = () => {
    setFetchId(prev => prev + 1);
  };

  useEffect(() => {
    // Skip fetching if disabled or no tokenAddress
    if (!enabled || (!tokenAddress && !chainId)) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Construct the API URL with parameters
        let url = '/api/dex-screener?';
        const params = new URLSearchParams();
        
        if (tokenAddress) {
          params.append('tokenAddress', tokenAddress);
        }
        
        if (chainId) {
          params.append('chainId', chainId);
        }
        
        url += params.toString();
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error fetching DexScreener data: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Set the pairs data
        if (responseData.pairs && Array.isArray(responseData.pairs)) {
          setData(responseData.pairs);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Error in useDexScreener hook:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tokenAddress, chainId, enabled, fetchId]);

  return {
    data,
    isLoading,
    error,
    refetch,
    mostLiquidPair,
  };
}

/**
 * Helper function to get DexScreener chainId from project ChainType
 */
export function getChainId(chainType: string): string | undefined {
  // Look up in the mapping
  const foundMapping = Object.entries(chainMapping).find(([key]) => 
    key.toLowerCase() === chainType.toLowerCase()
  );
  
  // Return the first chainId in the array if found
  return foundMapping?.[1][0];
}