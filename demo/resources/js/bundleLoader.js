

const getQueryParam = key => {
  const match = new RegExp(`[?&]${key}=([^&]*)`).exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

const createElement = (tag, attr) => {
  const el = document.createElement(tag);
  attr && Object.keys(attr).forEach(key => {
    el[key] = attr[key];
  });
  return el;
};

const loadJs = filename => {
  const scriptEl = createElement('script', { src: filename });
  document.body.appendChild(scriptEl);
};

const bundlesDropdown = document.querySelector('#bundles');
const currentVersion = getQueryParam('ver');
const currentBundle = currentVersion == null ? 'index.js' : `${currentVersion}.index.js`;

// step 1. load bundle js
loadJs(`/resources/js/${currentBundle}`);

// step 2. add change event listener to bundles drop down
bundlesDropdown.addEventListener('change', () => {
  let url = window.location.pathname.split('?')[0];
  const selectedBundle = bundlesDropdown.value;
  if (selectedBundle !== 'index.js') {
    const ver = selectedBundle.replace('.index.js', '');
    url += `?ver=${ver}`;
  }
  window.location.href = url;
});

// step 3. load bundle list to drop down
fetch('/resources/js/bundles.json')
  .then(resp => resp.json())
  .then(({ bundles }) => {
    bundles.forEach(bundle => {
      const bundleOption = createElement('option', {
        value: bundle,
        innerText: bundle,
        selected: currentBundle === bundle,
      });
      bundlesDropdown.appendChild(bundleOption);
    });
  });
