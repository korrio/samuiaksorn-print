"use client"

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, FileText, DollarSign, Calendar, Printer, Package, Eye, Settings, User, LucideIcon } from 'lucide-react';

interface DashboardData {
  totalSales: number;
  totalJobs: number;
  totalCustomers: number;
  monthlyGrowth: number;
}

interface JobStage {
  stage: string;
  count: number;
  color: string;
}

interface JobType {
  type: string;
  count: number;
  value: number;
  color: string;
}

interface MonthlySale {
  month: string;
  sales: number;
  jobs: number;
}

interface CustomerData {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

interface ArtDesigner {
  name: string;
  jobs: number;
  status: 'available' | 'busy';
  workload: number;
  color: string;
}

interface PrintingMachine {
  name: string;
  status: 'running' | 'idle' | 'maintenance';
  jobs: number;
  efficiency: number;
  color: string;
}

interface PrintOperator {
  name: string;
  machine: string;
  jobs: number;
  status: 'working' | 'break' | 'idle';
  shift: 'morning' | 'afternoon' | 'evening';
  color: string;
}

interface CancelledJob {
  reason: string;
  count: number;
  percentage: number;
  color: string;
}

interface StockJob {
  customer: string;
  jobType: string;
  quantity: number;
  stockLevel: number;
  lastOrder: string;
  status: 'ready' | 'low' | 'critical';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  color: string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

const CRMDashboard = () => {
  // Mock data - ในการใช้งานจริงจะเชื่อมต่อกับ Odoo API
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalSales: 2580000,
    totalJobs: 156,
    totalCustomers: 87,
    monthlyGrowth: 12.5
  });

  // ข้อมูลงานแต่ละ Stage
  const jobStages: JobStage[] = [
    { stage: 'Quotation', count: 23, color: '#fbbf24' },
    { stage: 'In Production', count: 18, color: '#3b82f6' },
    { stage: 'Quality Check', count: 8, color: '#f59e0b' },
    { stage: 'Ready', count: 12, color: '#10b981' },
    { stage: 'Delivered', count: 95, color: '#6b7280' }
  ];

  // ข้อมูลประเภทงาน
  const jobTypes: JobType[] = [
    { type: 'นามบัตร', count: 45, value: 450000, color: '#3b82f6' },
    { type: 'ใบปลิว', count: 32, value: 380000, color: '#10b981' },
    { type: 'บิล/ใบเสร็จ', count: 28, value: 520000, color: '#f59e0b' },
    { type: 'โบรชัวร์', count: 18, value: 720000, color: '#ef4444' },
    { type: 'สติกเกอร์', count: 21, value: 290000, color: '#8b5cf6' },
    { type: 'อื่นๆ', count: 12, value: 220000, color: '#6b7280' }
  ];

  // ข้อมูลยอดขายรายเดือน
  const monthlySales: MonthlySale[] = [
    { month: 'ม.ค.', sales: 2100000, jobs: 18 },
    { month: 'ก.พ.', sales: 1950000, jobs: 16 },
    { month: 'มี.ค.', sales: 2350000, jobs: 22 },
    { month: 'เม.ย.', sales: 2200000, jobs: 19 },
    { month: 'พ.ค.', sales: 2580000, jobs: 24 },
    { month: 'มิ.ย.', sales: 2750000, jobs: 26 }
  ];

  // ลูกค้าใหม่และเก่า
  const customerData: CustomerData[] = [
    { type: 'ลูกค้าเก่า', count: 62, percentage: 71.3, color: '#3b82f6' },
    { type: 'ลูกค้าใหม่', count: 25, percentage: 28.7, color: '#10b981' }
  ];

  // ข้อมูลช่างอาร์ต
  const artDesigners: ArtDesigner[] = [
    { name: 'aoe', jobs: 12, status: 'available', workload: 75, color: '#3b82f6' },
    { name: 'pad', jobs: 8, status: 'busy', workload: 95, color: '#ef4444' },
    { name: 'tangmo', jobs: 15, status: 'available', workload: 60, color: '#10b981' },
    { name: 'pek', jobs: 6, status: 'available', workload: 40, color: '#8b5cf6' }
  ];

