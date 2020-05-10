import { Marker } from "react-globe";
import data from "./assets/export.json";
import usData from "./assets/usExport.json";
//@ts-ignore
const markers: Marker[] = data;
//@ts-ignore
const usMarkers: Marker[] = usData;

for (let i = 0; i < usMarkers.length; i++) {
  markers.push(usMarkers[i]);
}
export default markers;
