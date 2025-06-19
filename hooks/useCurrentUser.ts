"use client"

import { useState, useEffect } from 'react';

interface CurrentUser {
  id: number;
  name: string;
  email?: string;
  acceptedAt: string;
}

interface UseCurrentUserReturn {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser) => void;
  clearCurrentUser: () => void;
  isUserAccepted: boolean;
}

const STORAGE_KEY = 'crm_current_user';

export const useCurrentUser = (): UseCurrentUserReturn => {
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUserState(parsed);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, []);

  const setCurrentUser = (user: CurrentUser) => {
    const userData = {
      ...user,
      acceptedAt: new Date().toISOString()
    };
    
    setCurrentUserState(userData);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
  };

  const clearCurrentUser = () => {
    setCurrentUserState(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    currentUser,
    setCurrentUser,
    clearCurrentUser,
    isUserAccepted: currentUser !== null
  };
};

export default useCurrentUser;