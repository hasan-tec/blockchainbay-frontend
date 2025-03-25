// lib/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';

// Helper function to get auth headers with JWT token
const getAuthHeaders = () => {
  const jwt = Cookies.get('jwt');
  return jwt ? { Authorization: `Bearer ${jwt}` } : {};
};

// Types and Interfaces
export interface FormattedGiveaway {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string | null;
  value: number;
  status: 'upcoming' | 'active' | 'ended';
  entries: number;
  slug: string;
  daysLeft: number;
  views?: number;
}

export interface GiveawayEntry {
  id: number;
  name: string;
  email: string;
  date: string;
  ip: string;
  verified: boolean;
}

export interface GiveawayDetail extends FormattedGiveaway {
  rules: string[];
  prizes: string[];
}

// Replace the entire getGiveawayStatus function with this improved version
const getGiveawayStatus = (startDateRaw: string | number, endDateRaw: string | number): 'upcoming' | 'active' | 'ended' => {
  const today = new Date();
  
  // Handle multiple date formats
  let start: Date, end: Date;
  
  // Parse start date
  if (typeof startDateRaw === 'number') {
    start = new Date(startDateRaw); // Unix timestamp (milliseconds)
  } else if (typeof startDateRaw === 'string') {
    if (startDateRaw.includes('T')) {
      start = new Date(startDateRaw); // ISO format
    } else {
      // Handle date format like "2025-03-20"
      const [year, month, day] = startDateRaw.split('-').map(Number);
      start = new Date(year, month - 1, day); // Month is 0-indexed
    }
  } else {
    start = new Date(); // Fallback
  }
  
  // Parse end date
  if (typeof endDateRaw === 'number') {
    end = new Date(endDateRaw);
  } else if (typeof endDateRaw === 'string') {
    if (endDateRaw.includes('T')) {
      end = new Date(endDateRaw);
    } else {
      const [year, month, day] = endDateRaw.split('-').map(Number);
      end = new Date(year, month - 1, day);
    }
  } else {
    end = new Date(); // Fallback
  }
  
  if (today < start) return 'upcoming';
  if (today > end) return 'ended';
  return 'active';
};

// Format giveaway data for frontend use
export const formatGiveawayData = (apiResponse: any): FormattedGiveaway[] => {
  // Handle case where data is not available or malformed
  if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
    console.warn('Invalid API response format:', apiResponse);
    return [];
  }

  return apiResponse.data
    .filter((item: any) => {
      // Safety check for item structure and required fields
      return item && item.id && (item.startDate || item.attributes?.startDate) && 
        (item.endDate || item.attributes?.endDate);
    })
    .map((item: any) => {
      // Determine if data is in attributes or directly on the item
      const attrs = item.attributes || item;
      
      const startDateRaw = attrs.startDate;
      const endDateRaw = attrs.endDate;  
      
      // Convert numeric timestamps to ISO strings if needed
      const startDate = typeof startDateRaw === 'number' 
        ? new Date(startDateRaw).toISOString() 
        : startDateRaw;
        
      const endDate = typeof endDateRaw === 'number' 
        ? new Date(endDateRaw).toISOString() 
        : endDateRaw;
      
      const today = new Date();
      const endDateObj = new Date(endDate);
      const status = getGiveawayStatus(startDateRaw, endDateRaw);
      
      // Calculate days left (or 0 if ended)
      const daysLeft = status === 'ended' ? 0 : 
        Math.round(Math.abs((today.getTime() - endDateObj.getTime()) / (24 * 60 * 60 * 1000)));
      
      // Map the image data correctly
      let imageUrl = null;
      if (attrs.image) {
        if (attrs.image.data && attrs.image.data.attributes) {
          imageUrl = attrs.image.data.attributes.url;
        } else if (typeof attrs.image === 'string') {
          imageUrl = attrs.image;
        }
      }
      
      // Count entries - Replace the current entries counting logic with this
      let entriesCount = 0;
      if (attrs.entries) {
        if (attrs.entries.data && Array.isArray(attrs.entries.data)) {
          // Strapi v4 format with entries.data
          entriesCount = attrs.entries.data.length;
        } else if (Array.isArray(attrs.entries)) {
          // Direct array of entries
          entriesCount = attrs.entries.length;
        } else if (typeof attrs.entries === 'number') {
          // Already a count
          entriesCount = attrs.entries;
        }
      }
      
      // Parse description if it's in JSON format
      let description = '';
      if (attrs.description) {
        if (typeof attrs.description === 'string') {
          try {
            // Check if it's a JSON string
            if (attrs.description.startsWith('[') || attrs.description.startsWith('{')) {
              const parsedDesc = JSON.parse(attrs.description);
              // Extract text from JSON structure if possible
              if (Array.isArray(parsedDesc) && parsedDesc[0]?.children) {
                description = parsedDesc[0].children
                  .filter((child: any) => child.text)
                  .map((child: any) => child.text)
                  .join(' ');
              } else {
                description = attrs.description;
              }
            } else {
              description = attrs.description;
            }
          } catch {
            description = attrs.description;
          }
        }
      }
      
      return {
        id: item.id,
        title: attrs.title || 'Untitled Giveaway',
        description: description,
        startDate: new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        endDate: new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: imageUrl,
        value: attrs.value || 0,
        status,
        entries: entriesCount,
        slug: attrs.slug || `giveaway-${item.id}`,
        daysLeft
      };
    });
};

