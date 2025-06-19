/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

// import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import Image from "next/image"
import { useRef, useState, useEffect } from 'react'
import useFetchLeadById from "@/hooks/useFetchLeadById";
import useCurrentUser from "@/hooks/useCurrentUser";
import QrCodeGenerator from '@/components/QrCodeGenerator';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

// Types
interface Stage {
  id: number;
  name: string;
  sequence: number;
  is_won: boolean;
  display_name: string;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  user_id: [number, string];
  crm_team_id: [number, string];
  display_name: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// interface LeadProperty {
//   name: string;
//   value: string;
//   type: string;
//   selection?: [string, string][];
// }

// interface Lead {
//   id: number;
//   name: string;
//   expected_revenue: number;
//   stage_id: [number, string] | null;
//   partner_id: [number, string] | null;
//   user_id: [number, string] | null;
//   email_from: string | null;
//   phone: string | null;
//   date_deadline: string | false;
//   date_open: string | false;
//   date_closed: string | false;
//   tag_ids: string[];
//   description: string | null;
//   lead_properties: LeadProperty[];
// }

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

export default function PrintJobPage() {
	const printRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  
  // Get optional query parameters
  const id = searchParams.get('id');
  const jobNo = searchParams.get('job');
  
  // State for modal and stages
  const [showStageModal, setShowStageModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [stages, setStages] = useState<Stage[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingStages, setLoadingStages] = useState(false);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [updatingStage, setUpdatingStage] = useState(false);
  const [acceptingJob, setAcceptingJob] = useState(false);
  
  console.log("job",jobNo)
  
  const { lead, isLoading, error, refetch } = useFetchLeadById(id);
  const { currentUser, setCurrentUser, clearCurrentUser, isUserAccepted } = useCurrentUser();

  // Fetch stages when modal opens
  useEffect(() => {
    if (showStageModal && stages.length === 0) {
      fetchStages();
    }
  }, [showStageModal, stages.length]);

  // Fetch team members when modal opens
  useEffect(() => {
    if (showTeamModal && teamMembers.length === 0) {
      fetchTeamMembers();
    }
  }, [showTeamModal, teamMembers.length]);

  // Fetch available stages
  const fetchStages = async () => {
    setLoadingStages(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.stage`);
      const result: ApiResponse<Stage[]> = await response.json();
      
      if (result.success) {
        // Sort stages by sequence
        const sortedStages = result.data.sort((a, b) => a.sequence - b.sequence);
        setStages(sortedStages);
      } else {
        console.error('Failed to fetch stages');
      }
    } catch (error) {
      console.error('Error fetching stages:', error);
    } finally {
      setLoadingStages(false);
    }
  };

  // Fetch team members
  const fetchTeamMembers = async () => {
    setLoadingTeamMembers(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.team.member`);
      const result: ApiResponse<TeamMember[]> = await response.json();
      
      if (result.success) {
        // Group by team and sort by name
        const sortedMembers = result.data.sort((a, b) => {
          // First sort by team name, then by member name
          if (a.crm_team_id[1] !== b.crm_team_id[1]) {
            return a.crm_team_id[1].localeCompare(b.crm_team_id[1]);
          }
          return a.name.localeCompare(b.name);
        });
        setTeamMembers(sortedMembers);
      } else {
        console.error('Failed to fetch team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoadingTeamMembers(false);
    }
  };

  // Stage emoji mapping
  const getStageEmoji = (stageName: string): string => {
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

  // Team emoji mapping
  const getTeamEmoji = (teamName: string): string => {
    const emojiMap: Record<string, string> = {
      'ประสานงาน': '📞',
      'กราฟฟิค/ช่างปริ้นDigital': '🎨',
      'บัญชี': '💳',
      'ตัด': '✂️',
      'ช่าง Inkjet': '🖨️',
      'ช่างพิมพ์ Offset': '🖨️',
      'งานหลังพิมพ์': '✨',
      'เรียงบิล': '📄',
      'แพ็ค': '📦'
    };
    return emojiMap[teamName] || '👥';
  };

  // Group team members by team
  const groupedTeamMembers = teamMembers.reduce((groups, member) => {
    const teamName = member.crm_team_id[1];
    if (!groups[teamName]) {
      groups[teamName] = [];
    }
    groups[teamName].push(member);
    return groups;
  }, {} as Record<string, TeamMember[]>);

  // Get current stage and possible next stages
const getCurrentStageIndex = (): number => {
 if (!lead || !stages.length || !lead.stage_id || !Array.isArray(lead.stage_id)) return -1;
 const stageId = lead.stage_id as [number, string];
 return stages.findIndex(stage => stage.id === stageId[0]);
};

  const getAvailableStages = (): Stage[] => {
    const currentIndex = getCurrentStageIndex();
    if (currentIndex === -1) return stages;
    
    // Return stages that come after the current stage, excluding restricted admin stages
    const restrictedStages = ['การเงิน', 'งานเก่า'];
    return stages.filter((stage, index) => 
      index > currentIndex && !restrictedStages.includes(stage.name)
    );
  };

  // Update lead stage
  const updateLeadStage = async (stageId: number, stageName: string): Promise<void> => {
    if (!lead) return;
    
    setUpdatingStage(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.lead/${lead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage_id: stageId
        })
      });

      if (response.ok) {
        // Refresh lead data
        if (refetch) {
          await refetch();
        }
        setShowStageModal(false);
        
        // Show success message
        await Swal.fire({
          title: 'สำเร็จ!',
          text: `งานถูกส่งไปยัง "${stageName}" เรียบร้อยแล้ว`,
          icon: 'success',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#10b981'
        });
      } else {
        throw new Error('Failed to update stage');
      }
    } catch (error) {
      console.error('Error updating stage:', error);
      await Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setUpdatingStage(false);
    }
  };

  // Accept job (update lead properties with team member ID)
  const acceptJob = async (userId: number, userName: string, userEmail?: string): Promise<void> => {
    if (!lead) return;
    
    setAcceptingJob(true);
    try {
      // Save user to localStorage
      setCurrentUser({
        id: userId,
        name: userName,
        email: userEmail,
        acceptedAt: new Date().toISOString()
      });

      // Update lead properties with team member ID
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.lead/${lead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead_properties: [
            {
              name: "b1f8d75d35d06603",
              value: userId
            }
          ],
          // user_id: userId
        })
      });

