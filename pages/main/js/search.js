window.addEventListener('load', function() {
    class Search {
        constructor (staff) {
            this.inputElements = {
                input:   document.querySelector('#search_input'),
                overlay: document.querySelector('.search-wrap .overlay'),
                button:  document.querySelector('#search_btn'),
                searchMessage:  document.querySelector('#search_message'),
            };
            this.cardElements = {
                card:        document.querySelector('.card'),
                overlay:     document.querySelector('.card .overlay'),
                photoLink:   document.querySelector('#photo_link'),
                photo:       document.querySelector('#photo'),
                fullname:    document.querySelector('#fullname'),
                position:    document.querySelector('#position'),
                department:  document.querySelector('#department'),
                group:       document.querySelector('#group'),
                workPhone:   document.querySelector('#work_phone'),
                townPhone:   document.querySelector('#town_phone'),
                mobilePhone: document.querySelector('#mobile_phone'),
                location:    document.querySelector('#location'),
                workTime:    document.querySelector('#work_time'),
                dinnerTime:  document.querySelector('#dinner_time'),
                keywords:    document.querySelector('#keywords'),
                updateTime:  document.querySelector('#update_time'),
                email:       document.querySelector('#email'),
            };
            this.resultElements = {
                resultOutElement:    document.querySelector('#result_out'),
                noResultElement:     document.querySelector('#no_result'),
                startMessageElement: document.querySelector('#start_message'),
                showMore:            document.querySelector('#show_more'),
                showMoreBtn:         document.querySelector('#show_more_btn'),
                overlay:             document.querySelector('.result-wrap .overlay'),
                counter:             document.querySelector('#result_counter'),
                showedCounter:       document.querySelector('#showed_result'),
            };
            this.resultList = undefined;
            this.pageWidth = 25;
            this.lastShowed = 0;
            this.staff = State;

            this.inputElements.button
        }

        reset = () => {
            return new Promise( (resolve, reject) => {
                this.startLoad();
                this.clearInput();
                this.clearCard();
                this.clearResultList();
                resolve();
            })
            .then( () => {
                this.endLoad();
            })

        }

        // Очистка карточки
        clearInput = () => {
            this.inputElements.input.value = '';
            this.inputElements.searchMessage.innerHTML = '';
        }

        // Очистка карточки
        clearCard = () => {
            this.cardElements.email.innerHTML = '';
            this.cardElements.email.href = '';

            this.cardElements.photoLink.href = '../../assets/img/Staff/man.jpg';
            this.cardElements.photo.src = '../../assets/img/Staff/man.jpg'; 
            this.cardElements.fullname.innerHTML = '';
            this.cardElements.position.innerHTML = '';
            this.cardElements.department.innerHTML = '';
            this.cardElements.group.innerHTML = '';
            this.cardElements.workPhone.innerHTML = '';
            this.cardElements.townPhone.innerHTML = '';
            this.cardElements.mobilePhone.innerHTML = '';
            this.cardElements.location.innerHTML = '';
            this.cardElements.workTime.innerHTML = '';
            this.cardElements.dinnerTime.innerHTML = '';
            this.cardElements.updateTime.innerHTML = '';
            this.cardElements.keywords.innerHTML = '';
        }

        // Загрузка данных в карточку
        _innerDataToCard = (person, department) => {
            if (!person || !department) return 1;
            let photoLink = '../../'+person.photo_link;
            if (person.photo_link === '' || !person.photo_link) {
                switch(person.sex) {
                    case 'nosex': photoLink = '../../assets/img/Staff/tech-build.jpg'; break;
                    case 'woman': photoLink = '../../assets/img/Staff/woman.jpg'; break;
                    case 'man': 
                    default: photoLink = '../../assets/img/Staff/man.jpg'; break;
                }
            };

            let group = {
                id: '0', 
                name: 'Без группы', 
                boss_memo: '',
            };

            switch (person.group) {
                case '1': group = {id: '1', name: '', boss_memo: ''};
                    break;
                case '0': break;
                default: group = department.groups.filter( (item) => {
                    return item.id === person.group;
                })[0];
            };

            if (!group || typeof group !== 'object') return 1;

            let updateTime = '';
            if (person.update_time && typeof person.update_time === 'string' && person.update_time !== '') {
                const timestamp = Date.parse(person.update_time);
                const date = new Date(timestamp);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const hour = date.getHours();
                const minutes = date.getMinutes();
                updateTime = `${(day<10)? '0'+day :day}.${(month<10)? '0'+month :month}.${year} ${(hour<10)? '0'+hour: hour}:${(minutes<10)? '0'+minutes: minutes}`;
            };

            this.cardElements.email.innerHTML = person.email;
            this.cardElements.email.href = 'mailto:' + person.email;

            this.cardElements.photoLink.href = photoLink;
            this.cardElements.photo.src = photoLink;

            this.cardElements.fullname.innerHTML = `${person.surname}<br>${person.name} ${person.patronymic}`;
            this.cardElements.position.innerHTML = person.position;
            this.cardElements.department.innerHTML = department.name;
            this.cardElements.group.innerHTML = group.name;
            this.cardElements.workPhone.innerHTML = person.work_phone;
            this.cardElements.townPhone.innerHTML = person.town_phone;
            this.cardElements.mobilePhone.innerHTML = person.mobile_phone;
            this.cardElements.location.innerHTML = person.location;
            this.cardElements.workTime.innerHTML = department.work_time;
            this.cardElements.dinnerTime.innerHTML = department.dinner_time;
            this.cardElements.updateTime.innerHTML = updateTime;
            this.cardElements.keywords.innerHTML = person.key_words;
            return 0;
        }

        // Очистка результатов поиска
        clearResultList = () => {
            while (this.resultElements.resultOutElement.firstChild) {
                this.resultElements.resultOutElement.removeChild(this.resultElements.resultOutElement.firstChild);
            };
            this.resultElements.startMessageElement.classList.remove('hidden');
            this.resultElements.noResultElement.classList.add('hidden');
            this.resultElements.resultOutElement.classList.add('hidden');
            this.resultElements.showMore.classList.add('hidden');
            //this.resultList = [];
            this.lastShowed = 0;
            this.updateCounter(0, 0);
        };

        // Начало загрузки (поиска)
        startLoad = () => {
            this.inputElements.overlay.classList.remove('hidden');
            this.cardElements.overlay.classList.remove('hidden');
            this.resultElements.overlay.classList.remove('hidden');
        };

        // Конец загрузки (поиска)
        endLoad = () => {
            this.inputElements.overlay.classList.add('hidden');
            this.cardElements.overlay.classList.add('hidden');
            this.resultElements.overlay.classList.add('hidden');
        };

        // Обновление счетчика найденных и показанных результатов
        updateCounter = (quantity, showed) => {
            this.showedCount = quantity;
            this.resultElements.counter.innerHTML = quantity;
            this.resultElements.showedCounter.innerHTML = showed;
        } 

        // Возвращает разметку одного результата поиска
        _getResultHTML = (person) => {
            let photoLink = '../../'+person.photo_link;
            if (person.photo_link === '' || !person.photo_link) {
                switch(person.sex) {
                    case 'nosex': photoLink = '../../assets/img/Staff/tech-build.jpg'; break;
                    case 'woman': photoLink = '../../assets/img/Staff/woman.jpg'; break;
                    case 'man': 
                    default: photoLink = '../../assets/img/Staff/man.jpg'; break;
                }
            };
            return `<div class="result__person person" id="${person.memo}"data-memo="${person.memo}" data-id="${person.id}" data-depmemo="${person.depMemo}" data-depid="${person.depId}">
                <div class="person__photo-block">
                    <a href="${photoLink}" target="_blank">
                        <img class="person__photo" src="${photoLink}" alt="Фото сотрудника">
                    </a>
                </div>
                <div class="person__info-block">
                    <h4 class="person__name">${person.surname} ${person.name} ${person.patronymic}</h4>
                    <span class="person__position">${person.position}</span>
                </div>
                <div class="person__contacts-block">
                    <p class="person__department">(${person.depNumber}) ${person.depShortName}</p>
                    <p class="person__phone">${person.work_phone}</p>
                    <p class="person__email"><a href="mailto:${person.email}">${person.email}</a></p>
                </div>
            </div>`;
        }

        // Возвращает результаты поиска
        _getSearchResult = query => {
            let result = [];

            query = query.replace('\\', '');
            query = query.replace('/', '');

            for (let departmentMemo in this.staff) {
                const department = this.staff[departmentMemo];
                const departmentPersonal = this.staff[departmentMemo].staff;
                for (let personMemo in departmentPersonal) {
                    let person = departmentPersonal[personMemo],
                        compare = new RegExp(query, 'i');
                    
                    let stringForChecking = [
                        `${person.name.replace('ё', 'е')} ${person.patronymic.replace('ё', 'е')} ${person.surname.replace('ё', 'е')} `,
                        `${person.name} ${person.patronymic.replace('ё', 'е')} ${person.surname.replace('ё', 'е')} `,
                        `${person.name.replace('ё', 'е')} ${person.patronymic} ${person.surname.replace('ё', 'е')} `,
                        `${person.name.replace('ё', 'е')} ${person.patronymic.replace('ё', 'е')} ${person.surname} `,

                        `${person.name} ${person.patronymic} ${person.surname} `,
                        `${person.name.replace('ё', 'е')} ${person.surname} `,
                        `${person.name} ${person.surname.replace('ё', 'е')} `,
                        `${person.name.replace('ё', 'е')} ${person.surname.replace('ё', 'е')} `,
                        `${person.name} ${person.surname} `,

                        `${person.surname.replace('ё', 'е')} ${person.name} `,
                        `${person.surname} ${person.name.replace('ё', 'е')} `,
                        `${person.surname.replace('ё', 'е')} ${person.name.replace('ё', 'е')} `,
                        `${person.surname} ${person.name} `,

                        `${department.name} `,
                        `${department.short_name} `,
                        `${department.memo} `,

                        `${person.key_words} `,

                        `${person.work_phone} `,
                        `${person.work_phone.replace('-', ' ')} `,
                        `${person.work_phone.replace('-', '')} `,

                        `${person.group.replace('№', '')} `,
                        `${person.position.replace('ё', 'е')} `,

                        `${person.location} `,
                        `${person.location.replace('№', '')} `,

                        `${personMemo}`
                    ];

                    for (let i = 0; i < stringForChecking.length; i++) {
                        if ( !compare.test(stringForChecking[i]) ) continue;
                        result.push(
                            Object.assign(
                                person, 
                                {
                                    depShortName: department.short_name,
                                    depMemo: department.memo,
                                    depId: department.id,
                                    depNumber: department.number,
                                }
                            )
                        );
                        break;
                    };
                    
                };
            };
            this.resultList = result;

            return 0;
        }

        // Вывод результатов поиска в блок
        showResult = () => {
            const startShowingIndex = this.lastShowed;
            let endShowingIndex = startShowingIndex + this.pageWidth;
            let showList = [];

            this.resultElements.showMore.classList.add('hidden');
            let endResultLisctCheck = false;
            
            for (let i = startShowingIndex; i < endShowingIndex; i++) {
                if (!this.resultList[i]) {
                    endShowingIndex = i;
                    endResultLisctCheck = true;
                    break;
                };

                showList.push(this.resultList[i])
            };

            this.lastShowed = endShowingIndex;
            for (let i = 0, l = showList.length; i < l; i++) {
                const personHTML = this._getResultHTML(showList[i]);
                this.resultElements.resultOutElement.insertAdjacentHTML('beforeend', personHTML);
            };
            this.updateCounter(this.resultList.length, endShowingIndex);
            
            setTimeout( () => {
                if (!endResultLisctCheck) this.resultElements.showMore.classList.remove('hidden');
            }, 0);

            this.resultElements.resultOutElement.addEventListener('click', this.showPersonDataHandler);
        }

        // Функция поиска
        search = (e) => {
            e.preventDefault();
            if (this.inputElements.button.dataset.lock === 'true') return;
            this.inputElements.input.dataset.lock = 'true';
            this.resultElements.overlay.classList.remove('hidden');
            this.inputElements.button.classList.add('btn_lightGrey');

            new Promise( (resolve, reject) => {
                if(!this.inputElements.input) reject('Невозможно считать поисковой запрос! Перезагрузите страницу.');

                const query = this.inputElements.input.value;
                if (!query || query.length === 0) reject('Задан пустой поисковой запрос!');
                if (query.length < 3) reject('Введите более 2-х символов.');

                if (!this.staff) reject('Данные недоступны! Сообщите о проблеме администратору.');

                this._getSearchResult(query);
                if (this.resultList !== undefined) {
                    resolve();
                } else {
                    reject('Возникла непредвиденная ошибка! Обратитесь к администратору.');
                };
            })
            .then( () => {
                this.clearResultList();
                this.clearCard();
                this.inputElements.searchMessage.innerHTML = '';
                this.showResult();

                this.resultElements.startMessageElement.classList.add('hidden');

                if (this.resultList.length === 0) {
                    this.resultElements.resultOutElement.classList.add('hidden');
                    this.resultElements.noResultElement.classList.remove('hidden');
                } else {
                    this.resultElements.resultOutElement.classList.remove('hidden');
                    this.resultElements.noResultElement.classList.add('hidden');
                    if (this.resultList.length > this.pageWidth) this.resultElements.showMore.classList.remove('hidden');
                    this.resultElements.resultOutElement.firstElementChild.dispatchEvent(new Event('click',  {bubbles: true}));
                };
                
                this.inputElements.input.dataset.lock = '';
                this.resultElements.overlay.classList.add('hidden');
                this.inputElements.button.classList.remove('btn_lightGrey');
            })
            .catch( error => {
                console.error(error);
                this.clearResultList();
                this.clearCard();
                this.inputElements.searchMessage.innerHTML = error;
                this.inputElements.input.dataset.lock = '';
                this.resultElements.overlay.classList.add('hidden');
                this.inputElements.button.classList.remove('btn_lightGrey');
            });
        }

        // Обработчик нажатия на любой из результатов поиска
        showPersonDataHandler = event => {
            if (event.target.tagName === 'A') return;
            
            event.preventDefault();
            if (this.cardElements.card.dataset.lock === 'true') return;

            this.cardElements.overlay.classList.remove('hidden');
            this.cardElements.card.dataset.lock = 'true';

            new Promise( (resolve, reject) => {
                const targetEvent = event.target.closest('.person');
                if (!targetEvent) {
                    resolve();
                    return;
                };

                this.clearCard();
                
                const personMemo = targetEvent.dataset.memo;
                const departmentMemo = targetEvent.dataset.depmemo;

                if (!personMemo || personMemo === '') reject('Не удалось получить идентификатор сотрудника. Обратитесь к администратору.');
                if (!departmentMemo || departmentMemo === '') reject('Не удалось получить идентификатор подразделения. Обратитесь к администратору.');

                const department = this.staff[departmentMemo];
                if (!department || typeof department !== 'object') reject('Не удалось получить данные подразделения. Обратитесь к администратору.');
                const person = department.staff[personMemo];
                if (!person || typeof person !== 'object') reject('Не удалось получить данные сотрудника. Обратитесь к администратору.');
                
                let cuer_dep = Object.assign({}, department);
                cuer_dep.staff = {};

                if (this._innerDataToCard(person, cuer_dep) !== 0) reject('При загрузке данных возникла непредвиденная ошибка. Обратитесь к администратору.');
                resolve();
            })
            .catch( error => {
                console.log(error);
                alert(error);
                //this.inputElements.searchMessage.innerHTML = error;
                
                this.cardElements.card.dataset.lock = '';
                this.cardElements.overlay.classList.add('hidden');
            })
            .then( () => {
                this.cardElements.card.dataset.lock = '';
                this.cardElements.overlay.classList.add('hidden');
            });  
        }
    };


    try {
        const SearchElement = new Search(State);
        SearchElement.endLoad();

        // Обработчик для кнопки посика
        SearchElement.inputElements.button.addEventListener('click', SearchElement.search);

        // Обработчик для кнопки "Зазгрузить еще"
        SearchElement.resultElements.showMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (SearchElement.resultElements.showMoreBtn.dataset.lock === 'true') return;
            new Promise( (resolve, reject) => {
                SearchElement.resultElements.showMoreBtn.dataset.lock = 'true';
                SearchElement.resultElements.showMoreBtn.classList.add('btn_lightGrey');

                SearchElement.showResult();
                resolve();
            })
            .then( () => {
                SearchElement.resultElements.showMoreBtn.dataset.lock = '';
                SearchElement.resultElements.showMoreBtn.classList.remove('btn_lightGrey');
            })
            .catch( error => {
                console.log(error);
                alert(error);
                //this.inputElements.searchMessage.innerHTML = error;
            });
        });

        // Фиксация карточки при прокрутке
        const html_element = document.querySelector('html');
        const contentWrap = document.querySelector('main');
        const cardElement = document.querySelector('.card');
        window.addEventListener('scroll', () => {
            if (html_element.scrollTop > contentWrap.offsetTop) {
                const yPosition = html_element.scrollTop + 10;
                cardElement.style = `position: sticky; top: ${yPosition}px;`;
            } else {
                cardElement.style = '';
            };
        });
    }
    catch (error) {
        alert('Возникла непредвиденная ошибка! Невозможно загрузить справочник. Не перезагружайте страницу и обратитесь к администратору по телефону 06-66 (э) или напишите на почту KuznetsovGS@ckba.local.');
        console.error(error);
    };

});