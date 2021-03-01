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

export const getAllSites = () => {
  let analytics = google.analytics("v3");
  let data = analytics.management.profiles.list({
    accountId: "137034616",
    webPropertyId: "~all",
  });

  return data;
};
