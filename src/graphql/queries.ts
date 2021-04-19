/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGeofenceBreaches = /* GraphQL */ `
  query GetGeofenceBreaches($id: ID!) {
    getGeofenceBreaches(id: $id) {
      id
      GeofenceId
      DeviceId
      Time
      Position
      createdAt
      updatedAt
    }
  }
`;
export const listGeofenceBreachess = /* GraphQL */ `
  query ListGeofenceBreachess(
    $filter: ModelGeofenceBreachesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGeofenceBreachess(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        GeofenceId
        DeviceId
        Time
        Position
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
