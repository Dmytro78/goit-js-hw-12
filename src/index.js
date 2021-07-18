import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


import fetchCountries  from './js/fetchCountries.js';
import getRefs from './js/refs.js';


import  cardCountry from '../templates/card-country.hbs';
import listCountries from '../templates/list-countries.hbs';



const refs = getRefs();
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();

  const searchQuery = evt.target.value.trim();
  console.log(searchQuery);

  if (searchQuery === '') {
    clearData();
    return;
  }
  fetchCountries(searchQuery)
    .then(data => {
      if (data.length === 1) {
        clearData();
        refs.countryList.innerHTML = cardCountry(data);
      }
      return data;
    })
    .then(data => {
      if (data.length > 1 && data.length <= 10) {
        clearData();
        refs.countryInfo.innerHTML = listCountries(data);
      }
      return data;
    })
    .then(data => {
      if (data.length > 10) {
        clearData();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      }
    })
    .catch(error => {
      clearData();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearData() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
