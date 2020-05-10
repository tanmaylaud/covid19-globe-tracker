import * as React from "react";
import ReactGlobe, { Marker } from "react-globe";

import markers from "./markers";
import markerRenderer from "./markerRenderer";
import worldTexture from "./assets/world.jpg";
import "./styles.css";
import { useState, useEffect } from "react";
import { Object3D } from "three";
import { Spinner } from "./Spinner";
import globalData from "./assets/global.json";

export default function App() {
  const [details, setDetails] = useState<any>(null);
  const [isLoaded, onTextureLoaded] = useState(false);
  function getTooltipContent(marker: Marker) {
    return `Location: ${marker.Country} (Active Cases: ${marker.activeCases})`;
  }

  function onClickMarker(
    marker: Marker,
    markerObject?: Object3D,
    event?: PointerEvent
  ) {
    setDetails(getTooltipContent(marker));
  }

  function onDefocus(previousCoordinates: any, event?: PointerEvent) {
    setDetails(null);
  }

  return (
    <React.Fragment>
      <Spinner loaded={isLoaded} />
      <div className="header1">COVID19 Globe Tracker</div>
      <div className="header2">Active Cases</div>
      <div className="globe">
        <ReactGlobe
          markers={markers}
          markerOptions={{ renderer: markerRenderer }}
          onDefocus={onDefocus}
          onClickMarker={onClickMarker}
          onMouseOverMarker={onClickMarker}
          onMouseOutMarker={() => setDetails(null)}
          cameraOptions={{
            maxDistanceRadiusScale: 10,
            autoRotateSpeed: 1.1,
            distanceRadiusScale: 10,
          }}
          focusOptions={{
            distanceRadiusScale: 5,
          }}
          globeOptions={{
            texture: worldTexture,
            glowColor: "red",
            enableClouds: false,
          }}
          onTextureLoaded={() => onTextureLoaded(true)}
        />
        {details && (
          <div className="details">
            <p> {details}</p>
          </div>
        )}
      </div>
      {isLoaded ? (
        <div className="footer">
          <Counter />
        </div>
      ) : null}
    </React.Fragment>
  );
}

function Counter() {
  const [total, setTotal] = useState(globalData.totalCount);
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    setTimeout(() => null, 5000);
  }, []);
  useEffect(() => {
    if (counter != total) {
      if (total - counter == 10000) setCounter(counter + 1);
      else if (counter < 10000) setCounter(counter + 100);
      else if (counter < 100000) setCounter(counter + 50);
    }
  }, [counter]);

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return <p>{numberWithCommas(counter)}</p>;
}
