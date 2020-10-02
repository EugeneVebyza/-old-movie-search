import Swiper from 'swiper';

const mySwiper = new Swiper('.swiper-container', {
    speed: 400,
    grabCursor: true,
    centerInsufficientSlides: true,
    preventClicks: true, // неактивные ссылки при свайпе
    preventInteractionOnTransition: true, // ссылки
    breakpoints: {
        804: {
            slidesPerView: 1,
            spaceBetween: 50
        },

        1060: {
            slidesPerView: 2,
            spaceBetween: 20
        },

        1548: {
            slidesPerView: 3,
            spaceBetween: 70,
        },

        2044: {
            slidesPerView: 4,
            spaceBetween: 70,
        }
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

});

export default mySwiper

// API KEYS
// fbb97a0c
// 334b742c
// trnsl.1.1.20200513T113933Z.6470dc3ca403dc4d.b67a81e2ade28213aad1fffda6bb6201578b2749
