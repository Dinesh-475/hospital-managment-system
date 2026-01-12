import { motion } from 'framer-motion';
import { HeartPulse, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#050505] text-white">
      {/* Top Navigation (Matches Reference Image) */}
      <div className="absolute top-0 left-0 w-full z-20 p-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <HeartPulse className="w-6 h-6 text-ios-blue group-hover:scale-110 transition-transform" />
          <span className="font-bold tracking-tight">Docvista</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/40">
          <Link to="#" className="hover:text-white transition-colors">Home</Link>
          <Link to="#" className="hover:text-white transition-colors">Services</Link>
          <Link to="#" className="hover:text-white transition-colors">Project</Link>
          <Link to="#" className="hover:text-white transition-colors">Review</Link>
          <div className="flex items-center gap-2 ml-4">
             <Link to="/login" className="px-4 py-2 hover:text-white transition-colors">Sign in</Link>
             <Link to="/register" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white border border-white/10">Login</Link>
          </div>
        </div>
      </div>

      {/* Background Grid & Effects */}
      <div className="absolute inset-0 z-0 opacity-20" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} 
      />
      
      {/* Animated Liquid Blobs (Moving Objects) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 45, -45, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-ios-blue/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 100, -80, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-ios-purple/15 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial from-ios-blue/5 to-transparent blur-[100px]"
        />
      </div>

      {/* Background Objects (Diagonal Stripes) */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[30px] bg-white/30 -rotate-45 translate-x-[20%] -translate-y-[50%]" />
        <div className="absolute top-0 right-0 w-[800px] h-[30px] bg-white/30 -rotate-45 translate-x-[25%] -translate-y-[45%]" />
        <div className="absolute top-0 right-0 w-[800px] h-[30px] bg-white/30 -rotate-45 translate-x-[30%] -translate-y-[40%]" />
        
        <div className="absolute bottom-0 left-0 w-[800px] h-[30px] bg-white/30 -rotate-45 -translate-x-[20%] translate-y-[50%]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[30px] bg-white/30 -rotate-45 -translate-x-[25%] translate-y-[45%]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[30px] bg-white/30 -rotate-45 -translate-x-[30%] translate-y-[40%]" />
      </div>

      <div className="container-apple relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-100px)] mt-20">
        {/* Left Side: Hero Content & Character */}
        <div className="hidden lg:flex flex-col space-y-12 text-left relative min-h-[500px]">
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-white"
            >
              The Next Gen <br />
              <span className="text-ios-blue drop-shadow-[0_0_30px_rgba(0,122,255,0.4)]">Hospital</span> OS.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-white/50 max-w-xl leading-relaxed"
            >
              Manage appointments, medical records, and digital health with Apple-level precision and security.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-10 pt-4"
          >
            <div className="flex items-center gap-3 text-sm font-bold text-white/30 uppercase tracking-[0.2em]">
              <Shield className="w-5 h-5 text-ios-blue" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-white/30 uppercase tracking-[0.2em]">
              <Zap className="w-5 h-5 text-ios-blue" />
              <span>Real-time</span>
            </div>
          </motion.div>

          {/* Character illustration (placeholder replaced with generated image path if available) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-[-100px] left-[-50px] w-[500px] pointer-events-none opacity-80"
          >
            <img 
               src="/Users/octane/.gemini/antigravity/brain/983e0e9c-8c47-4e71-8e63-9ff4d71e1502/auth_characters_matching_ref_1767538923427.png" 
               alt="Healthcare Illustration" 
               className="w-full h-auto filter drop-shadow-[0_0_50px_rgba(0,122,255,0.2)]"
            />
          </motion.div>
        </div>

        {/* Right Side: Glass Frame & Form */}
        <div className="flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="w-full max-w-[480px] relative"
          >
            {/* Liquid Glass Container (White Glass Style) */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20">
               {/* Inner Accent */}
               <div className="absolute -top-40 -right-40 w-80 h-80 bg-ios-blue/10 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 p-10 md:p-14 flex flex-col items-center">
              <div className="w-full text-center space-y-3 mb-10">
                <motion.h2 
                  className="text-4xl font-bold tracking-tight text-gray-900"
                >
                  {title}
                </motion.h2>
                <p className="text-gray-500 font-medium text-lg italic">{subtitle}</p>
              </div>

              <div className="w-full">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
