import { HeartPulse } from 'lucide-react';

export const LoginNavbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 flex items-center justify-between pointer-events-none">
       <div className="pointer-events-auto flex items-center gap-2">
         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <HeartPulse className="text-white w-6 h-6" />
         </div>
         <span className="font-bold text-xl tracking-tight text-gray-900">Docvista</span>
       </div>
       
       <div className="pointer-events-auto">
          {/* Registration removed as per new logic */}
       </div>
    </nav>
  );
};
