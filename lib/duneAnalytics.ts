// lib/duneAnalytics.ts

interface DuneExecutionResponse {
    execution_id: string;
    state: string;
  }
  
  interface DuneExecutionResult {
    execution_id: string;
    query_id: number;
    state: string;
    submitted_at: string;
    expires_at: string;
    execution_started_at: string;
    execution_ended_at: string;
    result?: {
      rows: any[];
      metadata: {
        column_names: string[];
        column_types: string[];
      };
    };
  }
  
  interface QueryMetadata {
    id: number;
    name: string;
    description: string;
    parameters: any[];
    query_type: string;
    visualizations: {
      id: number;
      type: string;
      name: string;
      options: any;
    }[];
  }
  
  export interface DuneChartData {
    queryId: number;
    chartType: string;
    title: string;
    data: any[];
    columns: string[];
    options: any;
    error?: string;
  }
  
  /**
   * Service for interacting with the Dune Analytics API
   */
  export class DuneAnalyticsService {
    private apiKey: string;
    private baseUrl: string = 'https://api.dune.com/api/v1';
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
    /**
     * Executes a query and waits for the results
     */
    async executeQuery(queryId: string | null): Promise<DuneChartData | null> {
      // Early return if queryId is null
      if (!queryId) {
        return {
          queryId: 0,
          chartType: 'error',
          title: 'Error',
          data: [],
          columns: [],
          options: {},
          error: 'No query ID provided'
        };
      }
      try {
        // First, get query metadata to understand what type of chart it is
        const metadata = await this.getQueryMetadata(queryId);
        if (!metadata) {
          throw new Error('Unable to fetch query metadata');
        }
  
        // Initialize execution
        const execution = await this.initializeExecution(queryId);
        if (!execution?.execution_id) {
          throw new Error('Failed to start query execution');
        }
  
        // Wait for results with timeout
        const results = await this.waitForResults(execution.execution_id);
        if (!results?.result) {
          throw new Error('Query execution failed or timed out');
        }
  
        // Find primary visualization
        const primaryViz = metadata.visualizations.find(v => v.id === 1) || metadata.visualizations[0];
        if (!primaryViz) {
          throw new Error('No visualizations found for this query');
        }
  
        // Format data for our charting components
        return {
          queryId: metadata.id,
          chartType: primaryViz.type,
          title: metadata.name,
          data: results.result.rows,
          columns: results.result.metadata.column_names,
          options: primaryViz.options
        };
      } catch (error) {
        console.error('Dune API error:', error);
        return {
          queryId: parseInt(queryId),
          chartType: 'error',
          title: 'Error',
          data: [],
          columns: [],
          options: {},
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  
    /**
     * Get metadata about a query (visualization types, parameters, etc)
     */
    private async getQueryMetadata(queryId: string): Promise<QueryMetadata | null> {
      try {
        const response = await fetch(`${this.baseUrl}/queries/${queryId}`, {
          method: 'GET',
          headers: {
            'x-dune-api-key': this.apiKey
          }
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error fetching query metadata:', error);
        return null;
      }
    }
  
    /**
     * Initialize a query execution
     */
    private async initializeExecution(queryId: string): Promise<DuneExecutionResponse | null> {
      try {
        const response = await fetch(`${this.baseUrl}/query/${queryId}/execute`, {
          method: 'POST',
          headers: {
            'x-dune-api-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error initializing query execution:', error);
        return null;
      }
    }
  
    /**
     * Wait for results with polling and timeout
     */
    private async waitForResults(executionId: string, maxAttempts = 10): Promise<DuneExecutionResult | null> {
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        try {
          const response = await fetch(`${this.baseUrl}/execution/${executionId}/results`, {
            method: 'GET',
            headers: {
              'x-dune-api-key': this.apiKey
            }
          });
  
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
  
          const data: DuneExecutionResult = await response.json();
          
          if (data.state === 'QUERY_STATE_COMPLETED') {
            return data;
          }
          
          if (data.state === 'QUERY_STATE_FAILED') {
            throw new Error('Query execution failed');
          }
          
          // Wait before trying again
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
        } catch (error) {
          console.error('Error polling for results:', error);
          return null;
        }
      }
      
      console.error('Timeout waiting for query results');
      return null;
    }
  }
  
  // Create a singleton instance with environment variable
  export const duneService = new DuneAnalyticsService(
    process.env.NEXT_PUBLIC_DUNE_API_KEY || 'YOUR_API_KEY_HERE'
  );