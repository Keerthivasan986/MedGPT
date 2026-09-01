import { useEffect, useState } from 'react';
import { DEFAULT_LOCATION } from '../utils/constants.js';

// Falls back to the city centre when the browser blocks or lacks geolocation.
export default function useGeolocation(fallback = DEFAULT_LOCATION) {
  const [location, setLocation] = useState(fallback);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => {}
    );
  }, []);

  return location;
}
