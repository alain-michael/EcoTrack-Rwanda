import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
  DistanceMatrixService,
} from '@react-google-maps/api';
import PopUp from './popup';

const MapContainer = () => {
  const [currentStop, setCurrentStop] = useState(0);
  const [time, setTime] = useState();
  const [distance, setDistance] = useState();
  const [stopName, setStopName] = useState();
  const [directions, setDirections] = useState();
  const mapRef = useRef();
  const center = useMemo(
    () => ({ lat: -1.939826787816454, lng: 30.0445426438232 }),
    [],
  );
  useEffect(() => {
    if (localStorage) {
      const currentStop = localStorage.getItem('currentStop');
      if (currentStop) {
        const currentStopCopy = JSON.parse(currentStop);
        setCurrentStop(currentStopCopy);
      }
    }
  });
  useEffect(() => {
    localStorage &&
      localStorage.setItem('currentStop', JSON.stringify(currentStop));
  }, [currentStop]);

  const origin = {
    lat: -1.939826787816454,
    lng: 30.0445426438232,
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
        waypoints: [
          {
            location: new google.maps.LatLng(
              -1.9355377074007851,
              30.060163829002217,
            ),
          },
          {
            location: new google.maps.LatLng(
              -1.9358808342336546,
              30.08024820994666,
            ),
          },
          {
            location: new google.maps.LatLng(
              -1.9489196023037583,
              30.092607828989397,
            ),
          },
          {
            location: new google.maps.LatLng(
              -1.9592132952818164,
              30.106684061788073,
            ),
          },
          {
            location: new google.maps.LatLng(
              -1.9487480402200394,
              30.126596781356923,
            ),
          },
        ],

        destination: {
          lat: -1.9365670876910166,
          lng: 30.13020167024439,
        },
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
        <GoogleMap
          zoom={8}
          center={center}
          className="map-container"
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
              destinations: [
                {
                  location: new google.maps.LatLng(
                    -1.9355377074007851,
                    30.060163829002217,
                  ),
                },
                {
                  location: new google.maps.LatLng(
                    -1.9358808342336546,
                    30.08024820994666,
                  ),
                },
                {
                  location: new google.maps.LatLng(
                    -1.9489196023037583,
                    30.092607828989397,
                  ),
                },
                {
                  location: new google.maps.LatLng(
                    -1.9592132952818164,
                    30.106684061788073,
                  ),
                },
                {
                  location: new google.maps.LatLng(
                    -1.9487480402200394,
                    30.126596781356923,
                  ),
                },
                {
                  lat: -1.9365670876910166,
                  lng: 30.13020167024439,
                },
              ],
              origins: [origin],
              travelMode: google.maps.TravelMode.DRIVING,
            }}
            callback={(response) => {
              var elements = response?.rows[0].elements;
              // finding next stop logic
              if (elements) {
                let currentElement = elements[currentStop];
                let currentTime = currentElement.duration.text;
                let currentDistance = currentElement.distance.text;
                setTime(currentTime);
                setDistance(currentDistance);
                for (let i = currentStop; i < elements?.length; i++) {
                  setStopName(response?.destinationAddresses[currentStop]);
                  let nextElement = elements[currentStop + 1];
                  if (
                    currentElement.distance.value <
                      nextElement.distance.value &&
                    currentTime === '1 min' &&
                    currentDistance === '1 m'
                  ) {
                    setCurrentStop(currentStop + 1);
                  } else {
                    break;
                  }
                }
              }
              console.log(currentStop, time, distance, stopName);
            }}
          />
        </GoogleMap>
      </>
    );
  } else {
    return <>.... Loading</>;
  }
};

export default MapContainer;
