// "use client"

// // import { Badge } from "@/components/ui/badge"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// import Image from "next/image"
// import { useRef, useState, useEffect } from 'react'
// import useFetchLeadById from "@/hooks/useFetchLeadById";
// import QrCodeGenerator from '@/components/QrCodeGenerator';
// import { useSearchParams } from 'next/navigation';

// // Types
// interface Stage {
//   id: number;
//   name: string;
//   sequence: number;
//   is_won: boolean;
//   display_name: string;
// }

// interface TeamMember {
//   id: number;
//   name: string;
//   email: string;
//   user_id: [number, string];
//   crm_team_id: [number, string];
//   display_name: string;
// }

// interface ApiResponse<T> {
//   success: boolean;
//   data: T;
// }

// export default function PrintJobPage() {
//   const printRef = useRef<HTMLDivElement>(null);
//   const searchParams = useSearchParams();
  
//   // Get optional query parameters
//   const id = searchParams.get('id');
//   const jobNo = searchParams.get('job');
  
//   // State for modal and stages
//   const [showStageModal, setShowStageModal] = useState(false);
//   const [showTeamModal, setShowTeamModal] = useState(false);
//   const [stages, setStages] = useState<Stage[]>([]);
//   const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
//   const [loadingStages, setLoadingStages] = useState(false);
//   const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
//   const [updatingStage, setUpdatingStage] = useState(false);
//   const [acceptingJob, setAcceptingJob] = useState(false);
  
//   console.log("job",jobNo)
  
//   const { lead, isLoading, error, refetch } = useFetchLeadById(id);

//   // Fetch stages when modal opens
//   useEffect(() => {
//     if (showStageModal && stages.length === 0) {
//       fetchStages();
//     }
//   }, [showStageModal]);

//   // Fetch team members when modal opens
//   useEffect(() => {
//     if (showTeamModal && teamMembers.length === 0) {
//       fetchTeamMembers();
//     }
//   }, [showTeamModal]);

//   // Fetch available stages
//   const fetchStages = async () => {
//     setLoadingStages(true);
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.stage`);
//       const result: ApiResponse<Stage[]> = await response.json();
      
//       if (result.success) {
//         // Sort stages by sequence
//         const sortedStages = result.data.sort((a, b) => a.sequence - b.sequence);
//         setStages(sortedStages);
//       } else {
//         console.error('Failed to fetch stages');
//       }
//     } catch (error) {
//       console.error('Error fetching stages:', error);
//     } finally {
//       setLoadingStages(false);
//     }
//   };

//   // Fetch team members
//   const fetchTeamMembers = async () => {
//     setLoadingTeamMembers(true);
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.team.member`);
//       const result: ApiResponse<TeamMember[]> = await response.json();
      
//       if (result.success) {
//         // Group by team and sort by name
//         const sortedMembers = result.data.sort((a, b) => {
//           // First sort by team name, then by member name
//           if (a.crm_team_id[1] !== b.crm_team_id[1]) {
//             return a.crm_team_id[1].localeCompare(b.crm_team_id[1]);
//           }
//           return a.name.localeCompare(b.name);
//         });
//         setTeamMembers(sortedMembers);
//       } else {
//         console.error('Failed to fetch team members');
//       }
//     } catch (error) {
//       console.error('Error fetching team members:', error);
//     } finally {
//       setLoadingTeamMembers(false);
//     }
//   };

//   // Stage emoji mapping
//   const getStageEmoji = (stageName: string) => {
//     type StageEmojiMap = {
//       [key: string]: string;
//     };
    
//     const emojiMap: StageEmojiMap = {
//       'ประสานงาน': '🤝',
//       'ตัดก่อนพิมพ์': '✂️',
//       'เสนอราคา': '💰',
//       'ออกแบบ': '🎨',
//       'กระบวนการพิมพ์': '🖨️',
//       'หลังพิมพ์': '✨',
//       'งานเสร็จ': '✅',
//       'การเงิน': '💳',
//       'งานเก่า': '📂'
//     };
//     return emojiMap[stageName] || '📋';
//   };

//   // Team emoji mapping
//   const getTeamEmoji = (teamName: string) => {
//     type TeamEmojiMap = {
//       [key: string]: string;
//     };
    
//     const emojiMap: TeamEmojiMap = {
//       'ประสานงาน': '📞',
//       'กราฟฟิก/ช่างภาพDigital': '🎨',
//       'บัญชี': '💰',
//       'ตัด': '✂️',
//       'ช่าง Inkjet': '🖨️',
//       'ช่างพิมพ์ Offset': '📄',
//       'งานหลังพิมพ์': '✨',
//       'เรียงบิล': '📑',
//       'แพ็ค': '📦',
//       'ส่งมอบ': '🚚'
//     };
//     return emojiMap[teamName] || '👥';
//   };

