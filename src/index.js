// =============================================================
import { getPhrases, getСategories } from './js/store/index';
import categoriesTemlate from './templates/question-list.hbs';
import phrasesTemplate from './templates/phrases-template.hbs';
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
};

let CATEGORIES = [];
let PHRASES = [];
let CURRENT_INDEX_PHRASES;
// =============================================================
//
//
//
//
// =====================  CALLBACKS  ===========================

// =============================================================
//
//
//
//
// ========================  HELPERS  ==========================
function renderCategories(filterCategories) {
  if (!filterCategories) filterCategories = CATEGORIES;
  moduleRefs.moduleContainer = filterCategories;
}

function renderPhrases() {}

function initPhrase() {
  let topic = PHRASES;
  let question = topic[CURRENT_INDEX_PHRASES];
  let randomNums = [];
  let answerRand = getRand([], 0, 3);

  for (let i = 0; i < 3; i++) {
    let rand = getRand(
      [CURRENT_INDEX_PHRASES, ...randomNums],
      0,
      topic.length - 1
    );
    randomNums.push(rand);
    refs.answerListElem[i].textContent = topic[randomNums[i]][SECOND_LANG];
  }

  refs.answerListElem[answerRand].textContent = question[SECOND_LANG];
  questionTitle.textContent = question[BASE_LANG];
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
  renderCategories(CATEGORIES);
}

onLoadWindow();

// =============================================================
