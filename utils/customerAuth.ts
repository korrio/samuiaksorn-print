interface CustomerAuthData {
  partner_id: string;
  authenticated_at: string;
  method: 'phone' | 'email';
  contact: string;
}

/**
 * Check if customer is authenticated
 */
export function isCustomerAuthenticated(partnerId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const authData = localStorage.getItem(`customer_auth_${partnerId}`);
    if (!authData) return false;

    const data: CustomerAuthData = JSON.parse(authData);
    
    // Check if authentication is still valid (24 hours)
    const authTime = new Date(data.authenticated_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - authTime.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff < 24; // Valid for 24 hours
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Get customer authentication data
 */
export function getCustomerAuthData(partnerId: string): CustomerAuthData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem(`customer_auth_${partnerId}`);
    if (!authData) return null;

    return JSON.parse(authData);
  } catch (error) {
    console.error('Error getting auth data:', error);
    return null;
  }
}

/**
 * Clear customer authentication
 */
export function clearCustomerAuth(partnerId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`customer_auth_${partnerId}`);
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
}

/**
 * Check if authentication is expiring soon (within 2 hours)
 */
export function isAuthExpiringSoon(partnerId: string): boolean {
  const authData = getCustomerAuthData(partnerId);
  if (!authData) return false;

  const authTime = new Date(authData.authenticated_at);
  const now = new Date();
  const hoursDiff = (now.getTime() - authTime.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff > 22; // Expiring in less than 2 hours
}