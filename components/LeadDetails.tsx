"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useParams } from 'next/navigation'

import useFetchLeadById from "@/hooks/useFetchLeadById";
import QrCodeGenerator from '@/components/QrCodeGenerator';

export default function PrintJobDetails() {
  const params = useParams();
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

  // Extract lead properties into a more usable format
  const properties = lead.lead_properties.reduce((acc: Record<string, any>, prop) => {
    acc[prop.name] = prop.value;
    return acc;
  }, {});

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
      <Card className="p-6 max-w-3xl mx-auto relative">
        {/* Header with logo and QR */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Image
              src="https://erpsamuiaksorn.com/web/binary/company_logo"
              alt="Company Logo"
              width={180}
              height={40}
              className="mb-4"
            />
            <h1 className="text-2xl font-semibold mb-2">{lead.name}</h1>
            <div className="gap-2">
              <span className="text-2xl font-large">{lead.expected_revenue.toFixed(2)} บาท</span><br/>
            </div>
          </div>
          <QrCodeGenerator />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-4">
            {/* Left column */}
            <div className="flex justify-between">
              <span className="text-gray-600">Customer</span>
              <span>{lead.partner_id ? lead.partner_id[1] : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span>{lead.email_from || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone</span>
              <span>{lead.phone || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Job No.</span>
              <span>{getPropertyValue("2f9b502ecd32baca")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer code</span>
              <span>{getPropertyValue("781a8e4050b75ea0")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เครื่องพิมพ์</span>
              <span>{getPropertyValue("05545f6d64cf2f2e")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">กระดาษ/วัสดุ</span>
              <span>{getPropertyValue("058e3b7a69e5ccc7")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ขนาดมาตรฐาน</span>
              <span>{getPropertyValue("5116658ff12262b5")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ขนาดระบุ</span>
              <span>{getPropertyValue("8995a01cd158af5e")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เล่มที่</span>
              <span>{getPropertyValue("1c1029ef80193852")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stock งาน</span>
              <span>{getPropertyValue("f97e8d714c4323ac")}</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Right column */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Salesperson</span>
              <Badge variant="secondary">{lead.user_id ? lead.user_id[1] : "-"}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expected Closing</span>
              <span>{formatDate(lead.date_deadline)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ช่างอาร์ต</span>
              <span>{getPropertyValue("cfa88ab31faaa9e3")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ช่างพิมพ์/ปริ้น</span>
              <span>{getPropertyValue("cfd03e83e1f2ad7b")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">สีพิมพ์</span>
              <span>{getPropertyValue("2bd3d4bb377c3ec4")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">จำนวนใบ/ชุด</span>
              <span>{getPropertyValue("a1c403ebe63df23d")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ลำดับสีกระดาษ</span>
              <span>{getPropertyValue("d788801775fe4bf4")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เลขที่ No.</span>
              <span>{getPropertyValue("be4eaaad4563df0f")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">หลังพิมพ์</span>
              <span>{getPropertyValue("f589c675cf7ae380")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">จำนวนพิมพ์</span>
              <span>{getPropertyValue("c1454aabcb10809c")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ราคาต่อหน่วย</span>
              <span>{getPropertyValue("13915b99e3484da1")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ภาษีมูลค่าเพิ่ม (Vat)</span>
              <span>{getPropertyValue("064c7a755c5c3fbb")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ใบเสร็จ</span>
              <span>{getPropertyValue("30e657f963f332d3")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">บิล No.</span>
              <span>{getPropertyValue("1e1a2c1139e73a55")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Job PL / Job อาร์ตเก่า</span>
              <span>{getPropertyValue("d66c58f992464e87")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วันที่เปิดงาน</span>
              <span>{formatDate(lead.date_open)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วันที่ปิดงาน</span>
              <span>{formatDate(lead.date_closed)}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {lead.description && (
        <Card className="mt-5 p-6 max-w-3xl mx-auto relative">
          <div className="">
            <span className="text-gray-600">รายละเอียด</span><hr/>
            <div className="mt-2" dangerouslySetInnerHTML={{ __html: lead.description || '' }} />
          </div>
        </Card>
      )}
    </>
  );
}