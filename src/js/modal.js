// ==============================================
const inputModule = document.querySelector('.js-input-module');
const inputQuestion = document.querySelector('.js-input-question');
const backdropModal = document.querySelector('.js-backdrop-modal');
const buttons = document.querySelectorAll('.js-modal-btn');
const listModuleModal = document.querySelector('.js-select-module');
const listQuestionModal = document.querySelector('.js-select-question');
const textListElem = document.querySelectorAll('.content-modal textarea');
// ==============================================

// ==============================================
let selectedModule = '';
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

function deleteModule() {}
function saveModule() {}
function createModule() {}

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

/* inputModule.addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.toggle('expanded');

  let text = e.target.textContent;
  e.target.previousElementSibling.checked = true;
  //console.dir();
}); */
