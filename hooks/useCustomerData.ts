import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Customer/Partner interfaces
export interface Partner {
  id: number;
  name: string;
  email: string;
  phone: string;
  mobile: string;
  company_type: 'person' | 'company';
  is_company: boolean;
  customer_rank: number;
  supplier_rank: number;
  total_invoiced: number;
  [key: string]: any;
}

export interface CustomerStats {
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date: string;
  lifetime_value: number;
  loyalty_points: number;
  loyalty_tier: string;
  preferred_services?: string[];
}

export interface CustomerLead {
  id: number;
  name: string;
  stage_id: [number, string];
  expected_revenue: number;
  create_date: string;
  write_date: string;
  date_deadline: string | false;
  lead_properties: any[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Custom hook to fetch comprehensive customer data for CRM portal
 */
const useCustomerData = (
  partnerId: string | number,
  baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'https://api.erpsamuiaksorn.com'
) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [customerLeads, setCustomerLeads] = useState<CustomerLead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch partner/customer basic info
  const fetchPartner = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse<Partner>>(`${baseUrl}/api/res.partner/${partnerId}`);
      if (response.data && response.data.success) {
        setPartner(response.data.data);
      } else {
        throw new Error('Partner not found');
      }
    } catch (err) {
      console.error('Error fetching partner:', err);
      // Use mockup data when API fails
      setPartner({
        id: parseInt(partnerId.toString()),
        name: 'ลูกค้าตัวอย่าง',
        email: 'customer@example.com',
        phone: '02-123-4567',
        mobile: '081-234-5678',
        company_type: 'person',
        is_company: false,
        customer_rank: 1,
        supplier_rank: 0,
        total_invoiced: 25000
      });
    }
  }, [partnerId, baseUrl]);

  // Fetch customer statistics and LTV
  const fetchCustomerStats = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse<CustomerStats>>(`${baseUrl}/api/res.partner/${partnerId}/stats`);
      if (response.data && response.data.success) {
        setCustomerStats(response.data.data);
      } else {
        // Fallback: calculate basic stats from available data
        setCustomerStats({
          total_orders: 0,
          total_spent: 0,
          average_order_value: 0,
          last_order_date: '',
          lifetime_value: 0,
          loyalty_points: 0,
          loyalty_tier: 'Bronze',
          preferred_services: []
        });
      }
    } catch (err) {
      console.error('Error fetching customer stats:', err);
      // Use mockup data when API fails
      setCustomerStats({
        total_orders: 12,
        total_spent: 25000,
        average_order_value: 2083,
        last_order_date: '2024-12-01T10:30:00Z',
        lifetime_value: 45000,
        loyalty_points: 1250,
        loyalty_tier: 'Gold',
        preferred_services: ['การ์ดงานแต่ง', 'โบรชัวร์', 'สติ๊กเกอร์', 'นามบัตร']
      });
    }
  }, [partnerId, baseUrl]);

  // Fetch customer's leads/orders
  const fetchCustomerLeads = useCallback(async () => {
    try {
      const domain = JSON.stringify([['partner_id', '=', parseInt(partnerId.toString())]]);
      const fields = JSON.stringify(['name', 'stage_id', 'expected_revenue', 'create_date', 'write_date', 'date_deadline', 'lead_properties']);
      const order = 'create_date desc';
      
      const response = await axios.get(`${baseUrl}/api/crm.lead`, {
        params: {
          domain,
          fields,
          order
        }
      });
      
      if (response.data && response.data.success) {
        setCustomerLeads(response.data.data || []);
      } else {
        setCustomerLeads([]);
      }
    } catch (err) {
      console.error('Error fetching customer leads:', err);
      // Use mockup data when API fails
      setCustomerLeads([
        {
          id: 4644,
          name: 'การ์ดงานแต่งงาน สุดหรู',
          stage_id: [7, 'ออกแบบ'],
          expected_revenue: 3500,
          create_date: '2024-11-28T14:30:00Z',
          write_date: '2024-12-01T10:15:00Z',
          date_deadline: '2024-12-15T00:00:00Z',
          lead_properties: []
        },
        {
          id: 4608,
          name: 'โบรชัวร์ธุรกิจ A4',
          stage_id: [1, 'ประสานงาน'],
          expected_revenue: 2000,
          create_date: '2024-11-25T09:20:00Z',
          write_date: '2024-11-30T16:45:00Z',
          date_deadline: '2024-12-10T00:00:00Z',
          lead_properties: []
        },
        {
          id: 4643,
          name: 'สติ๊กเกอร์โลโก้ บริษัท',
          stage_id: [5, 'การเงิน'],
          expected_revenue: 1500,
          create_date: '2024-11-20T11:10:00Z',
          write_date: '2024-11-29T13:22:00Z',
          date_deadline: false,
          lead_properties: []
        },
        {
          id: 4429,
          name: 'นามบัตรพรีเมียม',
          stage_id: [9, 'งานเสร็จ'],
          expected_revenue: 1200,
          create_date: '2024-11-15T08:45:00Z',
          write_date: '2024-11-28T14:30:00Z',
          date_deadline: false,
          lead_properties: []
        },
        {
          id: 2166,
          name: 'แบนเนอร์ งานเปิดร้าน',
          stage_id: [8, 'ตัดก่อนพิมพ์'],
          expected_revenue: 800,
          create_date: '2024-11-10T15:20:00Z',
          write_date: '2024-11-27T09:15:00Z',
          date_deadline: '2024-12-05T00:00:00Z',
          lead_properties: []
        }
      ]);
    }
  }, [partnerId, baseUrl]);

  // Main fetch function
  const fetchAllData = useCallback(async () => {
    if (!partnerId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchPartner(),
        fetchCustomerStats(),
        fetchCustomerLeads()
      ]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Failed to load customer data'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchPartner, fetchCustomerStats, fetchCustomerLeads, partnerId]);

  // Refetch function
  const refetch = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    partner,
    customerStats,
    customerLeads,
    isLoading,
    error,
    refetch
  };
};

export default useCustomerData;