//   // Group team members by team
//   const groupedTeamMembers = teamMembers.reduce((groups, member) => {
//     const teamName = member.crm_team_id[1];
//     if (!groups[teamName]) {
//       groups[teamName] = [];
//     }
//     groups[teamName].push(member);
//     return groups;
//   }, {} as Record<string, TeamMember[]>);

//   // Get current stage and possible next stages
//   const getCurrentStageIndex = () => {
//     if (!lead || !isLeadData(lead) || !stages.length) return -1;
//     const stageId = lead.stage_id;
//     if (!stageId) return -1;
//     return stages.findIndex(stage => stage.id === stageId[0]);
//   };

//   const getAvailableStages = () => {
//     const currentIndex = getCurrentStageIndex();
//     if (currentIndex === -1) return stages;
    
//     // Return stages that come after the current stage
//     return stages.filter((stage, index) => index > currentIndex);
//   };

//   // Update lead stage
//   const updateLeadStage = async (stageId: number, stageName: string) => {
//     if (!lead) return;
    
//     setUpdatingStage(true);
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.lead/${lead.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           stage_id: stageId
//         })
//       });

//       if (response.ok) {
//         // Refresh lead data
//         if (refetch) {
//           await refetch();
//         }
//         setShowStageModal(false);
        
//         // Show success message (you can replace this with your toast component)
//         alert(`งานถูกส่งไปยัง "${stageName}" เรียบร้อยแล้ว`);
//       } else {
//         throw new Error('Failed to update stage');
//       }
//     } catch (error) {
//       console.error('Error updating stage:', error);
//       alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
//     } finally {
//       setUpdatingStage(false);
//     }
//   };

//   // Accept job (change owner to current user)
//   const acceptJob = async (userId: number, userName: string) => {
//     if (!lead) return;
    
//     setAcceptingJob(true);
//     try {
//       // Update lead owner
//       const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.lead/${lead.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: userId
//         })
//       });

//       if (updateResponse.ok) {
//         // Refresh lead data
//         if (refetch) {
//           await refetch();
//         }
//         setShowTeamModal(false);
        
//         // Show success message
//         alert(`งานถูกมอบหมายให้ "${userName}" เรียบร้อยแล้ว`);
//       } else {
//         throw new Error('Failed to accept job');
//       }
//     } catch (error) {
//       console.error('Error accepting job:', error);
//       alert('เกิดข้อผิดพลาดในการรับงาน กรุณาลองใหม่อีกครั้ง');
//     } finally {
//       setAcceptingJob(false);
//     }
//   };

//   const handlePrint = () => {
//     if (printRef.current) {
//       const printContents = printRef.current.innerHTML;
//       const originalContents = document.body.innerHTML;
      
//       document.body.innerHTML = `
//         <html>
//           <head>
//             <title>Print</title>
//             <style>
//               @page {
//                 size: A4;
//                 margin: 10mm 10mm 10mm 10mm;
//               }
//               body {
//                 font-family: system-ui, -apple-system, sans-serif;
//                 padding: 0;
//                 margin: 0;
//                 font-size: 11pt;
//               }
//               table {
//                 width: 100%;
//                 border-collapse: collapse;
//               }
//               th, td {
//                 padding: 4px;
//                 text-align: left;
//                 border-bottom: 1px solid #ddd;
//                 font-size: 10pt;
//               }
//               th {
//                 background-color: #f2f2f2;
//               }
//               .print-header {
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: flex-start;
//                 margin-bottom: 12px;
//               }
//               .print-title {
//                 font-size: 14pt;
//                 font-weight: bold;
//                 margin: 5px 0;
//               }
//               .print-price {
//                 font-size: 12pt;
//                 margin-top: 2px;
//               }
//               .card {
//                 padding: 8px !important;
//                 box-shadow: none !important;
//                 border: none !important;
//               }
//               @media print {
//             .no-print {
//               display:none;
//             }
//                 .button-container {
//                   display: none;
//                 }
//                 button {
//                   display: none;
//                 }
//                 .card {
//                   border: none !important;
//                   box-shadow: none !important;
//                 }
//               }
//             </style>
//           </head>
//           <body>
//             ${printContents}
//           </body>
//         </html>
//       `;
      
//       window.print();
//       document.body.innerHTML = originalContents;
//     }
//   };

//   // Type definitions for components
//   type CustomCardProps = {
//     children: React.ReactNode;
//     className?: string;
//   };

//   const CustomCard = ({ children, className = '' }: CustomCardProps) => (
//     <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
//       {children}
//     </div>
//   );

//   const CustomCardHeader = ({ children, className = '' }: CustomCardProps) => (
//     <div className={`mb-4 ${className}`}>
//       {children}
//     </div>
//   );

//   const CustomCardTitle = ({ children, className = '' }: CustomCardProps) => (
//     <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
//       {children}
//     </h3>
//   );

//   // Type definition for lead data
//   interface LeadData {
//     id: number;
//     name: string;
//     stage_id: [number, string] | false;
//     user_id: [number, string] | false;
//     partner_id: [number, string] | false;
//     type_id: [number, string] | false;
//     description: string;
//     create_date: string;
//     date_deadline: string;
//     date_open: string;
//     date_closed: string;
//     email_from: string;
//     phone: string;
//     tag_ids: string[];
//     expected_revenue: number;
//     lead_properties: Array<{
//       name: string;
//       type: string;
//       value: any;
//       selection?: [string, string][];
//     }>;
//   }

//   // Type guard for lead data
//   const isLeadData = (data: any): data is LeadData => {
//     return data && typeof data === 'object' && 'id' in data;
//   };

//   // Get property value with type safety
//   const getPropertyValue = (name: string, defaultValue: string = "-") => {
//     if (!lead || !isLeadData(lead)) return defaultValue;
    
//     const prop = lead.lead_properties.find(p => p.name === name);
//     if (!prop) return defaultValue;
    
//     // Handle selection type properties
//     if (prop.type === 'selection' && prop.selection) {
//       const selectedOption = prop.selection.find(option => option[0] === prop.value);
//       return selectedOption ? selectedOption[1] : defaultValue;
//     }
    
//     return prop.value || defaultValue;
//   };

//   // Get stage name with type safety
//   const getStageName = (stageId: [number, string] | false): string => {
//     if (!stageId) return "-";
//     return stageId[1];
//   };

//   // Get user name with type safety
//   const getUserName = (userId: [number, string] | false): string => {
//     if (!userId) return "-";
//     return userId[1];
//   };

//   // Format date
//   const formatDate = (dateString: string | false) => {
//     if (!dateString) return "-";
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   if (isLoading) {
//     return (
//       <Card className="p-6 max-w-3xl mx-auto">
//         <div className="text-center">Loading...</div>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="p-6 max-w-3xl mx-auto">
//         <div className="text-center text-red-500">Error loading lead: {error.message}</div>
//       </Card>
//     );
//   }

//   if (!lead) {
//     return (
//       <Card className="p-6 max-w-3xl mx-auto">
//         <div className="text-center text-gray-500">No data available</div>
//       </Card>
//     );
//   }

//   const availableStages = getAvailableStages();

//   return (
//     <div className="container mx-auto p-4" ref={printRef}>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">งานพิมพ์ #{jobNo}</h1>
//         <div className="flex gap-2">
//           <Button onClick={() => setShowStageModal(true)}>
//             ส่งงานต่อไป
//           </Button>
//           <Button onClick={() => setShowTeamModal(true)}>
//             มอบหมายงาน
//           </Button>
//           <Button onClick={handlePrint}>
//             พิมพ์
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <CustomCard>
//           <CustomCardHeader>
//             <CustomCardTitle>ข้อมูลงาน</CustomCardTitle>
//           </CustomCardHeader>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">สถานะ</label>
//               <p className="mt-1">{getPropertyValue('stage_id', 'ยังไม่ได้กำหนด')}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">ผู้รับผิดชอบ</label>
//               <p className="mt-1">{getPropertyValue('user_id', 'ยังไม่ได้มอบหมาย')}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">วันที่สร้าง</label>
//               <p className="mt-1">{formatDate(getPropertyValue('create_date'))}</p>
//             </div>
//           </div>
//         </CustomCard>

//         <CustomCard>
//           <CustomCardHeader>
//             <CustomCardTitle>รายละเอียดงาน</CustomCardTitle>
//           </CustomCardHeader>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">ชื่อลูกค้า</label>
//               <p className="mt-1">{getPropertyValue('partner_id')}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">ประเภทงาน</label>
//               <p className="mt-1">{getPropertyValue('type_id')}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">รายละเอียด</label>
//               <p className="mt-1">{getPropertyValue('description')}</p>
//             </div>
//           </div>
//         </CustomCard>
//       </div>

//       {/* Team Member Selection Modal */}
//       <Dialog open={showTeamModal} onOpenChange={setShowTeamModal}>
//         <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>มอบหมายงานให้ทีมงาน</DialogTitle>
//           </DialogHeader>
          
//           <div className="space-y-4">
//             <div className="text-sm text-gray-600">
//               เลือกคนที่จะมอบหมายงานให้:
//             </div>
            
//             {loadingTeamMembers ? (
//               <div className="text-center py-4">
//                 <div className="text-sm text-gray-500">กำลังโหลดทีมงาน...</div>
//               </div>
//             ) : Object.keys(groupedTeamMembers).length > 0 ? (
//               <div className="space-y-3">
//                 {Object.entries(groupedTeamMembers).map(([teamName, members]) => (
//                   <div key={teamName} className="space-y-2">
//                     <div className="text-sm font-medium text-gray-700 flex items-center gap-2 border-b pb-1">
//                       <span className="text-base">{getTeamEmoji(teamName)}</span>
//                       {teamName}
//                     </div>
//                     <div className="space-y-1 pl-4">
//                       {members.map((member) => (
//                         <Button
//                           key={member.id}
//                           variant="outline"
//                           className="w-full justify-start h-auto p-3 text-left hover:bg-blue-50 hover:border-blue-200"
//                           onClick={() => acceptJob(member.user_id[0], member.user_id[1])}
//                           disabled={acceptingJob}
//                         >
//                           <div className="flex items-center gap-3 w-full">
//                             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
//                               {member.name.charAt(0)}
//                             </div>
//                             <div className="flex-1 text-left">
//                               <div className="font-medium">{member.name}</div>
//                               <div className="text-xs text-gray-500">{member.email}</div>
//                             </div>
//                           </div>
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-4">
//                 <div className="text-sm text-gray-500">
//                   ไม่พบข้อมูลทีมงาน
//                 </div>
//               </div>
//             )}
            
//             {acceptingJob && (
//               <div className="text-center py-2">
//                 <div className="text-sm text-blue-600">กำลังมอบหมายงาน...</div>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Stage Selection Modal */}
//       <Dialog open={showStageModal} onOpenChange={setShowStageModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>ส่งงานไปยังขั้นตอนถัดไป</DialogTitle>
//           </DialogHeader>
          
//           <div className="space-y-4">
//             <div className="text-sm text-gray-600">
//               สถานะปัจจุบัน: <span className="font-medium flex items-center gap-1">
//                 <span className="text-base">{getStageEmoji(lead.stage_id ? lead.stage_id[1] : "")}</span>
//                 {lead.stage_id ? lead.stage_id[1] : "ไม่ระบุ"}
//               </span>
//             </div>
            
//             {loadingStages ? (
//               <div className="text-center py-4">
//                 <div className="text-sm text-gray-500">กำลังโหลดขั้นตอน...</div>
//               </div>
//             ) : availableStages.length > 0 ? (
//               <div className="space-y-2">
//                 <div className="text-sm font-medium text-gray-700">เลือกขั้นตอนถัดไป:</div>
//                 {availableStages.map((stage) => (
//                   <Button
//                     key={stage.id}
//                     variant="outline"
//                     className="w-full justify-start h-auto p-3 text-left hover:bg-blue-50 hover:border-blue-200"
//                     onClick={() => updateLeadStage(stage.id, stage.name)}
//                     disabled={updatingStage}
//                   >
//                     <div className="flex items-center gap-3 w-full">
//                       <span className="text-xl">{getStageEmoji(stage.name)}</span>
//                       <div className="flex-1">
//                         <div className="font-medium">{stage.name}</div>
//                         <div className="text-xs text-gray-500">ลำดับที่ {stage.sequence + 1}</div>
//                       </div>
//                     </div>
//                   </Button>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-4">
//                 <div className="text-sm text-gray-500">
//                   ไม่มีขั้นตอนถัดไปสำหรับงานนี้
//                 </div>
//               </div>
//             )}
            
//             {updatingStage && (
//               <div className="text-center py-2">
//                 <div className="text-sm text-blue-600">กำลังอัปเดตสถานะ...</div>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Sticky Footer with Action Buttons */}
//       <div className="no-print fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between gap-4 z-50 shadow-lg">
//         <Button 
//           variant="outline" 
//           className="flex-1 max-w-32 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
//           onClick={() => setShowTeamModal(true)}
//           disabled={!lead}
//         >
//           🤝 รับงาน
//         </Button>
//         <Button 
//           className="flex-1 max-w-32 bg-blue-600 hover:bg-blue-700 text-white"
//           onClick={() => setShowStageModal(true)}
//           disabled={!lead}
//         >
//           📤 ส่งงานไปยัง
//         </Button>
//       </div>
//     </div>
//   );
// }