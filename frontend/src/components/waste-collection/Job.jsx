import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as ttmaps from "@tomtom-international/web-sdk-maps";

function Job() {
  const mapElement = useRef();
  const [mapZoom, setMapZoom] = useState(8);
  const [map, setMap] = useState({});

  useEffect(() => {
    let map = ttmaps.map({
      key: 'F2xMu3bjLFhJ7BZW3hVE7EpRXT2tblMs',
      container: mapElement.current,
      center: [-1.939826787816454, 30.0445426438232],
      zoom: mapZoom,
    });
    setMap(map);
    return () => map.remove();
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={mapElement} className="h-[100vh]"></div>
    </div>
  );
}

export default Job;
