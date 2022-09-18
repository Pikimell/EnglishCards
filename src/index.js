// =============================================================
import { getPhrases, getСategories } from './js/store/index';
import categoriesTemlate from './templates/question-list.hbs';
import phrasesTemplate from './templates/phrases-template.hbs';
import _ from 'lodash';
// =============================================================
//
//
//
//
// =============================================================

const moduleRefs = {
  inputModuleElem: document.querySelector('.js-find-input'),
  moduleContainer: document.querySelector('.js-module-list'),
};

const phrasesRefs = {
  form: document.querySelector('.js-form-question'),
  buttons: document.querySelectorAll('.js-question-footer input'),
};

let CATEGORIES = [];
let PHRASES = [];
let CURRENT_INDEX_PHRASES;
let CURRENT_INDEX_CATEGORY;
let BASE_LANG = 'eng';
let SECOND_LANG = 'rus';
// =============================================================
//
//
//
//
// =====================  CALLBACKS  ===========================
moduleRefs.moduleContainer.addEventListener('click', onModuleClick);
moduleRefs.inputModuleElem.addEventListener(
  'input',
  _.debounce(onSearchModule, 500)
);
phrasesRefs.buttons[0].addEventListener('click', loadPreviousQuestion);
phrasesRefs.buttons[1].addEventListener('click', onAnswerClick);
phrasesRefs.buttons[2].addEventListener('click', loadNextQuestion);

async function onModuleClick(e) {
  if (e.target.nodeName !== 'UL') {
    let target = e.target.closest('li');
    CURRENT_INDEX_CATEGORY = target.dataset.id;
    updateStyleSelectModule(target);

    setSpinner(true);
    PHRASES = await getPhrases(CURRENT_INDEX_CATEGORY);
    console.log('hide');
    setTimeout(() => {
      setSpinner(false);
    }, 1000);
    CURRENT_INDEX_PHRASES = 0;
    initPhrase();
    activateButton();
  }
}

async function onSearchModule(e) {
  let value = moduleRefs.inputModuleElem.value;
  let filteredArray = CATEGORIES.filter(obj => {
    let title = obj.title;
    return title.indexOf(value) >= 0;
  });
  renderCategories(filteredArray);
}

function loadPreviousQuestion(e) {
  if (CURRENT_INDEX_PHRASES > 0) CURRENT_INDEX_PHRASES--;
  initPhrase();
  activateButton();
}
function loadNextQuestion(e) {
  if (CURRENT_INDEX_PHRASES < PHRASES.length - 1) CURRENT_INDEX_PHRASES++;
  initPhrase();
  activateButton();
}
function onAnswerClick(e) {
  let answerElem = phrasesRefs.form.querySelector('input:checked');
  resetStyle();
  showAnswer(answerElem?.value ?? 0);
}
// =============================================================
//
//
//
//
// ========================  HELPERS  ==========================
function renderCategories(filterCategories) {
  if (!filterCategories) filterCategories = CATEGORIES;
  filterCategories.sort((a, b) => a.title.localeCompare(b.title));
  moduleRefs.moduleContainer.innerHTML = categoriesTemlate(filterCategories);
  setStyleForSelect(CURRENT_INDEX_CATEGORY);
}

function renderPhrases(PHRASE) {
  phrasesRefs.form.innerHTML = phrasesTemplate(PHRASE);
}

function initPhrase(index) {
  if (PHRASES.length > 0) {
    index = index ?? CURRENT_INDEX_PHRASES;
    let topic = PHRASES;
    let question = topic[index];
    let randomNums = [];
    let answerRand = getRand([], 0, 3);

    let PHARSE_OBJ = {};
    for (let i = 0; i < 3; i++) {
      let rand = getRand([index, ...randomNums], 0, topic.length - 1);
      randomNums.push(rand);
      PHARSE_OBJ[`rus${i + 1}`] = topic[randomNums[i]][SECOND_LANG];
    }

    PHARSE_OBJ[`rus${answerRand + 1}`] = question[SECOND_LANG];
    PHARSE_OBJ.eng = question[BASE_LANG];

    renderPhrases(PHARSE_OBJ);
  }
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

function showAnswer(index) {
  let answerListElem = phrasesRefs.form.querySelectorAll('p');
  if (answerListElem) {
    answerListElem[index].classList.add('wrong');

    let question = PHRASES[CURRENT_INDEX_PHRASES];

    for (let i = 0; i < 3; i++) {
      if (answerListElem[i].children[1].textContent === question[SECOND_LANG]) {
        answerListElem[i].closest('p').classList.remove('wrong');
        answerListElem[i].closest('p').classList.add('right');
      }
    }
  }
}

function updateStyleSelectModule(moduleRef) {
  let oldRef = moduleRefs.moduleContainer.querySelector('.selected');
  if (oldRef) oldRef.classList.remove('selected');
  setStyleForSelect(moduleRef);
}
function setStyleForSelect(moduleRef) {
  if (!moduleRef)
    moduleRef = moduleRefs.moduleContainer.querySelector(
      `[data-id=${CURRENT_INDEX_CATEGORY}]`
    );

  moduleRef?.classList?.add('selected');
}

function setSpinner(flag = false) {
  if (!flag) {
    document.body.classList.remove('show');
    setTimeout(() => {
      setSpinner(false);
    }, 10000);
  } else {
    document.body.classList.add('show');
  }
}
function resetStyle() {
  let answerListElem = phrasesRefs.form.querySelectorAll('p');
  for (let i = 0; i < 3; i++) {
    answerListElem[i].closest('p').classList.remove('selected');
    answerListElem[i].closest('p').classList.remove('wrong');
    answerListElem[i].closest('p').classList.remove('right');
  }
}
function activateButton() {
  if (CURRENT_INDEX_PHRASES > 0) {
    phrasesRefs.buttons[0].disabled = false;
  } else {
    phrasesRefs.buttons[0].disabled = true;
  }

  if (CURRENT_INDEX_PHRASES < PHRASES.length - 1) {
    phrasesRefs.buttons[2].disabled = false;
  } else {
    phrasesRefs.buttons[2].disabled = true;
  }
}
// toggle.addEventListener('change', e => {
//   [BASE_LANG, SECOND_LANG] = [SECOND_LANG, BASE_LANG];
// });
// =============================================================
//
//
//
//
// =========================   INIT   ==========================
async function onLoadWindow() {
  CATEGORIES = await getСategories();
  setSpinner(false);
  renderCategories(CATEGORIES);
}

onLoadWindow();

// =============================================================
