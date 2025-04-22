import { useState, useEffect } from 'react';
import axios from 'axios';

// Define interfaces for the lead data structure
export interface LeadProperty {
  name: string;
  type: string;
  string: string;
  default: any;
  value: any;
  selection?: Array<[string, string]>;
  domain?: any;
  comodel?: string;
}

export interface Lead {
  id: number;
  name: string;
  partner_id: [number, string] | false;
  email_from: string | false;
  phone: string | false;
  phone_mobile_search: any;
  user_id: [number, string] | false;
  team_id: [number, string] | false;
  company_id: [number, string] | false;
  stage_id: [number, string] | false;
  tag_ids: any[];
  description: string | false;
  date_open: string | false;
  date_closed: string | false;
  date_deadline: string | false;
  expected_revenue: number;
  probability: number;
  lead_properties: LeadProperty[];
  create_date: string;
  write_date: string;
  [key: string]: any; // For any additional fields
}

interface ApiResponse {
  success: boolean;
  data: Lead;
}

/**
 * Custom hook to fetch lead data from the Odoo API
 * 
 * @param idOrJobNo - The lead ID or job number to fetch
 * @param baseUrl - Base URL for the API (defaults to process.env.NEXT_PUBLIC_API_URL or 'https://api.erpsamuiaksorn.com')
 * @returns Object containing lead data, loading state, and error
 */
const useFetchLeadById = (
  idOrJobNo: string | number | null | undefined,
  baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'https://api.erpsamuiaksorn.com'
) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset states when ID changes
    setIsLoading(true);
    setError(null);
    setLead(null);

    // Skip API call if ID is missing or invalid
    if (!idOrJobNo) {
      setIsLoading(false);
      return;
    }

    const fetchLead = async () => {
      try {
        // Check if the identifier is a job number (starts with N) or a lead ID
        const isJobNumber = typeof idOrJobNo === 'string' && idOrJobNo.startsWith('N');
        
        let url: string;
        if (isJobNumber) {
          // Fetch by job number using a search
          url = `${baseUrl}/api/crm.lead/search_read`;
          const response = await axios.post(url, {
            domain: [['lead_properties.value', '=', idOrJobNo]],
            fields: [] // Empty array means fetch all fields
          });
          
          if (response.data && response.data.success && response.data.data.length > 0) {
            setLead(response.data.data[0]);
          } else {
            setError(new Error(`No lead found with job number: ${idOrJobNo}`));
          }
        } else {
          // Fetch by ID
          url = `${baseUrl}/api/crm.lead/${idOrJobNo}`;
          const response = await axios.get<ApiResponse>(url);
          
          if (response.data && response.data.success) {
            setLead(response.data.data);
          } else {
            setError(new Error('Failed to fetch lead data'));
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        console.error('Error fetching lead:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [idOrJobNo, baseUrl]); // Re-fetch when ID or URL changes

  return { lead, isLoading, error };
};

export default useFetchLeadById;