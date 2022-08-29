import { loadData, myData } from './js/store/index';
import questionListTemplate from './templates/question-list.hbs';

const refs = {
  questionList: document.querySelector('.list-topic'),
  formQuestion: document.querySelector('.js-form-question'),
  answerListElem: document.querySelectorAll('.js-form-question label'),
  findInputElem: document.querySelector('.js-find-input'),
};

let dictionary = new Map();
let indexQuestion = 0;
let indexTopic = 0;

window.addEventListener('load', async () => {
  await loadData();
  for (let key of Object.keys(myData)) {
    dictionary.set(key, myData[key]);
  }

  loadTopicList(
    [...dictionary.keys()]
      .sort((a, b) => a.localeCompare(b))
      .map((value, index) => {
        return { value, index };
      })
  );
});

refs.questionList.addEventListener('click', onTopicClick);
refs.formQuestion.addEventListener('submit', onFormSubmit);
refs.formQuestion.addEventListener('click', onFormClick);
refs.findInputElem.addEventListener('input', onInputChange);
prevBtn.addEventListener('click', onPrevBtnClick);
nextBtn.addEventListener('click', onNextBtnClick);
///////////////////////////////////////////

function onTopicClick(event) {
  prevBtn.disabled = true;
  answerBtn.disabled = false;
  nextBtn.disabled = false;
  indexQuestion = 0;
  indexTopic = event.target.dataset.id;
  resetStyle();
  if (event.target.nodeName === 'LI') loadQuestion();
}
function onFormSubmit(event) {
  event.preventDefault();
  let selected = refs.formQuestion.elements['radio-group'].value;
  selected = selected.length > 0 ? +selected : -1;
  if (selected != -1) {
    showAnswer(selected);
  }
}

function onPrevBtnClick(event) {
  resetStyle();
  if (indexQuestion > 0) {
    indexQuestion--;
    loadQuestion();
  } else if (indexQuestion == 0) {
    prevBtn.disabled = true;
  }
}
function onNextBtnClick(event) {
  resetStyle();
  let topic = dictionary.get([...dictionary.keys()][indexTopic]);
  if (indexQuestion < topic.length - 1) {
    indexQuestion++;
    loadQuestion();
  }
  prevBtn.disabled = false;
}
function onFormClick(event) {
  let target = event.target;
  let name = target.nodeName;

  if (name == 'LABEL') target = target.closest('p');

  if (target.nodeName == 'P') {
    selectAnswer(target.dataset.index);
  }
}

function onInputChange(event) {
  let text = event.target.value;
  filteredList = [...dictionary.keys()]
    .map((value, index) => {
      return { value, index };
    })
    .filter(value => value.value.indexOf(text) >= 0);
  loadTopicList(filteredList);
}
///////////////////////////////////////////
function loadTopicList(listTopic) {
  refs.questionList.innerHTML = questionListTemplate(listTopic);
}

function loadQuestion() {
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
  let counter = 0;
  while (rand === -1 || non.includes(rand)) {
    rand = Math.floor(Math.random() * max) + min;
    if (counter++ === 4999) {
      return 0;
    }
  }

  return rand;
}

function selectAnswer(index) {
  for (let i = 0; i < 3; i++) {
    refs.answerListElem[i].closest('p').classList.remove('selected');
  }
  refs.answerListElem[index].closest('p').classList.add('selected');
  refs.answerListElem[index].previousElementSibling.checked = true;
}

function resetStyle() {
  for (let i = 0; i < 3; i++) {
    refs.answerListElem[i].closest('p').classList.remove('selected');
    refs.answerListElem[i].closest('p').classList.remove('wrong');
    refs.answerListElem[i].closest('p').classList.remove('right');
    refs.answerListElem[i].previousElementSibling.checked = false;
  }
}

function showAnswer(index) {
  refs.answerListElem[index].closest('p').classList.add('wrong');
  let topic = dictionary.get([...dictionary.keys()][indexTopic]);
  let question = topic[indexQuestion];

  for (let i = 0; i < 3; i++) {
    if (refs.answerListElem[i].textContent === question.rus) {
      refs.answerListElem[i].closest('p').classList.remove('wrong');
      refs.answerListElem[i].closest('p').classList.add('right');
    }
  }
}

import './js/modal';
