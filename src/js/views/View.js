import icons from 'url:../../img/icons.svg';

export default class View {
  _parentElement;
  _message;
  _errorMessage;
  _data;

  /**
   *Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @param {boolean} [render=true] if flase, create markup string instead of rendering to the DOM
   * @returns
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const html = this._generateMarkup();

    if (!render) {
      return html;
    }

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return;
    }
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));

    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];

      //Updates changed TEXT
      if (
        !currEl.isEqualNode(newEl) &&
        currEl.firstChild?.nodeType === Node.TEXT_NODE &&
        currEl.firstChild.nodeValue.trim()
      ) {
        currEl.textContent = newEl.textContent;
      }

      //Updates changed ATTRIBUTES
      if (!currEl.isEqualNode(newEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const html = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div> 
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderError(msg = this._errorMessage) {
    const html = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${msg}</p>
      </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderMessage(msg = this._message) {
    const html = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${msg}</p>
      </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
