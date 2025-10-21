# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCourses*](#getcourses)
  - [*GetLessonsForModule*](#getlessonsformodule)
- [**Mutations**](#mutations)
  - [*CreateNewUser*](#createnewuser)
  - [*UpdateProgress*](#updateprogress)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCourses
You can execute the `GetCourses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCourses(): QueryPromise<GetCoursesData, undefined>;

interface GetCoursesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCoursesData, undefined>;
}
export const getCoursesRef: GetCoursesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCourses(dc: DataConnect): QueryPromise<GetCoursesData, undefined>;

interface GetCoursesRef {
  ...
  (dc: DataConnect): QueryRef<GetCoursesData, undefined>;
}
export const getCoursesRef: GetCoursesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCoursesRef:
```typescript
const name = getCoursesRef.operationName;
console.log(name);
```

### Variables
The `GetCourses` query has no variables.
### Return Type
Recall that executing the `GetCourses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCoursesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCoursesData {
  courses: ({
    id: UUIDString;
    title: string;
    description: string;
    imageUrl?: string | null;
  } & Course_Key)[];
}
```
### Using `GetCourses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCourses } from '@dataconnect/generated';


// Call the `getCourses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCourses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCourses(dataConnect);

console.log(data.courses);

// Or, you can use the `Promise` API.
getCourses().then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

### Using `GetCourses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCoursesRef } from '@dataconnect/generated';


// Call the `getCoursesRef()` function to get a reference to the query.
const ref = getCoursesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCoursesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

## GetLessonsForModule
You can execute the `GetLessonsForModule` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getLessonsForModule(vars: GetLessonsForModuleVariables): QueryPromise<GetLessonsForModuleData, GetLessonsForModuleVariables>;

interface GetLessonsForModuleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonsForModuleVariables): QueryRef<GetLessonsForModuleData, GetLessonsForModuleVariables>;
}
export const getLessonsForModuleRef: GetLessonsForModuleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLessonsForModule(dc: DataConnect, vars: GetLessonsForModuleVariables): QueryPromise<GetLessonsForModuleData, GetLessonsForModuleVariables>;

interface GetLessonsForModuleRef {
  ...
  (dc: DataConnect, vars: GetLessonsForModuleVariables): QueryRef<GetLessonsForModuleData, GetLessonsForModuleVariables>;
}
export const getLessonsForModuleRef: GetLessonsForModuleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLessonsForModuleRef:
```typescript
const name = getLessonsForModuleRef.operationName;
console.log(name);
```

### Variables
The `GetLessonsForModule` query requires an argument of type `GetLessonsForModuleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLessonsForModuleVariables {
  moduleId: UUIDString;
}
```
### Return Type
Recall that executing the `GetLessonsForModule` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLessonsForModuleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLessonsForModuleData {
  lessons: ({
    id: UUIDString;
    title: string;
    content: string;
    orderIndex: number;
  } & Lesson_Key)[];
}
```
### Using `GetLessonsForModule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLessonsForModule, GetLessonsForModuleVariables } from '@dataconnect/generated';

// The `GetLessonsForModule` query requires an argument of type `GetLessonsForModuleVariables`:
const getLessonsForModuleVars: GetLessonsForModuleVariables = {
  moduleId: ..., 
};

