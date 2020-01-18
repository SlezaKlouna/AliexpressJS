'use strict'; // spinner.innerHTML = `<img src="./img/spinner/spinner2.gif">`;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.addEventListener('DOMContentLoaded', function () {
    var search = document.querySelector('.search');
    var cartBtn = document.getElementById('cart');
    var wishListBtn = document.getElementById('wishlist');
    var cart = document.querySelector('.cart');
    var goodsWrapper = document.querySelector('.goods-wrapper');
    var category = document.querySelector('.category');
    var cartCounter = cartBtn.querySelector('.counter');
    var wishLisstCounter = wishListBtn.querySelector('.counter');
    var cartWrapperElem = document.querySelector('.cart-wrapper');
    var wishList = [];
    var goodsBasket = {}; // fetch('db/db.json'); // Функция для API с БД
    // console.log(fetch('db/db.json'));
    // fetch('db/db.json').then(); // then ожидает промис

    var loading = function loading(nameFn) {
        var spinner = "<div id=\"spinner\"><div class=\"spinner-loading\">\n                                  <div><div><div></div></div><div><div></div></div>\n                                  <div><div></div></div><div><div></div></div>\n                                  </div></div></div>";

        if (nameFn === 'renderCard') {
            goodsWrapper.innerHTML = spinner;
        }

        if (nameFn === 'renderBasket') {
            cartWrapperElem.innerHTML = spinner;
        }
    }; // Запрос на сервер


    var getGoods = function getGoods(handler, filter) {
        loading();
        fetch('db/db.json').then(function (response) {
            return response.json();
        }).then(filter).then(handler);
    }; // Создание карточки товара


    var createCardGoods = function createCardGoods(id, name, price, img) {
        var card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = "\n            <div class=\"card\">\n                <div class=\"card-img-wrapper\">\n                    <img class=\"card-img-top\" src=\"".concat(img, "\" alt=\"\">\n                    <button class=\"card-add-wishlist ").concat(wishList.includes(id) ? 'active' : '', "\" data-goods-id = \"").concat(id, "\"></button>\n                </div>\n                <div class=\"card-body justify-content-between\">\n                    <a href=\"#\" class=\"card-title\">").concat(name, "</a>\n                    <div class=\"card-price\">").concat(price, " \u20BD</div>\n                    <div><button class=\"card-add-cart\" data-goods-id =\"").concat(id, "\">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</button></div>\n                </div>\n            </div>\n        ");
        return card;
    }; // Сумма товаров в корзине


    var calcTotallPrice = function calcTotallPrice(goods) {
        // let sum = 0;
        // for (const item of goods){
        //     console.log(item);
        //     sum += item.price * goodsBasket[item.id];
        // }
        // REDUCE
        var sum = goods.reduce(function (accum, item) {
            return accum + item.price * goodsBasket[item.id];
        }, 0);
        cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
    }; // Фильтры корзины


    var showCardBasket = function showCardBasket(goods) {
        var basketGoods = goods.filter(function (item) {
            return goodsBasket.hasOwnProperty(item.id);
        });
        calcTotallPrice(basketGoods);
        return basketGoods;
    }; // Открытие корзины


    var openCart = function openCart(e) {
        e.preventDefault();
        cart.style.display = 'flex';
        window.addEventListener('keydown', closeCart);
        getGoods(renderBasket, showCardBasket);
    }; // Закрытие корзины


    var closeCart = function closeCart(e) {
        if (e.target === cart || e.target.classList.contains('cart-close') || e.keyCode === 27) {
            cart.style.display = 'none';
            window.removeEventListener('keydown', closeCart);
        }
    }; //


    var renderCard = function renderCard(item) {
        goodsWrapper.textContent = '';

        if (item.length) {
            item.forEach(function (_ref) {
                var id = _ref.id,
                    title = _ref.title,
                    price = _ref.price,
                    imgMin = _ref.imgMin;
                // const { id, name, price, img } = item;
                goodsWrapper.append(createCardGoods(id, title, price, imgMin));
            });
        } else {
            goodsWrapper.textContent = 'Товары не найдены!';
        }
    }; // Renger goodi in cart


    var createCadtGoodsBasket = function createCadtGoodsBasket(id, name, price, img) {
        var card = document.createElement('div');
        card.className = 'goods';
        card.innerHTML = "\n            <div class=\"goods-img-wrapper\">\n\t\t\t    <img class=\"goods-img\" src=\"".concat(img, "\" alt=\"\">\n\t\t\t</div>\n\t\t\t<div class=\"goods-description\">\n\t\t\t\t<h2 class=\"goods-title\">").concat(name, "</h2>\n\t\t\t\t<p class=\"goods-price\">").concat(price, " \u20BD</p>\n\t\t\t</div>\n\t\t\t<div class=\"goods-price-count\">\n\t\t\t    <div class=\"goods-trigger\">\n\t\t\t\t    <button class=\"goods-add-wishlist ").concat(wishList.includes(id) ? 'active' : '', "\" data-goods-id =\"").concat(id, "\"></button>\n\t\t\t\t    <button class=\"goods-delete\" data-goods-id =\"").concat(id, "\"></button>\n\t\t\t    </div>\n\t\t\t    <div class=\"goods-count\">").concat(goodsBasket[id], "</div>\n\t\t\t</div>");
        return card;
    };

    var renderBasket = function renderBasket(item) {
        cartWrapperElem.textContent = '';

        if (item.length) {
            item.forEach(function (_ref2) {
                var id = _ref2.id,
                    title = _ref2.title,
                    price = _ref2.price,
                    imgMin = _ref2.imgMin;
                cartWrapperElem.append(createCadtGoodsBasket(id, title, price, imgMin));
            });
        } else {
            cartWrapperElem.innerHTML = "<div id=\"cart-empty\">\u0412\u0430\u0448\u0430 \u043A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u0430</div>";
        }
    }; // Фильтры сортировки товаров


    var randomSort = function randomSort(item) {
        return item.sort(function () {
            return Math.random() - 0.5;
        });
    };

    var choiceCategory = function choiceCategory(e) {
        e.preventDefault();

        if (e.target.classList.contains('category-item')) {
            var _category = e.target.dataset.category;
            console.log(_category);
            getGoods(renderCard, function (goods) {
                return goods.filter(function (item) {
                    return item.category.includes(_category);
                });
            });
        }
    };

    var searchGoods = function searchGoods(event) {
        event.preventDefault();
        var input = event.target.elements.searchGoods;
        var inputValue = input.value.trim();

        if (inputValue !== '') {
            var searchString = new RegExp(inputValue, 'i'); // Regular

            getGoods(renderCard, function (goods) {
                return goods.filter(function (item) {
                    return searchString.test(item.title);
                });
            });
        } else {
            search.classList.add('error');
            setTimeout(function () {
                search.classList.remove('error');
            }, 2000);
        }

        input.value = '';
    }; // Работа с хранилищем
    // Работа с coockie


    var getCookie = function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    var coockieQuery = function coockieQuery(get) {
        if (get) {
            if (getCookie('goodsBasket')) {
                Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket'))); // goodsBasket = JSON.parse(getCookie('goodsBasket'));
            }

            checkCount();
        } else {
            document.cookie = "goodsBasket=".concat(JSON.stringify(goodsBasket), "; max-age=86400e3");
        } // console.log(goodsBasket);

    }; // End


    var checkCount = function checkCount() {
        wishLisstCounter.textContent = wishList.length;
        cartCounter.textContent = Object.keys(goodsBasket).length;
    };

    var storageQuery = function storageQuery(get) {
        if (get) {
            if (localStorage.getItem('wishList')) {
                wishList.push.apply(wishList, [0, 0].concat(_toConsumableArray(JSON.parse(localStorage.getItem('wishList'))))); // JSON.parse(localStorage.getItem('wishList')).forEach(id => wishList.push(id));
            }

            checkCount();
        } else {
            localStorage.setItem('wishList', JSON.stringify(wishList));
        }
    }; // const wishList = storageQuery(true);
    // Конец работы с хранилищем


    var toggleWishList = function toggleWishList(id, el) {
        if (wishList.includes(id)) {
            wishList.splice(wishList.indexOf(id), 1);
            el.classList.remove('active');
        } else {
            wishList.push(id);
            el.classList.add('active');
        } // console.log(wishList);


        checkCount();
        storageQuery();
    }; // Добавление в корзину


    var addBasket = function addBasket(id) {
        if (goodsBasket[id]) {
            goodsBasket[id] += 1;
        } else {
            goodsBasket[id] = 1;
        } // console.log(googsBasket);


        checkCount();
        coockieQuery();
    };

    var handlerGoods = function handlerGoods(event) {
        var target = event.target;

        if (target.classList.contains('card-add-wishlist')) {
            // target.dataset.goodsId;
            toggleWishList(target.dataset.goodsId, target);
        }

        ;

        if (target.classList.contains('card-add-cart')) {
            addBasket(target.dataset.goodsId);
        }
    };

    var removeGoods = function removeGoods(id) {
        delete goodsBasket[id];
        checkCount();
        coockieQuery();
        getGoods(renderBasket, showCardBasket);
    };

    var handlerBasket = function handlerBasket(event) {
        var target = event.target;

        if (target.classList.contains('goods-add-wishlist')) {
            toggleWishList(target.dataset.goodsId, target);
        }

        ;

        if (target.classList.contains('goods-delete')) {
            removeGoods(target.dataset.goodsId);
        }

        ;
    }; // Фильтры для листа предпочтений


    var showWishList = function showWishList() {
        getGoods(renderCard, function (goods) {
            return goods.filter(function (item) {
                return wishList.includes(item.id);
            });
        });
    }; // Обработчики событий


    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    cartWrapperElem.addEventListener('click', handlerBasket);
    wishListBtn.addEventListener('click', showWishList);
    getGoods(renderCard, randomSort);
    storageQuery('get');
    coockieQuery('get'); // goodsWrapper.append(createCardGoods(1, 'Darts', 1000, 'img/temp/Archer.jpg'));
    // goodsWrapper.append(createCardGoods(2, 'Flamingo', 3000, 'img/temp/Flamingo.jpg'));
    // goodsWrapper.append(createCardGoods(3, 'Socks', 500, 'img/temp/Socks.jpg'));
    // goodsWrapper.append(createCardGoods(4, 'Dress', 700, 'img/temp/Dress.jpg'));
});