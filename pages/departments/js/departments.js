function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
window.addEventListener('load', function () {
  function createMockState() {
    // MOCK DATA
    const mockData = {
      departments: [{
        id: '1',
        name: 'Leadership',
        short_name: 'Leadership',
        memo: 'leadership',
        number: '0'
      }, {
        id: '2',
        name: 'IT Department',
        short_name: 'IT',
        memo: 'department_it',
        number: '101'
      }, {
        id: '3',
        name: 'HR Department',
        short_name: 'HR',
        memo: 'department_hr',
        number: '102'
      }],
      staff: [{
        id: '101',
        memo: 'ivanovii',
        name: 'Ivanov Ivan Ivanovich',
        position: 'Director',
        department_id: '1',
        phone: '00-01',
        email: 'ivanov@example.com',
        sex: 'man',
        photo_link: ''
      }, {
        id: '102',
        memo: 'petrovps',
        name: 'Petrov Petr Sergeevich',
        position: 'Head of IT',
        department_id: '2',
        phone: '10-01',
        email: 'petrov@example.com',
        sex: 'man',
        photo_link: ''
      }, {
        id: '103',
        memo: 'sidorovaav',
        name: 'Sidorova Anna Viktorovna',
        position: 'Frontend Developer',
        department_id: '2',
        phone: '10-02',
        email: 'sidorova@example.com',
        sex: 'woman',
        photo_link: ''
      }, {
        id: '104',
        memo: 'smirnovad',
        name: 'Smirnova Anna Dmitrievna',
        position: 'Head of HR',
        department_id: '3',
        phone: '20-01',
        email: 'smirnova@example.com',
        sex: 'woman',
        photo_link: ''
      }]
    };
    const departmentsMap = {};
    const state = {};
    for (let i = 0; i < mockData.departments.length; i++) {
      const department = mockData.departments[i];
      departmentsMap[department.id] = department;
      state[department.memo] = {
        id: department.id,
        memo: department.memo,
        name: department.name,
        short_name: department.short_name,
        number: department.number,
        boss_memo: '',
        work_time: '08:00 - 17:00',
        dinner_time: '12:30 - 13:30',
        key_words: '',
        groups: [],
        staff: {},
        archive: {}
      };
    }
    for (let i = 0; i < mockData.staff.length; i++) {
      const person = mockData.staff[i];
      const department = departmentsMap[person.department_id];
      if (!department) continue;
      const departmentState = state[department.memo];
      const nameParts = person.name.trim().split(/\s+/);
      const personMemo = person.memo || `person${person.id}`;
      departmentState.staff[personMemo] = {
        id: person.id,
        memo: personMemo,
        surname: nameParts[0] || '',
        name: nameParts[1] || '',
        patronymic: nameParts.slice(2).join(' '),
        position: person.position,
        photo_link: person.photo_link,
        group: departmentState.boss_memo === '' ? '1' : '0',
        work_phone: person.phone,
        town_phone: '',
        mobile_phone: '',
        email: person.email,
        location: '',
        key_words: '',
        update_time: '',
        sex: person.sex
      };
      if (departmentState.boss_memo === '') {
        departmentState.boss_memo = personMemo;
      }
    }
    return state;
  }
  const AppState = typeof State !== 'undefined' && State ? State : createMockState();
  function hidePageLoader() {
    const loaderList = document.querySelectorAll('.loader, .overlay');
    for (let i = 0; i < loaderList.length; i++) {
      const loader = loaderList[i];
      const spinner = loader.querySelector('svg, .preloader, .spin');
      if (!spinner) continue;
      loader.classList.add('hidden');
      spinner.classList.remove('spin');
    }
  }
  hidePageLoader();
  class Departments {
    constructor(staff) {
      _defineProperty(this, "_showContentOverlay", () => {
        this.contentItems.overlay.classList.remove('hidden');
      });
      _defineProperty(this, "_hideSidebarOverlay", () => {
        this.sidebarElements.overlay.classList.add('hidden');
        this.sidebarElements.sidebar.classList.remove('agile');
      });
      _defineProperty(this, "_hideContentOverlay", () => {
        setTimeout(() => {
          this.contentItems.overlay.classList.add('hidden');
        }, 0);
      });
      _defineProperty(this, "_getSidebarItemHTML", department => {
        return `<div class="sidebar__item deplink" id="${department.memo}" data-memo="${department.memo}" data-id="${department.id}">
            <div class="deplink__name" title="${department.name}">${department.short_name}</div>
            <span class="deplink__count"><i class="fa fa-users" aria-hidden="true"></i> ${department.staffCount}</span>
        </div>`;
      });
      _defineProperty(this, "_getPersonHTML", person => {
        if (!person) return '';
        let photoLink = '../../' + person.photo_link;
        if (person.photo_link === '' || !person.photo_link) {
          switch (person.sex) {
            case 'nosex':
              photoLink = '../../assets/img/Staff/tech-build.jpg';
              break;
            case 'woman':
              photoLink = '../../assets/img/Staff/woman.jpg';
              break;
            case 'man':
            default:
              photoLink = '../../assets/img/Staff/man.jpg';
              break;
          }
        };
        const phoneHTML = person.work_phone ? `<p class="card__phone">${person.work_phone}</p>` : '';
        const emailHTML = person.email ? `<p class="card__email"><a href="mailto:${person.email}">${person.email}</a></p>` : '';
        return `<div class="card" id="${person.memo}" data-memo="${person.memo}" data-id="${person.id}">
            <a class="img_link" href="${photoLink}" target="_blank">
                <div class="card__photo-box">
                    <img src="${photoLink}" alt="Фото сотрудника" class="card__photo">
                </div>
            </a>
            <div class="card__main-info">
                <h4 class="card__fullname">${person.surname} ${person.name} ${person.patronymic}</h4>
                <p class="card__position">${person.position}</p>
            </div>
            <div class="card__contacts">
                ${phoneHTML}
                ${emailHTML}
            </div>
        </div>`;
      });
      _defineProperty(this, "_getGroupHTML", (group = {
        id: '',
        name: ''
      }) => {
        const groupHTMLId = `group${group.id}`;
        return `<h3 class="metadata__subtitle" id="${groupHTMLId}">${group.name}</h3>
                       <div class="personal__staffbox" id="staff_${groupHTMLId}">

                       </div>`;
      });
      _defineProperty(this, "_getGroupLinkHTML", group => {
        return `<a href="#group${group.id}" class="links-block__link">${group.name}</a>`;
      });
      _defineProperty(this, "getSidebarDepartmentsList", () => {
        let depList = [];
        for (const depMemo in this.staff) {
          const dep = this.staff[depMemo];
          depList.push({
            id: dep.id,
            memo: dep.memo,
            name: dep.name,
            short_name: dep.short_name,
            number: dep.number,
            staffCount: Object.keys(dep.staff).length
          });
        };
        return depList;
      });
      _defineProperty(this, "_clearContent", () => {
        this.contentItems.depName.innerHTML = '';
        this.contentItems.depShortname.innerHTML = '';
        this.contentItems.depNumber.innerHTML = '';
        this.contentItems.depQuantity.innerHTML = '';
        this.contentItems.depWorktime.innerHTML = '';
        this.contentItems.depDinnertime.innerHTML = '';
        this.contentItems.searchInput.value = '';
        this.contentItems.clearBtn.classList.add('hidden');
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
      });
      _defineProperty(this, "_innerDataToContent", department => {
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
            this.contentItems.groupsList.parentElement.classList.add('hidden');
            const wrap = this._getGroupHTML({
              id: 0,
              name: ''
            });
            this.contentItems.personal.insertAdjacentHTML('beforeend', wrap);
            for (let personMemo in depStaff) {
              document.querySelector('#staff_group0').insertAdjacentHTML('beforeend', this._getPersonHTML(depStaff[personMemo]));
            };
          } else {
            let groups = [{
              id: '1',
              name: 'Руководство подразделения'
            }];
            groups = groups.concat(department.groups, [{
              id: '0',
              name: 'Без группы'
            }]);
            for (let i = 0, l = groups.length; i < l; i++) {
              let groupPersonal = [];
              for (let personMemo in depStaff) {
                const person = depStaff[personMemo];
                if (person.group === groups[i].id) groupPersonal.push(person);
              };
              if (groupPersonal.length <= 0) continue;
              new Promise((resolve, reject) => {
                this.contentItems.groupsList.insertAdjacentHTML('beforeend', this._getGroupLinkHTML(groups[i]));
                this.contentItems.personal.insertAdjacentHTML('beforeend', this._getGroupHTML(groups[i]));
                resolve();
              }).then(() => {
                const wrap = document.querySelector(`#staff_group${groups[i].id}`);
                for (let person of groupPersonal) {
                  wrap.insertAdjacentHTML('beforeend', this._getPersonHTML(person));
                };
              });
            };
          };
          this.contentItems.searchInput.dataset.dep = department.memo;
        } catch (error) {
          alert('Не удалось загрузить список сотрудников!');
          console.error(error);
        };
        return 0;
      });
      _defineProperty(this, "sidebarInit", () => {
        const departmentList = this.getSidebarDepartmentsList();
        new Promise((resolve, reject) => {
          if (!departmentList || departmentList === undefined || departmentList.length === 0) reject('Не удалось сформировать список подразделений, возникла ошибка!');
          const departmentHTMLList = departmentList.map(item => {
            return '';
          });
          if (!departmentHTMLList || departmentHTMLList === undefined || departmentHTMLList.length === 0) reject('Не удалось сформировать список подразделений, возникла ошибка!');
          for (let i = 0, l = departmentList.length; i < l; i++) {
            const depHTML = this._getSidebarItemHTML(departmentList[i]);
            this.sidebarElements.departmentsList.insertAdjacentHTML('beforeend', depHTML);
          };
          this.sidebarElements.sidebar.addEventListener('click', this.clickDepartmentHandler);
          this.contentItems.personal.addEventListener('mouseup', this.openCardHandler);
          resolve();
        }).then(() => {
          this._hideSidebarOverlay();
          const _urlParams = new URLSearchParams(window.location.search);
          const _targetDep = _urlParams.get('dep');
          let _startEl = this.sidebarElements.departmentsList.firstElementChild;
          if (_targetDep) {
            const _matchEl = this.sidebarElements.departmentsList.querySelector('[data-memo="' + _targetDep + '"]');
            if (_matchEl) {
              _startEl = _matchEl;
              setTimeout(function() { _startEl.scrollIntoView({block: 'nearest'}); }, 150);
            }
          }
          if (_startEl) _startEl.dispatchEvent(new Event('click', {bubbles: true}));
          try {
            this.contentItems.searchBtn.addEventListener('click', this.searchHandler);
            this.contentItems.searchInput.addEventListener('submit', this.searchHandler);
            this.contentItems.searchInput.addEventListener('keydown', event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                this.searchHandler();
              } else if (event.key === 'Escape') {
                this.resetDepSearch();
              } else {
                const input = event.target;
                if (input.value === '') {
                  this.resetDepSearch(event);
                } else if (input.value !== '' && input.dataset.query === '0') {
                  this.contentItems.searchInput.dataset.query = '0';
                  this.contentItems.clearBtn.classList.remove('hidden');
                };
              }
            });
            this.contentItems.clearBtn.addEventListener('click', this.resetDepSearch);
          } catch (error) {
            this.contentItems.searchMessage.innerHTML = 'Возникла непредвиденная ошибка!';
            console.error(error);
          };
        }).catch(error => {
          alert(error);
          console.error(error);
        });
      });
      _defineProperty(this, "clickDepartmentHandler", event => {
        event.preventDefault();
        if (this.sidebarElements.sidebar.dataset.lock === 'true') return;
        this._showContentOverlay();
        this.sidebarElements.overlay.classList.remove('hidden');
        this.sidebarElements.sidebar.dataset.lock = 'true';
        new Promise((resolve, reject) => {
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
        }).then(() => {
          this._hideContentOverlay();
          this.sidebarElements.sidebar.dataset.lock = '';
          this.sidebarElements.overlay.classList.add('hidden');
        }).catch(error => {
          console.error(error);
          alert(error);
          this.sidebarElements.sidebar.dataset.lock = '';
          this.sidebarElements.overlay.classList.add('hidden');
        });
      });
      _defineProperty(this, "search", (query, depMemo = null) => {
        let result = {};
        if (!depMemo || depMemo === null) return result;
        query = query.replace('\\', '');
        query = query.replace('/', '');
        const personal = this.staff[depMemo].staff;
        if (!personal || personal.lenght === 0) return result;
        for (let personMemo in personal) {
          let person = personal[personMemo],
            compare = new RegExp(query, 'i');
          let stringForChecking = [`${person.name.replace('ё', 'е')} ${person.patronymic.replace('ё', 'е')} ${person.surname.replace('ё', 'е')} `, `${person.name} ${person.patronymic.replace('ё', 'е')} ${person.surname.replace('ё', 'е')} `, `${person.name.replace('ё', 'е')} ${person.patronymic} ${person.surname.replace('ё', 'е')} `, `${person.name.replace('ё', 'е')} ${person.patronymic.replace('ё', 'е')} ${person.surname} `, `${person.name} ${person.patronymic} ${person.surname} `, `${person.name.replace('ё', 'е')} ${person.surname} `, `${person.name} ${person.surname.replace('ё', 'е')} `, `${person.name.replace('ё', 'е')} ${person.surname.replace('ё', 'е')} `, `${person.name} ${person.surname} `, `${person.surname.replace('ё', 'е')} ${person.name} `, `${person.surname} ${person.name.replace('ё', 'е')} `, `${person.surname.replace('ё', 'е')} ${person.name.replace('ё', 'е')} `, `${person.surname} ${person.name} `, `${person.work_phone} `, `${person.work_phone.replace('-', ' ')} `, `${person.work_phone.replace('-', '')} `, `${person.location} `, `${person.location.replace('№', '')} `, `${personMemo}`];
          for (let i = 0; i < stringForChecking.length; i++) {
            if (!compare.test(stringForChecking[i])) continue;
            const group = 'group' + person.group;
            if (!result[group] || result[group] === undefined) result[group] = [];
            result[group].push(person.memo);
            break;
          };
        };
        return result;
      });
      _defineProperty(this, "searchHandler", event => {
        if (this.contentItems.searchInput.dataset.lock === 'true') return;
        new Promise((resolve, reject) => {
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
          const query = this.contentItems.searchInput.value;
          if (!query || query === '') reject('Задан пустой запрос');
          if (query.length < 3) reject('Введите более двух символов');
          const depMemo = this.contentItems.searchInput.dataset.dep;
          const result = this.search(query, depMemo);
          if (!result || result === undefined) reject('В процессе поиска возникла ошибка');
          resolve(result);
        }).then(response => {
          if (Object.keys(response).length <= 0) {
            this.contentItems.noresult.classList.remove('hidden');
            this.contentItems.personal.classList.add('hidden');
          } else {
            const subtitleList = document.querySelectorAll('.metadata__subtitle');
            if (subtitleList.length === 1) {
              const cardList = document.querySelectorAll('.card');
              for (let i = 0, l = cardList.length; i < l; i++) {
                var _response$Object$keys;
                const compareCard = (_response$Object$keys = response[Object.keys(response)[0]]) === null || _response$Object$keys === void 0 ? void 0 : _response$Object$keys.filter(item => {
                  return item === cardList[i].dataset.memo;
                });
                if (compareCard.length <= 0) cardList[i].classList.add('hidden');
              };
            } else {
              for (let i = 0, l = subtitleList.length; i < l; i++) {
                const group = subtitleList[i].id;
                const groupElement = document.querySelector('#staff_' + group);
                if (Object.keys(response).includes(group)) {
                  const cardList = groupElement.querySelectorAll('.card');
                  for (let i = 0, l = cardList.length; i < l; i++) {
                    const compareCard = response[group].filter(item => {
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
        }).catch(error => {
          if (typeof error === 'string') {
            this.contentItems.searchMessage.innerHTML = error;
          } else {
            this.resetDepSearch();
            this.contentItems.searchMessage.innerHTML = 'В процессе поиска возникла критическая ошибка!';
            console.error(error);
          };
        });
      });
      _defineProperty(this, "resetDepSearch", event => {
        this.contentItems.searchInput.dataset.lock = 'true';
        new Promise((resolve, reject) => {
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
        }).then(() => {
          this.contentItems.searchInput.value = '';
          this.contentItems.searchInput.dataset.query = '0';
          this.contentItems.clearBtn.classList.add('hidden');
          this.contentItems.searchInput.dataset.lock = '';
        }).catch(error => {
          this.contentItems.searchMessage.innerHTML = 'Возникла непредвиденная ошибка!';
          console.error(error);
        });
      });
      _defineProperty(this, "openCardHandler", event => {
        if (event.target.tagName === 'A') return;
        if (event.target.closest('.img_link') !== null) return;
        const popup = new Popup();
        popup.reset();
        new Promise((resolve, reject) => {
          const curCard = event.target.closest('.card');
          if (curCard === null) return;
          const personMemo = curCard.dataset.memo;
          if (!personMemo || personMemo === '') reject('Не удалось получить идентификатор сотрудника. Перезагрузите страницу или обратитесь к администратору.');
          const depMemo = this.contentItems.searchInput.dataset.dep;
          if (!depMemo || depMemo === '') reject('Не удалось получить идентификатор подразделения. Перезагрузите страницу или обратитесь к администратору.');
          const department = this.staff[depMemo];
          if (!department || typeof department !== 'object') reject('Не удалось получить данные. Перезагрузите страницу или обратитесь к администратору.');
          const person = department.staff[personMemo];
          if (!person || typeof person !== 'object') reject('Не удалось получить данные. Перезагрузите страницу или обратитесь к администратору.');
          person.department = department.name;
          person.workTime = department.work_time;
          person.dinnerTime = department.dinner_time;
          if (person.group === '1') {
            person.groupName = 'Руководство подразделения';
          } else if (person.group === '0') {
            person.groupName = 'Без группы';
          } else {
            const group = department.groups.filter(item => {
              return item.id === person.group;
            });
            if (!group || group.lenght === 0) {
              person.groupName = 'Без группы';
            } else {
              person.groupName = group[0].name;
            };
          };
          resolve(person);
        }).then(response => {
          popup.innerInfo(response);
        }).then(() => {
          popup.show();
          this.contentItems.personal.dataset.lock = '';
        }).catch(error => {
          if (typeof error === 'string') {
            alert(error);
          } else {
            alert('Возникла непредвиденная ошибка! Перезагрузите страницу.');
            console.error(error);
          };
          popup.reset();
          this.contentItems.personal.dataset.lock = '';
        });
      });
      this.staff = staff;
      this.sidebarElements = {
        sidebar: document.querySelector('.sidebar'),
        overlay: document.querySelector('.sidebar .overlay'),
        departmentsList: document.querySelector('#departments_list')
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
        personal: document.querySelector('#personal')
      };
      this.activeDepartment = undefined;
    }
  };
  class Popup {
    constructor() {
      _defineProperty(this, "innerInfo", person => {
        let photoLink = '../../' + person.photo_link;
        if (person.photo_link === '' || !person.photo_link) {
          switch (person.sex) {
            case 'nosex':
              photoLink = '../../assets/img/Staff/tech-build.jpg';
              break;
            case 'woman':
              photoLink = '../../assets/img/Staff/woman.jpg';
              break;
            case 'man':
            default:
              photoLink = '../../assets/img/Staff/man.jpg';
              break;
          }
        };
        this.cardElements.photo.src = photoLink;
        this.cardElements.fullname.innerHTML = `${person.surname}<br>${person.name}<br>${person.patronymic}`;
        this.cardElements.position.innerHTML = person.position;
        this.cardElements.department.innerHTML = person.department;
        this.cardElements.group.innerHTML = person.groupName;
        if (person.workTime && person.workTime !== '') {
          this.cardElements.workTime.querySelector('span').innerHTML = person.workTime;
          this.cardElements.workTime.classList.remove('hidden');
        };
        if (person.dinnerTime && person.dinnerTime !== '') {
          this.cardElements.dinnerTime.querySelector('span').innerHTML = person.dinnerTime;
          this.cardElements.dinnerTime.classList.remove('hidden');
        };
        if (person.work_phone || person.townPhone || person.mobile || person.email || person.location) this.cardElements.popupContacts.classList.remove('hidden');
        if (person.work_phone && person.work_phone !== '') {
          this.cardElements.phone.querySelector('span').innerHTML = person.work_phone;
          this.cardElements.phone.classList.remove('hidden');
        };
        if (person.town_phone && person.town_phone !== '') {
          this.cardElements.townPhone.querySelector('span').innerHTML = person.town_phone;
          this.cardElements.townPhone.classList.remove('hidden');
        };
        if (person.mobile_phone && person.mobile_phone !== '') {
          this.cardElements.mobile.querySelector('span').innerHTML = person.mobile_phone;
          this.cardElements.mobile.classList.remove('hidden');
        };
        if (person.location && person.location !== '') {
          this.cardElements.location.querySelector('span').innerHTML = person.location;
          this.cardElements.location.classList.remove('hidden');
        };
        if (person.email && person.email !== '') {
          const emailElement = this.cardElements.email.querySelector('a');
          emailElement.innerHTML = person.email;
          emailElement.href = `mailto:${person.email}`;
          this.cardElements.email.classList.remove('hidden');
        };
        if (person.key_words || person.update_time) this.cardElements.popupMeta.classList.remove('hidden');
        if (person.key_words && person.key_words !== '') {
          this.cardElements.keywords.innerHTML = 'Ключевые слова: ' + person.key_words;
          this.cardElements.keywords.classList.remove('hidden');
        };
        if (person.update_time && typeof person.update_time === 'string' && person.update_time !== '') {
          let updateTime = '';
          const timestamp = Date.parse(person.update_time);
          const date = new Date(timestamp);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const hour = date.getHours();
          const minutes = date.getMinutes();
          updateTime = `Обновлено: ${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year} ${hour < 10 ? '0' + hour : hour}:${minutes < 10 ? '0' + minutes : minutes}`;
          this.cardElements.updatetime.innerHTML = updateTime;
          this.cardElements.updatetime.classList.remove('hidden');
        };
      });
      _defineProperty(this, "reset", () => {
        this.cardElements.photo.src = '';
        this.cardElements.fullname.innerHTML = '';
        this.cardElements.position.innerHTML = '';
        this.cardElements.department.innerHTML = '';
        this.cardElements.group.innerHTML = '';
        this.cardElements.workTime.classList.add('hidden');
        this.cardElements.dinnerTime.classList.add('hidden');
        this.cardElements.popupContacts.classList.add('hidden');
        this.cardElements.phone.classList.add('hidden');
        this.cardElements.townPhone.classList.add('hidden');
        this.cardElements.mobile.classList.add('hidden');
        this.cardElements.location.classList.add('hidden');
        const emailElement = this.cardElements.email.querySelector('a');
        emailElement.innerHTML = '';
        emailElement.href = '';
        this.cardElements.email.classList.add('hidden');
        this.cardElements.popupMeta.classList.add('hidden');
        this.cardElements.keywords.classList.add('hidden');
        this.cardElements.updatetime.classList.add('hidden');
      });
      _defineProperty(this, "show", () => {
        this.bottomLayer.classList.remove('hidden');
        this.popupElement.classList.remove('animate__fadeOut', 'hidden');
        this.popupElement.classList.add('animate__fadeIn');
      });
      _defineProperty(this, "hide", () => {
        this.popupElement.classList.remove('animate__fadeIn');
        this.popupElement.classList.add('animate__fadeOut');
        setTimeout(() => {
          this.popupElement.classList.add('hidden');
          this.bottomLayer.classList.add('hidden');
        }, 300);
      });
      this.popupElement = document.querySelector('#person_card_popup');
      this.bottomLayer = document.querySelector('#bottom_layer');
      this.overlay = document.querySelector('#person_card_popup .overlay');
      this.closeBtn = document.querySelector('#popup_close');
      this.cardElements = {
        photo: document.querySelector('#popup_photo'),
        fullname: document.querySelector('#popup_fullname'),
        position: document.querySelector('#popup_position'),
        department: document.querySelector('#popup_department'),
        group: document.querySelector('#popup_group'),
        workTime: document.querySelector('#popup_worktime'),
        dinnerTime: document.querySelector('#popup_dinnertime'),
        popupContacts: document.querySelector('#popup_contacts'),
        phone: document.querySelector('#popup_phone'),
        townPhone: document.querySelector('#popup_townphone'),
        mobile: document.querySelector('#popup_mobile'),
        email: document.querySelector('#popup_email'),
        location: document.querySelector('#popup_location'),
        popupMeta: document.querySelector('#popup_meta'),
        keywords: document.querySelector('#popup_keywords'),
        updatetime: document.querySelector('#popup_updatetime')
      };
      this.bottomLayer.addEventListener('click', event => {
        if (event.target.id !== this.bottomLayer.id) return;
        this.hide();
      });
      this.closeBtn.addEventListener('click', event => {
        if (event.target.closest('button').id !== this.closeBtn.id) return;
        this.hide();
      });
      window.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        this.hide();
      });
    }
  };
  try {
    // const DepartmentsObj = new Departments(State);
    const DepartmentsObj = new Departments(AppState);
    DepartmentsObj.sidebarInit();
  } catch (error) {
    alert('Возникла непредвиденная ошибка! Невозможно загрузить справочник. Не перезагружайте страницу и обратитесь к администратору по телефону 06-66 (э) или напишите на почту KuznetsovGS@ckba.local.');
    console.error(error);
  };
});
