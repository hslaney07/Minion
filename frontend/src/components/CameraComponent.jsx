// CameraComponent.jsx
import { useRef, useEffect } from 'react';

export default function CameraComponent({ onFrame }) {
  const videoRef = useRef(null);

  useEffect(() => {
    async function setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    }
    setupCamera();
  }, []);

  // pass video frame to parent at intervals
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && onFrame) {
        onFrame(videoRef.current);
      }
    }, 200); // every 200ms
    return () => clearInterval(interval);
  }, [onFrame]);

  return <video ref={videoRef} style={{ width: '100%', height: '100%' }} />;
}
