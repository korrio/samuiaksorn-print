"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import NotificationService, { NotificationPreferences } from '@/services/notificationService';
import Swal from 'sweetalert2';

interface NotificationSettingsProps {
  partnerId: string;
  partnerEmail?: string;
  partnerPhone?: string;
}

export default function NotificationSettings({
  partnerId,
  partnerEmail,
  partnerPhone
}: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    sms_notifications: true,
    notification_types: {
      lead_created: true,
      lead_completed: true,
      lead_updated: false
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const notificationService = new NotificationService();

  // Load current preferences
  useEffect(() => {
    loadPreferences();
  }, [partnerId]);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      // Try to fetch existing preferences (this would need to be implemented in the service)
      // For now, using default preferences
      const defaultPrefs: NotificationPreferences = {
        email_notifications: true,
        sms_notifications: true,
        notification_types: {
          lead_created: true,
          lead_completed: true,
          lead_updated: false
        }
      };
      setPreferences(defaultPrefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationTypeChange = (type: keyof NotificationPreferences['notification_types'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notification_types: {
        ...prev.notification_types,
        [type]: value
      }
    }));
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      const success = await notificationService.updateNotificationPreferences(
        parseInt(partnerId),
        preferences
      );

      if (success) {
        await Swal.fire({
          title: 'สำเร็จ!',
          text: 'บันทึกการตั้งค่าเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      await Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกการตั้งค่าได้',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testNotification = async (type: 'email' | 'sms') => {
    try {
      if (type === 'email' && partnerEmail) {
        // Test email notification
        Swal.fire({
          title: 'กำลังส่งทดสอบ...',
          text: `กำลังส่งอีเมลทดสอบไปที่ ${partnerEmail}`,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Simulate email sending (you would integrate with actual email service)
        setTimeout(() => {
          Swal.fire({
            title: 'ส่งเรียบร้อย!',
            text: `ได้ส่งอีเมลทดสอบไปที่ ${partnerEmail} แล้ว`,
            icon: 'success',
            confirmButtonText: 'ตกลง'
          });
        }, 2000);

      } else if (type === 'sms' && partnerPhone) {
        // Test SMS notification
        Swal.fire({
          title: 'กำลังส่งทดสอบ...',
          text: `กำลังส่ง SMS ทดสอบไปที่ ${partnerPhone}`,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Simulate SMS sending (you would integrate with actual SMS service)
        setTimeout(() => {
          Swal.fire({
            title: 'ส่งเรียบร้อย!',
            text: `ได้ส่ง SMS ทดสอบไปที่ ${partnerPhone} แล้ว`,
            icon: 'success',
            confirmButtonText: 'ตกลง'
          });
        }, 2000);
      } else {
        Swal.fire({
          title: 'ไม่สามารถทดสอบได้',
          text: type === 'email' ? 'ไม่พบอีเมล' : 'ไม่พบเบอร์โทรศัพท์',
          icon: 'warning',
          confirmButtonText: 'ตกลง'
        });
      }
    } catch (error) {
      console.error('Error testing notification:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถส่งการทดสอบได้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔔 การแจ้งเตือน
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">ช่องทางติดต่อ</h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📧</span>
              <span>{partnerEmail || 'ไม่ระบุอีเมล'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📱</span>
              <span>{partnerPhone || 'ไม่ระบุเบอร์โทร'}</span>
            </div>
          </div>
        </div>

        {/* Notification Methods */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">วิธีการแจ้งเตือน</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">
                    อีเมล
                  </Label>
                  <p className="text-sm text-gray-600">
                    รับการแจ้งเตือนผ่านอีเมล
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testNotification('email')}
                  disabled={!partnerEmail}
                >
                  ทดสอบ
                </Button>
                <Switch
                  id="email-notifications"
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
                  disabled={!partnerEmail}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <Label htmlFor="sms-notifications" className="font-medium">
                    SMS
                  </Label>
                  <p className="text-sm text-gray-600">
                    รับการแจ้งเตือนผ่าน SMS
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testNotification('sms')}
                  disabled={!partnerPhone}
                >
                  ทดสอบ
                </Button>
                <Switch
                  id="sms-notifications"
                  checked={preferences.sms_notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('sms_notifications', checked)}
                  disabled={!partnerPhone}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">ประเภทการแจ้งเตือน</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <Label htmlFor="lead-created" className="font-medium">
                    งานใหม่
                  </Label>
                  <p className="text-sm text-gray-600">
                    แจ้งเตือนเมื่อมีการสร้างใบสั่งงานใหม่
                  </p>
                </div>
              </div>
              <Switch
                id="lead-created"
                checked={preferences.notification_types.lead_created}
                onCheckedChange={(checked) => handleNotificationTypeChange('lead_created', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <Label htmlFor="lead-completed" className="font-medium">
                    งานเสร็จ
                  </Label>
                  <p className="text-sm text-gray-600">
                    แจ้งเตือนเมื่องานเสร็จสมบูรณ์
                  </p>
                </div>
              </div>
              <Switch
                id="lead-completed"
                checked={preferences.notification_types.lead_completed}
                onCheckedChange={(checked) => handleNotificationTypeChange('lead_completed', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <Label htmlFor="lead-updated" className="font-medium">
                    อัปเดตสถานะ
                  </Label>
                  <p className="text-sm text-gray-600">
                    แจ้งเตือนเมื่อมีการเปลี่ยนสถานะงาน
                  </p>
                </div>
              </div>
              <Switch
                id="lead-updated"
                checked={preferences.notification_types.lead_updated}
                onCheckedChange={(checked) => handleNotificationTypeChange('lead_updated', checked)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={savePreferences}
            disabled={isSaving}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                กำลังบันทึก...
              </div>
            ) : (
              '💾 บันทึกการตั้งค่า'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}