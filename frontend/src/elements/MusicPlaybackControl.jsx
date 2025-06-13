import * as ort from 'onnxruntime-web';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MusicPlaybackVisual from '../components/MusicPlaybackVisual';
import { setMusicControlSlice } from '../stores/musicPlaybackSlice';
import { ErrorLoadingPage, LoadingVisual } from '../components/GeneralComponents';

const MusicPlaybackControl = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

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
    const topDetectionInformation = {
      gesture_label: topDetection.label,
      action: labels[topDetection.classId],
      confidence: (topDetection.confidence * 100).toFixed(1),
    };

    dispatch(setMusicControlSlice(topDetectionInformation))
  }


  if (loading) return <LoadingVisual />;
  if (error) return <ErrorLoadingPage />;
  return <MusicPlaybackVisual handleFrame={handleFrame}/>;
};

export default MusicPlaybackControl;