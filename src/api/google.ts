import { google } from "googleapis";

const analyticsreporting = google.analyticsreporting("v4");

export const signIntoGoogle = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./dist/config.json",
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });

  google.options({ auth });

  return analyticsreporting;
};
