import { Request, Response } from "express";
import { signIntoGoogle, getAllSites } from "../../api/google";
import { writeFileCSV } from "../../tools/fs/fs";
import { CrudController } from "../CrudController";
import { documentCreation } from "../../tools/documentCreation";
import { dateValidation } from "../../tools/validation/dateValidation";
import { ICombined } from "../../config/types";
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
      const sitesInfo: { id: string; URL: string }[] = [];
      if (!req.body.date_ranges) {
        throw "request body is not valid";
      }
      const { startDate, endDate } = req.body.date_ranges[0];

      if (!startDate || !endDate) {
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

      getAllSites()
        .then((sites: any) => {
          if (sites.data.items) {
            sites.data.items.forEach((site: any) => {
              sitesInfo.push({ id: site.id, URL: site.websiteUrl });
            });
          }
        })
        .finally(() => {
          const promiseArr = sitesInfo.map(async (site: any, index: number) => {
            try {
              const data = await analyticsreporting.reports.batchGet({
                requestBody: {
                  reportRequests: [
                    {
                      viewId: site.id,
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
                      viewId: site.id,
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
                    site: sitesInfo[index].URL,
                    viewID: sitesInfo[index].id,
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
              res.status(err.error.code).json({ error: err.error.errors });
            });
        });
    } catch (error) {
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
