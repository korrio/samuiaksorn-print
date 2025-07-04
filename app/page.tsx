import { Suspense } from 'react';
import { Metadata } from 'next';
import PrintJobPageV2 from '@/components/PrintJobPageV2';
// import PrintJobPageMobile from '@/components/PrintJobPageMobile'; // Your mobile-optimized component
import Loading from '@/components/Loading';
import LeadSearch from '@/components/LeadSearch';
import RecentActivities from '@/components/RecentActivities';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const id = params.id as string;
  const jobNo = params.job as string;

  // Default metadata
  let title = 'ใบสั่งงาน - โรงพิมพ์สมุยอักษร';
  let description = 'ระบบจัดการใบสั่งงาน - โรงพิมพ์สมุยอักษร';
  
  // If we have an ID or job number, try to fetch job data for better metadata
  if (id || jobNo) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.erpsamuiaksorn.com';
      const fetchUrl = id 
        ? `${apiUrl}/api/crm.lead/${id}`
        : `${apiUrl}/api/crm.lead/by-job/${jobNo}`;
      
      const response = await fetch(fetchUrl, { next: { revalidate: 300 } }); // Cache for 5 minutes
      const result = await response.json();
      
      if (result.success && result.data) {
        const jobData = result.data;
        title = `${jobData.name} - โรงพิมพ์สมุยอักษร`;
        
        const customer = jobData.partner_id ? jobData.partner_id[1] : '';
        const price = jobData.expected_revenue ? `${jobData.expected_revenue.toLocaleString('th-TH')} บาท` : '';
        const stage = jobData.stage_id ? jobData.stage_id[1] : '';
        
        description = `งาน: ${jobData.name}`;
        if (customer) description += ` | ลูกค้า: ${customer}`;
        if (price) description += ` | ราคา: ${price}`;
        if (stage) description += ` | สถานะ: ${stage}`;
      }
    } catch (error) {
      console.error('Error fetching job data for metadata:', error);
    }
  }

  // Build OG image URL
  const ogImageUrl = new URL('/api/og', 'https://print.erpsamuiaksorn.com');
  if (id) ogImageUrl.searchParams.set('id', id);
  if (jobNo) ogImageUrl.searchParams.set('job', jobNo);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      siteName: 'โรงพิมพ์สมุยอักษร',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const id = params.id as string;
  const jobNo = params.job as string;

  // If no ID or job parameter, show search component
  if (!id && !jobNo) {
    return (
      <main>
        <LeadSearch />
        <div className="mt-8 max-w-3xl mx-auto p-6">
          <RecentActivities />
        </div>
      </main>
    );
  }

  // Otherwise show the print job page
  return (
    <main>
      <Suspense fallback={<Loading />}>
        {/* Desktop Version - Hidden on mobile */}
        <div className="hidden md:block">
          <PrintJobPageV2 />
        </div>
        
        {/* Mobile Version - Hidden on desktop */}
        <div className="block md:hidden">
          {/*<PrintJobPageMobile/>*/}
          <PrintJobPageV2 />
        </div>
      </Suspense>
    </main>
  );
}