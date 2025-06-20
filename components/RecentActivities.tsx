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

const RecentActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        let data: ApiResponse;
        // const response = await fetch('https://erpsamuiaksorn.com/api/crm/activities/recent');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch activities');
        // }
        // data = await response.json();

        data = {
"error": false,
"message": "Retrieved 10 recent activities",
"timestamp": "2025-06-20T11:11:29+07:00",
"data": {
"activities": [
{
"type": "lead_update",
"timestamp": "2025-06-20T11:11:24+07:00",
"lead_id": 2732,
"lead_name": "N93763 ใบส่งของ",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Lead updated: N93763 ใบส่งของ",
"current_stage": "การเงิน",
"is_overdue": false,
"details": {
"current_stage_id": 5,
"current_stage_duration_hours": 13.466111111111111,
"current_stage_days": 0,
"days_since_last_activity": 0,
"expected_revenue": 5350,
"partner_name": "น้องหญิงผักสด",
"email_from": false,
"phone": false
}
},
{
"type": "lead_update",
"timestamp": "2025-06-20T11:09:14+07:00",
"lead_id": 4429,
"lead_name": "N94110 Your Personal bar",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Lead updated: N94110 Your Personal bar",
"current_stage": "ตัดก่อนพิมพ์",
"is_overdue": false,
"details": {
"current_stage_id": 8,
"current_stage_duration_hours": 13.466111111111111,
"current_stage_days": 0,
"days_since_last_activity": 0,
"expected_revenue": 6800,
"partner_name": "Chaweng Garden Beach Resort",
"email_from": false,
"phone": false
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T10:33:15+07:00",
"lead_id": 4589,
"lead_name": "N94006 ใบรับซื้อทองเก่า",
"user_id": 103,
"user_name": "ตา",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from ประสานงาน to กระบวนการพิมพ์",
"stage_from": "ประสานงาน",
"stage_to": "กระบวนการพิมพ์",
"duration_previous_stage": 0.03611111111111111,
"details": {
"stage_from_id": 1,
"stage_to_id": 2,
"duration_hours": 0.03611111111111111,
"duration_days": 0.0015046296296296294
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T10:31:05+07:00",
"lead_id": 4589,
"lead_name": "N94006 ใบรับซื้อทองเก่า",
"user_id": 103,
"user_name": "ตา",
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
"timestamp": "2025-06-20T10:29:28+07:00",
"lead_id": 4546,
"lead_name": "N94032 Ticket",
"user_id": 103,
"user_name": "ตา",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Lead updated: N94032 Ticket",
"current_stage": "กระบวนการพิมพ์",
"is_overdue": false,
"details": {
"current_stage_id": 2,
"current_stage_duration_hours": 13.466111111111111,
"current_stage_days": 0,
"days_since_last_activity": 0,
"expected_revenue": 7950,
"partner_name": "Jungle Experience",
"email_from": false,
"phone": false
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T10:20:20+07:00",
"lead_id": 4470,
"lead_name": "N94119 Note pad",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from งานเสร็จ to การเงิน",
"stage_from": "งานเสร็จ",
"stage_to": "การเงิน",
"duration_previous_stage": 0.2025,
"details": {
"stage_from_id": 4,
"stage_to_id": 5,
"duration_hours": 0.2025,
"duration_days": 0.0084375
}
},
{
"type": "lead_update",
"timestamp": "2025-06-20T10:18:00+07:00",
"lead_id": 1115,
"lead_name": "N92577 Note Pad",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Lead updated: N92577 Note Pad",
"current_stage": "การเงิน",
"is_overdue": false,
"details": {
"current_stage_id": 5,
"current_stage_duration_hours": 13.466111111111111,
"current_stage_days": 0,
"days_since_last_activity": 0,
"expected_revenue": 6500,
"partner_name": "Napasai",
"email_from": false,
"phone": false
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T10:08:11+07:00",
"lead_id": 4470,
"lead_name": "N94119 Note pad",
"user_id": 102,
"user_name": "สาว",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from หลังพิมพ์ to งานเสร็จ",
"stage_from": "หลังพิมพ์",
"stage_to": "งานเสร็จ",
"duration_previous_stage": 12.411111111111111,
"details": {
"stage_from_id": 3,
"stage_to_id": 4,
"duration_hours": 12.411111111111111,
"duration_days": 0.5171296296296296
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T08:45:46+07:00",
"lead_id": 4505,
"lead_name": "N94018 welcome card",
"user_id": 103,
"user_name": "ตา",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from ออกแบบ to กระบวนการพิมพ์",
"stage_from": "ออกแบบ",
"stage_to": "กระบวนการพิมพ์",
"duration_previous_stage": 11.0375,
"details": {
"stage_from_id": 7,
"stage_to_id": 2,
"duration_hours": 11.0375,
"duration_days": 0.45989583333333334
}
},
{
"type": "stage_change",
"timestamp": "2025-06-20T08:25:14+07:00",
"lead_id": 4588,
"lead_name": "N94042 captain order food",
"user_id": 103,
"user_name": "ตา",
"team_id": 1,
"team_name": "ประสานงาน",
"description": "Stage changed from ประสานงาน to เสนอราคา",
"stage_from": "ประสานงาน",
"stage_to": "เสนอราคา",
"duration_previous_stage": 0.0044444444444444444,
"details": {
"stage_from_id": 1,
"stage_to_id": 6,
"duration_hours": 0.0044444444444444444,
"duration_days": 0.00018518518518518518
}
}
],
"summary": {
"total_activities": 10,
"stage_changes": 6,
"lead_updates": 4,
"unique_leads": 8,
"unique_users": 2,
"teams_involved": 1
},
"filters_applied": {
"limit": 10,
"team_id": null,
"user_id": null
}
}
}
        if (data.error) {
          throw new Error(data.message);
        }
        setActivities(data.data.activities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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