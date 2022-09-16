import { DynamoAPI } from './dynamo';

export async function getСategories() {
  const table = 'english-test-categories';
  try {
    const listModules = await DynamoAPI.getAllItems(table);
    return listModules;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getPhrases(idCategory) {
  const table = 'english-test-phrases';
  const column = 'idCategory';
  try {
    const listModules = await DynamoAPI.getItems(table, idCategory, column);
    return listModules;
  } catch (err) {
    console.log(err);
    return [];
  }
}
