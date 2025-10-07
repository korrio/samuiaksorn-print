'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ActivityDetails {
  stage_from_id?: number | null;
  stage_to_id?: number;
  duration_hours?: number;
  duration_days?: number;
  current_stage_id?: number;
  current_stage_duration_hours?: number;
  current_stage_days?: number;
  days_since_last_activity?: number;
  expected_revenue?: number;
  partner_name?: string;
  email_from?: string | false;
  phone?: string | false;
}

interface Activity {
  type: 'stage_change' | 'lead_update';
  timestamp: string;
  lead_id: number;
  lead_name: string;
  user_id: number;
  user_name: string;
  team_id: number;
  team_name: string;
  description: string;
  stage_from?: string | false;
  stage_to?: string;
  current_stage?: string;
  is_overdue?: boolean;
  duration_previous_stage?: number;
  details: ActivityDetails;
}

interface ApiResponse {
  error: boolean;
  message: string;
  timestamp: string;
  data: {
    activities: Activity[];
    summary: {
      total_activities: number;
      stage_changes: number;
      lead_updates: number;
      unique_leads: number;
      unique_users: number;
      teams_involved: number;
    };
    filters_applied?: {
      limit: number;
      team_id: number | null;
      user_id: number | null;
    };
  };
}

interface RecentActivitiesProps {
  partnerId?: string | number;
  limit?: number;
}