  // ข้อมูลเครื่องพิมพ์
  const printingMachines: PrintingMachine[] = [
    { name: 'inkjet', status: 'running', jobs: 8, efficiency: 92, color: '#3b82f6' },
    { name: 'digital', status: 'idle', jobs: 5, efficiency: 88, color: '#6b7280' },
    { name: 'MO4', status: 'running', jobs: 12, efficiency: 95, color: '#10b981' },
    { name: 'MO2', status: 'maintenance', jobs: 0, efficiency: 0, color: '#f59e0b' },
    { name: 'GTO4', status: 'running', jobs: 6, efficiency: 89, color: '#3b82f6' },
    { name: 'GTO1', status: 'idle', jobs: 2, efficiency: 85, color: '#6b7280' },
    { name: 'ตัด5', status: 'running', jobs: 4, efficiency: 90, color: '#10b981' },
    { name: 'ตัด11', status: 'running', jobs: 7, efficiency: 93, color: '#10b981' }
  ];

  // ข้อมูลช่างพิมพ์
  const printOperators: PrintOperator[] = [
    { name: 'sorn', machine: 'MO4', jobs: 12, status: 'working', shift: 'morning', color: '#3b82f6' },
    { name: 'ton', machine: 'inkjet', jobs: 8, status: 'working', shift: 'morning', color: '#10b981' },
    { name: 'ae(แอ้)', machine: 'GTO4', jobs: 6, status: 'break', shift: 'afternoon', color: '#f59e0b' },
    { name: 'mek(เมฆ)', machine: 'digital', jobs: 5, status: 'working', shift: 'afternoon', color: '#3b82f6' },
    { name: 'deer', machine: 'ตัด5', jobs: 4, status: 'working', shift: 'evening', color: '#8b5cf6' }
  ];

  // ข้อมูลงานที่ยกเลิก
  const cancelledJobs: CancelledJob[] = [
    { reason: 'ลูกค้าเปลี่ยนใจ', count: 8, percentage: 32, color: '#ef4444' },
    { reason: 'งบประมาณไม่พอ', count: 5, percentage: 20, color: '#f59e0b' },
    { reason: 'เปลี่ยนดีไซน์', count: 4, percentage: 16, color: '#8b5cf6' },
    { reason: 'เลื่อนเวลา', count: 3, percentage: 12, color: '#6b7280' },
    { reason: 'คุณภาพไม่ผ่าน', count: 3, percentage: 12, color: '#ef4444' },
    { reason: 'อื่นๆ', count: 2, percentage: 8, color: '#94a3b8' }
  ];

