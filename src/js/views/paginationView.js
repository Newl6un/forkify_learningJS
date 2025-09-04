import View from './View.js';

import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.pagination');
  }

  _generateMarkup() {
    const totalPage = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    const currPage = this._data.page;

    //Page 1, and there are other pages
    if (currPage === 1 && totalPage > 1) {
      return this._generateMarkupPaginationButton(true);
    }

    //Last Page
    if (currPage === totalPage && totalPage > 1) {
      return this._generateMarkupPaginationButton();
    }
    //Other page
    if (currPage < totalPage) {
      return `${this._generateMarkupPaginationButton()}
        ${this._generateMarkupPaginationButton(true)}
      `;
    }

    //Page 1 and there are NO other pages
    return ``;
  }

  _generateMarkupPaginationButton(next = false) {
    const page = this._data.page;
    const target = page + (next ? 1 : -1); // trang sẽ đi tới
    const dir = next ? 'next' : 'prev';
    const arrow = next ? 'right' : 'left';
    const label = `<span>Page ${target}</span>`;

    return `
        <button class="btn--inline pagination__btn--${dir}" data-goto="${target}">
             ${next ? label : ''}
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-${arrow}"></use>
            </svg>
            ${next ? '' : label}
        </button>
    `;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');

      if (!btn) {
        return;
      }

      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }
}

export default new PaginationView();
