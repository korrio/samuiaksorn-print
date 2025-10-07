"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Swal from 'sweetalert2';

interface OrderCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: string;
  partnerName: string;
  onOrderCreated: () => void;
}

interface OrderFormData {
  name: string;
  expected_revenue: string;
  date_deadline: string;
  description: string;
  // Lead properties
  paper_material: string;
  standard_size: string;
  custom_size: string;
  quantity_sheets: string;
  quantity_print: string;
  pages_per_book: string;
  book_number: string;
  print_colors: string;
  paper_color_order: string;
  post_printing: string;
  number_no: string;
  unit_price: string;
}

export default function OrderCreationModal({
  isOpen,
  onClose,
  partnerId,
  partnerName,
  onOrderCreated
}: OrderCreationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    expected_revenue: '',
    date_deadline: '',
    description: '',
    paper_material: '',
    standard_size: '',
    custom_size: '',
    quantity_sheets: '',
    quantity_print: '',
    pages_per_book: '',
    book_number: '',
    print_colors: '',
    paper_color_order: '',
    post_printing: '',
    number_no: '',
    unit_price: ''
  });

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.expected_revenue);
      case 2:
        return !!(formData.paper_material && formData.quantity_sheets);
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Prepare lead properties
      const leadProperties = [
        { name: "e695494263014454", value: formData.paper_material },
        { name: "5116658ff12262b5", value: formData.standard_size },
        { name: "8995a01cd158af5e", value: formData.custom_size },
        { name: "a1c403ebe63df23d", value: formData.quantity_sheets },
        { name: "c1454aabcb10809c", value: formData.quantity_print },
        { name: "eb1bdca381cad707", value: formData.pages_per_book },
        { name: "1c1029ef80193852", value: formData.book_number },
        { name: "2bd3d4bb377c3ec4", value: formData.print_colors },
        { name: "d788801775fe4bf4", value: formData.paper_color_order },
        { name: "b480cd0a8f660acb", value: formData.post_printing },
        { name: "be4eaaad4563df0f", value: formData.number_no },
        { name: "13915b99e3484da1", value: formData.unit_price }
      ].filter(prop => prop.value); // Only include non-empty values

      // Create the order/lead
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          partner_id: parseInt(partnerId),
          expected_revenue: parseFloat(formData.expected_revenue),
          date_deadline: formData.date_deadline || false,
          description: formData.description,
          lead_properties: leadProperties
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Success notification
        await Swal.fire({
          title: 'สำเร็จ!',
          html: `
            <div class="text-center">
              <div class="text-4xl mb-2">✅</div>
              <p>สร้างใบสั่งงานเรียบร้อยแล้ว</p>
              <p class="text-sm text-gray-600 mt-2">เลขที่งาน: ${result.data?.id || 'N/A'}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#10b981'
        });

        // Reset form and close modal
        setFormData({
          name: '',
          expected_revenue: '',
          date_deadline: '',
          description: '',
          paper_material: '',
          standard_size: '',
          custom_size: '',
          quantity_sheets: '',
          quantity_print: '',
          pages_per_book: '',
          book_number: '',
          print_colors: '',
          paper_color_order: '',
          post_printing: '',
          number_no: '',
          unit_price: ''
        });
        setCurrentStep(1);
        onOrderCreated();
        onClose();
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      await Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถสร้างใบสั่งงานได้ กรุณาลองใหม่อีกครั้ง',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const paperSizes = [
    'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6',
    'B0', 'B1', 'B2', 'B3', 'B4', 'B5',
    'Letter', 'Legal', 'Tabloid'
  ];

  const printColors = [
    '1 สี (ดำ)',
    '2 สี',
    '4 สี (CMYK)',
    'Pantone 1 สี',
    'Pantone 2 สี',
    'สีเต็ม + Pantone'
  ];

  const postPrintingOptions = [
    'ไม่มี',
    'เคลือบ UV',
    'เคลือบด้าน',
    'เคลือบเงา',
    'ปั๊มนูน',
    'ปั๊มฟอยล์',
    'ไดคัท',
    'พับ',
    'เข้าเล่ม'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📝 สร้างใบสั่งงานใหม่
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>ลูกค้า:</span>
            <span className="font-medium">{partnerName}</span>
          </div>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-8 h-1 ${
                  currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">ข้อมูลพื้นฐาน</h3>
                <p className="text-sm text-gray-600">กรอกรายละเอียดงานที่ต้องการ</p>
              </div>

              <div>
                <Label htmlFor="name">ชื่องาน *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="เช่น นามบัตร, โบรชัวร์, ป้าย"
                />
              </div>

              <div>
                <Label htmlFor="expected_revenue">งบประมาณ (บาท) *</Label>
                <Input
                  id="expected_revenue"
                  type="number"
                  value={formData.expected_revenue}
                  onChange={(e) => handleInputChange('expected_revenue', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="date_deadline">วันที่ต้องการ</Label>
                <Input
                  id="date_deadline"
                  type="date"
                  value={formData.date_deadline}
                  onChange={(e) => handleInputChange('date_deadline', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">รายละเอียดเพิ่มเติม</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="อธิบายรายละเอียดงานที่ต้องการ..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Print Specifications */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">ข้อมูลการพิมพ์</h3>
                <p className="text-sm text-gray-600">ระบุรายละเอียดการพิมพ์</p>
              </div>

              <div>
                <Label htmlFor="paper_material">กระดาษ/วัสดุ *</Label>
                <Input
                  id="paper_material"
                  value={formData.paper_material}
                  onChange={(e) => handleInputChange('paper_material', e.target.value)}
                  placeholder="เช่น Art Paper 150 แกรม"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="standard_size">ขนาดมาตรฐาน</Label>
                  <Select onValueChange={(value) => handleInputChange('standard_size', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกขนาด" />
                    </SelectTrigger>
                    <SelectContent>
                      {paperSizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="custom_size">ขนาดระบุ</Label>
                  <Input
                    id="custom_size"
                    value={formData.custom_size}
                    onChange={(e) => handleInputChange('custom_size', e.target.value)}
                    placeholder="เช่น 10x15 ซม."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="quantity_sheets">จำนวนใบ/ชุด *</Label>
                  <Input
                    id="quantity_sheets"
                    type="number"
                    value={formData.quantity_sheets}
                    onChange={(e) => handleInputChange('quantity_sheets', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity_print">จำนวนพิมพ์</Label>
                  <Input
                    id="quantity_print"
                    type="number"
                    value={formData.quantity_print}
                    onChange={(e) => handleInputChange('quantity_print', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="print_colors">สีพิมพ์</Label>
                <Select onValueChange={(value) => handleInputChange('print_colors', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสีพิมพ์" />
                  </SelectTrigger>
                  <SelectContent>
                    {printColors.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">รายละเอียดเพิ่มเติม</h3>
                <p className="text-sm text-gray-600">ข้อมูลเสริม (ไม่จำเป็น)</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="pages_per_book">จำนวนหน้า/เล่ม</Label>
                  <Input
                    id="pages_per_book"
                    type="number"
                    value={formData.pages_per_book}
                    onChange={(e) => handleInputChange('pages_per_book', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="book_number">เล่มที่</Label>
                  <Input
                    id="book_number"
                    value={formData.book_number}
                    onChange={(e) => handleInputChange('book_number', e.target.value)}
                    placeholder="เช่น 1, 2, 3"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="post_printing">หลังพิมพ์</Label>
                <Select onValueChange={(value) => handleInputChange('post_printing', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกงานหลังพิมพ์" />
                  </SelectTrigger>
                  <SelectContent>
                    {postPrintingOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="unit_price">ราคาต่อหน่วย</Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) => handleInputChange('unit_price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="number_no">เลขที่ No.</Label>
                  <Input
                    id="number_no"
                    value={formData.number_no}
                    onChange={(e) => handleInputChange('number_no', e.target.value)}
                    placeholder="หมายเลขอ้างอิง"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                >
                  ← ย้อนกลับ
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                ยกเลิก
              </Button>
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep) || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ถัดไป →
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      กำลังส่ง...
                    </div>
                  ) : (
                    '✅ สร้างใบสั่งงาน'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}