import { dynamoGet, dynamoUpdate } from './dynamo.js';

export let myData = {};
export let Users = new Map();

export async function loadData() {
  myData = await dynamoGet('1');
  return myData;
}

export async function saveData() {
  dynamoUpdate('1', myData);
}
