
import { Suspense } from 'react';
import PrintJobPage from '@/components/PrintJobPage';
import Loading from '@/components/Loading'; // Create a loading component

export default function Page({ searchParams }) {
  
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <PrintJobPage />
      </Suspense>
    </main>
  );
}