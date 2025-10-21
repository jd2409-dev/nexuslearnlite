const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'europe-central2'
};
exports.connectorConfig = connectorConfig;

const createNewUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser', inputVars);
}
createNewUserRef.operationName = 'CreateNewUser';
exports.createNewUserRef = createNewUserRef;

exports.createNewUser = function createNewUser(dcOrVars, vars) {
  return executeMutation(createNewUserRef(dcOrVars, vars));
};

const getCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCourses');
}
getCoursesRef.operationName = 'GetCourses';
exports.getCoursesRef = getCoursesRef;

exports.getCourses = function getCourses(dc) {
  return executeQuery(getCoursesRef(dc));
};

const getLessonsForModuleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLessonsForModule', inputVars);
}
getLessonsForModuleRef.operationName = 'GetLessonsForModule';
exports.getLessonsForModuleRef = getLessonsForModuleRef;

exports.getLessonsForModule = function getLessonsForModule(dcOrVars, vars) {
  return executeQuery(getLessonsForModuleRef(dcOrVars, vars));
};

const updateProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProgress', inputVars);
}
updateProgressRef.operationName = 'UpdateProgress';
exports.updateProgressRef = updateProgressRef;

exports.updateProgress = function updateProgress(dcOrVars, vars) {
  return executeMutation(updateProgressRef(dcOrVars, vars));
};
