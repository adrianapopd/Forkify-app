import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;

  /**
   *Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g a recipe)
   * @param {boolean} [render= true] If false, create markup string instead od rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render is false
   * @this {Object} View instance
   * @author Adriana Pop
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup); //creates a virtual DOM objects that lives in the memory not on the page
    const newElements = Array.from(newDOM.querySelectorAll('*')); //return NODE LIST
    // console.log(newElements);
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    // console.log(currentElements);
    // console.log(newElements);

    newElements.forEach((newEl, i) => {
      const currentElement = currentElements[i];
      // console.log(currentElement, newEl.isEqualNode(currentElement));

      //Elements that contain Text only, update changed text
      if (
        !newEl.isEqualNode(currentElement) &&
        newEl.firstChild?.nodeValue.trim() !== '' //firstChild is Text Node,nodeValue is Text, rest in null is is not Text Node
      ) {
        // console.log(`💣💣💣`, newEl.firstChild.nodeValue.trim());
        currentElement.textContent = newEl.textContent;
      }

      //Update changes atributes
      if (!newEl.isEqualNode(currentElement)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          currentElement.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
     <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
     <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
     `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
     <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
     `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
