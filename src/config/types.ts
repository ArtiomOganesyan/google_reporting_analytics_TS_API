export interface ICombined {
  site?: string;
  viewID?: string;
  startDate?: string;
  endDate?: string;
  female?: string;
  male?: string;
  "18-24"?: string;
  "25-34"?: string;
  "35-44"?: string;
  "45-54"?: string;
  "55-64"?: string;
  "65+"?: string;
  [key: string]: any;
}

export interface IResponseData {
  columnHeader: {
    dimensions: string[];
    metricHeader: {
      metricHeaderEntries: { name: string; type: string }[];
    };
  };
  data: {
    rows: { dimensions: string[]; metrics: { values: string[] }[] }[];
    totals: { values: string[] }[];
    rowCount: number;
    minimums: { values: string[] }[];
    maximums: { values: string[] }[];
    samplesReadCounts: string[];
    samplingSpaceSizes: string[];
  };
}
