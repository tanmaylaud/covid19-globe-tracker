import Globe, { GlobeInstance } from "globe.gl";
import { request, getCoordinates, getPolygonLabel } from "./utils";
import {
  GLOBE_IMAGE_URL,
  BACKGROUND_IMAGE_URL,
  GEOJSON_URL,
  CASES_API,
} from "./Constants";
import { interpolateReds, scaleSequential } from "d3";
import { Countries, Country } from "./Country";
import { GlobalCounts } from "./GlobalCounts";

const getVal = (feat: any) => {
  return Math.pow(feat.covidData.confirmed / feat.properties.POP_EST, 1 / 4);
};

interface Feature {
  properties: {
    NAME: string;
    POP_EST: number;
  };
  covidData: Country;
}

let world: GlobeInstance;
const colorScale = scaleSequential(interpolateReds);

export function initGlobe() {
  // Globe container
  const globeContainer: HTMLElement = document.getElementById("globeViz")!;
  world = Globe()(globeContainer)
    .globeImageUrl(GLOBE_IMAGE_URL)
    .backgroundImageUrl(BACKGROUND_IMAGE_URL)
    .showGraticules(false)
    .polygonAltitude(0.06)
    .showAtmosphere(false)
    .polygonCapColor((feat: any) => colorScale(getVal(feat)))
    .polygonSideColor(() => "rgba(100, 100, 100, 0.05)")
    .polygonStrokeColor(() => "#ffff")
    .polygonLabel(({ properties: d, covidData: c }: any) => {
      const flagName = d.ADMIN === "France" ? "fr" : d.ISO_A2.toLowerCase();

      return getPolygonLabel(flagName, d, c);
    })
    .onPolygonHover((hoverD: any) =>
      world
        .polygonAltitude((d: any) => (d === hoverD ? 0.1 : 0.06))
        .polygonCapColor((d: any) =>
          d === hoverD ? "yellow" : colorScale(getVal(d))
        )
    )
    .polygonsTransitionDuration(200);

  getCases();
  window.addEventListener("resize", (event: UIEvent) => {
    world.width(window.innerWidth);
    world.height(window.innerHeight);
  });
}

let dates: string[] = [];
let countries: Countries;
let featureCollection: Feature[];

async function getCases() {
  countries = await request(CASES_API);
  featureCollection = (await request(GEOJSON_URL)).features;

  // world.polygonsData(countriesWithCovid);
  document.querySelector(".title-desc")!.innerHTML =
    "Hover on a country or territory to see cases, deaths, and recoveries.";

  dates = Object.keys(countries.China);

  updateCounters();
  updatePolygonsData();

  updatePointOfView();
}

//const infectedEl = document.querySelector("#infected")!;
//const deathsEl = document.querySelector("#deaths")!;
//const recoveriesEl = document.querySelector("#recovered")!;
//const updatedEl = document.querySelector(".updated")!;

function updateCounters() {
  let totalConfirmed = 0;
  let totalDeaths = 0;
  let totalRecoveries = 0;
  const date = dates.length - 1;
  Object.keys(countries).forEach((item: string) => {
    if (countries[item][dates[date]]) {
      const countryDate = countries[item][dates[date]];
      totalConfirmed += +countryDate.confirmed;
      totalDeaths += +countryDate.deaths;
      totalRecoveries += countryDate.recoveries ? +countryDate.recoveries : 0;
    }
  });
  GlobalCounts.totalConfirmed = totalConfirmed;
  GlobalCounts.totalDeaths = totalDeaths;
  GlobalCounts.totalRecoveries = totalRecoveries;
  GlobalCounts.totalActive = totalConfirmed - totalRecoveries - totalDeaths;
  GlobalCounts.set = true;
}

function updatePolygonsData() {
  const date = dates.length - 1;
  for (let x = 0; x < featureCollection.length; x++) {
    const country = featureCollection[x].properties.NAME;
    if (countries[country]) {
      featureCollection[x].covidData = {
        confirmed: countries[country][dates[date]].confirmed,
        deaths: countries[country][dates[date]].deaths,
        recoveries: countries[country][dates[date]].recoveries,
      };
    } else {
      featureCollection[x].covidData = {
        confirmed: 0,
        deaths: 0,
        recoveries: 0,
      };
    }
  }

  const maxVal = Math.max(...featureCollection.map(getVal));
  colorScale.domain([0, maxVal]);
  world.polygonsData(featureCollection);
}

async function updatePointOfView() {
  // Get coordinates
  try {
    const { latitude, longitude } = await getCoordinates();

    world.pointOfView(
      {
        lat: latitude,
        lng: longitude,
      },
      1000
    );
  } catch (e) {
    console.log("Unable to set point of view.");
  }
}
