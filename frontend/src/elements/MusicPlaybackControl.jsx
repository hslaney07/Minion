import * as ort from 'onnxruntime-web';
import { useEffect, useState } from 'react';
import { Header } from '../components/GeneralComponents';
import CameraComponent from '../components/CameraComponent';
import MusicPlaybackVisual from '../components/MusicPlaybackVisual';

const MusicPlaybackControl = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [gesture, setGesture] = useState("...");
  const [action, setAction] = useState("...");
  const [confidence, setConfidence] = useState(0);

  const gestureLabels = [
    "Middle Finger", "Dislike", "Fist", "Four", "Like", 
    "One", "Palm", "Three", "Two Up", "No Gesture"
  ];
  const labels = ['Magic', 'Volume Down', 'Mute', 'Skip', 
    'Volume Up', 'Play', 'Unmute', 'Rewind', 'Pause', "None"
  ];


  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await ort.InferenceSession.create('/ten_gestures_full.onnx');
        setSession(model);
      } catch (err) {
        console.error('Failed to load ONNX model:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);


  const handleFrame = async (video) => {
    if (!session) return;

    // capture current frame
    const canvas = document.createElement('canvas');
    canvas.width = 640; 
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const input = preprocess(imageData);

    const feeds = { images: input };
    const output = await session.run(feeds);
    const detections = postProcess(output);
    if (detections.length > 0){
      processDetections(detections);
    }
      
  };

  const preprocess = (imageData) => {
    const { data, width, height } = imageData;
    
    const floatData = new Float32Array(3 * height * width);   // create Float32Array with correct dimensions [1, 3, 640, 640]
    
    // convert RGB to BGR (reverse channels) and normalize 0-1
    for (let i = 0; i < height * width; i++) {
      // Note: ImageData is RGBA, so we need to reverse R and B
      floatData[i] = data[i * 4 + 2] / 255.0;  // B (from original R)
      floatData[i + height * width] = data[i * 4 + 1] / 255.0;  // G 
      floatData[i + 2 * height * width] = data[i * 4] / 255.0;  // R (from original B)
    }
    
    return new ort.Tensor('float32', floatData, [1, 3, height, width]);
  };

  const postProcess = (output) => {
    // output shape is [1, 14, 8400]
    const outputData = output.dims ? output.data : Object.values(output)[0].data;
    
    const confidenceThreshold = 0.7;
    
    const detections = [];
    
    for (let i = 0; i < 8400; i++) {
      // get class scores (rows 4-13)
      const classScores = [];
      for (let c = 4; c < 14; c++) {
        const index = c * 8400 + i;
        classScores.push(outputData[index]);
      }
      
      // find max confidence
      let maxScore = Math.max(...classScores);
      let classId = classScores.indexOf(maxScore);
      
      if (maxScore > confidenceThreshold) {
        // get bounding box (first 4 values for this detection)
        const bbox = [
          outputData[i],          // x1
          outputData[8400 + i],   // y1
          outputData[2*8400 + i], // x2
          outputData[3*8400 + i]   // y2
        ];
        
        detections.push({
          classId,
          confidence: maxScore,
          label: gestureLabels[classId] || `Class ${classId}`,
          bbox
        });
      }
    }
    
    return detections;
  };

  const processDetections = (detections) => {
    var topDetection = detections.reduce((best, current) =>
      current.confidence > best.confidence ? current : best,
      { classId: -1, confidence: 0 }
    );
    const action = labels[topDetection.classId];

    setAction(action)
    setGesture(topDetection.label)
    setConfidence((topDetection.confidence * 100).toFixed(1))
  }



  if (loading) return <div>Loading model...</div>;
  if (error) return <div>Error loading model: {error}</div>;
  return <div>
      <Header />
      <div className='gesture-action-section'>
        <div className='gesture-action-child'>
          <h2 className='gesture-text'>Gesture: {gesture} ({confidence}%)</h2>
        </div>
        <div className='gesture-action-child'>
          <h2 className='action-text'>Action: {action}</h2>
        </div>
      </div>
      <CameraComponent onFrame={handleFrame} />
      
    </div>;
};

export default MusicPlaybackControl;