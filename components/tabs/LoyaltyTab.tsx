"use client"

import React from 'react';
import LoyaltyCard from '@/components/LoyaltyCard';

interface LoyaltyTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  partner: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customerStats: any;
  partnerId: string;
}

export default function LoyaltyTab({
  partner,
  customerStats,
  partnerId
}: LoyaltyTabProps) {
  if (!customerStats) {
    return (
      <div className="p-4 text-center py-16">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">กำลังโหลดข้อมูลบัตรสมาชิก...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          🏆 บัตรสมาชิก
        </h2>
        <p className="text-gray-600">
          แต้มสะสมและสิทธิประโยชน์ของคุณ
        </p>
      </div>
      
      <LoyaltyCard
        customerName={partner?.name || 'Customer'}
        loyaltyPoints={customerStats.loyalty_points || 0}
        loyaltyTier={customerStats.loyalty_tier || 'Bronze'}
        totalSpent={customerStats.total_spent || 0}
        totalOrders={customerStats.total_orders || 0}
        memberId={partnerId}
        preferredServices={customerStats.preferred_services || []}
      />
    </div>
  );
}