import { dynamoGet, dynamoUpdate } from './dynamo.js';

export let myData = {};
export let Users = new Map();

export async function loadData() {
  myData = await dynamoGet('1');
  localStorage.setItem('questions', JSON.stringify(myData));
  return myData;
}

export async function saveData() {
  console.log('Save Data');
  dynamoUpdate('1', myData);
}
