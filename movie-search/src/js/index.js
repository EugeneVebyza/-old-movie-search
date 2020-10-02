import '../css/style.css';
import '../css/style.scss';
import '../../node_modules/swiper/css/swiper.css';
import {
    input,
    form,
    clearButton,
    messageContainer,
    messageText,
    preloader,
    moviecardDOM,

} from './const';

import mySwiper from './swiper';

let fullinfo = [];
const counter = {
    greatest_page: 0,
    request: 'green',
    total: null,
}

function message(text) {
    messageText.textContent = text;
    messageContainer.classList.add('show');

}

class Card {
    constructor(title, link, imgsrc, year, rating) {
        this.link = `https://www.imdb.com/title/${link}/videogallery/`;
        this.img = imgsrc;
        this.title = title;
        this.year = year;
        this.rating = rating;
        this.markup = moviecardDOM;
    }

    render() {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        slide.append(this.markup.content.cloneNode(true));
        slide.querySelector('h2.movie-title').textContent = this.title;
        slide.querySelector('p.rating').textContent = this.rating;
        slide.querySelector('p.year').textContent = this.year;
        slide.querySelector('a.moviegallery').href = this.link;
        const link = slide.querySelector('img.poster');
        slide.querySelector('img.poster').src = this.img;
        link.onerror = () => { slide.querySelector('img.poster').src = `/img/notfound.jpg` }

        mySwiper.appendSlide(slide);
    }
}

function preloaderShow(showOrHide){
    if (showOrHide){
        preloader.classList.remove('loader_hiding');
    }
    if (!showOrHide){
        preloader.classList.add('loader_hiding');
    }
}

async function createCard(data) {
    const pagecontainer = [];

    data.forEach(element => {
        const moviecard = new Card(element.Title, element.imdbID, element.Poster, element.Year, element.imdbRating, moviecardDOM);
        moviecard.render();
        preloaderShow(false);
        pagecontainer.push(moviecard);
    });
}

async function getID(page, value) {
    const url = `https://www.omdbapi.com/?s=${value}&page=${page}&apikey=334b742c`;

    const res = await fetch(url);
    const data = await res.json();
    counter.total = Math.ceil(data.totalResults / 10);
    if (data.Response === 'True') {
        message(`По запросу '${value}' нашлось ${data.totalResults} результатов`);
        const promises = data.Search.map(async(elem) => {
            const urlfulldata = `https://www.omdbapi.com/?i=${elem.imdbID}&apikey=334b742c`;
            const res1 = await fetch(urlfulldata);
            const fulldata = await res1.json();
            fullinfo.push(fulldata);
            return fulldata
        });
        await Promise.all(promises);
        createCard(fullinfo);
        fullinfo = [];


    }   else {if(page===1){
            if (data.Error==='Too many results.'){
                message(`По запросу '${value}' слишком много результатов, уточните запрос`);
            }

                if ((data.Error==='Movie not found!')||(data.totalResults===undefined)){
                    message(`По запросу '${value}' ничего не найдено, уточните запрос`);
                }
                else{
                    message(`Ключик все, свяжись со мной или подожди 24 часа`);
                }

            }
            preloaderShow(false);

        }

}

function nextpage() {
    if (counter.total > counter.greatest_page + 1) {
        getID(counter.greatest_page, counter.request);
    }
}

async function init() {
    await getID(counter.greatest_page + 1, counter.request);
    await getID(counter.greatest_page + 2, counter.request);
}

mySwiper.on('slideChange', function pagechanger() {
    if (Math.floor(mySwiper.activeIndex / 10) > counter.greatest_page) {
        counter.greatest_page = Math.floor(mySwiper.activeIndex / 10);
        nextpage();
    }
});

clearButton.onclick = ()=>{
    input.value = "";
}

async function translate(text) {

    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200513T113933Z.6470dc3ca403dc4d.b67a81e2ade28213aad1fffda6bb6201578b2749&text=${text}&lang=ru-en`;

    const res2 = await fetch(url);
    const data2 = await res2.json();

    return data2.text[0]
}

form.addEventListener('submit', async function startsearch(e) {
    e.preventDefault();

    if (input.value) {

        preloaderShow(true);
        counter.request = input.value;
        if (counter.request.match(/[а-яё]/gi)){
            counter.request = await translate(counter.request);
        }
        counter.greatest_page = 0;
        counter.total = 0;

        mySwiper.removeAllSlides();

        await init();

    } else {
        message("Пустой запрос! Добавьте немного букв.");
    }

});

window.addEventListener('DOMContentLoaded', () => {
    init();
})
