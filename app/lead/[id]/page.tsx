import { Metadata } from 'next';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Default metadata
  let title = 'ใบสั่งงาน - โรงพิมพ์สมุยอักษร';
  let description = 'ระบบจัดการใบสั่งงาน - โรงพิมพ์สมุยอักษร';
  
  // Fetch job data for better metadata
  if (id) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.erpsamuiaksorn.com';
      const fetchUrl = `${apiUrl}/api/crm.lead/${id}`;
      
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

export default async function LeadPage({ params }: Props) {
  const { id } = await params;
  
  // Redirect to main page with id as query param to maintain functionality
  redirect(`/?id=${id}`);
}