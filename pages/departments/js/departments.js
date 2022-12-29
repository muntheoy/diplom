window.addEventListener('load', function () {
    class Departments {
        constructor(staff) {
            this.staff = staff;

            this.sidebarElements = {
                sidebar: document.querySelector('.sidebar'),
                overlay: document.querySelector('.sidebar .overlay'),
                departmentsList: document.querySelector('#departments_list'),
            };

            this.contentItems = {
                content: document.querySelector('.content'),
                overlay: document.querySelector('.content .overlay'),
                depName: document.querySelector('#dep_name'),
                depShortname: document.querySelector('#dep_shortname'),
                depNumber: document.querySelector('#dep_number'),
                depQuantity: document.querySelector('#dep_quantity'),
                depWorktime: document.querySelector('#dep_worktime'),
                depDinnertime: document.querySelector('#dep_dinnertime'),
                groupsList: document.querySelector('#groups_list'),
                searchInput: document.querySelector('#search_input'),
                searchBtn: document.querySelector('#search_btn'),
                clearBtn: document.querySelector('#clear_btn'),
                searchMessage: document.querySelector('#search_message'),
                noresult: document.querySelector('#noresult'),
                personal: document.querySelector('#personal'),
            };

            this.activeDepartment = undefined;
        };

        // Сокрытие оверлея блока с контентом (элементов визализации загрузки)
       /* _showContentOverlay = () => {
            this.contentItems.overlay.classList.remove('hidden');
            this.contentItems.content.classList.add('agile');
        };*/

        // Сокрытие оверлея блока с контентом (элементов визализации загрузки)
        _showContentOverlay = () => {
            this.contentItems.overlay.classList.remove('hidden');
            //this.contentItems.content.classList.add('agile');
        };

        // Сокрытие оверлея сайдбара (элементов визализации загрузки)
        _hideSidebarOverlay = () => {
            this.sidebarElements.overlay.classList.add('hidden');
            this.sidebarElements.sidebar.classList.remove('agile');
        };

        // Сокрытие оверлея сайдбара (элементов визализации загрузки)
        _hideContentOverlay = () => {
            setTimeout(() => {
                this.contentItems.overlay.classList.add('hidden');
            }, 0);
            //this.contentItems.content.classList.remove('agile');
        };

        // Возвращает HTML элемента списка подразделений
        _getSidebarItemHTML = department => {
            return `<div class="sidebar__item deplink" id="${department.memo}" data-memo="${department.memo}" data-id="${department.id}">
                <span class="deplink__number">${department.number}</span>
                <div class="deplink__shortname" title="${department.name}">${department.short_name} (${department.staffCount})</div>
            </div>`;
        }

        // Возвращает HTML карточки сотрудника
        _getPersonHTML = person => {
            if (!person) return '';
            let photoLink = '../../'+person.photo_link;
            if (person.photo_link === '' || !person.photo_link) {
                switch(person.sex) {
                    case 'nosex': photoLink = '../../assets/img/Staff/tech-build.jpg'; break;
                    case 'woman': photoLink = '../../assets/img/Staff/woman.jpg'; break;
                    case 'man': 
                    default: photoLink = '../../assets/img/Staff/man.jpg'; break;
                }
            };
            let showBigPhotoBlock = `<div class="card__view-photo">
                                        <i class="fa fa-search-plus"></i>
                                    </div>`;
            return `<div class="card" id="${person.memo}" data-memo="${person.memo}" data-id="${person.id}">
                <div class="card__personal-info">
                    <a href="${photoLink}" target="_blank">
                        <div class="card__photo-box">
                            <img src="${photoLink}" alt="Фото сотрудника" class="card__photo">
                            ${(person.photo_link !== '' && person.photo_link)? showBigPhotoBlock: ''}
                        </div>
                    </a>
                    <div class="card__main-info">
                        <h4 class="card__fullname">${person.surname}<br>${person.name} ${person.patronymic}</h4>
                        <p class="card__position">${person.position}</p>
                    </div>
                </div>
                <div class="card__contacts">
                    <table class="card__table">
                        <tr>
                            <td class="card__table-items card__table-headers">Телефон:</td>
                            <td class="card__table-items">${person.work_phone}</td>
                        </tr>
                        <tr>
                            <td class="card__table-items card__table-headers">Городской:</td>
                            <td class="card__table-items">${person.town_phone}</td>
                        </tr>
                        <tr>
                            <td class="card__table-items card__table-headers">Сотовый:</td>
                            <td class="card__table-items">${person.mobile_phone}</td>
                        </tr>
                        <tr>
                            <td class="card__table-items card__table-headers">E-mail:</td>
                            <td class="card__table-items">
                                <a href="mailto:${person.email}">${person.email}</a>
                            </td>
                        </tr>
                        <tr>
                            <td class="card__table-items card__table-headers">Местоположение:</td>
                            <td class="card__table-items">${person.location}</td>
                        </tr>
                    </table>
                </div>
            </div>`;
        }

        // Возвращает HTML группц с подзаголовком
        _getGroupHTML = (group = {id:'', name:''}) => {
            const groupHTMLId = `group${group.id}`;
            return `<h3 class="metadata__subtitle" id="${groupHTMLId}">${group.name}</h3>
                       <div class="personal__staffbox" id="staff_${groupHTMLId}">
                        
                       </div>`;
        }
        
        _getGroupLinkHTML = group => {
            return `<a href="#group${group.id}" class="links-block__link">${group.name}</a>`;
        }

        // Возвращает массив подразделений с данными, достаточными для добавления в сайдбар
        getSidebarDepartmentsList = () => {
            let depList = [];
            for (const depMemo in this.staff) {
                const dep = this.staff[depMemo];

                depList.push({
                    id:         dep.id,
                    memo:       dep.memo,
                    name:       dep.name,
                    short_name: dep.short_name,
                    number:     dep.number,
                    staffCount: Object.keys( dep.staff ).length,
                });
            };
            
            return depList;
        };

        // Очистка контента
        _clearContent = () => {
            this.contentItems.depName.innerHTML = '';
            this.contentItems.depShortname.innerHTML = '';
            this.contentItems.depNumber.innerHTML = '';
            this.contentItems.depQuantity.innerHTML = '';
            this.contentItems.depWorktime.innerHTML = '';
            this.contentItems.depDinnertime.innerHTML = '';

            this.contentItems.searchInput.value = '';
            this.contentItems.searchInput.dataset.dep = '';

            this.contentItems.noresult.classList.add('hidden');
            this.contentItems.personal.classList.remove('hidden');
            this.contentItems.searchMessage.innerHTML = '';

            while (this.contentItems.groupsList.firstChild) {
                this.contentItems.groupsList.removeChild(this.contentItems.groupsList.firstChild);
            };
            this.contentItems.groupsList.parentElement.classList.remove('hidden');

            while (this.contentItems.personal.firstChild) {
                this.contentItems.personal.removeChild(this.contentItems.personal.firstChild);
            };
        }

        //Добавление данных в разметку
        _innerDataToContent = department => {
            this.contentItems.depName.innerHTML = department.name;
            this.contentItems.depShortname.innerHTML = department.short_name;
            this.contentItems.depNumber.innerHTML = department.number;
            this.contentItems.depQuantity.innerHTML = Object.keys(department.staff).length;
            this.contentItems.depWorktime.innerHTML = department.work_time;
            this.contentItems.depDinnertime.innerHTML = department.dinner_time;

            const depStaff = department.staff;
            // Ссылки групп
            const groups = department.groups;
            try {
                if (groups.length === 0) {
                    this.contentItems.groupsList.parentElement.classList.add('hidden');

                    const wrap = this._getGroupHTML({id: 0, name: ''});
                    this.contentItems.personal.insertAdjacentHTML('beforeend', wrap);
                    for (let personMemo in depStaff) {
                        document.querySelector('#staff_group0').insertAdjacentHTML('beforeend', this._getPersonHTML(depStaff[personMemo]));
                    };
                } else {
                    let groups = [{ id: '1', name: 'Руководство подразделения', }];
                    groups = groups.concat(department.groups, [{ id: '0', name: 'Без группы', }]);

                    for (let i = 0, l = groups.length; i < l; i++) {
                        let groupPersonal = [];
                        for (let personMemo in depStaff) {
                            const person = depStaff[personMemo];
                            if (person.group === groups[i].id) groupPersonal.push(person);
                        };

                        if (groupPersonal.length <= 0) continue;

                        new Promise( (resolve, reject) => {
                            this.contentItems.groupsList.insertAdjacentHTML('beforeend', this._getGroupLinkHTML(groups[i]));
                            this.contentItems.personal.insertAdjacentHTML('beforeend', this._getGroupHTML(groups[i]));
                            resolve();
                        })
                        .then( () => {
                            const wrap = document.querySelector(`#staff_group${groups[i].id}`);

                            for (let person of groupPersonal) {
                                wrap.insertAdjacentHTML('beforeend', this._getPersonHTML(person));
                            };
                        });
                    };
                };
                this.contentItems.searchInput.dataset.dep = department.memo;
            } 
            catch (error) {
                alert('Не удалось загрузить список сотрудников!');
                console.error(error);
            };
            return 0;
        }

        // Инициализация сайдбара со списком подразделений
        sidebarInit = () => {
            const departmentList = this.getSidebarDepartmentsList();
            new Promise( (resolve, reject) => {
                if (!departmentList || departmentList === undefined || departmentList.length === 0) reject('Не удалось сформировать список подразделений, возникла ошибка!');
                const departmentHTMLList = departmentList.map( item => {
                    return '';
                });
                if (!departmentHTMLList || departmentHTMLList === undefined || departmentHTMLList.length === 0) reject('Не удалось сформировать список подразделений, возникла ошибка!');
                
                //const departmentsHTML = departmentList.map( item => {
                //    return this._getSidebarItemHTML(item);
                //});
                //if (!departmentsHTML || departmentsHTML.length === 0) reject('Не удалось сформировать список подразделений, возникла ошибка!');

                for (let i = 0, l = departmentList.length; i < l; i++) {
                    const depHTML = this._getSidebarItemHTML(departmentList[i]);
                    this.sidebarElements.departmentsList.insertAdjacentHTML('beforeend', depHTML);
                };

                this.sidebarElements.sidebar.addEventListener('click', this.clickDepartmentHandler);
                resolve();
            })
            .then( () => {
                this._hideSidebarOverlay();
                this.sidebarElements.departmentsList.firstElementChild.dispatchEvent( new Event('click', {bubbles: true}) );
                try {
                    this.contentItems.searchBtn.addEventListener('click', this.searchHandler);
                    this.contentItems.searchInput.addEventListener('submit', this.searchHandler);
                    this.contentItems.searchInput.addEventListener('keydown', event => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            this.searchHandler();
                        } else if (event.key === 'Escape') {
                            this.resetDepSearch();
                        } else {
                            const input = event.target;
                            if ( input.value === '') {
                                this.resetDepSearch(event);
                            } else if (input.value !== '' && input.dataset.query === '0') {
                                this.contentItems.searchInput.dataset.query = '0';
                                this.contentItems.clearBtn.classList.remove('hidden');
                            };
                        }
                    });
                    this.contentItems.clearBtn.addEventListener('click', this.resetDepSearch);
                } catch(error) { 
                    this.contentItems.searchMessage.innerHTML = 'Возникла непредвиденная ошибка!';
                    console.error(error);
                };
            })
            .catch( error => {
                alert(error);
                console.error(error);
            });
        }

        // Обработчик нажатия на наименование отдела в сайдбаре
        clickDepartmentHandler = event => {
            event.preventDefault();
            if (this.sidebarElements.sidebar.dataset.lock === 'true') return;

            this._showContentOverlay();
            this.sidebarElements.overlay.classList.remove('hidden');
            this.sidebarElements.sidebar.dataset.lock = 'true';

            new Promise( (resolve, reject) => {
                const targetEvent = event.target.closest('.deplink');
                if (!targetEvent) {
                    resolve();
                    return;
                };

                if (targetEvent === this.activeDepartment) {
                    resolve();
                    return;
                }

                if (this.activeDepartment) {
                    this.activeDepartment.classList.remove('deplink_active');
                };
                this.activeDepartment = targetEvent;
                this.activeDepartment.classList.add('deplink_active');

                this._clearContent();

                const departmentMemo = targetEvent.dataset.memo;

                if (!departmentMemo || departmentMemo === '') reject('Не удалось получить идентификатор подразделения. Обратитесь к администратору.');

                const department = this.staff[departmentMemo];
                if (!department || typeof department !== 'object') reject('Не удалось получить данные подразделения. Обратитесь к администратору.');
                
                if (this._innerDataToContent(department) !== 0) reject('При загрузке данных возникла непредвиденная ошибка. Обратитесь к администратору.');
                resolve();
            })
            .then( () => {
                this._hideContentOverlay();
                this.sidebarElements.sidebar.dataset.lock = '';
                this.sidebarElements.overlay.classList.add('hidden');
            })
            .catch( error => {
                console.log(error);
                alert(error);
                this.sidebarElements.sidebar.dataset.lock = '';
                this.sidebarElements.overlay.classList.add('hidden');
            });  
        }

        // Поиск
        search = (query, depMemo = null) => {
            let result = {};

            if (!depMemo || depMemo === null) return result;
        
            query = query.replace('\\', '');
            query = query.replace('/', '');
        
            const personal = this.staff[depMemo].staff;
            if (!personal || personal.lenght === 0) return result;

            for (let personMemo in personal) {
                let person = personal[personMemo],
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
        
                    `${person.work_phone} `,
                    `${person.work_phone.replace('-', ' ')} `,
                    `${person.work_phone.replace('-', '')} `,
        
                    `${person.location} `,
                    `${person.location.replace('№', '')} `,
        
                    `${personMemo}`
                ];
        
                for (let i = 0; i < stringForChecking.length; i++) {
                    if ( !compare.test(stringForChecking[i]) ) continue;

                    const group = 'group'+person.group;
                    if (!result[group] || result[group] === undefined) result[group] = [];
                    result[group].push(person.memo);
                    break;
                };
                            
            };
            return result;
        }

        // Поиск
        searchHandler = event => {
            if (this.contentItems.searchInput.dataset.lock === 'true') return;
            new Promise( (resolve, reject) => {
                // Сброс карточек и заголовков
                const subtitleList = document.querySelectorAll('.metadata__subtitle');
                const staffboxList = document.querySelectorAll('.personal__staffbox');
                const cardsList = document.querySelectorAll('.card');

                for (let i = 0, l = subtitleList.length; i < l; i++) {
                    subtitleList[i].classList.remove('hidden');
                };

                for (let i = 0, l = staffboxList.length; i < l; i++) {
                    staffboxList[i].classList.remove('hidden');
                };

                for (let i = 0, l = cardsList.length; i < l; i++) {
                    cardsList[i].classList.remove('hidden');
                };

                // Поиск
                const query = this.contentItems.searchInput.value;

                if (!query || query === '') reject('Задан пустой запрос');
                if (query.length < 3) reject('Введите более двух символов');

                const depMemo = this.contentItems.searchInput.dataset.dep;
                const result = this.search(query, depMemo);

                if (!result || result === undefined) reject('В процессе поиска возникла ошибка'); 

                resolve(result);
            })
            .then( response => {
                if (Object.keys(response).length <= 0) {
                    this.contentItems.noresult.classList.remove('hidden');
                    this.contentItems.personal.classList.add('hidden');
                } else {
                    const subtitleList = document.querySelectorAll('.metadata__subtitle');

                    if (subtitleList.length === 1) {
                        const cardList = document.querySelectorAll('.card');
                        for (let i = 0, l = cardList.length; i < l; i++) {
                            const compareCard = response[ Object.keys(response)[0] ]?.filter( item => {
                                return item === cardList[i].dataset.memo;
                            });

                            if (compareCard.length <= 0) cardList[i].classList.add('hidden');
                        };
                    } else {
                        for (let i = 0, l = subtitleList.length; i < l; i++) {
                            const group = subtitleList[i].id;
                            const groupElement = document.querySelector('#staff_'+group);

                            if (Object.keys(response).includes(group) ) {
                                const cardList = groupElement.querySelectorAll('.card');
                                for (let i = 0, l = cardList.length; i < l; i++) {
                                    const compareCard = response[group].filter( item => {
                                        return item === cardList[i].dataset.memo;
                                    });

                                    if (compareCard.length <= 0) cardList[i].classList.add('hidden');
                                };
                                continue;
                            };

                            subtitleList[i].classList.add('hidden');                        
                            groupElement.classList.add('hidden');
                        };
                    };

                    
                };
            })
            .catch( error => {
                if (typeof error === 'string') {
                    this.contentItems.searchMessage.innerHTML = error;
                } else {
                    this.resetDepSearch();
                    this.contentItems.searchMessage.innerHTML = 'В процессе поиска возникла критическая ошибка!';
                    console.error(error);
                };
            });
        }
        
        resetDepSearch = event => {
            this.contentItems.searchInput.dataset.lock = 'true';
            new Promise( (resolve, reject) => {
                this.contentItems.searchInput.value = '';

                this.contentItems.noresult.classList.add('hidden');
                this.contentItems.personal.classList.remove('hidden');

                const subtitleList = document.querySelectorAll('.metadata__subtitle');
                const staffboxList = document.querySelectorAll('.personal__staffbox');
                const cardsList = document.querySelectorAll('.card');

                for (let i = 0, l = subtitleList.length; i < l; i++) {
                    subtitleList[i].classList.remove('hidden');
                };

                for (let i = 0, l = staffboxList.length; i < l; i++) {
                    staffboxList[i].classList.remove('hidden');
                };

                for (let i = 0, l = cardsList.length; i < l; i++) {
                    cardsList[i].classList.remove('hidden');
                };

                this.contentItems.searchMessage.innerHTML = '';
                resolve();
            })
            .then( () => {
                this.contentItems.searchInput.value = '';
                this.contentItems.searchInput.dataset.query = '0';
                this.contentItems.clearBtn.classList.add('hidden');
                this.contentItems.searchInput.dataset.lock = '';
            })
            .catch(error => {  
                this.contentItems.searchMessage.innerHTML = 'Возникла непредвиденная ошибка!';
                console.error(error); 
            });
        }
    };

    try {
        const DepartmentsObj = new Departments(State); 
        DepartmentsObj.sidebarInit();
    }
    catch (error) {
        alert('Возникла непредвиденная ошибка! Невозможно загрузить справочник. Не перезагружайте страницу и обратитесь к администратору по телефону 06-66 (э) или напишите на почту KuznetsovGS@ckba.local.');
        console.error(error);
    };

});