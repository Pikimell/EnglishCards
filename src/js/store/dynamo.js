import AWS from 'aws-sdk';
import { ACCESS_KEY, SECRET_ACCESS_KEY } from '../consts';

let awsConfig = {
  region: 'us-east-2',
  endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();

export async function dynamoGet(id) {
  let params = {
    TableName: 'english-bot',
    Key: {
      id: id,
    },
  };

  return new Promise(function (resolve, reject) {
    docClient.get(params, (err, data) => {
      if (err) reject(err);

      if (data) {
        let res = JSON.parse(data.Item.myData);
        resolve(res);
      }
    });
  });
}

export function dynamoUpdate(id, value) {
  let params = {
    TableName: 'english-bot',
    Key: {
      id: id,
    },
    UpdateExpression: 'set myData = :newValue',
    ExpressionAttributeValues: {
      ':newValue': JSON.stringify(value),
    },
  };

  docClient.update(params, (err, data) => {
    if (err) console.log(err);
  });
}
