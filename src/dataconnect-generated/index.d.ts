import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Course_Key {
  id: UUIDString;
  __typename?: 'Course_Key';
}

export interface CreateNewUserData {
  user_insert: User_Key;
}

export interface CreateNewUserVariables {
  email: string;
  username: string;
  passwordHash: string;
}

export interface GetCoursesData {
  courses: ({
    id: UUIDString;
    title: string;
    description: string;
    imageUrl?: string | null;
  } & Course_Key)[];
}

export interface GetLessonsForModuleData {
  lessons: ({
    id: UUIDString;
    title: string;
    content: string;
    orderIndex: number;
  } & Lesson_Key)[];
}

export interface GetLessonsForModuleVariables {
  moduleId: UUIDString;
}

export interface Lesson_Key {
  id: UUIDString;
  __typename?: 'Lesson_Key';
}

export interface Module_Key {
  id: UUIDString;
  __typename?: 'Module_Key';
}

export interface Progress_Key {
  userId: UUIDString;
  lessonId: UUIDString;
  __typename?: 'Progress_Key';
}

export interface Quiz_Key {
  id: UUIDString;
  __typename?: 'Quiz_Key';
}

export interface UpdateProgressData {
  progress_upsert: Progress_Key;
}

export interface UpdateProgressVariables {
  lessonId: UUIDString;
  isCompleted: boolean;
  score?: number | null;
  timeSpent?: number | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  operationName: string;
}
export const createNewUserRef: CreateNewUserRef;

export function createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;
export function createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface GetCoursesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCoursesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCoursesData, undefined>;
  operationName: string;
}
export const getCoursesRef: GetCoursesRef;

export function getCourses(): QueryPromise<GetCoursesData, undefined>;
export function getCourses(dc: DataConnect): QueryPromise<GetCoursesData, undefined>;

interface GetLessonsForModuleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonsForModuleVariables): QueryRef<GetLessonsForModuleData, GetLessonsForModuleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLessonsForModuleVariables): QueryRef<GetLessonsForModuleData, GetLessonsForModuleVariables>;
  operationName: string;
}
export const getLessonsForModuleRef: GetLessonsForModuleRef;

export function getLessonsForModule(vars: GetLessonsForModuleVariables): QueryPromise<GetLessonsForModuleData, GetLessonsForModuleVariables>;
export function getLessonsForModule(dc: DataConnect, vars: GetLessonsForModuleVariables): QueryPromise<GetLessonsForModuleData, GetLessonsForModuleVariables>;

interface UpdateProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
  operationName: string;
}
export const updateProgressRef: UpdateProgressRef;

export function updateProgress(vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;
export function updateProgress(dc: DataConnect, vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;

