import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.results');
    this._message = '';
    this._errorMessage = 'Cannot find any recipe for your query!';
  }

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join();
  }
}

export default new ResultsView();
