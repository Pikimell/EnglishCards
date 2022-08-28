// ==============================================
const inputModule = document.querySelector('.js-input-module');
const inputQuestion = document.querySelector('.js-input-question');
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
  }
}

buttons[0].addEventListener('click', deleteModule);
buttons[1].addEventListener('click', saveModule);
buttons[2].addEventListener('click', createModule);

function deleteModule() {
  inputModule.value = '';
  console.log('DELETE:', selectedModule);
  delete questionsList[selectedModule];
  saveData();
  loadData();
  listQuestionModal.textContent = '';
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

  saveData();
  loadData();
  listQuestionModal.textContent = '';
}
function createModule() {
  let textModule = inputModule.value;
  selectedModule = '';
  if (!questionsList[textModule]) questionsList[textModule] = [];

  saveData();
  loadData();
  inputModule.value = '';
  listQuestionModal.textContent = '';
}

function loadData() {
  questionsList = JSON.parse(localStorage.getItem('questions'));
  listModuleModal.innerHTML = Object.keys(questionsList)
    .map(val => {
      return `<li>${val}</li>`;
    })
    .join('');
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

    textListElem[0].textContent = eng;
    textListElem[1].textContent = rus;
    textListElem[2].textContent = trans ?? '';
    inputQuestion.value = index;
  }
}

function saveData() {
  localStorage.setItem('questions', JSON.stringify(questionsList));
}

questionButtons[0].addEventListener('click', deleteQuestion);
questionButtons[1].addEventListener('click', saveQuestion);
questionButtons[2].addEventListener('click', createQuestion);

function deleteQuestion(e) {
  e.preventDefault();
  clearQuestion();
  questionsList[selectModule] = questionsList[selectModule].splice(
    selectedQuestion,
    1
  );
  saveData();
  loadData();
}

function saveQuestion() {}

function createQuestion() {}

function clearQuestion() {
  document.querySelector('.content-modal').elements[0].value = '';
  document.querySelector('.content-modal').elements[1].value = '';
  document.querySelector('.content-modal').elements[2].value = '';
}
