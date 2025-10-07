"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LoyaltyCardProps {
  customerName: string;
  loyaltyPoints: number;
  loyaltyTier: string;
  totalSpent: number;
  totalOrders: number;
  memberId: string;
  preferredServices?: string[];
}

export default function LoyaltyCard({
  customerName,
  loyaltyPoints,
  loyaltyTier,
  totalSpent,
  totalOrders,
  memberId,
  preferredServices = []
}: LoyaltyCardProps) {
  // Get tier-specific styling
  const getTierStyling = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return {
          gradient: 'bg-gradient-to-br from-gray-800 via-gray-600 to-gray-800',
          accent: 'text-gray-100',
          badge: 'bg-gray-100 text-gray-800',
          points: 'text-gray-100'
        };
      case 'gold':
        return {
          gradient: 'bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-600',
          accent: 'text-yellow-100',
          badge: 'bg-yellow-100 text-yellow-800',
          points: 'text-yellow-100'
        };
      case 'silver':
        return {
          gradient: 'bg-gradient-to-br from-gray-400 via-gray-300 to-gray-500',
          accent: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-800',
          points: 'text-gray-700'
        };
      default: // Bronze
        return {
          gradient: 'bg-gradient-to-br from-orange-600 via-orange-400 to-orange-600',
          accent: 'text-orange-100',
          badge: 'bg-orange-100 text-orange-800',
          points: 'text-orange-100'
        };
    }
  };

  // Calculate progress to next tier
  const getProgressToNextTier = () => {
    const currentTierMin = getTierMinPoints(loyaltyTier);
    const nextTierMin = getNextTierMinPoints(loyaltyTier);
    
    if (nextTierMin === null) return 100; // Already at highest tier
    
    const progress = ((loyaltyPoints - currentTierMin) / (nextTierMin - currentTierMin)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getTierMinPoints = (tier: string): number => {
    switch (tier.toLowerCase()) {
      case 'platinum': return 5000;
      case 'gold': return 2000;
      case 'silver': return 500;
      default: return 0; // Bronze
    }
  };

  const getNextTierMinPoints = (tier: string): number | null => {
    switch (tier.toLowerCase()) {
      case 'bronze': return 500;
      case 'silver': return 2000;
      case 'gold': return 5000;
      default: return null; // Platinum is highest
    }
  };

  const getNextTierName = (tier: string): string | null => {
    switch (tier.toLowerCase()) {
      case 'bronze': return 'Silver';
      case 'silver': return 'Gold';
      case 'gold': return 'Platinum';
      default: return null;
    }
  };

  const styling = getTierStyling(loyaltyTier);
  const progress = getProgressToNextTier();
  const nextTier = getNextTierName(loyaltyTier);
  const nextTierMin = getNextTierMinPoints(loyaltyTier);
  const pointsNeeded = nextTierMin ? nextTierMin - loyaltyPoints : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Main Loyalty Card */}
      <Card className="overflow-hidden shadow-xl">
        <CardContent className="p-0">
          <div className={`${styling.gradient} relative p-6 text-white min-h-[200px]`}>
            {/* Card Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-6xl">🏆</div>
              <div className="absolute bottom-4 left-4 text-4xl opacity-20">✨</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">
                👑
              </div>
            </div>
            
            {/* Card Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-sm font-medium opacity-90">สมุยอักษร</h2>
                  <p className="text-xs opacity-75">LOYALTY CARD</p>
                </div>
                <Badge className={styling.badge}>
                  {loyaltyTier.toUpperCase()}
                </Badge>
              </div>

              {/* Customer Name */}
              <div className="mb-6">
                <h3 className="text-xl font-bold">{customerName}</h3>
                <p className="text-xs opacity-75">Member ID: {memberId}</p>
              </div>

              {/* Points Display */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-75 mb-1">แต้มสะสม</p>
                  <p className="text-3xl font-bold">{loyaltyPoints.toLocaleString()}</p>
                  <p className="text-xs opacity-75">Points</p>
                </div>
                
                {/* Chip Design */}
                <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded opacity-80 flex items-center justify-center">
                  <div className="w-6 h-4 bg-yellow-200 rounded-sm opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress to Next Tier */}
      {nextTier && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">ความคืบหน้าไปสู่ {nextTier}</h4>
                  <p className="text-sm text-gray-600">
                    ต้องการอีก {pointsNeeded.toLocaleString()} แต้ม
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{progress.toFixed(0)}%</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{getTierMinPoints(loyaltyTier).toLocaleString()}</span>
                <span>{nextTierMin?.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">🛒</div>
            <div className="text-2xl font-bold text-green-600">{totalOrders}</div>
            <div className="text-sm text-gray-600">ออเดอร์ทั้งหมด</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-sm text-gray-600">ยอดซื้อรวม</div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            🎁 สิทธิประโยชน์ {loyaltyTier}
          </h4>
          <div className="space-y-2">
            {getTierBenefits(loyaltyTier).map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferred Services */}
      {preferredServices && preferredServices.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              🏷️ บริการที่คุณใช้บ่อย
            </h4>
            <div className="flex flex-wrap gap-2">
              {preferredServices.map((service, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1"
                >
                  {service}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 เราแนะนำบริการเหล่านี้ตามประวัติการใช้งานของคุณ
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to get tier benefits
function getTierBenefits(tier: string): string[] {
  switch (tier.toLowerCase()) {
    case 'platinum':
      return [
        'ส่วนลด 15% ทุกรายการ',
        'จัดส่งฟรีทุกออเดอร์',
        'เซอร์วิสพิเศษ VIP',
        'ปรึกษาการออกแบบฟรี',
        'แต้มสะสม x3'
      ];
    case 'gold':
      return [
        'ส่วนลด 10% ทุกรายการ',
        'จัดส่งฟรีเมื่อซื้อครบ 1,000 บาท',
        'บริการด่วนพิเศษ',
        'แต้มสะสม x2'
      ];
    case 'silver':
      return [
        'ส่วนลด 5% ทุกรายการ',
        'จัดส่งฟรีเมื่อซื้อครบ 2,000 บาท',
        'แต้มสะสม x1.5'
      ];
    default: // Bronze
      return [
        'แต้มสะสม x1',
        'ส่วนลดพิเศษในโอกาสต่างๆ'
      ];
  }
}