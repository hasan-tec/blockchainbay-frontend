// lib/api.ts

// Use environment variable for the backend URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:1337';

// Define types for the Strapi API response
interface StrapiImage {
  id: number;
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  caption?: string;
  formats?: Record<string, any>;
}

interface StrapiRichTextNode {
  type: string;
  children: Array<{
    type: string;
    text: string;
  }>;
}


export interface GiveawayEntry {
  id: number;
  name: string;
  email: string;
  date: string;
  ip: string;
  verified: boolean;
}

interface StrapiGiveaway {
  id: number;
  Title: string;
  Description: StrapiRichTextNode[];
  StartDate: string;
  EndDate: string;
  GiveawayStatus: string;
  Prizes: StrapiRichTextNode[];
  Rules: StrapiRichTextNode[];
  Value: string;
  Image: StrapiImage;
  entries: GiveawayEntry[];
  slug: string | null;
}

interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Add or update these types in lib/api.ts

// Add views property to FormattedGiveaway when used in admin
export interface FormattedGiveaway {
    id: string;
    title: string;
    description: string;
    image: string;
    startDate: string;
    endDate: string;
    status: string;
    entries: number;
    daysLeft: number;
    value: string;
    slug: string;
    views?: number; // Optional for admin view
  }
  
  

// Create a type for the giveaway detail with additional fields
export interface GiveawayDetail extends FormattedGiveaway {
  prizes: string[];
  rules: string[];
}

/**
 * Fetches all giveaways with related data
 */
export async function fetchGiveaways(): Promise<StrapiResponse<StrapiGiveaway>> {
  try {
    const response = await fetch(`${API_URL}/api/giveaways?populate=*`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching giveaways:', error);
    throw error;
  }
}

/**
 * Formats the raw API data into a structure that works with our UI
 */
export function formatGiveawayData(apiData: StrapiResponse<StrapiGiveaway>): FormattedGiveaway[] {
  if (!apiData?.data) return [];
  
  return apiData.data.map(item => {
    // Parse description from blocks format
    const description = item.Description?.[0]?.children?.[0]?.text || '';
    
    // Format image URL (Strapi stores relative URLs)
    const imageUrl = item.Image?.url ? `${API_URL}${item.Image.url}` : '';
    
    // Calculate days left
    const endDate = new Date(item.EndDate);
    const today = new Date();
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Format dates for display
    const startDateFormatted = new Date(item.StartDate).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
    
    const endDateFormatted = new Date(item.EndDate).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
    
    return {
      id: item.id.toString(),
      title: item.Title || "",
      description: description,
      image: imageUrl,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      status: item.GiveawayStatus || "active",
      entries: item.entries?.length || 0,
      daysLeft: daysLeft,
      value: item.Value || "",
      slug: item.slug || item.id.toString(),
    };
  });
}

/**
 * Fetches a single giveaway by slug or ID
 */
export async function fetchGiveawayBySlug(slugOrId: string): Promise<StrapiGiveaway | null> {
  try {
    // Try to fetch by slug first
    let query = `filters[slug]=${encodeURIComponent(slugOrId)}&populate=*`;
    let response = await fetch(`${API_URL}/api/giveaways?${query}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    let data = await response.json();
    
    // If no giveaway found with this slug, try to fetch by ID
    if (!data.data || data.data.length === 0) {
      query = `filters[id]=${encodeURIComponent(slugOrId)}&populate=*`;
      response = await fetch(`${API_URL}/api/giveaways?${query}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      data = await response.json();
      
      // If still no results, return null
      if (!data.data || data.data.length === 0) {
        return null;
      }
    }
    
    // Return the first giveaway
    return data.data[0];
  } catch (error) {
    console.error('Error fetching giveaway by slug or ID:', error);
    throw error;
  }
}

/**
 * Process rich text blocks from Strapi
 */
function processRichText(blocks: StrapiRichTextNode[]): string[] {
  if (!blocks || !Array.isArray(blocks)) return [];
  
  return blocks.map(block => {
    if (block.type === 'paragraph' && block.children && Array.isArray(block.children)) {
      return block.children.map(child => child.text || '').join('');
    }
    return '';
  }).filter(text => text.trim().length > 0);
}

/**
 * Formats a giveaway for detailed view, including prizes and rules
 */
export function formatGiveawayDetail(item: StrapiGiveaway): GiveawayDetail {
  // First get the basic formatted giveaway data
  const baseFormatted = formatGiveawayData({ data: [item], meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } } })[0];
  
  // Parse prizes and rules using the rich text processor
  const prizes = processRichText(item.Prizes || []);
  const rules = processRichText(item.Rules || []);
  
  // Return the enhanced giveaway object
  return {
    ...baseFormatted,
    prizes,
    rules,
  };
}

/**
 * Fetches related giveaways (excludes the current one, returns active only)
 */
