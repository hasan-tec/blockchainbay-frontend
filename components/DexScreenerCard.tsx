"use client"
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, TrendingDown, Disc, DollarSign, BarChart3, AlertCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useDexScreener, getChainId } from "@/hooks/useDexScreener";
import { DexScreenerPairData } from "@/types/dexscreener";
import { Button } from "@/components/ui/button";

interface DexScreenerCardProps {
  tokenAddress?: string;
  chainType?: string;
  tokenSymbol?: string;
}

export default function DexScreenerCard({ tokenAddress, chainType, tokenSymbol }: DexScreenerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const chainId = chainType ? getChainId(chainType) : undefined;

  // Use our custom hook to fetch DEX data
  const { data: pairsData, isLoading, error, mostLiquidPair } = useDexScreener({
    tokenAddress,
    chainId,
    enabled: !!tokenAddress || !!chainId
  });
  
  // Format currency values
  const formatCurrency = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) return 'N/A';
    
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(4)}`;
    }
  };
  
  // Format percent values
  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    
    const formattedValue = (value * 100).toFixed(2);
    return `${formattedValue}%`;
  };

  // Is price change positive or negative?
  const getPriceChangeColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'text-gray-400';
    // Improved contrast for negative values - using a brighter red
    return value >= 0 ? 'text-green-500' : 'text-red-400';
  };

  // Get price trend icon
  const getPriceTrendIcon = (value: number | null | undefined) => {
    if (value === null || value === undefined) return null;
    return value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  // Get exchange name display
  const getExchangeName = (dexId: string) => {
    const dexNames: Record<string, string> = {
      'uniswap': 'Uniswap',
      'pancakeswap': 'PancakeSwap',
      'sushiswap': 'SushiSwap',
      'quickswap': 'QuickSwap',
      'trader_joe': 'Trader Joe',
      'spookyswap': 'SpookySwap',
      'raydium': 'Raydium',
      'orca': 'Orca',
      'meteora': 'Meteora'
    };

    return dexNames[dexId.toLowerCase()] || dexId;
  };

  // Get chain display name
  const getChainName = (chainId: string) => {
    const chainNames: Record<string, string> = {
      'ethereum': 'Ethereum',
      'bsc': 'BSC',
      'polygon': 'Polygon',
      'avalanche': 'Avalanche',
      'arbitrum': 'Arbitrum',
      'optimism': 'Optimism',
      'fantom': 'Fantom',
      'solana': 'Solana',
      'base': 'Base',
    };

    return chainNames[chainId.toLowerCase()] || chainId;
  };

  // If we have no token address or chain, show empty state
  if (!tokenAddress && !chainId) {
    return null;
  }

  return (
    <Card className="bg-[#0A0918] border border-gray-800/50 rounded-xl overflow-hidden shadow-lg mb-6">
      <div className="p-5 border-b border-gray-800/50">
        <h3 className="font-bold text-xl text-white flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-[#F7984A]" />
          {tokenSymbol || 'Token'} Market Data
        </h3>
      </div>

      <div className="p-5 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#F7984A]" />
          </div>
        ) : error || !pairsData || pairsData.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <AlertCircle className="h-10 w-10 mx-auto text-gray-400" />
            <p className="text-gray-400">
              {error 
                ? `Error loading market data: ${error.message}`
                : "No market data available for this token"}
            </p>
            {chainId && (
              <div className="text-sm text-gray-500">
                Chain: {getChainName(chainId)}
              </div>
            )}
            {tokenAddress && (
              <div className="text-sm text-gray-500">
                Token Address: {tokenAddress.substring(0, 6)}...{tokenAddress.substring(tokenAddress.length - 4)}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Main Market Stats - Always visible */}
            {mostLiquidPair && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Current Price</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">
                        {mostLiquidPair.priceUsd 
                          ? formatCurrency(mostLiquidPair.priceUsd) 
                          : mostLiquidPair.priceNative}
                      </span>
                      {mostLiquidPair.priceChange?.h24 !== null && mostLiquidPair.priceChange?.h24 !== undefined && (
                        <div className={`flex items-center ${getPriceChangeColor(mostLiquidPair.priceChange.h24)}`}>
                          {getPriceTrendIcon(mostLiquidPair.priceChange.h24)}
                          <span className="ml-1 text-sm font-medium">
                            {formatPercent(mostLiquidPair.priceChange.h24)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-[#0D0B26]/80 text-[#F7984A] border border-[#F7984A]/30 px-2 py-1">
                      <Disc className="h-3 w-3 mr-1" />
                      {getExchangeName(mostLiquidPair.dexId)}
                    </Badge>
                    <Badge className="bg-[#0D0B26]/80 text-blue-400 border border-blue-400/30 px-2 py-1">
                      {getChainName(mostLiquidPair.chainId)}
                    </Badge>
                    {mostLiquidPair.baseToken.symbol && mostLiquidPair.quoteToken.symbol && (
                      <Badge className="bg-[#0D0B26]/80 text-purple-400 border border-purple-400/30 px-2 py-1">
                        {mostLiquidPair.baseToken.symbol}/{mostLiquidPair.quoteToken.symbol}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                    <div className="text-sm text-gray-400 mb-1">24h Volume</div>
                    <div className="text-xl font-bold text-white">
                      {formatCurrency(mostLiquidPair.volume?.h24)}
                    </div>
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                    <div className="text-sm text-gray-400 mb-1">Liquidity</div>
                    <div className="text-xl font-bold text-white">
                      {formatCurrency(mostLiquidPair.liquidity?.usd)}
                    </div>
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                    <div className="text-sm text-gray-400 mb-1">FDV</div>
                    <div className="text-xl font-bold text-white">
                      {formatCurrency(mostLiquidPair.fdv)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expandable section - Only visible when expanded */}
            {expanded && pairsData.length > 0 && (
              <div className="mt-6 space-y-6">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
                
                <div>
                  <h4 className="text-lg font-bold mb-4 text-white">All Trading Pairs</h4>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {pairsData.map((pair, index) => (
                      <div 
                        key={pair.pairAddress || index}
                        className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-lg p-4 hover:border-gray-700/60 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                            </span>
                            <Badge className="bg-[#0D0B26]/80 text-gray-300 border border-gray-700 px-1.5 py-0 text-xs">
                              {getChainName(pair.chainId)}
                            </Badge>
                          </div>
                          <Badge className="bg-[#0D0B26] text-[#F7984A] border-none">
                            {getExchangeName(pair.dexId)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                          <div>
                            <div className="text-gray-400">Price</div>
                            <div className="font-medium text-white">{formatCurrency(pair.priceUsd)}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">24h</div>
                            <div className={`font-medium ${getPriceChangeColor(pair.priceChange?.h24)} bg-[#0D0B26] px-2 py-0.5 rounded inline-block`}>
                              {formatPercent(pair.priceChange?.h24)}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Volume</div>
                            <div className="font-medium text-white">{formatCurrency(pair.volume?.h24)}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Liquidity</div>
                            <div className="font-medium text-white">{formatCurrency(pair.liquidity?.usd)}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="ghost" 
                            size="sm"
                            className="text-[#F7984A] hover:text-[#F7984A]/80 hover:bg-[#F7984A]/10 p-1 h-auto"
                            onClick={() => window.open(pair.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Toggle button */}
            {pairsData.length > 1 && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-black hover:bg-white"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <div className="flex items-center">
                      <span className="mr-1">Show less</span>
                      <ChevronUp className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-1 ">Show all {pairsData.length} pairs</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}