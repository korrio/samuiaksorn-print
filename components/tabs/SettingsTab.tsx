"use client"

import React from 'react';
import NotificationSettings from '@/components/NotificationSettings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clearCustomerAuth } from '@/utils/customerAuth';

interface SettingsTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  partner: any;
  partnerId: string;
}

export default function SettingsTab({
  partner,
  partnerId
}: SettingsTabProps) {
  const handleLogout = () => {
    clearCustomerAuth(partnerId);
    window.location.reload();
  };

  const handleContactSupport = () => {
    // Open LINE, WhatsApp, or phone dialer
    window.open('tel:+66123456789', '_self');
  };

  const handleFeedback = () => {
    window.open('mailto:feedback@erpsamuiaksorn.com?subject=Customer Feedback', '_blank');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">⚙️ การตั้งค่า</h2>
        <p className="text-gray-600">จัดการบัญชีและการแจ้งเตือน</p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👤 ข้อมูลบัญชี
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {partner?.name?.charAt(0) || 'C'}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{partner?.name}</div>
                <div className="text-sm text-gray-600">Customer ID: {partnerId}</div>
                <div className="text-sm text-gray-600">
                  {partner?.is_company ? 'บริษัท' : 'บุคคลธรรมดา'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">อีเมล:</span>
              <span className="font-medium">{partner?.email || 'ไม่ระบุ'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">โทรศัพท์:</span>
              <span className="font-medium">{partner?.phone || partner?.mobile || 'ไม่ระบุ'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">สมาชิกตั้งแต่:</span>
              <span className="font-medium">
                {partner?.create_date ? 
                  new Date(partner.create_date).toLocaleDateString('th-TH') : 
                  'ไม่ระบุ'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <NotificationSettings
        partnerId={partnerId}
        partnerEmail={partner?.email}
        partnerPhone={partner?.phone || partner?.mobile}
      />

      {/* Support & Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🆘 การช่วยเหลือ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start text-left bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            onClick={handleContactSupport}
          >
            <span className="mr-3">📞</span>
            <div className="text-left">
              <div className="font-medium">ติดต่อฝ่ายสนับสนุน</div>
              <div className="text-xs opacity-75">โทร 02-123-4567</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start text-left bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            onClick={handleFeedback}
          >
            <span className="mr-3">📝</span>
            <div className="text-left">
              <div className="font-medium">ส่งความคิดเห็น</div>
              <div className="text-xs opacity-75">แบ่งปันประสบการณ์การใช้งาน</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start text-left bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
          >
            <span className="mr-3">❓</span>
            <div className="text-left">
              <div className="font-medium">คำถามที่พบบ่อย</div>
              <div className="text-xs opacity-75">คู่มือการใช้งาน</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start text-left bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
          >
            <span className="mr-3">📋</span>
            <div className="text-left">
              <div className="font-medium">นโยบายความเป็นส่วนตัว</div>
              <div className="text-xs opacity-75">เงื่อนไขการใช้งาน</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📱 ข้อมูลแอป
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🏢</div>
            <div className="font-medium text-gray-900">สมุยอักษร Customer Portal</div>
            <div className="text-sm text-gray-600 mt-1">เวอร์ชัน 1.0.0</div>
            <div className="text-xs text-gray-500 mt-2">
              © 2025 บริการพิมพ์สมุยอักษร
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 pt-4 border-t border-gray-100">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-green-600 hover:bg-green-50"
            >
              <span className="text-lg">💬</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-600 hover:bg-blue-50"
            >
              <span className="text-lg">📘</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-pink-600 hover:bg-pink-50"
            >
              <span className="text-lg">📷</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            ⚠️ โซนอันตราย
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
            onClick={handleLogout}
          >
            🚪 ออกจากระบบ
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            คุณจะต้องยืนยันตัวตนใหม่ในครั้งถัดไป
          </p>
        </CardContent>
      </Card>
    </div>
  );
}