export async function fetchRelatedGiveaways(currentSlug: string, limit: number = 3): Promise<FormattedGiveaway[]> {
  try {
    // Fetch active giveaways, excluding the current one
    const query = `filters[GiveawayStatus][$eq]=active&filters[slug][$ne]=${encodeURIComponent(currentSlug)}&populate=*&pagination[limit]=${limit}`;
    const response = await fetch(`${API_URL}/api/giveaways?${query}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return formatGiveawayData(data);
  } catch (error) {
    console.error('Error fetching related giveaways:', error);
    return [];
  }
}

/**
 * Submits a giveaway entry
 */
export async function submitGiveawayEntry(giveawayId: string, name: string, email: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/giveaway-entry-collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          Name: name,
          Email: email,
          EntryDate: new Date().toISOString(),
          giveaway: giveawayId
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error submitting giveaway entry:', error);
    return false;
  }
}



// Add these functions to your existing lib/api.ts file

/**
 * Fetches all giveaways with additional admin data (for admin panel)
 */
export async function fetchGiveawaysAdmin(): Promise<FormattedGiveaway[]> {
    try {
      const response = await fetch(`${API_URL}/api/giveaways?populate=*`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return formatGiveawayDataAdmin(data);
    } catch (error) {
      console.error('Error fetching giveaways for admin:', error);
      throw error;
    }
  }
  
  /**
   * Format giveaway data for admin panel (includes view counts)
   */
  function formatGiveawayDataAdmin(apiData: StrapiResponse<StrapiGiveaway>): FormattedGiveaway[] {
    const formatted = formatGiveawayData(apiData);
    
    // Add admin-specific fields like view counts
    // In a real implementation, this would come from the API
    return formatted.map(giveaway => ({
      ...giveaway,
      views: Math.floor(Math.random() * 10000) + 500, // Placeholder for demo
    }));
  }
  
  // lib/api.ts - Updated functions

/**
 * Fetches entries for a specific giveaway
 */
export async function fetchGiveawayEntries(giveawayId: string): Promise<GiveawayEntry[]> {
  try {
    console.log(`Fetching entries for giveaway ID: ${giveawayId}`);
    
    // Make the API call with appropriate filters
    const response = await fetch(`${API_URL}/api/giveaway-entry-collections?filters[giveaway][id][$eq]=${giveawayId}&populate=*`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Full API response data structure:', JSON.stringify(data, null, 2));
    
    // Call our formatter with the data
    const formattedEntries = formatGiveawayEntries(data);
    console.log('Formatted entries:', formattedEntries);
    
    return formattedEntries;
  } catch (error) {
    console.error('Error fetching giveaway entries:', error);
    return [];
  }
}

/**
 * Format giveaway entries for display
 */
function formatGiveawayEntries(apiData: any): GiveawayEntry[] {
  console.log("API data to format:", apiData);
  
  if (!apiData?.data) {
    console.warn("No data array found in API response");
    return [];
  }
  
  return apiData.data.map((entry: any) => {
    console.log("Processing entry ID:", entry.id);
    
    // In this Strapi response, the fields are directly on the entry object
    // NOT inside an attributes property as we initially thought
    return {
      id: entry.id,
      // Access fields directly from the entry object
      name: entry.Name || 'Unknown',
      email: entry.Email || 'unknown@example.com',
      date: entry.EntryDate || entry.createdAt || new Date().toISOString(),
      ip: entry.ip || "0.0.0.0",
      verified: true
    };
  });
}
  
 // lib/api.ts - Updated selectWinner function to use slug instead of id

/**
 * Select a random winner from entries
 */
// lib/api.ts - Updated selectWinner function
export async function selectWinner(giveawaySlug: string): Promise<GiveawayEntry | null> {
  try {
    const response = await fetch(`${API_URL}/api/giveaways/${giveawaySlug}/pick-winner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const winner = await response.json();
    return {
      id: winner.id,
      name: winner.Name,
      email: winner.Email,
      date: winner.EntryDate || winner.createdAt,
      ip: winner.ip || "0.0.0.0",
      verified: true
    };
  } catch (error) {
    console.error('Error selecting winner:', error);
    return null;
  }
}


// lib/api.ts - New functions for auto-updating giveaway status

/**
 * Updates a giveaway's status
 */
// lib/api.ts - Updated updateGiveawayStatus function
// lib/api.ts - Updated updateGiveawayStatus function to include publishedAt
export async function updateGiveawayStatus(
  giveawayId: string | number, 
  status: 'active' | 'upcoming' | 'ended'
): Promise<boolean> {
  try {
    // Using the endpoint structure for Strapi 5
    const response = await fetch(`${API_URL}/api/giveaways/${giveawayId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        status,
        publishedAt: new Date().toISOString() // Add this to ensure it's published
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating giveaway ${giveawayId} status to ${status}:`, error);
    return false;
  }
}


// lib/api.ts - Updated checkAndUpdateGiveawayStatuses function
export async function checkAndUpdateGiveawayStatuses(): Promise<void> {
  try {
    // Use the bulk update endpoint instead of individual updates
    const response = await fetch(`${API_URL}/api/giveaways/update-statuses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`Updated ${result.updates.length} giveaways`);
    
    // No need to do anything else as the server handled all updates
  } catch (error) {
    console.error('Error checking and updating giveaway statuses:', error);
  }
}

  // Add this function for debugging
export async function debugGiveawayEntries(giveawayId: string) {
  try {
    const response = await fetch(`${API_URL}/api/giveaway-entry-collections?filters[giveaway][id][$eq]=${giveawayId}`);
    const data = await response.json();
    console.log('DEBUG - Raw entry data:', JSON.stringify(data, null, 2));
    
    // Check the first entry's structure if it exists
    if (data.data && data.data.length > 0) {
      console.log('DEBUG - First entry:', JSON.stringify(data.data[0], null, 2));
      console.log('DEBUG - First entry attributes:', JSON.stringify(data.data[0].attributes, null, 2));
    }
    
    return data;
  } catch (error) {
    console.error('Debug error:', error);
    return null;
  }
}