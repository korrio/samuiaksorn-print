"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecentActivities from '@/components/RecentActivities';

interface DashboardTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  partner: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customerStats: any;
  partnerId: string;
}

export default function DashboardTab({
  partner,
  customerStats,
  partnerId
}: DashboardTabProps) {
  // Get loyalty tier color
  const getLoyaltyTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="mb-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{partner?.name}</h1>
          <p className="text-gray-600">Customer ID: {partner?.id}</p>
        </div>
        
        {customerStats && (
          <Badge className={`${getLoyaltyTierColor(customerStats.loyalty_tier)} font-medium px-4 py-2`}>
            🏆 {customerStats.loyalty_tier || 'Bronze'} Member
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="py-3 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          📞 ติดต่อเรา
        </Button>
        <Button 
          variant="outline" 
          className="py-3 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
        >
          📋 ดูใบเสนอราคา
        </Button>
      </div>

      {/* Customer Info */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            👤 ข้อมูลลูกค้า
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">อีเมล:</span>
              <span className="font-medium">{partner?.email || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">โทรศัพท์:</span>
              <span className="font-medium">{partner?.phone || partner?.mobile || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ประเภท:</span>
              <span className="font-medium">
                {partner?.is_company ? 'บริษัท' : 'บุคคลธรรมดา'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {customerStats && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🛒</div>
              <div className="text-2xl font-bold text-green-600">
                {customerStats.total_orders || 0}
              </div>
              <div className="text-sm text-gray-600">งานทั้งหมด</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(customerStats.total_spent || 0)}
              </div>
              <div className="text-sm text-gray-600">ยอดรวม</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-purple-600">
                {customerStats.loyalty_points || 0}
              </div>
              <div className="text-sm text-gray-600">แต้มสะสม</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-lg font-bold text-orange-600">
                {formatCurrency(customerStats.lifetime_value || 0)}
              </div>
              <div className="text-sm text-gray-600">LTV</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <RecentActivities partnerId={partnerId} limit={5} />
    </div>
  );
}