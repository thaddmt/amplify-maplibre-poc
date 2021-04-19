/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGeofenceBreachesInput = {
  id?: string | null,
  GeofenceId: string,
  DeviceId: string,
  Time: string,
  Position: Array< number | null >,
};

export type ModelGeofenceBreachesConditionInput = {
  GeofenceId?: ModelStringInput | null,
  DeviceId?: ModelStringInput | null,
  Time?: ModelStringInput | null,
  Position?: ModelFloatInput | null,
  and?: Array< ModelGeofenceBreachesConditionInput | null > | null,
  or?: Array< ModelGeofenceBreachesConditionInput | null > | null,
  not?: ModelGeofenceBreachesConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type GeofenceBreaches = {
  __typename: "GeofenceBreaches",
  id?: string,
  GeofenceId?: string,
  DeviceId?: string,
  Time?: string,
  Position?: Array< number | null >,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateGeofenceBreachesInput = {
  id: string,
  GeofenceId?: string | null,
  DeviceId?: string | null,
  Time?: string | null,
  Position?: Array< number | null > | null,
};

export type DeleteGeofenceBreachesInput = {
  id?: string | null,
};

export type ModelGeofenceBreachesFilterInput = {
  id?: ModelIDInput | null,
  GeofenceId?: ModelStringInput | null,
  DeviceId?: ModelStringInput | null,
  Time?: ModelStringInput | null,
  Position?: ModelFloatInput | null,
  and?: Array< ModelGeofenceBreachesFilterInput | null > | null,
  or?: Array< ModelGeofenceBreachesFilterInput | null > | null,
  not?: ModelGeofenceBreachesFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelGeofenceBreachesConnection = {
  __typename: "ModelGeofenceBreachesConnection",
  items?:  Array<GeofenceBreaches | null > | null,
  nextToken?: string | null,
};

export type CreateGeofenceBreachesMutationVariables = {
  input?: CreateGeofenceBreachesInput,
  condition?: ModelGeofenceBreachesConditionInput | null,
};

export type CreateGeofenceBreachesMutation = {
  createGeofenceBreaches?:  {
    __typename: "GeofenceBreaches",
    id: string,
    GeofenceId: string,
    DeviceId: string,
    Time: string,
    Position: Array< number | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGeofenceBreachesMutationVariables = {
  input?: UpdateGeofenceBreachesInput,
  condition?: ModelGeofenceBreachesConditionInput | null,
};

export type UpdateGeofenceBreachesMutation = {
  updateGeofenceBreaches?:  {
    __typename: "GeofenceBreaches",
    id: string,
    GeofenceId: string,
    DeviceId: string,
    Time: string,
    Position: Array< number | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGeofenceBreachesMutationVariables = {
  input?: DeleteGeofenceBreachesInput,
  condition?: ModelGeofenceBreachesConditionInput | null,
};

export type DeleteGeofenceBreachesMutation = {
  deleteGeofenceBreaches?:  {
    __typename: "GeofenceBreaches",
    id: string,
    GeofenceId: string,
    DeviceId: string,
    Time: string,
    Position: Array< number | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetGeofenceBreachesQueryVariables = {
  id?: string,
};

export type GetGeofenceBreachesQuery = {
  getGeofenceBreaches?:  {
    __typename: "GeofenceBreaches",
    id: string,
    GeofenceId: string,
    DeviceId: string,
    Time: string,
    Position: Array< number | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGeofenceBreachessQueryVariables = {
  filter?: ModelGeofenceBreachesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGeofenceBreachessQuery = {
  listGeofenceBreachess?:  {
    __typename: "ModelGeofenceBreachesConnection",
    items?:  Array< {
      __typename: "GeofenceBreaches",
      id: string,
      GeofenceId: string,
      DeviceId: string,
      Time: string,
      Position: Array< number | null >,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateGeofenceBreachesSubscription = {
  onCreateGeofenceBreaches?:  {
    __typename: "GeofenceBreaches",
    id: string,
    GeofenceId: string,
    DeviceId: string,
    Time: string,
    Position: Array< number | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGeofenceBreachesSubscription = {
  onUpdateGeofenceBreaches?:  {
    __typename: "GeofenceBreaches",
    id: string,
    GeofenceId: string,
    DeviceId: string,
    Time: string,
    Position: Array< number | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGeofenceBreachesSubscription = {
  onDeleteGeofenceBreaches?:  {
    __typename: "GeofenceBreaches",
    id: string,
    GeofenceId: string,
    DeviceId: string,
    Time: string,
    Position: Array< number | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};
