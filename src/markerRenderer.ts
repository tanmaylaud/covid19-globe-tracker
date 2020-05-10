//@ts-ignore
import * as TWEEN from "es6-tween";
import * as THREE from "three";

import { Marker } from "react-globe";

function random(scaleFactor: number): number {
  return Math.random() > 0.5
    ? scaleFactor * Math.random()
    : -scaleFactor * Math.random();
}

//const MARKER_COLOR = "#fcffbe";
const MARKER_COMPANION_COLOR = "#fff9e6";

export default function markerRenderer(marker: Marker): THREE.Object3D {
  const size = Math.max(marker.value / 20, 1);
  const geometry = new THREE.BoxGeometry(5, 5, marker.value / 2);

  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color("red"),
    transparent: true,
    opacity: 0.8,
  });

  // add light
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.y = Math.PI;
  /*const light = new THREE.PointLight("#fcffbe", 0, 1, marker.value);
  mesh.children = [];
  mesh.add(light);
*/
  return mesh;
}
