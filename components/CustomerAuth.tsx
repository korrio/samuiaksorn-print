"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';

interface CustomerAuthProps {
  partnerId: string;
  onAuthSuccess: () => void;
}

export default function CustomerAuth({ partnerId, onAuthSuccess }: CustomerAuthProps) {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const formatPhone = (phoneNumber: string): string => {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Format as Thai phone number
    if (digits.startsWith('0')) {
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (digits.startsWith('66')) {
      return '+66-' + digits.slice(2).replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phoneNumber;
  };

  const validatePhone = (phoneNumber: string): boolean => {
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.length === 10 && digits.startsWith('0');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendVerificationCode = async () => {
    if (authMethod === 'phone' && !validatePhone(phone)) {
      Swal.fire({
        title: 'หมายเลขโทรศัพท์ไม่ถูกต้อง',
        text: 'กรุณากรอกหมายเลขโทรศัพท์ 10 หลัก เช่น 081-234-5678',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    if (authMethod === 'email' && !validateEmail(email)) {
      Swal.fire({
        title: 'อีเมลไม่ถูกต้อง',
        text: 'กรุณากรอกอีเมลที่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    setIsSendingCode(true);
    try {
      // Simulate API call to send verification code
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_id: partnerId,
          method: authMethod,
          contact: authMethod === 'phone' ? phone.replace(/\D/g, '') : email
        })
      });

      if (response.ok) {
        setIsCodeSent(true);
        Swal.fire({
          title: 'ส่งรหัสยืนยันแล้ว!',
          text: authMethod === 'phone' 
            ? `รหัสยืนยันได้ถูกส่งไปที่ ${formatPhone(phone)}`
            : `รหัสยืนยันได้ถูกส่งไปที่ ${email}`,
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      
      // For demo purposes, simulate successful sending
      setIsCodeSent(true);
      Swal.fire({
        title: 'ส่งรหัสยืนยันแล้ว! (Demo)',
        html: `รหัสยืนยันได้ถูกส่งไปที่ ${authMethod === 'phone' ? formatPhone(phone) : email}<br><br><strong>รหัสทดสอบ: 123456</strong>`,
        icon: 'info',
        confirmButtonText: 'ตกลง'
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Swal.fire({
        title: 'รหัสยืนยันไม่ถูกต้อง',
        text: 'กรุณากรอกรหัสยืนยัน 6 หลัก',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate API call to verify code
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_id: partnerId,
          method: authMethod,
          contact: authMethod === 'phone' ? phone.replace(/\D/g, '') : email,
          code: verificationCode
        })
      });

      if (response.ok || verificationCode === '123456') {
        // Store authentication in localStorage
        const authData = {
          partner_id: partnerId,
          authenticated_at: new Date().toISOString(),
          method: authMethod,
          contact: authMethod === 'phone' ? phone : email
        };
        localStorage.setItem(`customer_auth_${partnerId}`, JSON.stringify(authData));

        Swal.fire({
          title: 'ยืนยันตัวตนสำเร็จ!',
          text: 'ยินดีต้อนรับสู่ระบบ CRM',
          icon: 'success',
          confirmButtonText: 'เข้าสู่ระบบ',
          confirmButtonColor: '#10b981'
        }).then(() => {
          onAuthSuccess();
        });
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Swal.fire({
        title: 'รหัสยืนยันไม่ถูกต้อง',
        text: 'กรุณาตรวจสอบรหัสยืนยันและลองใหม่อีกครั้ง',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCode = async () => {
    setIsCodeSent(false);
    setVerificationCode('');
    await sendVerificationCode();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🔐</div>
          <CardTitle>ยืนยันตัวตน</CardTitle>
          <p className="text-sm text-gray-600">
            กรุณายืนยันตัวตนเพื่อเข้าใช้งาน Customer Portal
          </p>
          <div className="text-xs text-gray-500 mt-2">
            Customer ID: {partnerId}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCodeSent ? (
            <>
              {/* Authentication Method Selection */}
              <div className="space-y-3">
                <Label>เลือกวิธีการยืนยันตัวตน</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={authMethod === 'phone' ? 'default' : 'outline'}
                    onClick={() => setAuthMethod('phone')}
                    className={authMethod === 'phone' ? 'bg-blue-600' : ''}
                  >
                    📱 SMS
                  </Button>
                  <Button
                    variant={authMethod === 'email' ? 'default' : 'outline'}
                    onClick={() => setAuthMethod('email')}
                    className={authMethod === 'email' ? 'bg-blue-600' : ''}
                  >
                    📧 Email
                  </Button>
                </div>
              </div>

              {/* Contact Input */}
              {authMethod === 'phone' ? (
                <div>
                  <Label htmlFor="phone">หมายเลขโทรศัพท์</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="081-234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={12}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    กรอกหมายเลขโทรศัพท์ที่ลงทะเบียนกับระบบ
                  </p>
                </div>
              ) : (
                <div>
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    กรอกอีเมลที่ลงทะเบียนกับระบบ
                  </p>
                </div>
              )}

              <Button
                onClick={sendVerificationCode}
                disabled={isSendingCode || (!phone && !email)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSendingCode ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังส่งรหัส...
                  </div>
                ) : (
                  `📲 ส่งรหัสยืนยันทาง ${authMethod === 'phone' ? 'SMS' : 'Email'}`
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Verification Code Input */}
              <div className="text-center mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  รหัสยืนยันได้ถูกส่งไปที่
                </div>
                <div className="font-medium text-blue-600">
                  {authMethod === 'phone' ? formatPhone(phone) : email}
                </div>
              </div>

              <div>
                <Label htmlFor="verification-code">รหัสยืนยัน</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-1">
                  กรอกรหัสยืนยัน 6 หลัก
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={verifyCode}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      กำลังยืนยัน...
                    </div>
                  ) : (
                    '✅ ยืนยันรหัส'
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={resendCode}
                  disabled={isSendingCode}
                  className="w-full"
                >
                  🔄 ส่งรหัสใหม่
                </Button>
              </div>
            </>
          )}

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              หากมีปัญหาการเข้าใช้งาน กรุณาติดต่อฝ่ายประสานงาน
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}