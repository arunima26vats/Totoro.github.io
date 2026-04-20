import { firebaseSetupMessage, isFirebaseConfigured } from '../services/firebase';
import StatusBanner from './StatusBanner';

export default function FirebaseNotice() {
  if (isFirebaseConfigured) {
    return null;
  }

  return <StatusBanner kind="info" message={firebaseSetupMessage} />;
}