// Format detailed giveaway data
export const formatGiveawayDetail = (apiResponse: any): GiveawayDetail | null => {
  if (!apiResponse) {
    console.warn('Invalid giveaway detail response:', apiResponse);
    return null;
  }
  
  const item = apiResponse;
  // Use item directly, or attributes if present
  const attrs = item.attributes || item;
  
  if (!attrs.startDate || !attrs.endDate) {
    console.warn('Giveaway detail missing required fields:', item);
    return null;
  }
  
  const formatted = formatGiveawayData({ data: [item] })[0];
  
  if (!formatted) {
    return null;
  }
  
  // Parse rules and prizes
  let rules: string[] = [];
  if (attrs.rules) {
    if (typeof attrs.rules === 'string') {
      rules = attrs.rules.split('\n').filter(Boolean);
    } else if (Array.isArray(attrs.rules)) {
      rules = attrs.rules;
    }
  }
  
  let prizes: string[] = [];
  if (attrs.prizes) {
    if (typeof attrs.prizes === 'string') {
      prizes = attrs.prizes.split('\n').filter(Boolean);
    } else if (Array.isArray(attrs.prizes)) {
      prizes = attrs.prizes;
    }
  }
  
  return {
    ...formatted,
    rules,
    prizes
  };
};

// Fetch all giveaways (public route, no auth needed)
export const fetchGiveaways = async (): Promise<FormattedGiveaway[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/giveaways?populate=*`);
    return formatGiveawayData(response.data);
  } catch (error) {
    console.error('Error fetching giveaways:', error);
    return [];
  }
};

// Fetch giveaways for admin (protected route, requires auth)
export const fetchGiveawaysAdmin = async (): Promise<FormattedGiveaway[]> => {
  try {
    // Include authentication headers
    const headers = getAuthHeaders();
    
    const response = await axios.get(`${API_URL}/api/giveaways?populate=*`, {
      headers
    });
    
    return formatGiveawayData(response.data);
  } catch (error) {
    console.error('Error fetching giveaways for admin:', error);
    // If unauthorized, return empty array
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error('Authentication error: JWT token invalid or expired');
    }
    return [];
  }
};

// Fetch a specific giveaway by slug (public route)
export const fetchGiveawayBySlug = async (slug: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/api/giveaways?filters[slug][$eq]=${slug}&populate=*`);
    
    if (!response.data || !response.data.data || !response.data.data.length) {
      console.warn(`No giveaway found with slug: ${slug}`);
      return null;
    }
    
    return response.data.data[0];
  } catch (error) {
    console.error(`Error fetching giveaway with slug ${slug}:`, error);
    return null;
  }
};

