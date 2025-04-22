"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useParams } from 'next/navigation'

import useFetchLeadById from "@/hooks/useFetchLeadById";
import QrCodeGenerator from '@/components/QrCodeGenerator';

export default function TableModeLeadDetails() {
  const params = useParams();
  const id = params?.id as string;

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

        {/* Main content table */}
        <div className="overflow-hidden">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600 w-1/4">Customer</td>
                <td className="py-2 px-4 w-1/4">{lead.partner_id ? lead.partner_id[1] : "-"}</td>
                <td className="py-2 px-4 text-gray-600 w-1/4">Salesperson</td>
                <td className="py-2 px-4 w-1/4">
                  <Badge variant="secondary">{lead.user_id ? lead.user_id[1] : "-"}</Badge>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">Email</td>
                <td className="py-2 px-4">{lead.email_from || "-"}</td>
                <td className="py-2 px-4 text-gray-600">Expected Closing</td>
                <td className="py-2 px-4">{formatDate(lead.date_deadline)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">Phone</td>
                <td className="py-2 px-4">{lead.phone || "-"}</td>
                <td className="py-2 px-4 text-gray-600">Tags</td>
                <td className="py-2 px-4">{lead.tag_ids.length > 0 ? lead.tag_ids.join(', ') : "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">Job No.</td>
                <td className="py-2 px-4">{getPropertyValue("2f9b502ecd32baca")}</td>
                <td className="py-2 px-4 text-gray-600">Related Job No.</td>
                <td className="py-2 px-4">{getPropertyValue("455051be9d5872b1")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">Customer code</td>
                <td className="py-2 px-4">{getPropertyValue("781a8e4050b75ea0")}</td>
                <td className="py-2 px-4 text-gray-600">ช่างอาร์ต</td>
                <td className="py-2 px-4">{getPropertyValue("cfa88ab31faaa9e3")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">เครื่องพิมพ์</td>
                <td className="py-2 px-4">{getPropertyValue("05545f6d64cf2f2e")}</td>
                <td className="py-2 px-4 text-gray-600">ช่างพิมพ์/ปริ้น</td>
                <td className="py-2 px-4">{getPropertyValue("cfd03e83e1f2ad7b")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">กระดาษ/วัสดุ</td>
                <td className="py-2 px-4">{getPropertyValue("058e3b7a69e5ccc7")}</td>
                <td className="py-2 px-4 text-gray-600">สีพิมพ์</td>
                <td className="py-2 px-4">{getPropertyValue("2bd3d4bb377c3ec4")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">ขนาดมาตรฐาน</td>
                <td className="py-2 px-4">{getPropertyValue("5116658ff12262b5")}</td>
                <td className="py-2 px-4 text-gray-600">ขนาดระบุ</td>
                <td className="py-2 px-4">{getPropertyValue("8995a01cd158af5e")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">จำนวนใบ/ชุด</td>
                <td className="py-2 px-4">{getPropertyValue("a1c403ebe63df23d")}</td>
                <td className="py-2 px-4 text-gray-600">ลำดับสีกระดาษ</td>
                <td className="py-2 px-4">{getPropertyValue("d788801775fe4bf4")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">เล่มที่</td>
                <td className="py-2 px-4">{getPropertyValue("1c1029ef80193852")}</td>
                <td className="py-2 px-4 text-gray-600">เลขที่ No.</td>
                <td className="py-2 px-4">{getPropertyValue("be4eaaad4563df0f")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">หลังพิมพ์</td>
                <td className="py-2 px-4">{getPropertyValue("f589c675cf7ae380")}</td>
                <td className="py-2 px-4 text-gray-600">จำนวนพิมพ์</td>
                <td className="py-2 px-4">{getPropertyValue("c1454aabcb10809c")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">ราคาต่อหน่วย</td>
                <td className="py-2 px-4">{getPropertyValue("13915b99e3484da1")}</td>
                <td className="py-2 px-4 text-gray-600">ภาษีมูลค่าเพิ่ม (Vat)</td>
                <td className="py-2 px-4">{getPropertyValue("064c7a755c5c3fbb")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">ใบเสร็จ</td>
                <td className="py-2 px-4">{getPropertyValue("30e657f963f332d3")}</td>
                <td className="py-2 px-4 text-gray-600">บิล No.</td>
                <td className="py-2 px-4">{getPropertyValue("1e1a2c1139e73a55")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">Stock งาน</td>
                <td className="py-2 px-4">{getPropertyValue("f97e8d714c4323ac")}</td>
                <td className="py-2 px-4 text-gray-600">Job PL / Job อาร์ตเก่า</td>
                <td className="py-2 px-4">{getPropertyValue("d66c58f992464e87")}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">วันที่เปิดงาน</td>
                <td className="py-2 px-4">{formatDate(lead.date_open)}</td>
                <td className="py-2 px-4 text-gray-600">วันที่ปิดงาน</td>
                <td className="py-2 px-4">{formatDate(lead.date_closed)}</td>
              </tr>
            </tbody>
          </table>
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