import { format } from "d3";
import { FLAG_ENDPOINT } from "./Constants";
import { numberWithCommas } from "./utils";

export function getPolygonLabel(flagName: string, d: any, c: any): string {
  return `
          <div class="card">
            <img class="card-img" src="${FLAG_ENDPOINT}/${flagName}.png" alt="flag" />
            <div class="container">
               <span class="card-title"><b>${d.NAME}</b></span> <br />
               <div class="card-spacer"></div>
               <hr />
               <div class="card-spacer"></div>
               <span>Cases: ${numberWithCommas(c.confirmed)}</span>  <br />
               <span>Deaths: ${numberWithCommas(c.deaths)}</span> <br />
               <span>Recovered: ${numberWithCommas(c.recoveries)}</span> <br />
               <span>Active: ${numberWithCommas(c.active)}</span>  <br />
               <span>Population: ${format(".3s")(d.POP_EST)}</span>
            </div>
          </div>
        `;
}
