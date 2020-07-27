export interface Countries {
  [country: string]: {
    [date: string]: Country;
  };
}

export interface Country {
  confirmed: number;
  recoveries: number;
  deaths: number;
}
