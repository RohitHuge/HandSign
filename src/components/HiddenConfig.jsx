import { useState } from 'react';
import { X, Plus, Trash2, Clock } from 'lucide-react';

export default function HiddenConfig({ currentTime, timestampMap, onUpdateMap, onClose }) {
  const [newWord, setNewWord] = useState('');

  const handleAdd = () => {
    if (!newWord.trim()) return;
    
    const newEntry = {
      time: currentTime,
      word: newWord.toUpperCase(),
      confidence: Math.floor(Math.random() * 15) + 85 // random 85-99
    };
    
    onUpdateMap([...timestampMap, newEntry].sort((a, b) => a.time - b.time));
    setNewWord('');
  };

  const handleRemove = (index) => {
    const newMap = [...timestampMap];
    newMap.splice(index, 1);
    onUpdateMap(newMap);
  };

  return (
    <div className="absolute top-16 right-4 w-80 bg-cyber-900 border border-cyber-700 shadow-2xl rounded-xl z-50 overflow-hidden text-sm">
      <div className="flex justify-between items-center bg-cyber-800 p-3 border-b border-cyber-700">
        <h3 className="font-mono text-cyber-purple font-bold tracking-widest flex items-center gap-2">
          <Clock className="w-4 h-4" />
          TIMELINE_CONFIG
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Time Info */}
        <div className="flex justify-between items-center bg-black/50 rounded p-2 border border-cyber-700/50">
          <span className="text-gray-400">Current Video Time:</span>
          <span className="font-mono text-cyber-neon">{currentTime}s</span>
        </div>

        {/* Add New Word */}
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Enter word to trigger..."
            className="flex-1 bg-cyber-800 border border-cyber-700 rounded px-3 py-1.5 focus:outline-none focus:border-cyber-neon font-mono text-xs uppercase"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button 
            onClick={handleAdd}
            className="bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50 rounded px-3 hover:bg-cyber-purple/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Mapping */}
        <div className="max-h-48 overflow-y-auto space-y-2 mt-4">
          <div className="text-xs text-gray-500 font-mono mb-2">MAPPED TRIGGERS</div>
          {timestampMap.length === 0 ? (
            <div className="text-gray-500 text-center py-2 text-xs">No triggers configured</div>
          ) : (
            timestampMap.map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center bg-cyber-800/50 rounded p-2 border border-cyber-700">
                <div className="font-mono">
                  <span className="text-cyber-neon mr-2">{entry.time}s</span>
                  <span className="text-white">{entry.word}</span>
                </div>
                <button 
                  onClick={() => handleRemove(idx)}
                  className="text-red-500/50 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
