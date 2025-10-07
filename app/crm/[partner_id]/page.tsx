import CustomerPortal from '@/components/CustomerPortal';

export default async function CustomerCRMPage({
  params,
}: {
  params: Promise<{ partner_id: string }>;
}) {
  const resolvedParams = await params;
  return <CustomerPortal partnerId={resolvedParams.partner_id} />;
}