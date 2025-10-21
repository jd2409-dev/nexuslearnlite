import { CreateNewUserData, CreateNewUserVariables, GetCoursesData, GetLessonsForModuleData, GetLessonsForModuleVariables, UpdateProgressData, UpdateProgressVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewUser(options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;
export function useCreateNewUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;

export function useGetCourses(options?: useDataConnectQueryOptions<GetCoursesData>): UseDataConnectQueryResult<GetCoursesData, undefined>;
export function useGetCourses(dc: DataConnect, options?: useDataConnectQueryOptions<GetCoursesData>): UseDataConnectQueryResult<GetCoursesData, undefined>;

export function useGetLessonsForModule(vars: GetLessonsForModuleVariables, options?: useDataConnectQueryOptions<GetLessonsForModuleData>): UseDataConnectQueryResult<GetLessonsForModuleData, GetLessonsForModuleVariables>;
export function useGetLessonsForModule(dc: DataConnect, vars: GetLessonsForModuleVariables, options?: useDataConnectQueryOptions<GetLessonsForModuleData>): UseDataConnectQueryResult<GetLessonsForModuleData, GetLessonsForModuleVariables>;

export function useUpdateProgress(options?: useDataConnectMutationOptions<UpdateProgressData, FirebaseError, UpdateProgressVariables>): UseDataConnectMutationResult<UpdateProgressData, UpdateProgressVariables>;
export function useUpdateProgress(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProgressData, FirebaseError, UpdateProgressVariables>): UseDataConnectMutationResult<UpdateProgressData, UpdateProgressVariables>;
