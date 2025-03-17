// components/DuneData.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  BarChart3, RefreshCw, ExternalLink, LineChart as LineChartIcon, 
  PieChart as PieChartIcon, List, Table as TableIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, Legend, Sector,
  ScatterChart, Scatter, ZAxis
} from 'recharts';

interface DuneDataProps {
  queryId: string | null;
  title?: string;
  apiKey?: string;
  preferredChartType?: string;
}

interface DuneResponse {
  execution_id: string;
  query_id: number;
  state: string;
  result?: {
    rows: any[];
    metadata: {
      column_names: string[];
      column_types: string[];
    };
  };
  error?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_DUNE_API_KEY || "YOUR_API_KEY_HERE";

// Chart type options
type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'counter' | 'table' | 'scatter';

// COLORS for visualizations
const COLORS = ['#F7984A', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const DuneData: React.FC<DuneDataProps> = ({ 
  queryId, 
  title = "Analytics",
  apiKey = API_KEY,
  preferredChartType
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnTypes, setColumnTypes] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [activeIndex, setActiveIndex] = useState(0); // For pie chart active sector

  const fetchDuneData = async (id: string) => {
    try {
      setLoading(true);
      
      // Make request to Dune API
      const response = await fetch(`https://api.dune.com/api/v1/query/${id}/results`, {
        method: 'GET',
        headers: {
          'x-dune-api-key': apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const duneData: DuneResponse = await response.json();
      
      if (duneData.state !== "QUERY_STATE_COMPLETED") {
        throw new Error(`Query not completed: ${duneData.state}`);
      }
      
      if (!duneData.result?.rows) {
        throw new Error('No data returned from query');
      }
      
      setData(duneData.result.rows);
      setColumns(duneData.result.metadata.column_names);
      setColumnTypes(duneData.result.metadata.column_types);
      
      // Auto-detect chart type based on data
      if (!preferredChartType) {
        detectChartType(duneData.result.rows, duneData.result.metadata.column_names, duneData.result.metadata.column_types);
      } else {
        setChartType(preferredChartType as ChartType);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching Dune data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const detectChartType = (rows: any[], columnNames: string[], columnTypes: string[]) => {
    // Single value counter
    if (rows.length === 1 && Object.keys(rows[0]).length === 1) {
      setChartType('counter');
      return;
    }
    
    // Few rows with one or two columns - potentially a pie chart
    if (rows.length <= 10 && columnNames.length <= 2) {
      // One numeric and one categorical column
      const hasNumericColumn = columnTypes.some(type => 
        type.includes('int') || type.includes('double') || type.includes('float'));
      
      if (hasNumericColumn) {
        setChartType('pie');
        return;
      }
    }
    
    // Small dataset with multiple categorical columns - bar chart
    if (rows.length <= 20 && columnNames.length > 1) {
      const numericColumns = columnNames.filter((_, i) => 
        columnTypes[i].includes('int') || 
        columnTypes[i].includes('double') || 
        columnTypes[i].includes('float')
      );
      
      if (numericColumns.length > 0) {
        setChartType('bar');
        return;
      }
    }
    
    // Check for time series data (date/timestamp column + numeric column)
    const hasDateColumn = columnNames.some((name, index) => {
      const type = columnTypes[index];
      return type.includes('date') || type.includes('time') || 
             name.toLowerCase().includes('date') || name.toLowerCase().includes('time');
    });
    
    const hasNumericColumn = columnNames.some((name, index) => {
      const type = columnTypes[index];
      return type.includes('int') || type.includes('double') || 
             type.includes('float') || type.includes('decimal');
    });
    
    if (hasDateColumn && hasNumericColumn) {
      // Time series with more than 100 points looks better as area chart
      setChartType(rows.length > 100 ? 'area' : 'line');
      return;
    }
    
    // Two numeric columns might be scatter plot
    const numericColumns = columnNames.filter((_, i) => 
      columnTypes[i].includes('int') || 
      columnTypes[i].includes('double') || 
      columnTypes[i].includes('float')
    );
    
    if (numericColumns.length >= 2) {
      setChartType('scatter');
      return;
    }
    
    // Many rows with multiple columns - table view
    if (rows.length > 20 || columnNames.length > 3) {
      setChartType('table');
      return;
    }
    
    // Default to bar chart for other data types
    setChartType('bar');
  };

  useEffect(() => {
    if (queryId) {
      fetchDuneData(queryId);
    }
  }, [queryId]);

  const handleRefresh = () => {
    if (!queryId || isRefreshing) return;
    
    setIsRefreshing(true);
    fetchDuneData(queryId);
  };

  const handleChartTypeChange = () => {
    // Cycle through chart types based on data characteristics
    const chartTypes: ChartType[] = ['bar', 'line', 'area', 'pie', 'scatter', 'table'];
    const currentIndex = chartTypes.indexOf(chartType);
    const nextIndex = (currentIndex + 1) % chartTypes.length;
    setChartType(chartTypes[nextIndex]);
  };

  if (!queryId) {
    return null;
  }

  const duneUrl = `https://dune.com/queries/${queryId}`;

  // Format data for visualization
  const formatData = () => {
    if (!data || data.length === 0 || !columns || columns.length === 0) return [];
    
    // For counter display
    if (data.length === 1 && Object.keys(data[0]).length === 1) {
      const key = Object.keys(data[0])[0];
      const value = data[0][key];
      
      return [
        { name: key, value: parseFloat(value) }
      ];
    }
    
    // For pie chart - extract name/value pairs
    if (chartType === 'pie') {
      if (columns.length === 1) {
        // Count occurrences of each value
        const counts: Record<string, number> = {};
        data.forEach((row) => {
          const value = row[columns[0]];
          counts[value] = (counts[value] || 0) + 1;
        });
        
        return Object.entries(counts).map(([name, value]) => ({
          name,
          value
        }));
      } else {
        // Find a numeric column for values and use the other column for names
        const numericColumnIndex = columnTypes.findIndex(type => 
          type.includes('int') || type.includes('double') || type.includes('float'));
        
        if (numericColumnIndex >= 0) {
          const nameColumn = columns[numericColumnIndex === 0 ? 1 : 0];
          const valueColumn = columns[numericColumnIndex];
          
          return data.map(row => ({
            name: row[nameColumn],
            value: parseFloat(row[valueColumn])
          }));
        }
      }
    }
    
    // For scatter plot
    if (chartType === 'scatter') {
      const numericColumns = columns.filter((_, i) => 
        columnTypes[i].includes('int') || 
        columnTypes[i].includes('double') || 
        columnTypes[i].includes('float')
      );
      
      if (numericColumns.length >= 2) {
        return data.map(row => ({
          x: parseFloat(row[numericColumns[0]]),
          y: parseFloat(row[numericColumns[1]]),
          z: numericColumns.length > 2 ? parseFloat(row[numericColumns[2]]) : 1
        }));
      }
    }
    
    // For time series, find the date column and numeric columns
    const dateColumn = columns.find((col, index) => {
      const type = columnTypes[index];
      return type.includes('date') || type.includes('time') || col.toLowerCase().includes('date');
    });
    
    const numericColumns = columns.filter((col, index) => {
      const type = columnTypes[index];
      return type.includes('int') || type.includes('double') || type.includes('float') || type.includes('decimal');
    });
    
    if (dateColumn && numericColumns.length > 0 && (chartType === 'line' || chartType === 'area')) {
      // Sample data if there are too many points
      let sampledData = data;
      if (data.length > 200) {
        const sampleRate = Math.ceil(data.length / 200);
        sampledData = data.filter((_, index) => index % sampleRate === 0);
        // Always include the last point for continuity
        if (sampledData[sampledData.length - 1] !== data[data.length - 1]) {
          sampledData.push(data[data.length - 1]);
        }
      }
      
      return sampledData.map(row => {
        const result: any = {
          date: row[dateColumn]
        };
        
        numericColumns.forEach(col => {
          result[col] = parseFloat(row[col]);
        });
        
        return result;
      });
    }
    
    // For other data, return as is with proper formatting
    return data.map(row => {
      const result: any = {};
      Object.entries(row).forEach(([key, value]) => {
        if (typeof value === 'number') {
          result[key] = value;
        } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
          result[key] = parseFloat(value);
        } else {
          result[key] = value;
        }
      });
      return result;
    });
  };

  // Pie chart active sector handler
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#fff" fontSize={14}>
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#fff" fontSize={16} fontWeight="bold">
          {value.toLocaleString()}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#999" fontSize={12}>
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  const renderChart = () => {
    const chartData = formatData();
    
    if (chartData.length === 0) {
      return (
        <div className="w-full h-64  rounded-lg flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      );
    }
    
    // Counter display for single values
    if (chartType === 'counter' || (chartData.length === 1 && Object.keys(chartData[0]).length === 2)) {
      const value = chartData[0].value;
      
      return (
        <div className="w-full h-64 rounded-lg flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">{chartData[0].name}</h3>
          <div className="text-5xl font-bold text-[#F7984A]">
            {typeof value === 'number' ? value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            }) : value}
          </div>
        </div>
      );
    }
    
    // Pie Chart
    if (chartType === 'pie') {
      return (
        <div className="w-full h-64 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0D0B26', 
                  border: '1px solid #333',
                  borderRadius: '4px',
                  color: '#fff' 
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }
    
    // Table view for tabular data
    if (chartType === 'table') {
      // Display first 10 rows in a simple table
      const displayData = data?.slice(0, 10) || [];
      const columnHeaders = columns || [];
      
      return (
        <div className="w-full h-64 rounded-lg p-4 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                {columnHeaders.map((header, idx) => (
                  <th key={idx} className="p-2 text-xs font-medium text-gray-400">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, rowIdx) => (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-[#07071C]' : 'bg-[#0A0A23]'}>
                  {columnHeaders.map((col, colIdx) => (
                    <td key={colIdx} className="p-2 text-xs text-gray-300 truncate max-w-[150px]">
                      {typeof row[col] === 'number' 
                        ? row[col].toLocaleString(undefined, {maximumFractionDigits: 4}) 
                        : String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.length > 10 && (
            <div className="mt-2 text-xs text-gray-400 text-center">
              Showing 10 of {data.length} rows
            </div>
          )}
        </div>
      );
    }
    
    // Scatter Plot
    if (chartType === 'scatter') {
      return (
        <div className="w-full h-64 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="x" 
                stroke="#999" 
                tick={{ fill: '#999', fontSize: 10 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="y" 
                stroke="#999" 
                tick={{ fill: '#999', fontSize: 10 }}
              />
              <ZAxis type="number" dataKey="z" range={[20, 200]} name="z" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: '#0D0B26', 
                  border: '1px solid #333',
                  borderRadius: '4px',
                  color: '#fff' 
                }} 
              />
              <Scatter name="Values" data={chartData} fill="#F7984A" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      );
    }
    
    // Determine X and Y axes for line/area/bar charts
    const dateColumn = Object.keys(chartData[0]).find(key => key.toLowerCase().includes('date'));
    const xAxisKey = dateColumn || 'date' in chartData[0] ? 'date' : Object.keys(chartData[0])[0];
    
    // Filter out the x-axis key to get y-axis keys
    const yAxisKeys = Object.keys(chartData[0]).filter(key => 
      key !== xAxisKey && typeof chartData[0][key] === 'number'
    );
    
    // Line chart for time series
    if (chartType === 'line') {
      return (
        <div className="w-full h-64 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#999" 
                tick={{ fill: '#999', fontSize: 10 }}
              />
              <YAxis stroke="#999" tick={{ fill: '#999', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0D0B26', 
                  border: '1px solid #333',
                  borderRadius: '4px',
                  color: '#fff' 
                }} 
              />
              <Legend />
              {yAxisKeys.map((key, index) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[index % COLORS.length]}
                  activeDot={{ r: 8 }}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }
    
    // Area chart for time series (better for many points)
    if (chartType === 'area') {
      return (
        <div className="w-full h-64 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#999" 
                tick={{ fill: '#999', fontSize: 10 }}
              />
              <YAxis stroke="#999" tick={{ fill: '#999', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0D0B26', 
                  border: '1px solid #333',
                  borderRadius: '4px',
                  color: '#fff' 
                }} 
              />
              <Legend />
              {yAxisKeys.map((key, index) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[index % COLORS.length]}
                  fill={`${COLORS[index % COLORS.length]}30`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    }
    
    // Bar chart
    return (
      <div className="w-full h-64 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="#999" 
              tick={{ fill: '#999', fontSize: 10 }}
            />
            <YAxis stroke="#999" tick={{ fill: '#999', fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0D0B26', 
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#fff' 
              }} 
            />
            <Legend />
            {yAxisKeys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Icon for current chart type
  const renderChartTypeIcon = () => {
    switch (chartType) {
      case 'bar': return <BarChart3 className="h-4 w-4" />;
      case 'line': return <LineChartIcon className="h-4 w-4" />;
      case 'area': return <LineChartIcon className="h-4 w-4" />;
      case 'pie': return <PieChartIcon className="h-4 w-4" />;
      case 'table': return <TableIcon className="h-4 w-4" />;
      case 'scatter': return <PieChartIcon className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };


   // In DuneData.tsx
return (
  <div className="w-full">
    <div className="flex items-center justify-between mb-4">
      {title && (
        <div className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#F7984A]" />
          {title}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={handleChartTypeChange}
          title="Change chart type"
        >
          {renderChartTypeIcon()}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
        
        <Link 
          href={duneUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#F7984A] hover:text-[#F7984A]/80 text-sm flex items-center gap-1"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
    <div>
      {loading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-t-[#F7984A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="w-full h-64 flex flex-col items-center justify-center text-center p-4">
          <p className="text-red-400 mb-2">{error}</p>
          <p className="text-sm text-gray-400 mb-4">There was an error loading the analytics data.</p>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-[#F7984A]/50 text-[#F7984A]"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing && <RefreshCw className="h-3 w-3 mr-2 animate-spin" />}
              Try Again
            </Button>
            
            <Link 
              href={duneUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-700 text-gray-300"
              >
                View on Dune
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {renderChart()}
        </>
      )}
    </div>
  </div>
);
};

export default DuneData;