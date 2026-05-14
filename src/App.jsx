import { useState, useEffect } from 'react'
import VideoAnalysisPanel from './components/VideoAnalysisPanel'
import DetectionSidebar from './components/DetectionSidebar'
import SentenceBuilder from './components/SentenceBuilder'
import HiddenConfig from './components/HiddenConfig'
import Controls from './components/Controls'

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentGesture, setCurrentGesture] = useState(null);
  const [detectedWords, setDetectedWords] = useState([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const [timestampMap, setTimestampMap] = useState([]);

  // Load initial data
  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => setTimestampMap(data))
      .catch(err => console.error("Error loading data.json", err));
  }, []);

  const handleUpdateMap = async (newMap) => {
    setTimestampMap(newMap);
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMap)
      });
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  return (
    <div className="h-screen w-screen bg-cyber-900 text-white flex flex-col p-4 gap-4 overflow-hidden relative" 
         onKeyDown={(e) => {
           if (e.ctrlKey && e.shiftKey && e.key === 'X') {
             setIsConfigOpen(!isConfigOpen);
           }
         }}
         tabIndex={0}>
      
      {/* Header */}
      <header className="flex justify-between items-center px-2 py-1">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-neon to-cyber-purple tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse shadow-[0_0_10px_#00f0ff]"></span>
          NEXUS SIGN.AI
        </h1>
        <div className="flex gap-4 text-sm font-mono text-gray-400">
          <div>SYS.STATUS: <span className="text-cyber-green">ONLINE</span></div>
          <div>LATENCY: <span className="text-cyber-neon">12ms</span></div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        <VideoAnalysisPanel 
          isPlaying={isPlaying}
          onTimeUpdate={setCurrentTime}
          timestampMap={timestampMap}
          onGestureDetected={(gesture) => {
            setCurrentGesture(gesture);
            if (gesture && !detectedWords.includes(gesture.word)) {
              setDetectedWords(prev => [...prev, gesture.word]);
            }
          }}
        />
        <DetectionSidebar currentGesture={currentGesture} />
      </div>

      {/* Bottom Area */}
      <SentenceBuilder words={detectedWords} />

      {/* Floating Elements */}
      <Controls 
        isPlaying={isPlaying} 
        onTogglePlay={() => setIsPlaying(!isPlaying)} 
        onReset={() => {
          setDetectedWords([]);
          setCurrentGesture(null);
        }}
      />

      {isConfigOpen && (
        <HiddenConfig 
          currentTime={currentTime}
          timestampMap={timestampMap}
          onUpdateMap={handleUpdateMap}
          onClose={() => setIsConfigOpen(false)}
        />
      )}
      
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-purple/5 via-cyber-900/0 to-transparent z-[-1]" />
    </div>
  )
}

export default App