// Call the `getLessonsForModule()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLessonsForModule(getLessonsForModuleVars);
// Variables can be defined inline as well.
const { data } = await getLessonsForModule({ moduleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLessonsForModule(dataConnect, getLessonsForModuleVars);

console.log(data.lessons);

// Or, you can use the `Promise` API.
getLessonsForModule(getLessonsForModuleVars).then((response) => {
  const data = response.data;
  console.log(data.lessons);
});
```

### Using `GetLessonsForModule`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLessonsForModuleRef, GetLessonsForModuleVariables } from '@dataconnect/generated';

// The `GetLessonsForModule` query requires an argument of type `GetLessonsForModuleVariables`:
const getLessonsForModuleVars: GetLessonsForModuleVariables = {
  moduleId: ..., 
};

// Call the `getLessonsForModuleRef()` function to get a reference to the query.
const ref = getLessonsForModuleRef(getLessonsForModuleVars);
// Variables can be defined inline as well.
const ref = getLessonsForModuleRef({ moduleId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLessonsForModuleRef(dataConnect, getLessonsForModuleVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.lessons);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.lessons);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewUser
You can execute the `CreateNewUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface CreateNewUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
}
export const createNewUserRef: CreateNewUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface CreateNewUserRef {
  ...
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
}
export const createNewUserRef: CreateNewUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewUserRef:
```typescript
const name = createNewUserRef.operationName;
console.log(name);
```

### Variables
The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewUserVariables {
  email: string;
  username: string;
  passwordHash: string;
}
```
### Return Type
Recall that executing the `CreateNewUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewUserData {
  user_insert: User_Key;
}
```
### Using `CreateNewUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewUser, CreateNewUserVariables } from '@dataconnect/generated';

// The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`:
const createNewUserVars: CreateNewUserVariables = {
  email: ..., 
  username: ..., 
  passwordHash: ..., 
};

// Call the `createNewUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewUser(createNewUserVars);
// Variables can be defined inline as well.
const { data } = await createNewUser({ email: ..., username: ..., passwordHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewUser(dataConnect, createNewUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createNewUser(createNewUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateNewUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewUserRef, CreateNewUserVariables } from '@dataconnect/generated';

// The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`:
const createNewUserVars: CreateNewUserVariables = {
  email: ..., 
  username: ..., 
  passwordHash: ..., 
};

// Call the `createNewUserRef()` function to get a reference to the mutation.
const ref = createNewUserRef(createNewUserVars);
// Variables can be defined inline as well.
const ref = createNewUserRef({ email: ..., username: ..., passwordHash: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewUserRef(dataConnect, createNewUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateProgress
You can execute the `UpdateProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateProgress(vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;

interface UpdateProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
}
export const updateProgressRef: UpdateProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProgress(dc: DataConnect, vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;

interface UpdateProgressRef {
  ...
  (dc: DataConnect, vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
}
export const updateProgressRef: UpdateProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProgressRef:
```typescript
const name = updateProgressRef.operationName;
console.log(name);
```

### Variables
The `UpdateProgress` mutation requires an argument of type `UpdateProgressVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProgressVariables {
  lessonId: UUIDString;
  isCompleted: boolean;
  score?: number | null;
  timeSpent?: number | null;
}
```
### Return Type
Recall that executing the `UpdateProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProgressData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProgressData {
  progress_upsert: Progress_Key;
}
```
### Using `UpdateProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProgress, UpdateProgressVariables } from '@dataconnect/generated';

// The `UpdateProgress` mutation requires an argument of type `UpdateProgressVariables`:
const updateProgressVars: UpdateProgressVariables = {
  lessonId: ..., 
  isCompleted: ..., 
  score: ..., // optional
  timeSpent: ..., // optional
};

// Call the `updateProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProgress(updateProgressVars);
// Variables can be defined inline as well.
const { data } = await updateProgress({ lessonId: ..., isCompleted: ..., score: ..., timeSpent: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProgress(dataConnect, updateProgressVars);

console.log(data.progress_upsert);

// Or, you can use the `Promise` API.
updateProgress(updateProgressVars).then((response) => {
  const data = response.data;
  console.log(data.progress_upsert);
});
```

### Using `UpdateProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProgressRef, UpdateProgressVariables } from '@dataconnect/generated';

// The `UpdateProgress` mutation requires an argument of type `UpdateProgressVariables`:
const updateProgressVars: UpdateProgressVariables = {
  lessonId: ..., 
  isCompleted: ..., 
  score: ..., // optional
  timeSpent: ..., // optional
};

// Call the `updateProgressRef()` function to get a reference to the mutation.
const ref = updateProgressRef(updateProgressVars);
// Variables can be defined inline as well.
const ref = updateProgressRef({ lessonId: ..., isCompleted: ..., score: ..., timeSpent: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProgressRef(dataConnect, updateProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.progress_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.progress_upsert);
});
```

