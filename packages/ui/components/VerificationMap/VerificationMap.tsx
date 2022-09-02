import { FunctionComponent } from "react";
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';

type Props = {
  longitude: number;
  latitude: number;
};

const VerificationMap: FunctionComponent<React.PropsWithChildren<Props>> = ({
  longitude,
  latitude,
}) => {
  
  return (
    <div className="relative">
      <MapContainer
        center={[latitude, longitude]} 
        zoom={13} 
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}        
        doubleClickZoom={false}
        dragging={false}
        style={{
          width: '100%',
          height: '150px'
        }}
      >
        { process.env.NODE_ENV === 'development' ? (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />           
        ) : (
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/512/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
          />
        )}        
      </MapContainer>

      <div 
        style={{
          position: 'absolute',
          top: 'calc(50% - 7px)',
          left: 'calc(50% - 5px)',
          zIndex: '9999'
        }}
      >
        <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.75 0C2.8475 0 0.5 2.3475 0.5 5.25C0.5 9.1875 5.75 15 5.75 15C5.75 15 11 9.1875 11 5.25C11 2.3475 8.6525 0 5.75 0ZM5.75 7.125C4.715 7.125 3.875 6.285 3.875 5.25C3.875 4.215 4.715 3.375 5.75 3.375C6.785 3.375 7.625 4.215 7.625 5.25C7.625 6.285 6.785 7.125 5.75 7.125Z" fill="#8B8E8F"/>
        </svg>
      </div>
    </div>
  );
};

export default VerificationMap