// Fetch entries for a specific giveaway (admin-only route)
export const fetchGiveawayEntries = async (giveawayId: number): Promise<GiveawayEntry[]> => {
  try {
    // Include authentication headers
    const headers = getAuthHeaders();
    
    // Using a more direct filter approach
    const response = await axios.get(`${API_URL}/api/entries?filters[giveaway][id][$eq]=${giveawayId}&populate=*`, {
      headers
    });
    
    console.log("Entries response:", response.data);
    
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.warn(`No entries found for giveaway ID ${giveawayId}`);
      return [];
    }
    
    // Map the entries with proper field access
    return response.data.data.map((entry: any) => {
      const attrs = entry.attributes || entry;
      
      return {
        id: entry.id,
        name: attrs.name || "Unknown",
        email: attrs.email || "no-email@example.com",
        date: attrs.createdAt || new Date().toISOString(),
        ip: attrs.ip || "127.0.0.1",
        verified: attrs.verified || true // Default verification status
      };
    });
  } catch (error) {
    console.error(`Error fetching entries for giveaway ${giveawayId}:`, error);
    // Handle unauthorized error specifically
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error('Authentication error: JWT token invalid or expired');
    }
    return [];
  }
};

// Submit an entry for a giveaway (public route)
export const submitGiveawayEntry = async (
  giveawayId: number, 
  name: string, 
  email: string,
  captchaToken: string
): Promise<boolean> => {
  try {
    // First check if this email has already entered
    const checkResponse = await axios.get(
      `${API_URL}/api/entries?filters[giveaway][id][$eq]=${giveawayId}&filters[email][$eq]=${encodeURIComponent(email)}`
    );
    
    if (checkResponse.data.data.length > 0) {
      console.log('Email already used for this giveaway');
      return false;
    }
    
    // Create the entry with the correct format for Strapi
    const response = await axios.post(`${API_URL}/api/entries`, {
      data: {
        name,
        email,
        giveaway: giveawayId // Simple ID format for Strapi
      }
    });
    
    console.log('Entry submission response:', response.data);
    return true;
  } catch (error) {
    console.error('Error submitting giveaway entry:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error details:', error.response.data);
    }
    return false;
  }
};

