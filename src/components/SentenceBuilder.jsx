import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function SentenceBuilder({ words }) {
  return (
    <div className="h-40 shrink-0 flex gap-4">
      {/* Raw Output */}
      <div className="flex-1 rounded-2xl border border-cyber-700 bg-cyber-800/80 backdrop-blur p-6 flex flex-col relative overflow-hidden">
        <h3 className="text-gray-400 font-mono text-sm flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5" />
          RAW_DETECTION_STREAM
        </h3>
        
        <div className="flex flex-wrap gap-3 overflow-y-auto pr-2 pb-2">
          <AnimatePresence>
            {words.map((word, i) => (
              <motion.div
                key={`${word}-${i}`}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className="px-4 py-2 rounded-lg bg-cyber-900 border border-cyber-700 font-mono text-lg text-cyber-neon shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                {word}
              </motion.div>
            ))}
          </AnimatePresence>
          {words.length === 0 && (
            <span className="text-cyber-700 font-mono text-lg italic">Waiting for input...</span>
          )}
        </div>
      </div>
    </div>
  );
}
