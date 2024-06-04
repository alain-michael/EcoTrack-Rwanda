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
    // const service = new google.maps.DirectionsService();
    // service.route(
    //   {
    //     origin: origin,
    //     waypoints: [
    //       {
    //         location: new google.maps.LatLng(
    //           -1.9355377074007851,
    //           30.060163829002217,
    //         ),
    //       },
    //       {
    //         location: new google.maps.LatLng(
    //           -1.9358808342336546,
    //           30.08024820994666,
    //         ),
    //       },
    //       {
    //         location: new google.maps.LatLng(
    //           -1.9489196023037583,
    //           30.092607828989397,
    //         ),
    //       },
    //       {
    //         location: new google.maps.LatLng(
    //           -1.9592132952818164,
    //           30.106684061788073,
    //         ),
    //       },
    //       {
    //         location: new google.maps.LatLng(
    //           -1.9487480402200394,
    //           30.126596781356923,
    //         ),
    //       },
    //     ],

    //     destination: {
    //       lat: -1.9365670876910166,
    //       lng: 30.13020167024439,
    //     },
    //     travelMode: google.maps.TravelMode.DRIVING,
    //   },
    //   (result, status) => {
    //     if (result) {
    //       setDirections(result);
    //     }
    //   },
    // );

    return (
      <>
        <div className='w-full h-full border-solid border border-black'>

             <GoogleMap
          zoom={8}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        ></GoogleMap>
        </div>
      </>
    );
  } else {
    return <>.... Loading</>;
  }
}

export default Job;
