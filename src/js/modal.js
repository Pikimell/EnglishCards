// =============================================
import { myData, saveData } from './store/index';
// =============================================

// ==============================================
const inputModule = document.querySelector('.js-input-module');
const backdropModal = document.querySelector('.js-backdrop-modal');
const buttons = document.querySelectorAll('.js-modal-btn');
const questionButtons = document.querySelectorAll('.js-quest-btn');
const listModuleModal = document.querySelector('.js-select-module');
const listQuestionModal = document.querySelector('.js-select-question');
const textListElem = document.querySelectorAll('.content-modal textarea');
// ==============================================

// ==============================================
let selectedModule = '';
let selectedQuestion = '';
let questionsList = [];
// ==============================================

// ==============================================
window.addEventListener('keypress', event => {
  if (
    event.code === 'KeyQ' &&
    event.ctrlKey &&
    !document.body.classList.contains('show')
  ) {
    loadData();
    document.body.classList.add('show');
    backdropModal.addEventListener('click', closeBackdropModal);
  }
});
function closeBackdropModal() {
  if (event.target === event.currentTarget) {
    document.body.classList.remove('show');
    backdropModal.removeEventListener('click', closeBackdropModal);
    let copyMyData = JSON.parse(localStorage.getItem('questions'));

    for (const key of Object.keys(myData)) {
      delete myData[key];
    }

    for (const key of Object.keys(copyMyData)) {
      myData[key] = copyMyData[key];
    }

    saveData();
  }
}

buttons[0].addEventListener('click', deleteModule);
buttons[1].addEventListener('click', saveModule);
buttons[2].addEventListener('click', createModule);

function deleteModule() {
  inputModule.value = '';
  delete questionsList[selectedModule];
  listQuestionModal.textContent = '';
  selectedModule = '';
  localSaveData();
  loadData();
}
function saveModule() {
  let textModule = inputModule.value;
  let data = questionsList[selectedModule];
  delete questionsList[selectedModule];
  selectedModule = '';
  questionsList[textModule] =
    (questionsList[textModule] ?? []).length > 0
      ? [...questionsList[textModule], ...data]
      : data;

  localSaveData();
  loadData();
  listQuestionModal.textContent = '';
}
function createModule() {
  let textModule = inputModule.value;
  selectedModule = '';
  if (!questionsList[textModule]) questionsList[textModule] = [];

  localSaveData();
  loadData();
  inputModule.value = '';
  listQuestionModal.textContent = '';
}

function loadData() {
  questionsList = JSON.parse(localStorage.getItem('questions'));
  listModuleModal.innerHTML = Object.keys(questionsList)
    .sort((a, b) => a.localeCompare(b))
    .map(val => {
      return `<li>${val}</li>`;
    })
    .join('');

  if (selectedModule.length > 0) {
    selectModule(selectedModule);
  }
}

listModuleModal.addEventListener('click', event => {
  if (event.currentTarget != event.target) {
    selectModule(event.target.textContent);
  }
});

function selectModule(question) {
  inputModule.value = question;
  selectedModule = question;
  listQuestionModal.innerHTML = questionsList[question]
    .map((val, index) => {
      return `<li>${index + 1}. ${val.eng}</li>`;
    })
    .join('');
}

listQuestionModal.addEventListener('click', loadDetails);
function loadDetails(event) {
  if (event.target !== event.currentTarget) {
    let index = event.target.textContent.split('.')[0];
    selectedQuestion = index - 1;
    let quest = questionsList[selectedModule][+index - 1];
    const { rus, eng, trans } = quest;
    textListElem[0].value = eng;
    textListElem[1].value = rus;
    textListElem[2].value = trans ?? '';
  }
}

function localSaveData() {
  localStorage.setItem('questions', JSON.stringify(questionsList));
}

questionButtons[0].addEventListener('click', deleteQuestion);
questionButtons[1].addEventListener('click', saveQuestion);
questionButtons[2].addEventListener('click', createQuestion);

function deleteQuestion(e) {
  e.preventDefault();
  clearQuestion();
  questionsList[selectedModule].splice(selectedQuestion, 1);
  localSaveData();
  loadData();
}

function saveQuestion(e) {
  e.preventDefault();
  if (selectedQuestion >= 0) {
    questionsList[selectedModule][selectedQuestion].eng = textListElem[0].value;
    questionsList[selectedModule][selectedQuestion].rus = textListElem[1].value;
    questionsList[selectedModule][selectedQuestion].trans =
      textListElem[2].value;
    clearQuestion();
    localSaveData();
    loadData();
    selectedQuestion = -1;
  }
}

function createQuestion(e) {
  e.preventDefault();
  if (true) {
    let quest = {
      eng: textListElem[0].value,
      rus: textListElem[1].value,
      trans: textListElem[2].value,
    };

    questionsList[selectedModule].push(quest);
    clearQuestion();
    localSaveData();
    loadData();
    selectedQuestion = -1;
  }
}

function clearQuestion() {
  textListElem[0].value = '';
  textListElem[1].value = '';
  textListElem[2].value = '';
}
