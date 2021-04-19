/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGeofenceBreaches = /* GraphQL */ `
  mutation CreateGeofenceBreaches(
    $input: CreateGeofenceBreachesInput!
    $condition: ModelGeofenceBreachesConditionInput
  ) {
    createGeofenceBreaches(input: $input, condition: $condition) {
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
export const updateGeofenceBreaches = /* GraphQL */ `
  mutation UpdateGeofenceBreaches(
    $input: UpdateGeofenceBreachesInput!
    $condition: ModelGeofenceBreachesConditionInput
  ) {
    updateGeofenceBreaches(input: $input, condition: $condition) {
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
export const deleteGeofenceBreaches = /* GraphQL */ `
  mutation DeleteGeofenceBreaches(
    $input: DeleteGeofenceBreachesInput!
    $condition: ModelGeofenceBreachesConditionInput
  ) {
    deleteGeofenceBreaches(input: $input, condition: $condition) {
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
