import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

interface LeadProperty {
  name: string
  value: string | number | boolean
  type: string
  string: string
}

interface PrintJobData {
  id: number
  name: string
  expected_revenue: number
  probability: number
  partner_name: string
  email_from: string | null
  phone: string
  user_id: [number, string]
  date_deadline: string
  lead_properties: LeadProperty[]
}

interface PrintJobResponse {
  jsonrpc: string
  id: null
  result: PrintJobData[]
}

interface PrintJobProps {
  data?: PrintJobResponse
}

export default function PrintJobDetails({ data }: PrintJobProps) {
  if (!data?.result?.[0]) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">No data available</div>
      </Card>
    )
  }

  const job = data.result[0]

  // Extract lead properties into a more usable format
  const properties = job.lead_properties.reduce((acc: Record<string, any>, prop: LeadProperty) => {
    acc[prop.name] = prop.value
    return acc
  }, {})

  return (
    <Card className="p-6 max-w-3xl mx-auto relative">
      {/* Green corner banner */}
      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
        <div className="bg-green-600 text-white text-sm font-medium py-1 px-8 rotate-45 transform origin-bottom-right translate-y-12 translate-x-6">
          งานเสร็จ
        </div>
      </div>

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
          <h1 className="text-2xl font-semibold mb-2">{job.name}</h1>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-medium">฿ {job.expected_revenue.toFixed(2)}</span>
            <span className="text-gray-600">at {job.probability.toFixed(2)} %</span>
          </div>
        </div>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202568-02-25%20at%2013.34.02-8zjxY8nWFDhunxFSSq0pFsm35lguqk.png"
          alt="QR Code"
          width={120}
          height={120}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="space-y-4">
          {/* Left column */}
          <div className="flex justify-between">
            <span className="text-gray-600">Customer</span>
            <span>{job.partner_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email</span>
            <span>{job.email_from || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone</span>
            <span>{job.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Job No.</span>
            <span>{properties["2f9b502ecd32baca"] || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Customer code</span>
            <span>{properties["781a8e4050b75ea0"] || "Other"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">เครื่องพิมพ์</span>
            <span>{properties["05545f6d64cf2f2e"] === "80b87c656e37c167" ? "Digital" : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Job PL / Job Art เก่า</span>
            <span>{properties["c9257225ad8e43db"] || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ราคาต่อหน่วย</span>
            <span>{properties["13915b99e3484da1"] || "-"}</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Right column */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Salesperson</span>
            <Badge variant="secondary">{job.user_id[1]}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Expected Closing</span>
            <div className="flex items-center gap-1">
              <span>{job.date_deadline ? new Date(job.date_deadline).toLocaleDateString() : "-"}</span>
              <div className="flex">
                {[1, 2, 3].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">จำนวนพิมพ์</span>
            <span>{properties["894f129640e26c80"] || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">วัสดุ</span>
            <span>{properties["058e3b7a69e5ccc7"] === "da09cbc556df4962" ? "กระดาษ Brisk 270g" : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ขนาด</span>
            <span>{properties["5116658ff12262b5"] === "d4f5d50e5b751087" ? "A4" : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">บิล No.</span>
            <span>{properties["1e1a2c1139e73a55"] || "-"}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

