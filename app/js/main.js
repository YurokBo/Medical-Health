$(function () {
    let owlPartner = $(".partner .partner__carousel"),
        owlJobs = $(".featured-job .featured-job__carousel");

    owlPartner.owlCarousel({
        loop: true,
        nav: true,
        dots: false,
        navText: ["<img src='img/chevron.png'>", "<img src='img/chevron.png'>"],
        autoplay: false,
        autoplayTimeout: 5000,
        autoplayHoverPause: false,
        responsive: {
            0: {
                items: 1
            },
            650: {
                items: 2
            },
            970: {
                items: 3
            },
            1250: {
                items: 4
            },
            1300: {
                items: 5
            }
        }
    });

    owlPartner.on('mousewheel', '.owl-stage', function (e) {
        if (e.deltaY > 0) {
            owl.trigger('next.owl');
        } else {
            owl.trigger('prev.owl');
        }
        e.preventDefault();
    });

    owlJobs.owlCarousel({
        loop: true,
        items: 3,
        nav: true,
        dots: false,
        navText: ["<img src='img/chevron.png'>", "<img src='img/chevron.png'>"],
        autoplay: false,
        autoplayTimeout: 5000,
        autoplayHoverPause: false,
        margin: 10,
        responsive: {
            0: {
                items: 1
            },
            1200: {
                items: 3
            }
        }
    })
});

/*-------this is a function which change blocks place-------*/
(function () {
    let originalPositions = [];
    let daElements = document.querySelectorAll('[data-da]');
    let daElementsArray = [];
    let daMatchMedia = [];
    //Заполняем массивы
    if (daElements.length > 0) {
        let number = 0;
        for (let index = 0; index < daElements.length; index++) {
            const daElement = daElements[index];
            const daMove = daElement.getAttribute('data-da');
            if (daMove != '') {
                const daArray = daMove.split(',');
                const daPlace = daArray[1] ? daArray[1].trim() : 'last';
                const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
                const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
                const daDestination = document.querySelector('.' + daArray[0].trim())
                if (daArray.length > 0 && daDestination) {
                    daElement.setAttribute('data-da-index', number);
                    //Заполняем массив первоначальных позиций
                    originalPositions[number] = {
                        "parent": daElement.parentNode,
                        "index": indexInParent(daElement)
                    };
                    //Заполняем массив элементов
                    daElementsArray[number] = {
                        "element": daElement,
                        "destination": document.querySelector('.' + daArray[0].trim()),
                        "place": daPlace,
                        "breakpoint": daBreakpoint,
                        "type": daType
                    };
                    number++;
                }
            }
        }
        dynamicAdaptSort(daElementsArray);

        //Создаем события в точке брейкпоинта
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daBreakpoint = el.breakpoint;
            const daType = el.type;

            daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
            daMatchMedia[index].addListener(dynamicAdapt);
        }
    }

    //Основная функция
    function dynamicAdapt(e) {
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daElement = el.element;
            const daDestination = el.destination;
            const daPlace = el.place;
            const daBreakpoint = el.breakpoint;
            const daClassname = "_dynamic_adapt_" + daBreakpoint;

            if (daMatchMedia[index].matches) {
                //Перебрасываем элементы
                if (!daElement.classList.contains(daClassname)) {
                    let actualIndex = indexOfElements(daDestination)[daPlace];
                    if (daPlace === 'first') {
                        actualIndex = indexOfElements(daDestination)[0];
                    } else if (daPlace === 'last') {
                        actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
                    }
                    daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
                    daElement.classList.add(daClassname);
                }
            } else {
                //Возвращаем на место
                if (daElement.classList.contains(daClassname)) {
                    dynamicAdaptBack(daElement);
                    daElement.classList.remove(daClassname);
                }
            }
        }
        customAdapt();
    }

    //Вызов основной функции
    dynamicAdapt();

    //Функция возврата на место
    function dynamicAdaptBack(el) {
        const daIndex = el.getAttribute('data-da-index');
        const originalPlace = originalPositions[daIndex];
        const parentPlace = originalPlace['parent'];
        const indexPlace = originalPlace['index'];
        const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
        parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
    }

    //Функция получения индекса внутри родителя
    function indexInParent(el) {
        var children = Array.prototype.slice.call(el.parentNode.children);
        return children.indexOf(el);
    }

    //Функция получения массива индексов элементов внутри родителя
    function indexOfElements(parent, back) {
        const children = parent.children;
        const childrenArray = [];
        for (let i = 0; i < children.length; i++) {
            const childrenElement = children[i];
            if (back) {
                childrenArray.push(i);
            } else {
                //Исключая перенесенный элемент
                if (childrenElement.getAttribute('data-da') == null) {
                    childrenArray.push(i);
                }
            }
        }
        return childrenArray;
    }

    //Сортировка объекта
    function dynamicAdaptSort(arr) {
        arr.sort(function (a, b) {
            if (a.breakpoint > b.breakpoint) {
                return -1
            } else {
                return 1
            }
        });
        arr.sort(function (a, b) {
            if (a.place > b.place) {
                return 1
            } else {
                return -1
            }
        });
    }

    //Дополнительные сценарии адаптации
    function customAdapt() {
        //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

}());


document.addEventListener('scroll', () => {
    const scrollBtn = document.querySelector('.scrollUp');
    window.scrollY > 713 ? scrollBtn.classList.add('scrollUp__show') : scrollBtn.classList.remove('scrollUp__show');
});

document.addEventListener('click', e => {
    const menuBurgerInner = document.querySelector('.menu-burger__inner');
    openMenu(e, menuBurgerInner);
    closeMenu(e, menuBurgerInner);
    scrollUp(e);
    activePlus(e);
});

function openMenu(e, elem) {
    const menuBurgerBtn = e.target.closest('.menu-burger__btn');

    if (!menuBurgerBtn) {
        return;
    }

    elem.classList.add('active__menu-burger');
}

function closeMenu(e, elem) {
    const menuBurgerClose = e.target.closest('.menu-burger__close');

    if (!menuBurgerClose) {
        return;
    }

    elem.classList.remove('active__menu-burger');
}

function scrollUp(e) {
    const scrollBtn = e.target.closest('.scrollUp');

    if (!scrollBtn) {
        return
    }

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
}

function activePlus(e) {
    const vacancyList = e.target.closest('.vacancy__list');

    if (!vacancyList) {
        return;
    }

    if (vacancyList) {
        const vacancyPlus = vacancyList.querySelector('.vacancy__plus'),
            vacancyItem = vacancyList.querySelector('.vacancy__item');
        vacancyPlus.classList.toggle('vacancy__plus-active');
        vacancyItem.classList.toggle('vacancy__item-active');
    }

}

window.addEventListener("resize", () => {

    screenWidthDetection()

});

function screenWidthDetection() {
    const menuBurgerInner = document.querySelector('.menu-burger__inner');
    if (window.matchMedia("(min-width: 1355px)").matches) {
        menuBurgerInner.classList.remove('active__menu-burger');
    }
}