// Select a winner for a giveaway (admin-only route)
export const selectWinner = async (giveawaySlug: string): Promise<GiveawayEntry | null> => {
  try {
    // Include authentication headers
    const headers = getAuthHeaders();
    
    // Get the giveaway ID
    const giveawayResponse = await axios.get(`${API_URL}/api/giveaways?filters[slug][$eq]=${giveawaySlug}`, {
      headers
    });
    
    if (!giveawayResponse.data || !giveawayResponse.data.data || !giveawayResponse.data.data[0]) {
      console.warn(`No giveaway found with slug: ${giveawaySlug}`);
      return null;
    }
    
    const giveaway = giveawayResponse.data.data[0];
    const giveawayId = giveaway.id;
    
    // Get entries
    const entriesResponse = await axios.get(`${API_URL}/api/entries?filters[giveaway][id][$eq]=${giveawayId}`, {
      headers
    });
    
    if (!entriesResponse.data || !entriesResponse.data.data || !entriesResponse.data.data.length) {
      console.warn(`No entries found for giveaway ID ${giveawayId}`);
      return null;
    }
    
    // Check if winner already exists - use previouswinners endpoint with populate
    const winnersResponse = await axios.get(`${API_URL}/api/previouswinners?filters[giveaway][id][$eq]=${giveawayId}&populate=*`, {
      headers
    });
    
    console.log("Winners response data structure:", JSON.stringify(winnersResponse.data, null, 2).substring(0, 200) + "...");
    
    // If winner exists, return it
    if (winnersResponse.data && winnersResponse.data.data && winnersResponse.data.data.length > 0) {
      const winner = winnersResponse.data.data[0];
      
      // Check for entry directly in the winner object (not in attributes.entry.data)
      if (winner.entry && winner.entry.id) {
        // We already have the entry data directly in the winner object
        return {
          id: winner.entry.id,
          name: winner.entry.name || "Unknown",
          email: winner.entry.email || "no-email@example.com",
          date: winner.entry.createdAt || new Date().toISOString(),
          ip: winner.entry.ip || "127.0.0.1",
          verified: true
        };
      } 
      // For Strapi v4 format, check if it's in attributes
      else if (winner.attributes && winner.attributes.entry) {
        const entryData = winner.attributes.entry;
        
        if (typeof entryData === 'object' && entryData !== null) {
          // If entry is directly an object with the data
          if (entryData.id) {
            return {
              id: entryData.id,
              name: entryData.name || "Unknown",
              email: entryData.email || "no-email@example.com",
              date: entryData.createdAt || new Date().toISOString(),
              ip: entryData.ip || "127.0.0.1",
              verified: true
            };
          }
          // If entry is in Strapi v4 format with data property
          else if (entryData.data && entryData.data.id) {
            const entryId = entryData.data.id;
            const entryResponse = await axios.get(`${API_URL}/api/entries/${entryId}?populate=*`, {
              headers
            });
            const entry = entryResponse.data.data;
            const attrs = entry.attributes || entry;
            
            return {
              id: entry.id,
              name: attrs.name || "Unknown",
              email: attrs.email || "no-email@example.com",
              date: attrs.createdAt || new Date().toISOString(),
              ip: attrs.ip || "127.0.0.1",
              verified: true
            };
          }
        }
      }
      
      console.warn("Winner exists but entry data is missing or in an unexpected format:", winner);
      // Fall through to select a new winner
    }
    
    // Randomly select winner
    const entries = entriesResponse.data.data;
    console.log("Entries available for selection:", entries.length);
    
    if (entries.length === 0) {
      console.warn("No entries available to select a winner");
      return null;
    }

    const randomIndex = Math.floor(Math.random() * entries.length);
    const winnerEntry = entries[randomIndex];

    // Create winner record - use previouswinners endpoint
    try {
      await axios.post(`${API_URL}/api/previouswinners`, {
        data: {
          giveaway: giveawayId,
          entry: winnerEntry.id,
          selected_at: new Date().toISOString()
        }
      }, {
        headers
      });
      console.log("Winner record created successfully");
    } catch (postError) {
      console.error("Error creating winner record:", postError);
      // Continue anyway to return the selected winner
    }

    // Safely extract properties with fallbacks
    const attrs = winnerEntry.attributes || winnerEntry;

    return {
      id: winnerEntry.id,
      name: attrs.name || "Unknown",
      email: attrs.email || "no-email@example.com",
      date: attrs.createdAt || new Date().toISOString(),
      ip: attrs.ip || "127.0.0.1",
      verified: true
    };
  } catch (error) {
    console.error('Error selecting winner:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    // Handle unauthorized error specifically
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error('Authentication error: JWT token invalid or expired');
    }
    return null;
  }
};

// Fetch a winner for a giveaway (admin-only route)
export const fetchGiveawayWinner = async (giveawayId: number): Promise<GiveawayEntry | null> => {
  try {
    // Include authentication headers
    const headers = getAuthHeaders();
    
    // Get the winner from the previouswinners endpoint
    const winnersResponse = await axios.get(`${API_URL}/api/previouswinners?filters[giveaway][id][$eq]=${giveawayId}&populate=*`, {
      headers
    });
    
    if (!winnersResponse.data || !winnersResponse.data.data || !winnersResponse.data.data.length) {
      console.log(`No winner found for giveaway ID ${giveawayId}`);
      return null;
    }
    
    const winner = winnersResponse.data.data[0];
    
    // Check for entry directly in the winner object
    if (winner.entry && winner.entry.id) {
      return {
        id: winner.entry.id,
        name: winner.entry.name || "Unknown",
        email: winner.entry.email || "no-email@example.com",
        date: winner.entry.createdAt || new Date().toISOString(),
        ip: winner.entry.ip || "127.0.0.1",
        verified: true
      };
    }
    
    // If we need to get the entry separately
    if (winner.attributes && winner.attributes.entry) {
      const entryData = winner.attributes.entry;
      
      if (typeof entryData === 'object' && entryData !== null) {
        // If entry is directly an object with the data
        if (entryData.id) {
          return {
            id: entryData.id,
            name: entryData.name || "Unknown",
            email: entryData.email || "no-email@example.com",
            date: entryData.createdAt || new Date().toISOString(),
            ip: entryData.ip || "127.0.0.1",
            verified: true
          };
        }
        // If entry is in Strapi v4 format with data property
        else if (entryData.data && entryData.data.id) {
          const entryId = entryData.data.id;
          const entryResponse = await axios.get(`${API_URL}/api/entries/${entryId}?populate=*`, {
            headers
          });
          const entry = entryResponse.data.data;
          const attrs = entry.attributes || entry;
          
          return {
            id: entry.id,
            name: attrs.name || "Unknown",
            email: attrs.email || "no-email@example.com",
            date: attrs.createdAt || new Date().toISOString(),
            ip: attrs.ip || "127.0.0.1",
            verified: true
          };
        }
      }
    }
    
    console.warn("Winner exists but entry data is missing or in an unexpected format:", winner);
    return null;
  } catch (error) {
    console.error('Error fetching winner:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    // Handle unauthorized error specifically
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error('Authentication error: JWT token invalid or expired');
    }
    return null;
  }
};

