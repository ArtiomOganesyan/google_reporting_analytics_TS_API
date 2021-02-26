import { ICombined, IResponseData } from "../config/types";

export const documentCreation = {
  responseCombining: (arr: IResponseData[]): ICombined => {
    console.log(JSON.stringify(arr[0]));
    let obj: ICombined = {};
    arr.forEach((el: { data: { rows: any[] } }) => {
      if (!el.data.rows) {
        return obj;
      }
      el.data.rows.forEach(
        (row: { dimensions: string[]; metrics: { values: string[] }[] }) => {
          obj[row.dimensions[0]] = row.metrics[0].values[0];
        }
      );
    });
    return obj;
  },
  CSVCreation: (obj: ICombined, str: string) => {
    let file = str || "" + Object.keys(obj).join(", ") + "\n";
    return file + Object.values(obj).join(", ") + "\n";
  },
};
