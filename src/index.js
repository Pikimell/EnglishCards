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
