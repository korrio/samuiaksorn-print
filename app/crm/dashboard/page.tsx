/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, FileText, DollarSign, Calendar, Printer, Package, Eye, Settings, User, AlertCircle, RefreshCw } from 'lucide-react';

import jsonData from './data.json';

const CRMDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: '30',
    teamId: '',
    stageId: '',
    userId: ''
  });

  // API Configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.dateRange) params.append('date_range', filters.dateRange);
      if (filters.teamId) params.append('team_id', filters.teamId);
      if (filters.stageId) params.append('stage_id', filters.stageId);
      if (filters.userId) params.append('user_id', filters.userId);



      // setDashboardData(result.data);

      // const response = await fetch(`${API_BASE_URL}/crm/dashboard?${params}`);
      // const response = await fetch(`/data.json`);
      // const result = await response.json();
      const result = jsonData

      if (result.success) {
        setDashboardData(result.data);
      } else {
        // setError(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      // setError('Network error: ' + err.message);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  interface TrendData {
  value: string;
  color: string;
  icon: string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
  trend?: number;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatTrend = (trend: number): TrendData => {
  const isPositive = trend >= 0;
  return {
    value: `${isPositive ? '+' : ''}${trend.toFixed(1)}%`,
    color: isPositive ? 'text-green-600' : 'text-red-600',
    icon: isPositive ? '↗' : '↘'
  };
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle, 
  trend 
}) => {
  const trendData: TrendData | null = trend !== undefined ? formatTrend(trend) : null;
  
  return (
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
        <p className="text-sm text-gray-500">{subtitle}</p>
      )}
      {trendData && (
        <div className={`text-sm mt-2 ${trendData.color} flex items-center gap-1`}>
          <span>{trendData.icon}</span>
          <span>{trendData.value} vs ช่วงก่อน</span>
        </div>
      )}
    </div>
  );
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">กำลังโหลดข้อมูล...</h2>
          <p className="text-gray-500">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { kpis, funnel_data, monthly_data, revenue_data, top_opportunities, stale_opportunities } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Printer className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">CRM Dashboard - โรงพิมพ์</h1>
          <button 
            onClick={fetchDashboardData}
            className="ml-auto p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <select 
            value={filters.dateRange} 
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">ทั้งหมด</option>
            <option value="7">7 วันที่แล้ว</option>
            <option value="30">30 วันที่แล้ว</option>
            <option value="90">90 วันที่แล้ว</option>
          </select>

          <select 
            value={filters.teamId} 
            onChange={(e) => setFilters({...filters, teamId: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">ทุกทีม</option>
            {dashboardData.teams?.map((team: any) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>

          <select 
            value={filters.stageId} 
            onChange={(e) => setFilters({...filters, stageId: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">ทุกสถานะ</option>
            {dashboardData.stages?.map((stage: any) => (
              <option key={stage.id} value={stage.id}>{stage.name}</option>
            ))}
          </select>

          <select 
            value={filters.userId} 
            onChange={(e) => setFilters({...filters, userId: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">ทุกคน</option>
            {dashboardData.users?.map((user: any) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        
        <p className="text-gray-600">ภาพรวมข้อมูลธุรกิจและลูกค้า</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="ยอดขายรวม"
          value={formatCurrency(kpis.total_revenue)}
          icon={DollarSign}
          color="bg-green-500"
          subtitle="ยอดรวมทั้งหมด"
          trend={kpis.revenue_trend}
        />
        <StatCard
          title="งานทั้งหมด"
          value={`${kpis.total_opportunities.toLocaleString()} งาน`}
          icon={FileText}
          color="bg-blue-500"
          subtitle="ในระบบ"
          trend={kpis.opportunity_trend}
        />
        <StatCard
          title="งานสำเร็จ"
          value={`${kpis.won_count.toLocaleString()} งาน`}
          icon={Users}
          color="bg-purple-500"
          subtitle={formatCurrency(kpis.won_revenue)}
          trend={kpis.won_trend}
        />
        <StatCard
          title="อัตราสำเร็จ"
          value={`${kpis.conversion_rate}%`}
          icon={TrendingUp}
          color="bg-orange-500"
          subtitle="conversion rate"
          trend={kpis.conversion_trend}
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
            <AreaChart data={revenue_data.labels?.map((label: any, index: any) => ({
              month: label,
              revenue: revenue_data.revenue[index],
              count: revenue_data.count[index]
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value as number) : `${value} งาน`,
                  name === 'revenue' ? 'ยอดขาย' : 'จำนวนงาน'
                ]}
                labelFormatter={(label) => `เดือน ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
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
            <BarChart data={funnel_data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="stage" 
                angle={-45} 
                textAnchor="end" 
                height={100} 
                fontSize={12}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'count' ? `${value} งาน` : formatCurrency(value as number),
                  name === 'count' ? 'จำนวนงาน' : 'มูลค่า'
                ]}
              />
              <Bar dataKey="count" fill="#3b82f6" name="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Opportunities */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            งานที่มีมูลค่าสูงสุด
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {top_opportunities?.map((opportunity: any, index: any) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{opportunity.name}</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(opportunity.revenue)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>ลูกค้า: {opportunity.partner}</span>
                    <span>สถานะ: {opportunity.stage}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>ทีม: {opportunity.team}</span>
                    <span>ผู้รับผิดชอบ: {opportunity.salesperson}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* งานที่ค้างนาน */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            งานที่ค้างนาน
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {stale_opportunities?.slice(0, 10).map((opportunity: any, index: any) => (
              <div key={index} className={`p-4 bg-gray-50 rounded-lg border-l-4 ${
                opportunity.priority === 'high' ? 'border-red-500' : 
                opportunity.priority === 'medium' ? 'border-yellow-500' : 'border-gray-400'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{opportunity.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    opportunity.priority === 'high' ? 'bg-red-100 text-red-800' :
                    opportunity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {opportunity.days_stale} วัน
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>ลูกค้า: {opportunity.partner}</span>
                    <span>สถานะ: {opportunity.stage}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>ผู้รับผิดชอบ: {opportunity.salesperson}</span>
                    {opportunity.expected_revenue > 0 && (
                      <span>มูลค่า: {formatCurrency(opportunity.expected_revenue)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* งานเสร็จสิ้นตามเวลา */}
      {dashboardData.leads_completed_overtime && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            งานที่เสร็จสิ้นตามเวลา
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.leads_completed_overtime.labels?.map((label: any, index: any) => ({
              week: label,
              count: dashboardData.leads_completed_overtime.completed_count[index],
              revenue: dashboardData.leads_completed_overtime.completed_revenue[index]
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'count' ? `${value} งาน` : formatCurrency(value as number),
                  name === 'count' ? 'จำนวนงาน' : 'มูลค่า'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.3}
                name="count"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* สรุปข้อมูล */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-red-600" />
          สรุปข้อมูล
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {funnel_data?.reduce((sum: any, stage: any) => sum + stage.count, 0) || 0}
            </div>
            <div className="text-sm text-gray-600">งานทั้งหมดในระบบ</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {formatCurrency(funnel_data?.reduce((sum: any, stage: any) => sum + stage.revenue, 0) || 0)}
            </div>
            <div className="text-sm text-gray-600">มูลค่ารวมในระบบ</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {stale_opportunities?.length || 0}
            </div>
            <div className="text-sm text-gray-600">งานที่ต้องติดตาม</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;