// Fetch related giveaways (public route)
export const fetchRelatedGiveaways = async (currentSlug: string): Promise<FormattedGiveaway[]> => {
  try {
    // Get all giveaways except the current one
    const response = await axios.get(`${API_URL}/api/giveaways?filters[slug][$ne]=${currentSlug}&populate=*&limit=3`);
    const allRelated = formatGiveawayData(response.data);
    
    // Filter out ended giveaways
    const activeOrUpcoming = allRelated.filter(giveaway => giveaway.status !== 'ended');
    
    return activeOrUpcoming;
  } catch (error) {
    console.error('Error fetching related giveaways:', error);
    return [];
  }
};

// Add these new functions for Admin authentication

// Function to login a user
export const loginUser = async (identifier: string, password: string): Promise<{ user: any, jwt: string } | null> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/local`, {
      identifier,
      password
    });

    if (response.data && response.data.jwt) {
      // Set the JWT in a cookie for subsequent requests
      Cookies.set('jwt', response.data.jwt, { expires: 7 }); // expires in 7 days
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Login error details:', error.response.data);
    }
    return null;
  }
};

// Function to logout a user
export const logoutUser = (): void => {
  Cookies.remove('jwt');
};

// Function to get the current authenticated user
export const getCurrentUser = async (): Promise<any | null> => {
  try {
    const headers = getAuthHeaders();
    
    if (Object.keys(headers).length === 0) {
      return null; // No JWT token found
    }
    
    const response = await axios.get(`${API_URL}/api/users/me?populate=role`, {
      headers
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Function to check if the current user is an admin
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return false;
    }
    
    // Check if user has admin role
    return user.role?.name === 'Admin' || user.role?.type === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};


// lib/api.ts - updated notifyWinner function
export const notifyWinner = async (
  giveawayId: number,
  winnerId: number,
  winnerEmail: string,
  winnerName: string,
  giveawayTitle: string
): Promise<boolean> => {
  try {
    // Call the API route instead of using NodeMailer directly
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        winnerEmail,
        winnerName,
        giveawayTitle
      }),
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log("Email sent successfully via API route");
      
      // Update database if needed
      try {
        const headers = getAuthHeaders();
        await axios.put(`${API_URL}/api/previouswinners/update-notification`, {
          giveawayId,
          winnerId,
          notified: true,
          notifiedAt: new Date().toISOString()
        }, { headers });
      } catch (updateError) {
        console.warn("Email sent but failed to update notification status");
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error notifying winner:', error);
    return false;
  }
};

// This can stay in lib/api.ts
export const getWinnerMailtoLink = (
  winnerEmail: string,
  giveawayTitle: string
): string => {
  const subject = encodeURIComponent(`Congratulations! You won the ${giveawayTitle} giveaway!`);
  const body = encodeURIComponent(
    `Dear Winner,\n\nCongratulations! We're excited to inform you that you've been selected as the winner of our "${giveawayTitle}" giveaway.\n\nTo claim your prize, please reply to this email with your preferred contact information.\n\nThank you for participating!\n\nBest regards,\nThe BlockchainBay Team`
  );
  
  return `mailto:${winnerEmail}?subject=${subject}&body=${body}`;
};



