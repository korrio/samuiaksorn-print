"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useRef } from 'react'
import useFetchLeadById from "@/hooks/useFetchLeadById";
import QrCodeGenerator from '@/components/QrCodeGenerator';
import { useSearchParams } from 'next/navigation';

export default function PrintJobPage() {
	const printRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  
  // Get optional query parameters
  const id = searchParams.get('id');
  const jobNo = searchParams.get('job');
  
  console.log("job",jobNo)
  
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
                margin: 10mm 10mm 10mm 10mm;
              }
              body {
                font-family: system-ui, -apple-system, sans-serif;
                padding: 0;
                margin: 0;
                font-size: 11pt;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                padding: 4px;
                text-align: left;
                border-bottom: 1px solid #ddd;
                font-size: 10pt;
              }
              th {
                background-color: #f2f2f2;
              }
              .print-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12px;
              }
              .print-title {
                font-size: 14pt;
                font-weight: bold;
                margin: 5px 0;
              }
              .print-price {
                font-size: 12pt;
                margin-top: 2px;
              }
              .card {
                padding: 8px !important;
                box-shadow: none !important;
                border: none !important;
              }
              @media print {
                .button-container {
                  display: none;
                }
                button {
                  display: none;
                }
                .card {
                  border: none !important;
                  box-shadow: none !important;
                }
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

  // Helper to get property value by name
  const getPropertyValue = (name: string, defaultValue: string = "-") => {
    if (!lead) return defaultValue;
    
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="button-container mb-4 flex justify-end">
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Print Job Details
        </button>
      </div>
      
      <div ref={printRef}>
        <Card className="p-2 relative card">
          {/* Header with logo and QR */}
          <div className="flex justify-between items-start mb-3 print-header">
            <div>
              <Image
                src="https://erpsamuiaksorn.com/web/binary/company_logo"
                alt="Company Logo"
                width={150}
                height={35}
                className="mb-2"
              />
              <div className="text-xxl font-semibold mb-1 print-title">{lead.name}</div>
              <div className="print-price">
                <span>ราคา {lead.expected_revenue.toFixed(2)} บาท</span>
              </div>
            </div>
            <QrCodeGenerator id={id || undefined} />
          </div>

          {/* Main content table */}
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="py-1 px-2 text-gray-600 w-1/4 font-medium">ลูกค้า</td>
                <td className="py-1 px-2 w-1/4">{lead.partner_id ? lead.partner_id[1] : "-"}</td>
                <td className="py-1 px-2 text-gray-600 w-1/4 font-medium">ประสานงาน</td>
                <td className="py-1 px-2 w-1/4">{lead.user_id ? lead.user_id[1] : "-"}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">อีเมลล์</td>
                <td className="py-1 px-2">{lead.email_from || "-"}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">วันที่นัดหมายส่งงาน</td>
                <td className="py-1 px-2">{formatDate(lead.date_deadline)}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">เบอร์โทร</td>
                <td className="py-1 px-2">{lead.phone || "-"}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">ประเภทงาน</td>
                <td className="py-1 px-2">{lead.tag_ids.length > 0 ? lead.tag_ids.join(', ') : "-"}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">Job No.</td>
                <td className="py-1 px-2">{getPropertyValue("2f9b502ecd32baca")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">(งานเก่า) Job No.</td>
                <td className="py-1 px-2">{getPropertyValue("455051be9d5872b1")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">รหัสลูกค้า</td>
                <td className="py-1 px-2">{getPropertyValue("781a8e4050b75ea0")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">ช่างอาร์ต</td>
                <td className="py-1 px-2">{getPropertyValue("cfa88ab31faaa9e3")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">เครื่องพิมพ์</td>
                <td className="py-1 px-2">{getPropertyValue("05545f6d64cf2f2e")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">ช่างพิมพ์/ปริ้น</td>
                <td className="py-1 px-2">{getPropertyValue("cfd03e83e1f2ad7b")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">กระดาษ/วัสดุ</td>
                <td className="py-1 px-2">{getPropertyValue("058e3b7a69e5ccc7")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">สีพิมพ์</td>
                <td className="py-1 px-2">{getPropertyValue("2bd3d4bb377c3ec4")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">ขนาดมาตรฐาน</td>
                <td className="py-1 px-2">{getPropertyValue("5116658ff12262b5")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">ขนาดระบุ</td>
                <td className="py-1 px-2">{getPropertyValue("8995a01cd158af5e")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">จำนวนใบ/ชุด</td>
                <td className="py-1 px-2">{getPropertyValue("a1c403ebe63df23d")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">ลำดับสีกระดาษ</td>
                <td className="py-1 px-2">{getPropertyValue("d788801775fe4bf4")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">เล่มที่</td>
                <td className="py-1 px-2">{getPropertyValue("1c1029ef80193852")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">เลขที่ No.</td>
                <td className="py-1 px-2">{getPropertyValue("be4eaaad4563df0f")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">หลังพิมพ์</td>
                <td className="py-1 px-2">{getPropertyValue("f589c675cf7ae380")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">จำนวนพิมพ์</td>
                <td className="py-1 px-2">{getPropertyValue("c1454aabcb10809c")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">ราคาต่อหน่วย</td>
                <td className="py-1 px-2">{getPropertyValue("13915b99e3484da1")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">ภาษีมูลค่าเพิ่ม (Vat)</td>
                <td className="py-1 px-2">{getPropertyValue("064c7a755c5c3fbb")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">ใบเสร็จ</td>
                <td className="py-1 px-2">{getPropertyValue("30e657f963f332d3")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">บิล No.</td>
                <td className="py-1 px-2">{getPropertyValue("1e1a2c1139e73a55")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">Stock งาน</td>
                <td className="py-1 px-2">{getPropertyValue("f97e8d714c4323ac")}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">Job PL / Job อาร์ตเก่า</td>
                <td className="py-1 px-2">{getPropertyValue("d66c58f992464e87")}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600 font-medium">วันที่เปิดงาน</td>
                <td className="py-1 px-2">{formatDate(lead.date_open)}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">วันที่ปิดงาน</td>
                <td className="py-1 px-2">{formatDate(lead.date_closed)}</td>
              </tr>
            </tbody>
          </table>
          
          {lead.description && (
            <div className="mt-3">
              <h3 className="text-gray-600 font-medium mb-1">รายละเอียด</h3>
              <hr className="mb-1" />
              <div dangerouslySetInnerHTML={{ __html: lead.description || '' }} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}