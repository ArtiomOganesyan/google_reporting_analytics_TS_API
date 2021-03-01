import { Request, Response } from "express";
import { signIntoGoogle } from "../../api/google";
import { writeFileCSV } from "../../tools/fs/fs";
import { CrudController } from "../CrudController";
import { documentCreation } from "../../tools/documentCreation";
import { dateValidation } from "../../tools/validation/dateValidation";
import { ICombined } from "../../config/types";
import { GoogleApis } from "googleapis";
import { errorCreation } from "../../tools/errorCreation";

export class ReportController extends CrudController {
  /**
   * create
   */
  public create(
    req: Request<import("express-serve-static-core").ParamsDictionary>,
    res: Response
  ) {
    throw new Error("Method not implemented");
  }

  /**
   * read
   */
  public read(
    req: Request<import("express-serve-static-core").ParamsDictionary>,
    res: Response
  ) {
    try {
      const analyticsreporting = signIntoGoogle();
      if (!req.body.date_ranges || !req.body.view_ids) {
        throw "request body is not valid";
      }
      const { startDate, endDate } = req.body.date_ranges[0];
      const viewIDs = req.body.view_ids;

      if (!startDate || !endDate || !viewIDs.length) {
        throw "request body is not valid";
      }

      if (
        dateValidation.isInvalidDate(startDate) ||
        dateValidation.isInvalidDate(endDate) ||
        dateValidation.isInvalidRange(startDate, endDate) ||
        dateValidation.isBeforeReportApiStart(startDate)
      ) {
        throw "date is not valid";
      }

      let combined: ICombined = {};
      let CSVString = "";

      const promiseArr = viewIDs.map(async (viewID: string, index: number) => {
        try {
          const data = await analyticsreporting.reports.batchGet({
            requestBody: {
              reportRequests: [
                {
                  viewId: viewID,
                  dateRanges: [
                    {
                      endDate: endDate,
                      startDate: startDate,
                    },
                  ],
                  metrics: [
                    {
                      expression: "ga:users",
                    },
                  ],
                  dimensions: [
                    {
                      name: "ga:userGender",
                    },
                  ],
                },
                {
                  viewId: viewID,
                  dateRanges: [
                    {
                      endDate: endDate,
                      startDate: startDate,
                    },
                  ],
                  metrics: [
                    {
                      expression: "ga:users",
                    },
                  ],
                  dimensions: [
                    {
                      name: "ga:userAgeBracket",
                    },
                  ],
                },
              ],
            },
          });
          return data;
        } catch (error) {
          throw { msg: "google requestBody error", error: { ...error } };
        }
      });

      Promise.all(promiseArr)
        .then((wholeResponse) => {
          wholeResponse.forEach((response: any, index) => {
            if (response && response.data && response.data.reports) {
              combined = {
                site: "needs implementation",
                viewID: viewIDs[index],
                startDate: startDate,
                endDate: endDate,
              };
            }

            const toCombine = documentCreation.responseCombining(
              response.data.reports
            );

            combined = {
              ...combined,
              ...toCombine,
            };

            CSVString = documentCreation.CSVCreation(combined, CSVString);
          });
        })
        .then(() => {
          writeFileCSV(__dirname + "/doc.csv", CSVString);
        })
        .finally(() => {
          res.sendFile(__dirname + "/doc.csv");
        })
        .catch((err) => {
          console.log("==================================================");
          res.status(err.error.code).json({ error: err.error.errors });
        });
    } catch (error) {
      console.log(error);
      console.log(errorCreation([error]));

      res.json(errorCreation([error]));
    }
  }

  /**
   * update
   */
  public update(
    req: Request<import("express-serve-static-core").ParamsDictionary>,
    res: Response
  ) {
    throw new Error("Method not implemented");
  }

  /**
   * create
   */
  public delete(
    req: Request<import("express-serve-static-core").ParamsDictionary>,
    res: Response
  ) {
    throw new Error("Method not implemented");
  }
}
