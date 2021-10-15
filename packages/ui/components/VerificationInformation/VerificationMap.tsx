import { FunctionComponent } from "react";
import { layer, Map, Layers } from "react-openlayers";
import { fromLonLat } from "ol/proj";

type Props = {
  longitude: number;
  latitude: number;
};

export const VerificationMap: FunctionComponent<Props> = ({
  longitude,
  latitude,
}) => {
  return (
    <div>
      <Map view={{ center: fromLonLat([longitude, latitude]), zoom: 5 }}>
        <Layers>
          <layer.Tile />
        </Layers>
      </Map>
    </div>
  );
};
