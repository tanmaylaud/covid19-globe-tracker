import * as React from "react";
import "./styles.css";
import { useState, useEffect } from "react";
import { initGlobe } from "./Globe";
import { GlobalCounts } from "./GlobalCounts";
import { Counter } from "./Counter";
import { Spinner } from "./Spinner";

export default function App() {
  const [totals, setTotals] = useState<number[]>([]);
  const [loaderTimeout, timedOut] = useState(false);
  useEffect(() => initGlobe(), []);
  useEffect(() => {
    setTimeout(() => timedOut(true), 5000);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      let total: number[] = [];
      total.push(GlobalCounts.totalConfirmed);
      total.push(GlobalCounts.totalDeaths);
      total.push(GlobalCounts.totalRecoveries);
      total.push(GlobalCounts.totalActive);
      setTotals(total);
      if (!GlobalCounts.set) window.location.reload();
    }, 3000);
  }, [GlobalCounts.set]);

  return (
    <React.Fragment>
      <div id="globeViz"></div>
      <div className="top-info-container">
        <div className="title">COVID-19 Globe Tracker</div>
        <div className="title-desc">
          Hover on a country or territory for details
        </div>
      </div>
      <div className="bottom-info-container">
        <span className="gradient-container">
          LOW<div className="gradient"></div>HIGH
        </span>
        <Spinner loaded={GlobalCounts.set || loaderTimeout} />
        {GlobalCounts.set ? (
          <>
            <div
              style={{ fontSize: "14px", color: "#ccd6f6", marginTop: "35px" }}
            >
              Total Counts <span className="updated"></span>
            </div>
            <div style={{ color: "#e6f1ff", padding: "0 5px" }}>
              <span id="infected">
                INFECTED:
                <Counter count={totals[0]} />
              </span>
              <span id="deaths">
                {" "}
                • DEATHS:
                <Counter count={totals[1]} />
              </span>
              <span id="recovered">
                {" "}
                • RECOVERED:
                <Counter count={totals[2]} />
              </span>
              <span id="active">
                {" "}
                • ACTIVE:
                <Counter count={totals[3]} />
              </span>
            </div>
          </>
        ) : null}
        <div className="moreInfo" style={{ marginTop: "5px" }}>
          <a
            href="https://github.com/tanmaylaud/covid19-globe-tracker"
            rel="noopener noreferrer"
            target="_BLANK"
            style={{ color: "yellow", textDecoration: "none" }}
          >
            Click For More Information
          </a>
        </div>
      </div>
    </React.Fragment>
  );
}
