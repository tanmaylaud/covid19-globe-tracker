import React from "react";
import "./Spinner.css";
export function Spinner(props: { loaded: boolean }) {
  return !props.loaded ? (
    <div className="spinbody">
      <div className="spinner"></div>
    </div>
  ) : null;
}