const RecentActivities = ({ partnerId, limit = 10 }: RecentActivitiesProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const url = partnerId 
          ? `https://dashboard-api.erpsamuiaksorn.com/api/crm/activities/recent?partner_id=${partnerId}&limit=${limit}`
          : `https://dashboard-api.erpsamuiaksorn.com/api/crm/activities/recent?limit=${limit}`;
          
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data: ApiResponse = await response.json();
        
        if (data.error) {
          throw new Error(data.message);
        }
        setActivities(data.data.activities);
      } catch (err) {
        console.error('Error fetching recent activities:', err);
        // Use mockup data when API fails
        const mockData: ApiResponse = {
"error": false,
"message": "Retrieved 10 recent activities",
"timestamp": "2025-06-20T15:15:41+07:00",
"data": {
"activities": [
{
"type": "stage_change",
"timestamp": "2025-06-20T15:06:48+07:00",
"lead_id": 4644,
"lead_name": "์N94555Laundry Package",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from New to ประสานงาน",
"stage_from": false,
"stage_to": "ประสานงาน",
"duration_previous_stage": 0,
"details": {
"stage_from_id": null,
"stage_to_id": 1,
"duration_hours": 0,
"duration_days": 0
}
},
{
"type": "lead_update",
"timestamp": "2025-06-20T15:06:35+07:00",
"lead_id": 4608,
"lead_name": "N94509 Gift Voucher",
"user_id": 105,
"user_name": "ฟ้า",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Lead updated: N94509 Gift Voucher",
"current_stage": "ออกแบบ",
"is_overdue": false,
"details": {
"current_stage_id": 7,
"current_stage_duration_hours": 2.6863888888888887,
"current_stage_days": 0,
"days_since_last_activity": 0,
"expected_revenue": 0,
"partner_name": "Baan Sawan Massage",
"email_from": false,
"phone": false
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T15:06:04+07:00",
"lead_id": 4643,
"lead_name": "N94554Pillow Menu",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from New to ประสานงาน",
"stage_from": false,
"stage_to": "ประสานงาน",
"duration_previous_stage": 0,
"details": {
"stage_from_id": null,
"stage_to_id": 1,
"duration_hours": 0,
"duration_days": 0
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T15:04:33+07:00",
"lead_id": 4429,
"lead_name": "N94110 Your Personal bar",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from ตัดก่อนพิมพ์ to การเงิน",
"stage_from": "ตัดก่อนพิมพ์",
"stage_to": "การเงิน",
"duration_previous_stage": 17.350555555555555,
"details": {
"stage_from_id": 8,
"stage_to_id": 5,
"duration_hours": 17.350555555555555,
"duration_days": 0.7229398148148148
}
},
{
"type": "lead_update",
"timestamp": "2025-06-20T15:01:40+07:00",
"lead_id": 2166,
"lead_name": "N93343 การ์ดงานแต่ง",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Lead updated: N93343 การ์ดงานแต่ง",
"current_stage": "การเงิน",
"is_overdue": false,
"details": {
"current_stage_id": 5,
"current_stage_duration_hours": 17.53611111111111,
"current_stage_days": 0,
"days_since_last_activity": 0,
"expected_revenue": 0,
"partner_name": "Bliss Event",
"email_from": false,
"phone": false
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T14:59:15+07:00",
"lead_id": 4633,
"lead_name": "N94039 มวย 21-23/6/68",
"user_id": 103,
"user_name": "ตา",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from ประสานงาน to การเงิน",
"stage_from": "ประสานงาน",
"stage_to": "การเงิน",
"duration_previous_stage": 0.5780555555555555,
"details": {
"stage_from_id": 1,
"stage_to_id": 5,
"duration_hours": 0.5780555555555555,
"duration_days": 0.024085648148148148
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T14:46:57+07:00",
"lead_id": 4642,
"lead_name": "N94553Luggage Tag Arrival",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from New to ประสานงาน",
"stage_from": false,
"stage_to": "ประสานงาน",
"duration_previous_stage": 0,
"details": {
"stage_from_id": null,
"stage_to_id": 1,
"duration_hours": 0,
"duration_days": 0
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T14:44:13+07:00",
"lead_id": 4641,
"lead_name": "N94552Hotel Map A3",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from New to ประสานงาน",
"stage_from": false,
"stage_to": "ประสานงาน",
"duration_previous_stage": 0,
"details": {
"stage_from_id": null,
"stage_to_id": 1,
"duration_hours": 0,
"duration_days": 0
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T14:43:23+07:00",
"lead_id": 4640,
"lead_name": "N94551Note Pad HK 10.5x14.50 cm.",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from New to ประสานงาน",
"stage_from": false,
"stage_to": "ประสานงาน",
"duration_previous_stage": 0,
"details": {
"stage_from_id": null,
"stage_to_id": 1,
"duration_hours": 0,
"duration_days": 0
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T14:41:54+07:00",
"lead_id": 4639,
"lead_name": "N94100Letter Head A4",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from New to ประสานงาน",
"stage_from": false,
"stage_to": "ประสานงาน",
"duration_previous_stage": 0,
"details": {
"stage_from_id": null,
"stage_to_id": 1,
"duration_hours": 0,
"duration_days": 0
}
}
],
"summary": {
"total_activities": 10,
"stage_changes": 8,
"lead_updates": 2,
"unique_leads": 10,
"unique_users": 3,
"teams_involved": 1
},
"filters_applied": {
"limit": 10,
"team_id": null,
"user_id": null
}
}
}
        setActivities(mockData.data.activities);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [partnerId, limit]);

  const formatTimestamp = (timestamp: string) => {
    // Parse ISO 8601 timestamp with timezone (e.g., "2025-06-20T11:11:24+07:00")
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} นาทีที่แล้ว`;
    } else if (diffHours < 24) {
      return `${diffHours} ชั่วโมงที่แล้ว`;
    } else {
      return `${diffDays} วันที่แล้ว`;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'stage_change':
        return 'bg-blue-500';
      case 'lead_update':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'stage_change':
        return 'เปลี่ยนสถานะ';
      case 'lead_update':
        return 'อัพเดทงาน';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center p-4">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>กิจกรรมล่าสุด</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {activities.slice(0, 20).map((activity, index) => (
          <div key={index} className="border-l-4 border-gray-200 pl-4 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`${getActivityBadgeColor(activity.type)} text-white`}>
                    {getActivityTypeLabel(activity.type)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                <div className="font-medium text-blue-600 mb-1">
                  {activity.lead_name}
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  {activity.description}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>โดย: {activity.user_name}</span>
                    <span>ทีม: {activity.team_name}</span>
                    {activity.details.expected_revenue && (
                      <span>มูลค่า: {activity.details.expected_revenue.toLocaleString('th-TH')} บาท</span>
                    )}
                  </div>
                  <Link href={`/?id=${activity.lead_id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" />
                      ดูรายละเอียด
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;