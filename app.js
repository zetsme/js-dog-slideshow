const breedListEl = document.getElementById('breed');
const slideshowEl = document.getElementById('slideshow');

const createElement = (tag, classes = '', attributes = {}, textCotent = '') => {
  const setAttrs = (elem, attrs) =>
    Object.keys(attrs).map((key) => elem.setAttribute(key, attrs[key]));
  const $ = document.createElement(tag);
  if (classes) $.className = classes;
  if (Object.keys(attributes).length > 0) {
    setAttrs($, attributes);
  }
  $.textContent = textCotent;
  return $;
};

const fetchData = async (url) => {
  const res = await fetch(url);
  return await res.json();
};

const fetchBreedList = async () => {
  const { message } = await fetchData('https://dog.ceo/api/breeds/list/all');
  createBreedList(message);
};

const createBreedList = (data) => {
  const selectEl = document.createElement('select');
  const defaultOption = createElement('option', null, {}, 'Choose your Dog');
  selectEl.appendChild(defaultOption);
  breedListEl.appendChild(selectEl);

  Object.keys(data).forEach((item) => {
    const option = createElement('option', null, {}, item);
    selectEl.appendChild(option);
  });

  selectEl.addEventListener('change', fetchImagesByBreed);
};

fetchBreedList();

const fetchImagesByBreed = async (e) => {
  const { message } = await fetchData(`https://dog.ceo/api/breed/${e.target.value}/images`);
  createSlideShow(message);
};

const createSlide = (url) => {
  const slideEl = createElement('div', 'slide', {
    style: `background-image: url(${url})`,
  });
  slideshowEl.appendChild(slideEl);
};

const slideShow = () => {
  let intervalTimer;
  let imageRemoveDelay;
  const createSlideShow = (data) => {
    slideshowEl.innerHTML = '';
    let currentPosition = 0;
    clearInterval(intervalTimer);
    clearTimeout(imageRemoveDelay);
    if (data.length > 1) {
      createSlide(data[0]);
      createSlide(data[1]);
      currentPosition += 2;
      intervalTimer = setInterval(() => {
        createSlide(data[currentPosition]);
        imageRemoveDelay = setTimeout(() => {
          slideshowEl.children[0].remove();
        }, 1000);
        if (currentPosition >= data.length - 1) {
          currentPosition = 0;
        } else {
          currentPosition++;
        }
      }, 3000);
    } else {
      createSlide(data[0]);
      createSlide(data[0]);
    }
  };

  return createSlideShow;
};

const createSlideShow = slideShow();
