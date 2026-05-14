import { useRef, useEffect, useState } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { motion } from 'framer-motion';
import { Scan } from 'lucide-react';

export default function VideoAnalysisPanel({ isPlaying, onTimeUpdate, timestampMap, onGestureDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [handLandmarker, setHandLandmarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  // Initialize MediaPipe
  useEffect(() => {
    const initializeMediaPipe = async () => {
      setIsLoading(true);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        setHandLandmarker(landmarker);
      } catch (err) {
        console.error("Error loading mediapipe:", err);
      }
      setIsLoading(false);
    };
    initializeMediaPipe();
  }, []);

  // Handle Play/Pause
  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play();
      predictWebcam();
    } else {
      videoRef.current?.pause();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying, handLandmarker]);

  const predictWebcam = () => {
    if (!videoRef.current || !canvasRef.current || !handLandmarker) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Prevent MediaPipe from crashing if video is not fully loaded or has 0 dimensions
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      if (isPlaying && !video.paused) {
        animationRef.current = requestAnimationFrame(predictWebcam);
      }
      return;
    }

    const ctx = canvas.getContext('2d');

    // Ensure canvas dimensions match video
    if (canvas.width !== video.clientWidth || canvas.height !== video.clientHeight) {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
    }

    let startTimeMs = performance.now();
    if (lastVideoTimeRef.current !== video.currentTime) {
      lastVideoTimeRef.current = video.currentTime;

      try {
        const results = handLandmarker.detectForVideo(video, startTimeMs);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw futuristic nodes and lines
        if (results.landmarks) {
          for (const landmarks of results.landmarks) {
            // Draw connections
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00f0ff';
            
            const HAND_CONNECTIONS = [
              [0, 1], [1, 2], [2, 3], [3, 4],
              [0, 5], [5, 6], [6, 7], [7, 8],
              [5, 9], [9, 10], [10, 11], [11, 12],
              [9, 13], [13, 14], [14, 15], [15, 16],
              [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]
            ];

            for (const connection of HAND_CONNECTIONS) {
              const start = landmarks[connection[0]];
              const end = landmarks[connection[1]];
              
              ctx.beginPath();
              ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
              ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
              ctx.stroke();
            }

            // Draw nodes
            ctx.strokeStyle = '#00f0ff';
            ctx.fillStyle = '#b026ff';
            ctx.lineWidth = 2;

            for (const point of landmarks) {
              ctx.beginPath();
              ctx.arc(point.x * canvas.width, point.y * canvas.height, 4, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
            }
            ctx.shadowBlur = 0;
          }
        }
      } catch (err) {
        // Ignore MediaPipe errors if video is interrupted
        console.warn("MediaPipe processing interrupted:", err);
      }
    }

    // Trigger onTimeUpdate and check for gestures
    const currentTime = Math.floor(video.currentTime);
    onTimeUpdate(currentTime);

    // Check if any mapped timestamp matches current time
    const matched = timestampMap.find(m => Math.abs(m.time - currentTime) < 0.5);
    if (matched) {
      onGestureDetected(matched);
    }

    if (isPlaying && !video.paused) {
      animationRef.current = requestAnimationFrame(predictWebcam);
    }
  };

  return (
    <div className="flex-[2] relative rounded-2xl overflow-hidden border border-cyber-700 bg-cyber-800 shadow-[0_0_30px_rgba(0,240,255,0.1)] group">

      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-neon rounded-tl-xl m-4 z-20" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-neon rounded-tr-xl m-4 z-20" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-neon rounded-bl-xl m-4 z-20" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-neon rounded-br-xl m-4 z-20" />

      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover grayscale opacity-80 mix-blend-screen"
        crossOrigin="anonymous"
        loop
        playsInline
      >
        {/* Placeholder video or user can provide one */}
        <source src="../../HandSign.mp4" type="video/mp4" />
      </video>

      {/* MediaPipe Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Scanning Overlay Effect */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 h-1 bg-cyber-neon/50 shadow-[0_0_20px_#00f0ff] z-10"
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-900/80 backdrop-blur-sm z-30">
          <Scan className="w-12 h-12 text-cyber-neon animate-spin mb-4" />
          <p className="font-mono text-cyber-neon tracking-widest animate-pulse">INITIALIZING VISION CORE...</p>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyber-900/80 border border-cyber-700 backdrop-blur-md z-20 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyber-neon animate-pulse shadow-[0_0_8px_#00f0ff]' : 'bg-red-500'}`} />
        <span className="font-mono text-xs tracking-wider">{isPlaying ? 'ANALYZING FEED' : 'STANDBY'}</span>
      </div>

    </div>
  );
}
