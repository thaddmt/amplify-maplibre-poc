import Location, { Position } from "aws-sdk/clients/location";
import { Auth, API, graphqlOperation } from "aws-amplify";
import * as subscriptions from "../graphql/subscriptions";
import { GeofenceBreaches } from "../API";
import awsconfig from "../aws-exports";
import Observable from "zen-observable-ts";
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

  // TODO: add filtering for geofence collection and tracker name
  subscribeToGeofenceEvents = () => {
    return new Observable((observer) => {
      const subscription = (API.graphql(
        graphqlOperation(subscriptions.onCreateGeofenceBreaches)
      ) as any).subscribe({
        next: ({ provider, value }: any) => {
          var breach: GeofenceBreaches;
          if (value.data.onCreateGeofenceBreaches) {
            breach = value.data.onCreateGeofenceBreaches;
            observer.next({ breach });
          }
        },
        error: (error: any) => observer.error({ error }),
      });

      return () => subscription.unsubscribe();
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

  getDevicePositions = (deviceIds: [string], trackerName?: string) => {
    const params = {
      TrackerName: trackerName || "test-tracker-1", // If not available take default from aws_config
      DeviceIds: deviceIds,
    };
    return new Promise(async (resolve, reject) => {
      (await this.createClient()).batchGetDevicePosition(
        params,
        (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (data) {
            console.log(data);
            resolve(data);
          }
        }
      );
    });
  };

  getDevicePositionHistory = (deviceId: string, trackerName?: string) => {
    const params = {
      TrackerName: trackerName || "test-tracker-1", // If not available take default from aws_config
      DeviceId: deviceId,
    };
    return new Promise(async (resolve, reject) => {
      (await this.createClient()).getDevicePositionHistory(
        params,
        (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (data) {
            console.log(data);
            resolve(data);
          }
        }
      );
    });
  };

  updateDevicePosition = (
    deviceId: string,
    position: [number],
    trackerName?: string
  ) => {
    const params = {
      TrackerName: trackerName || "test-tracker-1", // If not available take default from aws_config
      Updates: [
        {
          DeviceId: deviceId,
          Position: position,
          SampleTime: new Date(),
        },
      ],
    };
    return new Promise(async (resolve, reject) => {
      (await this.createClient()).batchUpdateDevicePosition(
        params,
        (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (data) {
            console.log(data);
            resolve(data);
          }
        }
      );
    });
  };
}

export const Geo = new AmplifyGeo();
