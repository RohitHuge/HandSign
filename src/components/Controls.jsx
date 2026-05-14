import { Play, Square, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Controls({ isPlaying, onTogglePlay, onReset }) {
  return (
    <div className="absolute bottom-8 right-8 flex gap-3 z-50">
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="w-12 h-12 rounded-full bg-cyber-800 border border-cyber-700 text-gray-400 flex items-center justify-center hover:text-white hover:border-cyber-purple transition-colors shadow-lg"
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 240, 255, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onTogglePlay}
        className={`px-6 h-12 rounded-full flex items-center gap-2 font-mono text-sm font-bold tracking-wider border shadow-lg transition-colors ${
          isPlaying 
            ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20' 
            : 'bg-cyber-neon/10 border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon/20'
        }`}
      >
        {isPlaying ? (
          <>
            <Square className="w-4 h-4 fill-current" />
            STOP_FEED
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            INIT_DETECTION
          </>
        )}
      </motion.button>
      
    </div>
  );
}
