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
                personal: document.querySelector('#personal'),
            };

            this.activeDepartment = undefined;
        };

        _showContentOverlay = () => {
            this.contentItems.overlay.classList.remove('hidden');
        };

        _hideSidebarOverlay = () => {
            this.sidebarElements.overlay.classList.add('hidden');
            this.sidebarElements.sidebar.classList.remove('agile');
        };

        _hideContentOverlay = () => {
            setTimeout(() => {
                this.contentItems.overlay.classList.add('hidden');
            }, 0);
        };

        _getSidebarItemHTML = department => {
            return `<div class="sidebar__item deplink" id="${department.memo}" data-memo="${department.memo}" data-id="${department.id}">
                <span class="deplink__number">${department.number}</span>
                <div class="deplink__shortname" title="${department.name}">${department.short_name} (${department.staffCount})</div>
            </div>`;
        }

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

        _getGroupHTML = (group = {id:'', name:''}) => {
            const groupHTMLId = `group${group.id}`;
            return `<h3 class="metadata__subtitle" id="${groupHTMLId}">${group.name}</h3>
                       <div class="personal__staffbox" id="staff_${groupHTMLId}">
                        
                       </div>`;
        }
        
        _getGroupLinkHTML = group => {
            return `<a href="#group${group.id}" class="metadata__link">${group.name}</a>`;
        }

        getSidebarDepartmentsList = () => {
            let depList = [];
            for (const depMemo in this.staff) {
                const dep = this.staff[depMemo];

                depList = [
                    ...depList,
                    {
                        id:         dep.id,
                        memo:       dep.memo,
                        name:       dep.name,
                        short_name: dep.short_name,
                        number:     dep.number,
                        staffCount: Object.keys( dep.staff ).length,
                    },
                ];
            };
            return depList;
        };

        _clearContent = () => {
            this.contentItems.depName.innerHTML = '';
            this.contentItems.depShortname.innerHTML = '';
            this.contentItems.depNumber.innerHTML = '';
            this.contentItems.depQuantity.innerHTML = '';
            this.contentItems.depWorktime.innerHTML = '';
            this.contentItems.depDinnertime.innerHTML = '';

            while (this.contentItems.groupsList.firstChild) {
                this.contentItems.groupsList.removeChild(this.contentItems.groupsList.firstChild);
            };
            this.contentItems.groupsList.classList.remove('hidden');

            while (this.contentItems.personal.firstChild) {
                this.contentItems.personal.removeChild(this.contentItems.personal.firstChild);
            };
        }

        _innerDataToContent = department => {
            this.contentItems.depName.innerHTML = department.name;
            this.contentItems.depShortname.innerHTML = department.short_name;
            this.contentItems.depNumber.innerHTML = department.number;
            this.contentItems.depQuantity.innerHTML = Object.keys(department.staff).length;
            this.contentItems.depWorktime.innerHTML = department.work_time;
            this.contentItems.depDinnertime.innerHTML = department.dinner_time;

            const depStaff = department.staff;
            const groups = department.groups;
            try {
                if (groups.length === 0) {
                    this.contentItems.groupsList.classList.add('hidden');

                    const wrap = this._getGroupHTML({id: 0, name: ''});
                    this.contentItems.personal.insertAdjacentHTML('beforeend', wrap);
                    for (let personMemo in depStaff) {
                        document.querySelector('#staff_group0').insertAdjacentHTML('beforeend', this._getPersonHTML(depStaff[personMemo]));
                    };
                } else {
                    const groups = [
                        { id: '1', name: 'Руководство подразделения', },
                        ...department.groups,
                        { id: '0', name: 'Без группы', }
                    ];

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
            } 
            catch (error) {
                alert('Не удалось загрузить список сотрудников!');
                console.error(error);
            };
            return 0;
        }

        sidebarInit = () => {
            const departmentList = this.getSidebarDepartmentsList();
            new Promise( (resolve, reject) => {
                if (!departmentList || departmentList === undefined || departmentList.length === 0) reject('Не удалось сформировать список подразделений, возникла ошибка!');
                const departmentHTMLList = departmentList.map( item => {
                    return '';
                });
                if (!departmentHTMLList || departmentHTMLList === undefined || departmentHTMLList.length === 0) reject('Не удалось сформировать список подразделений, возникла ошибка!');

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
            })
            .catch( error => {
                alert(error);
                console.error(error);
            });
        }

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
            })
            .catch( error => {
                console.log(error);
                alert(error);
            })
            .finally( () => {
                this.sidebarElements.sidebar.dataset.lock = '';
                this.sidebarElements.overlay.classList.add('hidden');
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