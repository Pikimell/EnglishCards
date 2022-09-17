import AWS from 'aws-sdk';
import uniqid from 'uniqid';
import { ACCESS_KEY, SECRET_ACCESS_KEY } from '../consts';

let awsConfig = {
  region: 'us-east-2',
  endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();

export class DynamoAPI {
  static async createItem(table, item) {
    const randId = uniqid();

    var params = {
      TableName: table,
      Item: {
        ...item,
        id: randId,
      },
    };

    docClient.put(params, function (err, data) {
      if (err) console.log(err);
    });

    return randId;
  }

  static async updateItem(table, id, item) {
    let updateData = DynamoAPI.generateUpdateElem(item);

    let params = {
      TableName: table,
      Key: {
        id: id,
      },
      UpdateExpression: updateData[0],
      ExpressionAttributeValues: updateData[1],
    };

    docClient.update(params, (err, data) => {
      console.log(err, data);
    });
  }

  static async getItem(table, id, nameCollumn = 'id') {
    let params = {
      TableName: table,
      Key: {
        [nameCollumn]: id,
      },
    };
    return DynamoAPI.getDataPromise(params);
  }

  static async getItems(table, id, nameCollumn = 'id') {
    var params = {
      TableName: table,
      FilterExpression: `contains(${nameCollumn}, :${nameCollumn})`,
      ExpressionAttributeValues: {
        [':' + nameCollumn]: id,
      },
    };

    let data = await docClient.scan(params).promise();
    return data.Items;
  }

  static async getItems2(table, id, nameCollumn = 'id') {
    let result, accumulated, ExclusiveStartKey;

    do {
      result = await docClient
        .query({
          TableName: table,
          ExclusiveStartKey,
          Limit: 10,
          FilterExpression: `contains(${nameCollumn}, :${nameCollumn})`,
          ExpressionAttributeValues: {
            [':' + nameCollumn]: id,
          },
        })
        .promise();

      ExclusiveStartKey = result.LastEvaluatedKey;
      accumulated = [...accumulated, ...result.Items];
    } while (result.Items.length || result.LastEvaluatedKey);

    console.log('------------------------------------------------------------');
    console.log(accumulated);
    console.log('------------------------------------------------------------');
    return accumulated;
  }

  static async getAllItems(table) {
    const params = {
      TableName: table,
    };

    let data = await docClient.scan(params).promise();
    return data.Items;
  }

  static async getAllItems2(table) {
    let result, accumulated, ExclusiveStartKey;

    do {
      result = await docClient
        .query({
          TableName: table,
          ExclusiveStartKey,
          Limit: 100,
        })
        .promise();

      ExclusiveStartKey = result.LastEvaluatedKey;
      accumulated = [...accumulated, ...result.Items];
    } while (result.Items.length || result.LastEvaluatedKey);

    return accumulated;
  }

  static async deleteItem(table, id) {
    var params = {
      Key: {
        id: id,
      },
      TableName: table,
    };

    docClient.delete(params, function (err, data) {
      if (err) {
        console.log('Error', err);
      }
    });
  }

  static getDataPromise(params) {
    return new Promise(function (resolve, reject) {
      docClient.get(params, (err, data) => {
        if (err) reject(err);

        if (data) {
          let res = data.Item;
          resolve(res);
        }
      });
    });
  }

  static generateUpdateElem(item) {
    let result = 'set ';
    let values = {};

    for (const key of Object.keys(item)) {
      result += ` ${key} = :${key} ,`;
      values[`:${key}`] = item[key];
    }

    result = result.slice(0, result.length - 1);

    return [result, values];
  }
}
