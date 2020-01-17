'use strict';

let spinner = document.createElement('div');
spinner.className = 'preloader';
spinner.innerHTML = `<img src="./img/spinner/spinner2.gif">`;
document.body.append(spinner);

spinner.style.display = 'flex';


document.addEventListener('DOMContentLoaded', () => {
    setTimeout( () => {
        spinner.style.display = 'none';
    }, 1000);

    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishList = document.getElementById('wishlist');
    const cart = document.querySelector('.cart');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const category = document.querySelector('.category');

    // fetch('db/db.json'); // Функция для API с БД
    // console.log(fetch('db/db.json'));
    // fetch('db/db.json').then(); // then ожидает промис

    const createCardGoods = (id, name, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `
            <div class="card">
                <div class="card-img-wrapper">
                    <img class="card-img-top" src="${img}" alt="">
                    <button class="card-add-wishlist" data-goods-id = "${id}"></button>
                </div>
                <div class="card-body justify-content-between">
                    <a href="#" class="card-title">${name}</a>
                    <div class="card-price">${price} ₽</div>
                    <div><button class="card-add-cart">Добавить в корзину</button></div>
                </div>
            </div>
        `
        return card;
    }

    const openCart = (e) => {
        e.preventDefault();
        cart.style.display = 'flex';
        window.addEventListener('keydown',  closeCart);
    };

    const closeCart = (e) => {
        if(e.target === cart || e.target.classList.contains('cart-close') || e.keyCode === 27) {
            cart.style.display = 'none';
            window.removeEventListener('keydown', closeCart);
        }

    }

    const renderCard = (item) => {
        goodsWrapper.textContent = '';
        item.forEach(({ id, title, price, imgMin }) => {
            // const { id, name, price, img } = item;
            goodsWrapper.append(createCardGoods(id, title, price, imgMin));
        });
    }


    const getGoods = (handler, filter) => {
        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);
    }

    const randomSort = (item) => {
        return item.sort(() => Math.random() - 0.5 )
    }

    // const filterCategory =

    const choiceCategory = e => {
        e.preventDefault();

        if (e.target.classList.contains('category-item')) {
            const category = e.target.dataset.category;
            console.log(category)
            getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)));
        }
    }

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiceCategory);

    getGoods(renderCard, randomSort);



    // goodsWrapper.append(createCardGoods(1, 'Darts', 1000, 'img/temp/Archer.jpg'));
    // goodsWrapper.append(createCardGoods(2, 'Flamingo', 3000, 'img/temp/Flamingo.jpg'));
    // goodsWrapper.append(createCardGoods(3, 'Socks', 500, 'img/temp/Socks.jpg'));
    // goodsWrapper.append(createCardGoods(4, 'Dress', 700, 'img/temp/Dress.jpg'));

});