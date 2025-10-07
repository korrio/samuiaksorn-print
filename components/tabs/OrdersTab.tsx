"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

interface OrdersTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customerLeads: any[];
}

interface Stage {
  id: number;
  name: string;
  fold: boolean;
  sequence: number;
}

export default function OrdersTab({
  customerLeads
}: OrdersTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stages, setStages] = useState<Stage[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filteredLeads, setFilteredLeads] = useState(customerLeads);

  // Fetch stages from API
  useEffect(() => {
    const fetchStages = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.erpsamuiaksorn.com';
        const fields = JSON.stringify(['name', 'fold', 'sequence']);
        const order = 'sequence asc';
        
        const response = await axios.get(`${baseUrl}/api/crm.stage`, {
          params: { fields, order }
        });
        
        if (response.data && response.data.success) {
          setStages(response.data.data || []);
        } else {
          throw new Error('Failed to fetch stages');
        }
      } catch (err) {
        console.error('Error fetching stages:', err);
        // Use mockup data when API fails
        setStages([
          { id: 1, name: 'ประสานงาน', fold: false, sequence: 1 },
          { id: 5, name: 'การเงิน', fold: false, sequence: 2 },
          { id: 7, name: 'ออกแบบ', fold: false, sequence: 3 },
          { id: 8, name: 'ตัดก่อนพิมพ์', fold: false, sequence: 4 },
          { id: 9, name: 'งานเสร็จ', fold: false, sequence: 5 }
        ]);
      }
    };
    
    fetchStages();
  }, []);

  // Filter leads based on active filter
  useEffect(() => {
    let filtered = customerLeads;
    
    switch (activeFilter) {
      case 'in_progress':
        filtered = customerLeads.filter(lead => 
          !['งานเสร็จ', 'การเงิน', 'งานเก่า'].includes(lead.stage_id[1])
        );
        break;
      case 'completed':
        filtered = customerLeads.filter(lead => lead.stage_id[1] === 'งานเสร็จ');
        break;
      case 'payment':
        filtered = customerLeads.filter(lead => lead.stage_id[1] === 'การเงิน');
        break;
      default:
        filtered = customerLeads;
    }
    
    setFilteredLeads(filtered);
  }, [customerLeads, activeFilter]);
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get stage color
  const getStageColor = (stageName: string) => {
    const stageColors: Record<string, string> = {
      'ประสานงาน': 'bg-blue-100 text-blue-800',
      'เสนอราคา': 'bg-yellow-100 text-yellow-800',
      'ออกแบบ': 'bg-purple-100 text-purple-800',
      'ตัดก่อนพิมพ์': 'bg-orange-100 text-orange-800',
      'กระบวนการพิมพ์': 'bg-green-100 text-green-800',
      'หลังพิมพ์': 'bg-indigo-100 text-indigo-800',
      'งานเสร็จ': 'bg-green-100 text-green-800',
      'การเงิน': 'bg-gray-100 text-gray-800'
    };
    return stageColors[stageName] || 'bg-gray-100 text-gray-800';
  };

  // Get stage emoji
  const getStageEmoji = (stageName: string) => {
    const emojiMap: Record<string, string> = {
      'ประสานงาน': '📞',
      'ตัดก่อนพิมพ์': '✂️',
      'เสนอราคา': '💰',
      'ออกแบบ': '🎨',
      'กระบวนการพิมพ์': '🖨️',
      'หลังพิมพ์': '✨',
      'งานเสร็จ': '✅',
      'การเงิน': '💳',
      'งานเก่า': '📂'
    };
    return emojiMap[stageName] || '📋';
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">งานของฉัน</h2>
        <p className="text-gray-600">{filteredLeads.length} จาก {customerLeads.length} งานทั้งหมด</p>
      </div>

      {/* Filter/Sort Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button 
          variant={activeFilter === 'all' ? 'default' : 'outline'} 
          size="sm" 
          className="whitespace-nowrap"
          onClick={() => setActiveFilter('all')}
        >
          📋 ทั้งหมด
        </Button>
        <Button 
          variant={activeFilter === 'in_progress' ? 'default' : 'outline'} 
          size="sm" 
          className="whitespace-nowrap"
          onClick={() => setActiveFilter('in_progress')}
        >
          🟡 กำลังดำเนิน
        </Button>
        <Button 
          variant={activeFilter === 'completed' ? 'default' : 'outline'} 
          size="sm" 
          className="whitespace-nowrap"
          onClick={() => setActiveFilter('completed')}
        >
          ✅ เสร็จแล้ว
        </Button>
        <Button 
          variant={activeFilter === 'payment' ? 'default' : 'outline'} 
          size="sm" 
          className="whitespace-nowrap"
          onClick={() => setActiveFilter('payment')}
        >
          ⏳ รอชำระ
        </Button>
      </div>

      {/* Orders List */}
      {filteredLeads.length > 0 ? (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{lead.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>งานที่ #{lead.id}</span>
                      <span>•</span>
                      <span>{formatDate(lead.create_date)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 mb-1">
                      {formatCurrency(lead.expected_revenue)}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{getStageEmoji(lead.stage_id[1])}</span>
                  <Badge className={`${getStageColor(lead.stage_id[1])} text-xs px-2 py-1`}>
                    {lead.stage_id[1]}
                  </Badge>
                </div>

                {/* Deadline */}
                {lead.date_deadline && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span>📅</span>
                    <span>กำหนดส่ง: {formatDate(lead.date_deadline)}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs"
                  >
                    👁️ ดูรายละเอียด
                  </Button>
                  {lead.stage_id[1] === 'งานเสร็จ' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs bg-green-50 border-green-200 text-green-700"
                    >
                      📥 รับงาน
                    </Button>
                  )}
                  {lead.stage_id[1] !== 'งานเสร็จ' && lead.stage_id[1] !== 'การเงิน' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs bg-blue-50 border-blue-200 text-blue-700"
                    >
                      📞 สอบถาม
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีการสั่งงาน</h3>
            <p className="text-gray-600 mb-4">
              {activeFilter === 'all' ? 'ยังไม่มีการสั่งงาน' : 'ไม่พบงานในหมวดนี้'}
            </p>
            {activeFilter !== 'all' && (
              <Button 
                variant="outline"
                onClick={() => setActiveFilter('all')}
              >
                📋 ดูงานทั้งหมด
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {customerLeads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 สถิติงาน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {customerLeads.filter(lead => 
                    !['งานเสร็จ', 'การเงิน', 'งานเก่า'].includes(lead.stage_id[1])
                  ).length}
                </div>
                <div className="text-sm text-gray-600">กำลังดำเนิน</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {customerLeads.filter(lead => lead.stage_id[1] === 'งานเสร็จ').length}
                </div>
                <div className="text-sm text-gray-600">เสร็จแล้ว</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(customerLeads.reduce((sum, lead) => sum + lead.expected_revenue, 0))}
                </div>
                <div className="text-sm text-gray-600">มูลค่ารวม</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {customerLeads.length > 0 ? 
                    formatCurrency(customerLeads.reduce((sum, lead) => sum + lead.expected_revenue, 0) / customerLeads.length) 
                    : formatCurrency(0)
                  }
                </div>
                <div className="text-sm text-gray-600">มูลค่าเฉลี่ย</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}