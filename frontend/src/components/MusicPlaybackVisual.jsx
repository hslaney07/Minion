import { useSelector } from 'react-redux';
import { Header } from './GeneralComponents';
import CameraComponent from '../components/CameraComponent';

export default function MusicPlaybackVisual({ handleFrame }) {
  const { gesture_label, action, confidence } = useSelector((state) => state.musicControl);

  return (
    <div>
      <Header />
      <div className='gesture-action-section'>
        <div className='gesture-action-child'>
          <h2 className='gesture-text'>Gesture: {gesture_label} ({confidence}%)</h2>
        </div>
        <div className='gesture-action-child'>
          <h2 className='action-text'>Action: {action}</h2>
        </div>
      </div>
      <CameraComponent onFrame={handleFrame} />
    </div>
  );
}
