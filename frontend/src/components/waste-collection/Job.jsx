import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
  DistanceMatrixService,
} from '@react-google-maps/api';
import PopUp from './popup';
import { useParams } from 'react-router-dom';
import { instance } from '../../features/AxiosInstance';

const Job = () => {
  const { id } = useParams();
  const [currentStop, setCurrentStop] = useState(0);
  const [time, setTime] = useState();
  const [distance, setDistance] = useState();
  const [stopName, setStopName] = useState();
  const [directions, setDirections] = useState();
  const [origin, setOrigin] = useState({});
  const mapRef = useRef();
  const center = useMemo(() => ({ lat: origin.lat, lng: origin.lng }), []);

  const getDestination=()=>{
  }
  const destination = useMemo(
    () => ({ lat: -1.939826787816454, lng: 30.0445426438232 }),
    [],
  );
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setOrigin({ lat, lng });
    });
  };
  useEffect(() => {
    getUserLocation();
  }, []);
  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
    }),
    [],
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_API_KEY,
  });

  if (isLoaded) {
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (result) {
          setDirections(result);
        }
      },
    );

    return (
      <>
        <PopUp time={time} distance={distance} />
        <GoogleMap
          zoom={8}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: '#1976D2',
                  strokeWeight: 5,
                },
              }}
            />
          )}
          <DistanceMatrixService
            options={{
              destinations: [destination],
              origins: [origin],
              travelMode: google.maps.TravelMode.DRIVING,
            }}
          />
        </GoogleMap>
      </>
    );
  }
};

export default Job;
