"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

import useFetchLeadById from "@/hooks/useFetchLeadById";
import QrCodeGenerator from '@/components/QrCodeGenerator';

export default function PrintJobDetailsNew() {
  const id = "2396"

  const { lead, isLoading, error } = useFetchLeadById(id);

  if (isLoading) {
    return (
      <Card className="p-6 max-w-3xl mx-auto">
        <div className="text-center">Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 max-w-3xl mx-auto">
        <div className="text-center text-red-500">Error loading lead: {error.message}</div>
      </Card>
    );
  }

  if (!lead) {
    return (
      <Card className="p-6 max-w-3xl mx-auto">
        <div className="text-center text-gray-500">No data available</div>
      </Card>
    );
  }

  // Helper to get property value by name
  const getPropertyValue = (name: string, defaultValue: string = "-") => {
    const prop = lead.lead_properties.find(p => p.name === name);
    if (!prop) return defaultValue;
    
    // Handle selection type properties
    if (prop.type === 'selection' && prop.selection) {
      const selectedOption = prop.selection.find(option => option[0] === prop.value);
      return selectedOption ? selectedOption[1] : defaultValue;
    }
    
    return prop.value || defaultValue;
  };

  // Format date
  const formatDate = (dateString: string | false) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="pb-20"> {/* Add padding bottom for sticky buttons */}
        <Card className="p-4 sm:p-6 max-w-3xl mx-auto relative">
          {/* Header with logo and QR */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
            <div className="flex-1">
              <Image
                src="https://erpsamuiaksorn.com/web/binary/company_logo"
                alt="Company Logo"
                width={180}
                height={40}
                className="mb-4 w-32 sm:w-44 h-auto"
              />
              <h1 className="text-xl sm:text-2xl font-semibold mb-2">{lead.name}</h1>
              <div className="gap-2">
                <span className="text-xl sm:text-2xl font-large">{lead.expected_revenue.toFixed(2)} บาท</span><br/>
              </div>
            </div>
            <div className="flex-shrink-0">
              <QrCodeGenerator />
            </div>
          </div>

          {/* Main content grid - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
            {/* Left column */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">Customer</span>
                <span className="text-sm sm:text-base break-all">{lead.partner_id ? lead.partner_id[1] : "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">Email</span>
                <span className="text-sm sm:text-base break-all">{lead.email_from || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">Phone</span>
                <span className="text-sm sm:text-base">{lead.phone || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">Job No.</span>
                <span className="text-sm sm:text-base">{getPropertyValue("2f9b502ecd32baca")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">Customer code</span>
                <span className="text-sm sm:text-base">{getPropertyValue("781a8e4050b75ea0")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">เครื่องพิมพ์</span>
                <span className="text-sm sm:text-base">{getPropertyValue("05545f6d64cf2f2e")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">กระดาษ/วัสดุ</span>
                <span className="text-sm sm:text-base">{getPropertyValue("058e3b7a69e5ccc7")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">ขนาดมาตรฐาน</span>
                <span className="text-sm sm:text-base">{getPropertyValue("5116658ff12262b5")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">ขนาดระบุ</span>
                <span className="text-sm sm:text-base">{getPropertyValue("8995a01cd158af5e")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">เล่มที่</span>
                <span className="text-sm sm:text-base">{getPropertyValue("1c1029ef80193852")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">Stock งาน</span>
                <span className="text-sm sm:text-base">{getPropertyValue("f97e8d714c4323ac")}</span>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-3 sm:space-y-4 mt-6 lg:mt-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">Salesperson</span>
                <Badge variant="secondary" className="w-fit text-xs sm:text-sm">{lead.user_id ? lead.user_id[1] : "-"}</Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">Expected Closing</span>
                <span className="text-sm sm:text-base">{formatDate(lead.date_deadline)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">ช่างอาร์ต</span>
                <span className="text-sm sm:text-base">{getPropertyValue("cfa88ab31faaa9e3")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">ช่างพิมพ์/ปริ้น</span>
                <span className="text-sm sm:text-base">{getPropertyValue("cfd03e83e1f2ad7b")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">สีพิมพ์</span>
                <span className="text-sm sm:text-base">{getPropertyValue("2bd3d4bb377c3ec4")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">จำนวนใบ/ชุด</span>
                <span className="text-sm sm:text-base">{getPropertyValue("a1c403ebe63df23d")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">ลำดับสีกระดาษ</span>
                <span className="text-sm sm:text-base">{getPropertyValue("d788801775fe4bf4")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">เลขที่ No.</span>
                <span className="text-sm sm:text-base">{getPropertyValue("be4eaaad4563df0f")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">หลังพิมพ์</span>
                <span className="text-sm sm:text-base">{getPropertyValue("f589c675cf7ae380")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">จำนวนพิมพ์</span>
                <span className="text-sm sm:text-base">{getPropertyValue("c1454aabcb10809c")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">ราคาต่อหน่วย</span>
                <span className="text-sm sm:text-base">{getPropertyValue("13915b99e3484da1")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">ภาษีมูลค่าเพิ่ม (Vat)</span>
                <span className="text-sm sm:text-base">{getPropertyValue("064c7a755c5c3fbb")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">ใบเสร็จ</span>
                <span className="text-sm sm:text-base">{getPropertyValue("30e657f963f332d3")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">บิล No.</span>
                <span className="text-sm sm:text-base">{getPropertyValue("1e1a2c1139e73a55")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">Job PL / Job อาร์ตเก่า</span>
                <span className="text-sm sm:text-base">{getPropertyValue("d66c58f992464e87")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">วันที่เปิดงาน</span>
                <span className="text-sm sm:text-base">{formatDate(lead.date_open)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm sm:text-base font-medium">วันที่ปิดงาน</span>
                <span className="text-sm sm:text-base">{formatDate(lead.date_closed)}</span>
              </div>
            </div>
          </div>
        </Card>
        
        {lead.description && (
          <Card className="mt-5 p-4 sm:p-6 max-w-3xl mx-auto relative">
            <div className="">
              <span className="text-gray-600 text-sm sm:text-base font-medium">รายละเอียด</span><hr/>
              <div className="mt-2 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: lead.description || '' }} />
            </div>
          </Card>
        )}
      </div>

      {/* Sticky Footer with Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between gap-4 z-50 shadow-lg">
        <Button 
          variant="outline" 
          className="flex-1 max-w-32 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
          onClick={() => {
            // Handle รับงาน action
            console.log('รับงาน clicked');
          }}
        >
          รับงาน
        </Button>
        <Button 
          className="flex-1 max-w-32 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            // Handle ส่งงาน action
            console.log('ส่งงาน clicked');
          }}
        >
          ส่งงาน
        </Button>
      </div>
    </>
  );
}