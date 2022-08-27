import { loadData, myData } from './js/store/index';
import questionListTemplate from './templates/question-list.hbs';

const refs = {
  questionList: document.querySelector('.list-topic'),
};

let dictionary = new Map();

window.addEventListener('load', async () => {
  await loadData();
  for (let key of Object.keys(myData)) {
    dictionary.set(key, myData[key]);
  }

  loadTopicList(dictionary.keys());
});

function loadTopicList(listTopic) {
  refs.questionList.innerHTML = questionListTemplate(listTopic);
}
