import LeadDetails from '@/components/LeadDetails';
import PrintJobPage from '@/components/PrintJobPage';
import OdooCrmLeads from '@/components/OdooCrmLeads';

export default function Page({ params }: { params: { id ? : string } }) {
    console.log("params.id",params.id)
    return (
        <main>
        {/*<LeadDetails />*/}
        <PrintJobPage />
      { /*<h1>Lead Details</h1>*/}
      {/*<OdooCrmLeads leadId={2510} />*/}
    </main>
    );
}