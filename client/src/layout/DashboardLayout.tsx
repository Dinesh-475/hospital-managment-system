
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UniversalNavBar from '@/components/Navigation/UniversalNavBar';
import PageTransition from '@/components/PageTransition';
import { RootState } from '@/store'; // Ensure RootState is imported for typed selector

const DashboardLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null; // Or generic loading

  return (
    <div className="min-h-screen bg-[#f4f7fe] font-sans text-gray-900 relative overflow-x-hidden">
       {/* Global Cartoonish Background blobs (Soft & Playful) - Matching Login */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[60px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[80px] animate-pulse animation-delay-2000" />
       </div>

       <div className="relative z-10">
         <UniversalNavBar user={user} />
         
         <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
            <div className="liquid-glass rounded-[2rem] p-6 sm:p-8 min-h-[80vh]">
                <PageTransition>
                <Outlet />
                </PageTransition>
            </div>
         </main>
       </div>
    </div>
  );
};

export default DashboardLayout;
