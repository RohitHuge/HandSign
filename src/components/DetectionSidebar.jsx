import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Fingerprint, Network } from 'lucide-react';

export default function DetectionSidebar({ currentGesture }) {
  return (
    <div className="flex-1 flex flex-col gap-4">
      
      {/* Current Detection Card */}
      <div className="flex-1 rounded-2xl border border-cyber-700 bg-cyber-800/50 backdrop-blur p-6 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-purple/10 blur-[50px] rounded-full" />
        
        <div className="flex items-center gap-2 text-cyber-purple mb-6 font-mono text-sm">
          <Fingerprint className="w-4 h-4" />
          <span>CURRENT_NODE_MATCH</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentGesture ? (
              <motion.div
                key={currentGesture.word}
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                className="text-center"
              >
                <h2 className="text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {currentGesture.word}
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyber-900 border border-cyber-700">
                  <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                  <span className="font-mono text-cyber-green">{currentGesture.confidence}% CONFIDENCE</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-cyber-700 font-mono text-xl flex flex-col items-center gap-4"
              >
                <Activity className="w-12 h-12 opacity-50" />
                AWAITING GESTURE
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative Grid */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-[linear-gradient(transparent_0%,_var(--color-cyber-800)_100%),_repeating-linear-gradient(0deg,_transparent_0%,_transparent_1px,_var(--color-cyber-700)_1px,_var(--color-cyber-700)_2px)] opacity-30" />
      </div>

      {/* System Stats */}
      <div className="h-48 rounded-2xl border border-cyber-700 bg-cyber-800/50 backdrop-blur p-4 flex flex-col gap-4 font-mono text-xs">
        <h3 className="text-gray-400 flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          NEURAL ENGINE
        </h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-cyber-neon">TENSOR_CORES</span>
              <span>84%</span>
            </div>
            <div className="h-1 bg-cyber-900 rounded overflow-hidden">
              <motion.div 
                className="h-full bg-cyber-neon"
                initial={{ width: "80%" }}
                animate={{ width: ["80%", "88%", "82%", "85%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-cyber-purple">MEMORY_ALLOC</span>
              <span>2.4 GB</span>
            </div>
            <div className="h-1 bg-cyber-900 rounded overflow-hidden">
              <motion.div 
                className="h-full bg-cyber-purple"
                initial={{ width: "60%" }}
                animate={{ width: ["60%", "62%", "59%", "61%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 text-gray-500">
          <Network className="w-4 h-4" />
          MODEL: HAND_LANDMARKER_V2
        </div>
      </div>
    </div>
  );
}