      if (updateResponse.ok) {
        // Refresh lead data
        if (refetch) {
          await refetch();
        }
        setShowTeamModal(false);
        
        // Show success message
        await Swal.fire({
          title: 'สำเร็จ!',
          text: `งานถูกมอบหมายให้ "${userName}" เรียบร้อยแล้ว`,
          icon: 'success',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#10b981'
        });
      } else {
        throw new Error('Failed to accept job');
      }
    } catch (error) {
      console.error('Error accepting job:', error);
      await Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'เกิดข้อผิดพลาดในการรับงาน กรุณาลองใหม่อีกครั้ง',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setAcceptingJob(false);
    }
  };

  const handlePrint = (): void => {
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
      			.no-print {
      				display:none;
      			}
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
  const getPropertyValue = (name: string, defaultValue: string = "-"): string => {
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
  const formatDate = (dateString: string | false): string => {
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

  const availableStages = getAvailableStages();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top Header with Company Logo */}
      <div className="no-print mb-4 flex justify-between items-center">
        <Image
          id="main-logo"
          src="https://erpsamuiaksorn.com/web/binary/company_logo"
          alt="Company Logo"
          width={120}
          height={28}
          className="h-7 w-auto hidden print:block"
        />
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          🖨️ พิมพ์ใบสั่งงาน
        </button>
      </div>
      
      <div className="mb-20" ref={printRef}>
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

          {/* Current User and Stage Display */}
          <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Current User Display */}
            {isUserAccepted && currentUser && (
              <div className="no-print p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className=" flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-600 font-medium">ผู้ใช้งานปัจจุบัน:</div>
                    <div className="font-semibold text-green-800 flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-700 text-xs font-bold">
                        {currentUser.name.charAt(0)}
                      </div>
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      รับงานเมื่อ: {new Date(currentUser.acceptedAt).toLocaleString('th-TH')}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCurrentUser}
                    className="text-green-600 hover:text-green-800 hover:bg-green-100"
                  >
                    เปลี่ยนผู้ใช้
                  </Button>
                </div>
              </div>
            )}
            
            {/* Current Stage Display */}
            <div className="no-print p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="no-print">
                <div className="text-sm text-blue-600 font-medium">สถานะงานปัจจุบัน:</div>
                <div className="font-semibold text-blue-800 flex items-center gap-2">
                  <span className="text-lg">{getStageEmoji(lead.stage_id ? lead.stage_id[1] : "")}</span>
                  {lead.stage_id ? lead.stage_id[1] : "ไม่ระบุ"}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  อัปเดตล่าสุด: {new Date(lead.write_date).toLocaleString('th-TH')}
                </div>
              </div>
            </div>
          </div>

          {/* Main content table */}
          <table className="w-full border-collapse">
            <tbody>
              <tr className="hidden">
                <td className="py-1 px-2 text-gray-600 w-1/4 font-medium">ลูกค้า</td>
                <td className="py-1 px-2 w-1/4">{lead.partner_id ? lead.partner_id[1] : "-"}</td>
                <td className="py-1 px-2 text-gray-600 w-1/4 font-medium">ผู้รับงานปัจจุบัน</td>
                <td className="py-1 px-2 w-1/4">{lead.user_id ? lead.user_id[1] : "-"}</td>
              </tr>
              <tr className="hidden">
                <td className="py-1 px-2 text-gray-600 font-medium">อีเมลล์</td>
                <td className="py-1 px-2">{lead.email_from || "-"}</td>
                <td className="py-1 px-2 text-gray-600 font-medium">วันที่นัดหมายส่งงาน</td>
                <td className="py-1 px-2">{formatDate(lead.date_deadline)}</td>
              </tr>
              <tr className="hidden">
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
                <td className="py-1 px-2">{getPropertyValue("e695494263014454")}</td>
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
                <td className="py-1 px-2">{getPropertyValue("b480cd0a8f660acb")}</td>
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

      {/* Team Member Selection Modal */}
      <Dialog open={showTeamModal} onOpenChange={setShowTeamModal}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>เลือกผู้รับงาน</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {loadingTeamMembers ? (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">กำลังโหลดทีมงาน...</div>
              </div>
            ) : Object.keys(groupedTeamMembers).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(groupedTeamMembers).map(([teamName, members]) => (
                  <div key={teamName} className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 flex items-center gap-2 border-b pb-1">
                      <span className="text-base">{getTeamEmoji(teamName)}</span>
                      {teamName}
                    </div>
                    <div className="space-y-1 pl-4">
                      {members.map((member) => (
                        <Button
                          key={member.id}
                          variant="outline"
                          className="w-full justify-start h-auto p-3 text-left hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50"
                          onClick={() => acceptJob(member.id, member.user_id[1], member.email)}
                          disabled={acceptingJob}
                        >
                          <div className="flex items-center gap-3 w-full">
                            {acceptingJob ? (
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                                {member.name.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1 text-left">
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-gray-500">{member.email}</div>
                            </div>
                            {acceptingJob && (
                              <div className="text-xs text-blue-600">กำลังรับงาน...</div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">
                  ไม่พบข้อมูลทีมงาน
                </div>
              </div>
            )}
            
            {acceptingJob && (
              <div className="text-center py-2">
                <div className="text-sm text-blue-600">กำลังมอบหมายงาน...</div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Stage Selection Modal */}
      <Dialog open={showStageModal} onOpenChange={setShowStageModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ส่งงานไปยังขั้นตอนถัดไป</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              สถานะปัจจุบัน: <span className="font-medium flex items-center gap-1">
                <span className="text-base">{getStageEmoji(lead.stage_id ? lead.stage_id[1] : "")}</span>
                {lead.stage_id ? lead.stage_id[1] : "ไม่ระบุ"}
              </span>
            </div>
            
            {loadingStages ? (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">กำลังโหลดขั้นตอน...</div>
              </div>
            ) : availableStages.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">เลือกขั้นตอนถัดไป:</div>
                {availableStages.map((stage) => (
                  <Button
                    key={stage.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-3 text-left hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => updateLeadStage(stage.id, stage.name)}
                    disabled={updatingStage}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-xl">{getStageEmoji(stage.name)}</span>
                      <div className="flex-1">
                        <div className="font-medium">{stage.name}</div>
                        <div className="text-xs text-gray-500">ลำดับที่ {stage.sequence + 1}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">
                  ไม่มีขั้นตอนถัดไปสำหรับงานนี้
                </div>
              </div>
            )}
            
            {updatingStage && (
              <div className="text-center py-2">
                <div className="text-sm text-blue-600">กำลังอัปเดตสถานะ...</div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Sticky Footer with Action Buttons */}
      <div className="no-print fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between gap-4 z-50 shadow-lg">
        <Button 
          variant="outline" 
          className={`flex-1 max-w-32 ${
            isUserAccepted 
              ? 'bg-green-100 border-green-300 text-green-800' 
              : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300'
          } ${acceptingJob ? 'opacity-50' : ''}`}
          onClick={() => setShowTeamModal(true)}
          disabled={!lead || acceptingJob}
        >
          {acceptingJob ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">กำลังรับงาน...</span>
            </div>
          ) : isUserAccepted && currentUser ? (
            <div className="flex flex-col items-center text-xs">
              <span>✅ {currentUser.name}</span>
              <span className="text-[10px] opacity-75">คลิกเพื่อเปลี่ยน</span>
            </div>
          ) : (
            '🤝 รับงาน'
          )}
        </Button>
        <Button 
          className="flex-1 max-w-32 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setShowStageModal(true)}
          disabled={!lead}
        >
          📤 ส่งงานไปยัง
        </Button>
      </div>
    </div>
  );
}