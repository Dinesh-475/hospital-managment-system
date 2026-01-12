import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    title: "Smart Hospital Management",
    description: "AI-powered automation for patient records, appointments, and staff management.",
    color: "bg-ios-blue",
    icon: "🏥"
  },
  {
    title: "Real-time Analytics",
    description: "Track hospital performance, patient flow, and resource utilization in real-time.",
    color: "bg-ios-purple",
    icon: "📊"
  },
  {
    title: "Secure & Private",
    description: "Enterprise-grade security ensuring patient data remains confidential and protected.",
    color: "bg-ios-green",
    icon: "🛡️"
  }
];

export const LoginCarousel = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 flex-col justify-between">
      
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
         <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="relative z-10">
         <div className="flex items-center gap-2 mb-8 opacity-90">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">D</div>
            <span className="font-bold text-lg tracking-wide">DOCVISTA</span>
         </div>
         
         <div className="h-[400px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                 <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-4xl shadow-2xl">
                    {features[active].icon}
                 </div>
                 <h2 className="text-4xl md:text-5xl font-bold leading-tight font-heading">
                    {features[active].title}
                 </h2>
                 <p className="text-lg text-blue-100 max-w-md font-light leading-relaxed">
                    {features[active].description}
                 </p>
              </motion.div>
            </AnimatePresence>
         </div>
      </div>
      
      {/* Progress Indicators */}
      <div className="flex space-x-3 relative z-10">
        {features.map((_, idx) => (
          <div 
             key={idx} 
             className={`h-1.5 rounded-full transition-all duration-500 ${idx === active ? 'w-12 bg-white' : 'w-3 bg-white/30'}`} 
          />
        ))}
      </div>

    </div>
  );
};
