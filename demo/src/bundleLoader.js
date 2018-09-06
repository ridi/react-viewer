

const createElement = (tag, attr) => {
  const el = document.createElement(tag);
  if (attr) {
    Object.keys(attr).forEach((key) => {
      el[key] = attr[key];
    });
  }
  return el;
};

const loadJs = (filename) => {
  const scriptEl = createElement('script', { src: filename });
  document.body.appendChild(scriptEl);
};

const bundlesDropdown = document.querySelector('#bundles');
const contentsDropdown = document.querySelector('#contents');
const currentVersion = new URLSearchParams(window.location.search).get('ver');
const currentContentId = new URLSearchParams(window.location.search).get('contentId');
const currentBundle = currentVersion == null ? 'index.js' : `${currentVersion}.index.js`;

// step 1. load bundle js
loadJs(`./resources/js/${currentBundle}`);

// step 2. add change event listener to dropdowns
bundlesDropdown.addEventListener('change', () => {
  const selectedBundle = bundlesDropdown.value;
  const queryParams = new URLSearchParams(window.location.search);

  if (selectedBundle === 'index.js') {
    queryParams.delete('ver');
  } else {
    queryParams.set('ver', selectedBundle.replace('.index.js', ''));
  }

  const currentUrl = window.location.pathname.split('?')[0];
  window.location.href = `${currentUrl}?${queryParams.toString()}`;
});
contentsDropdown.addEventListener('change', () => {
  const selectedContentId = contentsDropdown.value;
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set('contentId', selectedContentId);

  const currentUrl = window.location.pathname.split('?')[0];
  window.location.href = `${currentUrl}?${queryParams.toString()}`;
});

// step 3. load bundle list to drop down
fetch('./resources/js/bundles.json')
  .then(resp => resp.json())
  .then(({ latestVersion, bundles }) => {
    bundles.forEach((bundle) => {
      const optionText = bundle === 'index.js' ? `(latest)index.${latestVersion}.js` : bundle;

      const bundleOption = createElement('option', {
        value: bundle,
        innerText: optionText,
        selected: currentBundle === bundle,
      });
      bundlesDropdown.appendChild(bundleOption);
    });
  });

// step 4. load contents list to drop down
fetch('./resources/contents/contents.json')
  .then(resp => resp.json())
  .then(({ contents }) => {
    contents.forEach((content) => {
      const bundleOption = createElement('option', {
        value: content.id,
        innerText: content.title,
        selected: currentContentId === content.id.toString(),
      });
      contentsDropdown.appendChild(bundleOption);
    });
  });
