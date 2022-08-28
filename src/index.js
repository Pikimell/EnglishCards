import { loadData, myData } from './js/store/index';
import questionListTemplate from './templates/question-list.hbs';
import answerListTemplate from './templates/question-list.hbs';

const refs = {
  questionList: document.querySelector('.list-topic'),
  formQuestion: document.querySelector('.js-form-question'),
  answerListElem: document.querySelectorAll('.js-form-question label'),
};

let dictionary = new Map();

window.addEventListener('load', async () => {
  await loadData();
  for (let key of Object.keys(myData)) {
    dictionary.set(key, myData[key]);
  }

  loadTopicList(dictionary.keys());
});

refs.questionList.addEventListener('click', onTopicClick);
refs.formQuestion.addEventListener('submit', onFormSubmit);
refs.formQuestion.addEventListener('click', onFormClick);
prevBtn.addEventListener('click', onPrevBtnClick);
nextBtn.addEventListener('click', onNextBtnClick);
///////////////////////////////////////////

function onTopicClick(event) {
  if (event.target.nodeName === 'LI') loadQuestion(event.target.dataset.id, 1);
}
function onFormSubmit(event) {
  event.preventDefault();
}
function onPrevBtnClick(event) {}
function onNextBtnClick(event) {}
function onFormClick(event) {
  console.log(event.target);
}
///////////////////////////////////////////
function loadTopicList(listTopic) {
  refs.questionList.innerHTML = questionListTemplate(listTopic);
}

function loadQuestion(indexTopic, indexQuestion) {
  let topic = dictionary.get([...dictionary.keys()][indexTopic]);
  let question = topic[indexQuestion];
  let randomNums = [];
  let answerRand = getRand([], 0, 3);

  for (let i = 0; i < 3; i++) {
    let rand = getRand([indexQuestion, ...randomNums], 0, topic.length - 1);
    randomNums.push(rand);
    refs.answerListElem[i].textContent = topic[randomNums[i]].rus;
  }

  refs.answerListElem[answerRand].textContent = question.rus;
  questionTitle.textContent = question.eng;
}

function getRand(non, min, max) {
  let rand = -1;

  while (rand === -1 || non.includes(rand)) {
    rand = Math.floor(Math.random() * max) + min;
  }

  return rand;
}

function selectAnswer(index) {
  for (let i = 0; i < 3; i++) {
    refs.answerListElem[i].classList.remove('selected');
  }
  refs.answerListElem[index].classList.add('selected');
}
