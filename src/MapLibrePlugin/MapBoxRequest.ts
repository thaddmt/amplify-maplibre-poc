import { Signer } from "aws-amplify";

export default class MapBoxRequest {
  credentials: any;
  constructor(currentCredentials: any) {
    this.credentials = currentCredentials;
  }

  transformRequest = (url: string, resourceType: string) => {
    if (resourceType === "Style" && !url.includes("://")) {
      // resolve to an AWS URL
      url = `https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
    }

    if (url.includes("amazonaws.com")) {
      // only sign AWS requests (with the signature as part of the query string)
      return {
        url: Signer.signUrl(url, {
          access_key: this.credentials.accessKeyId,
          secret_key: this.credentials.secretAccessKey,
          session_token: this.credentials.sessionToken,
        }),
      };
    }
  };
}
