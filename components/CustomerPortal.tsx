"use client"

import React, { useState } from 'react';
import useCustomerData from '@/hooks/useCustomerData';
import OrderCreationModal from '@/components/OrderCreationModal';
import MobileTabNavigation, { TabItem } from '@/components/MobileTabNavigation';
import DashboardTab from '@/components/tabs/DashboardTab';
import OrdersTab from '@/components/tabs/OrdersTab';
import LoyaltyTab from '@/components/tabs/LoyaltyTab';
import SettingsTab from '@/components/tabs/SettingsTab';
import { Card } from '@/components/ui/card';

interface CustomerPortalProps {
  partnerId: string;
}

export default function CustomerPortal({ partnerId }: CustomerPortalProps) {
  const { partner, customerStats, customerLeads, isLoading, error, refetch } = useCustomerData(partnerId);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Define tabs
  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'หน้าหลัก',
      icon: '🏠',
      component: DashboardTab
    },
    {
      id: 'orders',
      label: 'งานของฉัน',
      icon: '📋',
      component: OrdersTab
    },
    {
      id: 'loyalty',
      label: 'บัตรสมาชิก',
      icon: '🏆',
      component: LoyaltyTab
    },
    {
      id: 'settings',
      label: 'ตั้งค่า',
      icon: '⚙️',
      component: SettingsTab
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบข้อมูลลูกค้า</h1>
          <p className="text-gray-600 mb-4">ไม่สามารถโหลดข้อมูลลูกค้า ID: {partnerId}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🔄 ลองใหม่อีกครั้ง
          </button>
        </Card>
      </div>
    );
  }

  // No data state
  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบข้อมูลลูกค้า</h1>
          <p className="text-gray-600">กรุณาตรวจสอบ Customer ID</p>
        </Card>
      </div>
    );
  }

  // Component props to pass to tabs
  const componentProps = {
    partner,
    customerStats,
    customerLeads,
    partnerId,
    refetch
  };

  return (
    <>
      <MobileTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        componentProps={componentProps}
      />

      {/* Order Creation Modal */}
      <OrderCreationModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        partnerId={partnerId}
        partnerName={partner?.name || 'Customer'}
        onOrderCreated={refetch}
      />
    </>
  );
}