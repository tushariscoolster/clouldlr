// @flow
import { createAction } from 'redux-actions';
import AWS from 'aws-sdk';
import {
  RECEIVE_LOG_GROUPS,
  RECEIVE_LOG_GROUPS_FAIL,
  REQUEST_LOG_GROUPS,
  SELECTED_LOG_GROUPS
} from './SideBarConstant';

const os = require('os');
const storage = require('electron-json-storage');

storage.setDataPath(os.tmpdir());

export const requestLogGroups = createAction(REQUEST_LOG_GROUPS);
export const receiveLogGroups = createAction(RECEIVE_LOG_GROUPS);
export const receiveLogGroupsFail = createAction(RECEIVE_LOG_GROUPS_FAIL);
export const selectLogGroup = createAction(SELECTED_LOG_GROUPS);

export const fetchLogGroups = () => dispatch => {
  dispatch(requestLogGroups());
  storage.get('credentials', (error, data) => {
    if (error) throw error;
    AWS.config.update({
      region: data.region,
      secretAccessKey: data.secretkey,
      accessKeyId: data.accessKey
    });
    const cloudwatchlogs = new AWS.CloudWatchLogs();
    cloudwatchlogs.describeLogGroups({}, (err, logs) => {
      if (err) dispatch(receiveLogGroupsFail());
      // an error occurred
      else dispatch(receiveLogGroups(logs)); // successful response
    });
  });
};
