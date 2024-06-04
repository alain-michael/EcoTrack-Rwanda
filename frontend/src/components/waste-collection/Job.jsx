import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
  DistanceMatrixService,
} from '@react-google-maps/api';

function Job() {
  const [directions, setDirections] = useState();
  const mapRef = useRef();
  const center = useMemo(
    () => ({ lat: -1.939826787816454, lng: 30.0445426438232 }),
    [],
  );
  const origin = {
    lat: -1.939826787816454,
    lng: 30.0445426438232,
  };
  const destination = {
    lat: -1.9365670876910166,
    lng: 30.13020167024439,
  };
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
        <div className="">
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
        </div>
      </>
    );
  } else {
    return <>.... Loading</>;
  }
}

export default Job;
