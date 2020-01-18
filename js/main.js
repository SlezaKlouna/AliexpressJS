'use strict';
// spinner.innerHTML = `<img src="./img/spinner/spinner2.gif">`;


document.addEventListener('DOMContentLoaded', () => {
    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishListBtn = document.getElementById('wishlist');
    const cart = document.querySelector('.cart');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const category = document.querySelector('.category');

    const cartCounter = cartBtn.querySelector('.counter');
    const wishLisstCounter = wishListBtn.querySelector('.counter');

    const cartWrapperElem = document.querySelector('.cart-wrapper');

    const wishList = [];
    const goodsBasket = {};

    // fetch('db/db.json'); // Функция для API с БД
    // console.log(fetch('db/db.json'));
    // fetch('db/db.json').then(); // then ожидает промис

    const loading = (nameFn)=> {
        const spinner = `<div id="spinner"><div class="spinner-loading">
                                  <div><div><div></div></div><div><div></div></div>
                                  <div><div></div></div><div><div></div></div>
                                  </div></div></div>`;
        if (nameFn === 'renderCard'){
            goodsWrapper.innerHTML = spinner;
        }
        if (nameFn === 'renderBasket'){
            cartWrapperElem.innerHTML = spinner;
        }
    }

    // Запрос на сервер
    const getGoods = (handler, filter) => {
        loading();
        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);
    }

    // Создание карточки товара
    const createCardGoods = (id, name, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `
            <div class="card">
                <div class="card-img-wrapper">
                    <img class="card-img-top" src="${img}" alt="">
                    <button class="card-add-wishlist ${wishList.includes(id) ? 'active' : ''}" data-goods-id = "${id}"></button>
                </div>
                <div class="card-body justify-content-between">
                    <a href="#" class="card-title">${name}</a>
                    <div class="card-price">${price} ₽</div>
                    <div><button class="card-add-cart" data-goods-id ="${id}">Добавить в корзину</button></div>
                </div>
            </div>
        `
        return card;
    }

    // Сумма товаров в корзине
    const calcTotallPrice = goods => {
        // let sum = 0;
        // for (const item of goods){
        //     console.log(item);
        //     sum += item.price * goodsBasket[item.id];
        // }
        // REDUCE
        let sum = goods.reduce((accum, item) => {
            return accum + item.price * goodsBasket[item.id];
        }, 0);
        cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
    }

    // Фильтры корзины
    const showCardBasket = goods => {
        const basketGoods = goods.filter(item => goodsBasket.hasOwnProperty(item.id));
        calcTotallPrice(basketGoods);
        return basketGoods;
    }


    // Открытие корзины
    const openCart = (e) => {
        e.preventDefault();
        cart.style.display = 'flex';
        window.addEventListener('keydown',  closeCart);
        getGoods(renderBasket, showCardBasket);
    };

    // Закрытие корзины
    const closeCart = (e) => {
        if(e.target === cart || e.target.classList.contains('cart-close') || e.keyCode === 27) {
            cart.style.display = 'none';
            window.removeEventListener('keydown', closeCart);
        }

    }

    //
    const renderCard = (item) => {
        goodsWrapper.textContent = '';

        if (item.length){
            item.forEach(({ id, title, price, imgMin }) => {
                // const { id, name, price, img } = item;
                goodsWrapper.append(createCardGoods(id, title, price, imgMin));
            });
        }else {
            goodsWrapper.textContent = 'Товары не найдены!';
        }
    }

    // Renger goodi in cart
    const createCadtGoodsBasket = (id, name, price, img) => {
        const card = document.createElement('div');
        card.className = 'goods';
        card.innerHTML = `
            <div class="goods-img-wrapper">
			    <img class="goods-img" src="${img}" alt="">
			</div>
			<div class="goods-description">
				<h2 class="goods-title">${name}</h2>
				<p class="goods-price">${price} ₽</p>
			</div>
			<div class="goods-price-count">
			    <div class="goods-trigger">
				    <button class="goods-add-wishlist ${wishList.includes(id) ? 'active' : ''}" data-goods-id ="${id}"></button>
				    <button class="goods-delete" data-goods-id ="${id}"></button>
			    </div>
			    <div class="goods-count">${goodsBasket[id]}</div>
			</div>`
        return card;
    }

    const renderBasket = (item) => {
        cartWrapperElem.textContent = '';
        if (item.length){
            item.forEach(({ id, title, price, imgMin }) => {
                cartWrapperElem.append(createCadtGoodsBasket(id, title, price, imgMin));
            });
        }else {
            cartWrapperElem.innerHTML = `<div id="cart-empty">Ваша корзина пока пуста</div>`;
        }
    }

    // Фильтры сортировки товаров
    const randomSort = (item) => {
        return item.sort(() => Math.random() - 0.5 )
    }

    const choiceCategory = e => {
        e.preventDefault();

        if (e.target.classList.contains('category-item')) {
            const category = e.target.dataset.category;
            console.log(category)
            getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)));
        }
    }

    const searchGoods = event => {
        event.preventDefault();
        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim();

        if (inputValue !== ''){
            const searchString = new RegExp(inputValue, 'i');// Regular
           getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
        } else {
            search.classList.add('error');
            setTimeout(() => {
                search.classList.remove('error');
            }, 2000);
        }

        input.value = '';
    };

    // Работа с хранилищем
    // Работа с coockie
    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const coockieQuery = get => {
        if (get) {
            if (getCookie('goodsBasket')){
                Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')))
                // goodsBasket = JSON.parse(getCookie('goodsBasket'));
            }
            checkCount();
        } else {
            document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`;
        }
        // console.log(goodsBasket);
    }
    // End
    const checkCount = () => {
        wishLisstCounter.textContent = wishList.length;
        cartCounter.textContent = Object.keys(goodsBasket).length;
    }

    const storageQuery = get => {
        if(get){
            if (localStorage.getItem('wishList')){
                wishList.push(0, 0, ...JSON.parse(localStorage.getItem('wishList')))

               // JSON.parse(localStorage.getItem('wishList')).forEach(id => wishList.push(id));
            }
            checkCount();
        } else {
            localStorage.setItem('wishList', JSON.stringify(wishList));
        }
    };
    // const wishList = storageQuery(true);
    // Конец работы с хранилищем

    const toggleWishList = (id, el) => {
        if (wishList.includes(id)){
            wishList.splice(wishList.indexOf(id), 1);
            el.classList.remove('active');
        } else {
            wishList.push(id);
            el.classList.add('active');
        }
        // console.log(wishList);
        checkCount();
        storageQuery();
    };

    // Добавление в корзину
    const addBasket = id => {
        if (goodsBasket[id]){
            goodsBasket[id] += 1;
        } else {
            goodsBasket[id] = 1;
        }
        // console.log(googsBasket);
        checkCount();
        coockieQuery();
    };

    const handlerGoods = event => {
        const target = event.target;

        if (target.classList.contains('card-add-wishlist')){
            // target.dataset.goodsId;
            toggleWishList(target.dataset.goodsId, target);
        };

        if (target.classList.contains('card-add-cart')){
            addBasket(target.dataset.goodsId);
        }
    }

    const removeGoods = id => {
        delete goodsBasket[id];
        checkCount();
        coockieQuery();
        getGoods(renderBasket, showCardBasket);
    };

    const handlerBasket = event => {
        const target = event.target;
        if (target.classList.contains('goods-add-wishlist')){
            toggleWishList(target.dataset.goodsId, target);
        };
        if (target.classList.contains('goods-delete')){
            removeGoods(target.dataset.goodsId);
        };
    };

    // Фильтры для листа предпочтений
    const showWishList = () => {
        getGoods(renderCard, goods => goods.filter(item => wishList.includes(item.id)));
    };

    // Обработчики событий

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    cartWrapperElem.addEventListener('click', handlerBasket);
    wishListBtn.addEventListener('click', showWishList);

    getGoods(renderCard, randomSort);

    storageQuery('get');
    coockieQuery('get');

    // goodsWrapper.append(createCardGoods(1, 'Darts', 1000, 'img/temp/Archer.jpg'));
    // goodsWrapper.append(createCardGoods(2, 'Flamingo', 3000, 'img/temp/Flamingo.jpg'));
    // goodsWrapper.append(createCardGoods(3, 'Socks', 500, 'img/temp/Socks.jpg'));
    // goodsWrapper.append(createCardGoods(4, 'Dress', 700, 'img/temp/Dress.jpg'));

});