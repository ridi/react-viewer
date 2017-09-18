

export default class Renderer {
  static generateSpineHtml(number, contents) {
    const article = document.createElement('article');
    article.setAttribute('class', `chapter${(number === 1 ? ' first' : '')}`);
    article.setAttribute('data-id', number);
    article.setAttribute('id', `ridi_c${number}`);
    const spacer = `<pre id="ridi_link_c${number}"></pre>`;
    article.innerHTML = spacer + contents;
    return article.outerHTML;
  }
}
