"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRef } from 'react'
import useFetchLeadById from "@/hooks/useFetchLeadById";
import QrCodeGenerator from '@/components/QrCodeGenerator';
import { useSearchParams } from 'next/navigation';

export default function MobilePrintJobPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  
  const id = searchParams.get('id');
  // const jobNo = searchParams.get('job');
  
  const { lead, isLoading, error } = useFetchLeadById(id);

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      document.body.innerHTML = `
        <html>
          <head>
            <title>Print</title>
            <style>
              @page {
                size: A4;
                margin: 10mm;
              }
              body {
                font-family: system-ui, -apple-system, sans-serif;
                padding: 0;
                margin: 0;
                font-size: 11pt;
              }
              .print-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 16px;
              }
              .print-item {
                display: flex;
                flex-direction: column;
                padding: 4px;
                border-bottom: 1px solid #ddd;
              }
              .print-label {
                font-size: 9pt;
                color: #666;
                font-weight: 500;
                margin-bottom: 2px;
              }
              .print-value {
                font-size: 10pt;
                word-break: break-word;
              }
              .print-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 16px;
              }
              .print-title {
                font-size: 14pt;
                font-weight: bold;
                margin: 8px 0 4px 0;
              }
              .print-price {
                font-size: 12pt;
                font-weight: 600;
                color: #333;
              }
              @media print {
                .no-print { display: none; }
                .button-container { display: none; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  const getPropertyValue = (name: string, defaultValue: string = "-") => {
    if (!lead) return defaultValue;
    
    const prop = lead.lead_properties.find(p => p.name === name);
    if (!prop) return defaultValue;
    
    if (prop.type === 'selection' && prop.selection) {
      const selectedOption = prop.selection.find(option => option[0] === prop.value);
      return selectedOption ? selectedOption[1] : defaultValue;
    }
    
    return prop.value || defaultValue;
  };

  const formatDate = (dateString: string | false) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 w-full max-w-sm">
          <div className="text-center">Loading...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 w-full max-w-sm">
          <div className="text-center text-red-500">Error: {error.message}</div>
        </Card>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 w-full max-w-sm">
          <div className="text-center text-gray-500">No data available</div>
        </Card>
      </div>
    );
  }

  const jobData = [
    { label: "ลูกค้า", value: lead.partner_id ? lead.partner_id[1] : "-" },
    { label: "ประสานงาน", value: lead.user_id ? lead.user_id[1] : "-" },
    { label: "อีเมลล์", value: lead.email_from || "-" },
    { label: "วันที่นัดส่งงาน", value: formatDate(lead.date_deadline) },
    { label: "เบอร์โทร", value: lead.phone || "-" },
    { label: "ประเภทงาน", value: lead.tag_ids.length > 0 ? lead.tag_ids.join(', ') : "-" },
    { label: "Job No.", value: getPropertyValue("2f9b502ecd32baca") },
    { label: "งานเก่า Job No.", value: getPropertyValue("455051be9d5872b1") },
    { label: "รหัสลูกค้า", value: getPropertyValue("781a8e4050b75ea0") },
    { label: "ช่างอาร์ต", value: getPropertyValue("cfa88ab31faaa9e3") },
    { label: "เครื่องพิมพ์", value: getPropertyValue("05545f6d64cf2f2e") },
    { label: "ช่างพิมพ์/ปริ้น", value: getPropertyValue("cfd03e83e1f2ad7b") },
    { label: "กระดาษ/วัสดุ", value: getPropertyValue("e695494263014454") },
    { label: "สีพิมพ์", value: getPropertyValue("2bd3d4bb377c3ec4") },
    { label: "ขนาดมาตรฐาน", value: getPropertyValue("5116658ff12262b5") },
    { label: "ขนาดระบุ", value: getPropertyValue("8995a01cd158af5e") },
    { label: "จำนวนใบ/ชุด", value: getPropertyValue("a1c403ebe63df23d") },
    { label: "ลำดับสีกระดาษ", value: getPropertyValue("d788801775fe4bf4") },
    { label: "เล่มที่", value: getPropertyValue("1c1029ef80193852") },
    { label: "เลขที่ No.", value: getPropertyValue("be4eaaad4563df0f") },
    { label: "หลังพิมพ์", value: getPropertyValue("b480cd0a8f660acb") },
    { label: "จำนวนพิมพ์", value: getPropertyValue("c1454aabcb10809c") },
    { label: "ราคาต่อหน่วย", value: getPropertyValue("13915b99e3484da1") },
    { label: "VAT", value: getPropertyValue("064c7a755c5c3fbb") },
    { label: "ใบเสร็จ", value: getPropertyValue("30e657f963f332d3") },
    { label: "บิล No.", value: getPropertyValue("1e1a2c1139e73a55") },
    { label: "Stock งาน", value: getPropertyValue("f97e8d714c4323ac") },
    { label: "Job PL/อาร์ตเก่า", value: getPropertyValue("d66c58f992464e87") },
    { label: "วันเปิดงาน", value: formatDate(lead.date_open) },
    { label: "วันปิดงาน", value: formatDate(lead.date_closed) },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Print Button - Fixed Top */}
      <div className="no-print sticky top-0 bg-white border-b border-gray-200 p-3 z-40 shadow-sm">
        <Button 
          onClick={handlePrint}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          🖨️ Print Job Details
        </Button>
      </div>

      <div ref={printRef} className="p-3">
        {/* Header Card */}
        <Card className="mb-3 p-3">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <Image
                src="https://erpsamuiaksorn.com/web/binary/company_logo"
                alt="Company Logo"
                width={120}
                height={28}
                className="mb-2"
              />
              <h1 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                {lead.name}
              </h1>
              <div className="text-lg font-semibold text-blue-600">
                ฿{lead.expected_revenue.toFixed(2)}
              </div>
            </div>
            <div className="ml-3 flex-shrink-0">
              <QrCodeGenerator id={id || undefined} />
            </div>
          </div>
        </Card>

        {/* Job Details Grid */}
        <Card className="p-3">
          <div className="grid grid-cols-1 gap-3">
            {jobData.map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
                <div className="text-xs font-medium text-gray-600 mb-1">
                  {item.label}
                </div>
                <div className="text-sm text-gray-900 break-words">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Description Section */}
          {lead.description && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-xs font-medium text-gray-600 mb-2">รายละเอียด</h3>
              <div 
                className="text-sm text-gray-900 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: lead.description || '' }} 
              />
            </div>
          )}
        </Card>
      </div>

      {/* Action Buttons - Fixed Bottom */}
      <div className="no-print fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 font-medium"
            onClick={() => {
              console.log('รับงาน clicked');
            }}
          >
            ✅ รับงาน
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={() => {
              console.log('ส่งงาน clicked');
            }}
          >
            📤 ส่งงาน
          </Button>
        </div>
      </div>
    </div>
  );
}