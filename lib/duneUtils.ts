// lib/duneUtils.ts

/**
 * Extracts a query ID from various Dune URL formats or IDs
 */
export function extractDuneQueryId(input: string | null): string | null {
    if (!input) return null;
    
    // Already a numeric ID
    if (/^\d+$/.test(input)) {
      return input;
    }
    
    try {
      // Handle full URLs like https://dune.com/queries/3730971/6275008
      if (input.includes('dune.com/queries/')) {
        const matches = input.match(/dune\.com\/queries\/(\d+)/);
        if (matches && matches[1]) {
          return matches[1];
        }
      }
      
      // Handle embed URLs like https://dune.com/embeds/3730971/6275008
      if (input.includes('dune.com/embeds/')) {
        const matches = input.match(/dune\.com\/embeds\/(\d+)/);
        if (matches && matches[1]) {
          return matches[1];
        }
      }
      
      // Handle old format: https://dune.xyz/queries/...
      if (input.includes('dune.xyz/queries/')) {
        const matches = input.match(/dune\.xyz\/queries\/(\d+)/);
        if (matches && matches[1]) {
          return matches[1];
        }
      }
      
      // Handle format: dune.com/user/queries/123
      const userQueryMatches = input.match(/dune\.com\/[^\/]+\/queries\/(\d+)/);
      if (userQueryMatches && userQueryMatches[1]) {
        return userQueryMatches[1];
      }
    } catch (error) {
      console.error('Error extracting Dune query ID:', error);
    }
    
    return null;
  }
  
  /**
   * Validates if a query ID is in the correct format
   */
  export function isValidDuneQueryId(queryId: string | null): boolean {
    if (!queryId) return false;
    
    // Valid query IDs are numeric
    return /^\d+$/.test(queryId);
  }
  
  /**
   * Formats various Dune URL inputs into consistent formats
   */
  export function formatDuneUrls(queryId: string | null): {
    embedUrl: string;
    directUrl: string;
    iframeEmbedUrl: string;
    apiUrl: string;
  } {
    const id = extractDuneQueryId(queryId) || '0';
    
    return {
      // URL to view the query on Dune
      directUrl: `https://dune.com/queries/${id}`,
      
      // URL for the embedded visualization
      embedUrl: `https://dune.com/embeds/${id}`,
      
      // URL specifically for iframe embeds
      iframeEmbedUrl: `https://dune.com/embeds/query/${id}`,
      
      // API URL for executing the query
      apiUrl: `https://api.dune.com/api/v1/query/${id}/execute`
    };
  }
  
  /**
   * Try to determine the type of analytics from query ID or name
   */
  export function guessAnalyticsType(queryId: string | null, title?: string): string {
    // Default to a generic type
    return 'dashboard';
  }