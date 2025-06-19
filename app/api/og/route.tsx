/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const jobNo = searchParams.get('job');

    // Fetch job data
    let jobData = null;
    if (id || jobNo) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.erpsamuiaksorn.com';
        const fetchUrl = id 
          ? `${apiUrl}/api/crm.lead/${id}`
          : `${apiUrl}/api/crm.lead/by-job/${jobNo}`;
        
        const response = await fetch(fetchUrl);
        const result = await response.json();
        
        if (result.success) {
          jobData = result.data;
        }
      } catch (error) {
        console.error('Error fetching job data for OG image:', error);
      }
    }

    // Default values
    const title = jobData?.name || 'ใบสั่งงาน - โรงพิมพ์สมุยอักษร';
    const price = jobData?.expected_revenue 
      ? `${jobData.expected_revenue.toLocaleString('th-TH')} บาท`
      : '-';
    const stage = jobData?.stage_id ? jobData.stage_id[1] : 'ไม่ระบุสถานะ';
    const customer = jobData?.partner_id ? jobData.partner_id[1] : '-';
    
    // Get Job No from properties
    const getPropertyValue = (name: string) => {
      if (!jobData) return '-';
      const prop = jobData.lead_properties?.find((p: any) => p.name === name);
      return prop?.value || '-';
    };
    
    const jobNumber = getPropertyValue('2f9b502ecd32baca') || jobNo || '-';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8fafc',
            padding: '40px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1e40af',
              }}
            >
              🖨️ โรงพิมพ์สมุยอักษร
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                color: '#6b7280',
                backgroundColor: '#e5e7eb',
                padding: '8px 16px',
                borderRadius: '8px',
              }}
            >
              Job #{jobNumber}
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              flex: 1,
            }}
          >
            {/* Title */}
            <div
              style={{
                display: 'flex',
                fontSize: '52px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '24px',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>

            {/* Info Grid */}
            <div
              style={{
                display: 'flex',
                gap: '32px',
                marginBottom: '32px',
              }}
            >
              <div style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '16px',
                    color: '#6b7280',
                    marginBottom: '8px',
                  }}
                >
                  {/*ลูกค้า*/}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '52px',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  {customer}
                </div>
              </div>
              <div style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '16px',
                    color: '#6b7280',
                    marginBottom: '8px',
                  }}
                >
                  {/*สถานะ*/}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '52px',
                    fontWeight: '600',
                    color: '#374151',
                    backgroundColor: '#dbeafe',
                    padding: '8px 16px',
                    borderRadius: '8px',
                  }}
                >
                  {stage}
                </div>
              </div>
            </div>

            {/* Price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f0fdf4',
                padding: '24px',
                borderRadius: '12px',
                border: '2px solid #bbf7d0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '18px',
                  color: '#15803d',
                  fontWeight: '500',
                }}
              >
                ราคา
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#15803d',
                }}
              >
                {price}
              </div>
            </div>
          </div>

          {/* Footer */}
{/*          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#9ca3af',
              marginTop: '32px',
            }}
          >
            ระบบจัดการใบสั่งงาน - โรงพิมพ์สมุยอักษร
          </div>*/}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#374151',
          }}
        >
          <div style={{ display: 'flex' }}>🖨️ โรงพิมพ์สมุยอักษร</div>
          <div style={{ 
            display: 'flex',
            fontSize: '20px', 
            marginTop: '16px', 
            color: '#6b7280' 
          }}>
            ระบบจัดการใบสั่งงาน
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}