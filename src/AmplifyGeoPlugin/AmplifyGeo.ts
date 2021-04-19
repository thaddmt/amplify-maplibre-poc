import Location, { Position } from "aws-sdk/clients/location";
import { Auth, API, graphqlOperation } from "aws-amplify";
import * as subscriptions from "../graphql/subscriptions";
import awsconfig from "../aws-exports";

class AmplifyGeo {
  subscription?: any;

  // amplify-amplifylocpoc1-dev-144437-unauthRole
  createClient = async () => {
    const credentials = await Auth.currentCredentials();
    const client = new Location({
      credentials,
      region: awsconfig.aws_project_region,
    });
    return client;
  };

  subscribeToGeofenceEvents = () => {
    this.subscription = (API.graphql(
      graphqlOperation(subscriptions.onCreateGeofenceBreaches)
    ) as any).subscribe({
      next: ({ provider, value }: any) => {
        if (value.data.onCreateGeofenceBreaches)
          console.log(
            "Breached geofence " +
              value.data.onCreateGeofenceBreaches.GeofenceId
          );
      },
      error: (error: any) => console.warn(error),
    });
  };

  searchForPlaces = (
    param: string,
    biasPosition?: Position,
    placeIndexResource?: string
  ) => {
    const params = {
      IndexName: placeIndexResource || "test-places-1", // If not available take default from aws_config
      Text: param || "Indianapolis",
      BiasPosition: biasPosition,
    };
    return new Promise(async (resolve, reject) => {
      (await this.createClient()).searchPlaceIndexForText(
        params,
        (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (data) {
            resolve(data);
          }
        }
      );
    });
  };

  listGeofences = (collectionName?: string) => {
    const params = {
      CollectionName: collectionName || "test-geofence-collection-1", // If not available take default from aws_config
    };
    return new Promise(async (resolve, reject) => {
      (await this.createClient()).listGeofences(params, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        if (data) {
          console.log(data);
          resolve(data);
        }
      });
    });
  };
}

export const Geo = new AmplifyGeo();