  // ข้อมูล Stock งาน
  const stockJobs: StockJob[] = [
    { 
      customer: 'บริษัท ABC จำกัด', 
      jobType: 'นามบัตร', 
      quantity: 5000, 
      stockLevel: 2000,
      lastOrder: '15/05/2025',
      status: 'ready',
      priority: 'high',
      color: '#10b981'
    },
    { 
      customer: 'ร้าน XYZ', 
      jobType: 'ใบปลิว', 
      quantity: 10000, 
      stockLevel: 3000,
      lastOrder: '10/05/2025',
      status: 'ready',
      priority: 'medium',
      color: '#3b82f6'
    },
    { 
      customer: 'โรงแรม DEF', 
      jobType: 'โบรชัวร์', 
      quantity: 2000, 
      stockLevel: 800,
      lastOrder: '20/04/2025',
      status: 'low',
      priority: 'high',
      color: '#f59e0b'
    },
    { 
      customer: 'ร้านอาหาร GHI', 
      jobType: 'เมนู', 
      quantity: 1000, 
      stockLevel: 500,
      lastOrder: '25/05/2025',
      status: 'ready',
      priority: 'low',
      color: '#3b82f6'
    },
    { 
      customer: 'คลินิก JKL', 
      jobType: 'ใบเสร็จ', 
      quantity: 5000, 
      stockLevel: 200,
      lastOrder: '01/06/2025',
      status: 'critical',
      priority: 'urgent',
      color: '#ef4444'
    }
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: StatCardProps) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Printer className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">CRM Dashboard - โรงพิมพ์</h1>
        </div>
        <p className="text-gray-600">ภาพรวมข้อมูลธุรกิจและลูกค้า</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="ยอดขายรวม"
          value={formatCurrency(dashboardData.totalSales)}
          icon={DollarSign}
          color="bg-green-500"
          subtitle="เดือนนี้"
        />
        <StatCard
          title="งานทั้งหมด"
          value={`${dashboardData.totalJobs} งาน`}
          icon={FileText}
          color="bg-blue-500"
          subtitle="ในระบบ"
        />
        <StatCard
          title="ลูกค้าทั้งหมด"
          value={`${dashboardData.totalCustomers} ราย`}
          icon={Users}
          color="bg-purple-500"
          subtitle="ลูกค้าใน CRM"
        />
        <StatCard
          title="อัตราเติบโต"
          value={`+${dashboardData.monthlyGrowth}%`}
          icon={TrendingUp}
          color="bg-orange-500"
          subtitle="เทียบเดือนที่แล้ว"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* ยอดขายรายเดือน */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            ยอดขายรายเดือน
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value: number) => `${(value/1000000).toFixed(1)}M`} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'ยอดขาย']}
                labelFormatter={(label: string) => `เดือน ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* สถานะงาน */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            สถานะงานในระบบ
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobStages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* ประเภทงาน */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            ประเภทงานและยอดขาย
          </h3>
          <div className="grid grid-cols-1 gap-3 mb-4">
            {jobTypes.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: job.color }}></div>
                  <span className="font-medium">{job.type}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{job.count} งาน</div>
                  <div className="text-sm text-gray-600">{formatCurrency(job.value)}</div>
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={jobTypes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ type, percentage }: { type: string; percentage: number }) => `${type} ${((percentage || 0) * 100).toFixed(1)}%`}
              >
                {jobTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ข้อมูลลูกค้า */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            ข้อมูลลูกค้า
          </h3>
          
          {/* Customer Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {customerData.map((customer, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold mb-2`} style={{ color: customer.color }}>
                  {customer.count}
                </div>
                <div className="text-sm text-gray-600">{customer.type}</div>
                <div className="text-xs text-gray-500">{customer.percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>

          {/* Customer Chart */}
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={customerData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="count"
                label={({ type, percentage }: { type: string; percentage: number }) => `${type} ${percentage.toFixed(1)}%`}
              >
                {customerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ข้อมูลแผนกและเครื่องจักร */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* ช่างอาร์ต */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            ช่างอาร์ต (แผนกกราฟฟิค)
          </h3>
          <div className="space-y-3">
            {artDesigners.map((designer, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{designer.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    designer.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {designer.status === 'available' ? 'ว่าง' : 'ไม่ว่าง'}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{designer.jobs} งาน</span>
                  <span>workload: {designer.workload}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${designer.workload}%`,
                      backgroundColor: designer.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* เครื่องพิมพ์ */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-600" />
            เครื่องพิมพ์
          </h3>
          <div className="space-y-3">
            {printingMachines.map((machine, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{machine.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    machine.status === 'running' ? 'bg-green-100 text-green-800' :
                    machine.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {machine.status === 'running' ? 'ทำงาน' :
                     machine.status === 'idle' ? 'รอ' : 'ซ่อม'}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{machine.jobs} งาน</span>
                  <span>ประสิทธิภาพ: {machine.efficiency}%</span>
                </div>
                {machine.efficiency > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${machine.efficiency}%`,
                        backgroundColor: machine.color 
                      }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ช่างพิมพ์ */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            ช่างพิมพ์
          </h3>
          <div className="space-y-3">
            {printOperators.map((operator, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{operator.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    operator.status === 'working' ? 'bg-green-100 text-green-800' : 
                    operator.status === 'break' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {operator.status === 'working' ? 'ทำงาน' : 
                     operator.status === 'break' ? 'พัก' : 'ว่าง'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <div>เครื่อง: {operator.machine}</div>
                  <div>กะ: {operator.shift === 'morning' ? 'เช้า' : 
                             operator.shift === 'afternoon' ? 'บ่าย' : 'เย็น'}</div>
                  <div>{operator.jobs} งาน</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* งานที่ยกเลิกและ Stock งาน */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* สาเหตุการยกเลิกงาน */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            งานที่ยกเลิกและสาเหตุ
          </h3>
          <div className="mb-4">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {cancelledJobs.reduce((sum, job) => sum + job.count, 0)} งาน
            </div>
            <p className="text-sm text-gray-600">ยกเลิกในเดือนนี้</p>
          </div>
          
          <div className="space-y-3 mb-6">
            {cancelledJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: job.color }}></div>
                  <span className="font-medium text-sm">{job.reason}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{job.count} งาน</div>
                  <div className="text-xs text-gray-500">{job.percentage}%</div>
                </div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cancelledJobs} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="reason" type="category" width={80} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock งาน */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Stock งาน (ผลิตรอไว้)
          </h3>
          <div className="mb-4">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stockJobs.length} รายการ
            </div>
            <p className="text-sm text-gray-600">งานที่ stock ไว้สำหรับลูกค้าประจำ</p>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {stockJobs.map((stock, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: stock.color }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{stock.customer}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stock.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    stock.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    stock.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {stock.priority === 'urgent' ? 'ด่วนมาก' :
                     stock.priority === 'high' ? 'สำคัญ' :
                     stock.priority === 'medium' ? 'ปานกลาง' : 'ปกติ'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <div className="flex justify-between">
                    <span>ประเภท: {stock.jobType}</span>
                    <span className={`font-medium ${
                      stock.status === 'critical' ? 'text-red-600' :
                      stock.status === 'low' ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {stock.status === 'critical' ? 'วิกฤต' :
                       stock.status === 'low' ? 'เหลือน้อย' : 'พร้อม'}
                    </span>
                  </div>
                  <div>จำนวนรวม: {stock.quantity.toLocaleString()} ชิ้น</div>
                  <div>Stock เหลือ: {stock.stockLevel.toLocaleString()} ชิ้น</div>
                  <div>สั่งล่าสุด: {stock.lastOrder}</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(stock.stockLevel / stock.quantity) * 100}%`,
                      backgroundColor: stock.status === 'critical' ? '#ef4444' :
                                     stock.status === 'low' ? '#f59e0b' : '#10b981'
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {((stock.stockLevel / stock.quantity) * 100).toFixed(1)}% เหลือ
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-red-600" />
          กิจกรรมล่าสุด
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium">ใบเสนอราคาใหม่: บริษัท ABC จำกัด</p>
              <p className="text-sm text-gray-600">งานพิมพ์นามบัตร 5,000 ใบ - ₿45,000</p>
            </div>
            <span className="text-sm text-gray-500">2 ชั่วโมงที่แล้ว</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium">งานเสร็จสิ้น: ร้าน XYZ</p>
              <p className="text-sm text-gray-600">ใบปลิวโฆษณา 10,000 ใบ - ₿75,000</p>
            </div>
            <span className="text-sm text-gray-500">5 ชั่วโมงที่แล้ว</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium">ลูกค้าใหม่: บริษัท DEF จำกัด</p>
              <p className="text-sm text-gray-600">เพิ่มในระบบ CRM</p>
            </div>
            <span className="text-sm text-gray-500">1 วันที่แล้ว</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard; 