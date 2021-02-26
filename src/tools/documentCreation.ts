export const documentCreation = {
  responseCombining: (arr: any[]): any => {
    let obj: any = {};
    arr.forEach((el: { data: { rows: any[] } }) => {
      if (!el.data.rows) {
        return obj;
      }
      el.data.rows.forEach(
        (row: {
          dimensions: (string | number)[];
          metrics: { values: any[] }[];
        }) => {
          obj[row.dimensions[0]] = row.metrics[0].values[0];
        }
      );
    });
    return obj;
  },
  CSVCreation: (
    obj: { [s: string]: unknown } | ArrayLike<unknown>,
    str: string
  ) => {
    let file = str || "" + Object.keys(obj).join(", ") + "\n";
    return file + Object.values(obj).join(", ") + "\n";
  },
};
