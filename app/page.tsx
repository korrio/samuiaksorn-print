import { Suspense } from 'react';
import PrintJobPage from '@/components/PrintJobPage';
// import PrintJobPageMobile from '@/components/PrintJobPageMobile'; // Your mobile-optimized component
import Loading from '@/components/Loading';

export default function Page() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        {/* Desktop Version - Hidden on mobile */}
        <div className="hidden md:block">
          <PrintJobPage />
        </div>
        
        {/* Mobile Version - Hidden on desktop */}
        <div className="block md:hidden">
          {/*<PrintJobPageMobile/>*/}
          <PrintJobPage />
        </div>
      </Suspense>
    </main>
  );
}