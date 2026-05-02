'use strict';

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
  class Mail {
    constructor(_theme = '', to = ['KuznetsovGS@ckba.local'], _fields = []) {
      _defineProperty(this, "setTheme", theme => {
        this.theme = theme;
      });
      _defineProperty(this, "setAddresse", (addresse = []) => {
        this.to = addresse;
      });
      _defineProperty(this, "setFields", (fields = []) => {
        this.fields = fields;
      });
      _defineProperty(this, "getMail", () => {
        if (this.to.length === 0) return 1;
        try {
          let adresser = 'mailto:';
          let copyTo = 'cc=';
          let theme = 'subject=';
          let body = 'body=';
          for (let i = 0, l = this.to.length; i < l; i++) {
            if (i === 0) {
              adresser += this.to[i];
            } else {
              copyTo += this.to[i] + ',';
            };
          };
          theme += encodeURIComponent(this.theme);
          for (let i = 0, l = this.fields.length; i < l; i++) {
            body += encodeURIComponent(`${this.fields[i].nameru}: ${this.fields[i].value}\n`);
          };
          return `${adresser}?${copyTo}&${theme}&${body}`;
        } catch (error) {
          console.error('При формировании сообщения возникла ошибка:', error);
        };
      });
      this.theme = _theme;
      this.to = to;
      this.fields = _fields;
    }
  };
  function startLoad() {
    const overlay = document.querySelector('#form_block .overlay');
    overlay.classList.remove('hidden');
    overlay.querySelector('svg').classList.add('spin');
  };
  function endLoad() {
    const overlay = document.querySelector('#form_block .overlay');
    overlay.classList.add('hidden');
    overlay.querySelector('svg').classList.remove('spin');
  };
  function clearFieldStyle(form) {
    if (!form || !form.elements) return;
    if (form.elements.length === 0) return;
    for (let i = 0, l = form.elements.length; i < l; i++) {
      const elememnt = form.elements[i];
      elememnt.classList.remove('input_error');
      const field = elememnt.closest('.field');
      if (!field || field === null) continue;
      const messageField = field.querySelector('.field__message');
      if (!messageField || messageField === null) continue;
      messageField.innerHTML = '';
    };
  };
  function switchButtonMode(button, state = 0) {
    const first_img = button.querySelector('.check');
    const last_img = button.querySelector('.spin');
    if (state === 0) {
      first_img.classList.add('hidden');
      last_img.classList.add('hidden');
    } else if (state === 1) {
      first_img.classList.remove('hidden');
      last_img.classList.add('hidden');
    } else if (state === 2) {
      first_img.classList.add('hidden');
      last_img.classList.remove('hidden');
    };
  };
  const buttonLock = (button, unvisible = false, style = true) => {
    button.dataset.lock = 'true';
    button.disabled = true;
    if (style) {
      button.classList.add('btn_lightGrey');
    };
    if (unvisible) {
      button.classList.add('hidden');
    };
  };
  const buttonUnlock = (button, unvisible = true, style = true) => {
    button.dataset.lock = 'false';
    button.disabled = false;
    if (style) {
      button.classList.remove('btn_lightGrey');
    };
    if (unvisible) {
      button.classList.remove('hidden');
    };
  };
  function addFormInit() {
    const depInput = document.querySelector('#add_department');
    const delDepInput = document.querySelector('#delete_department');
    // for (let depMemo in State) {
    for (let depMemo in AppState) {
      // const curDep = State[depMemo];
      const curDep = AppState[depMemo];
      depInput.insertAdjacentHTML('beforeend', `<option value="${curDep['memo']}">${curDep['name']}</option>`);
      delDepInput.insertAdjacentHTML('beforeend', `<option value="${curDep['memo']}">${curDep['name']}</option>`);
    };
    let groupSelect = document.querySelector('#add_group');
    depInput.addEventListener('change', () => {
      groupSelect.disabled = true;
      new Promise(resolve => {
        while (groupSelect.firstChild) {
          groupSelect.firstChild.remove();
        };
        if (depInput.value === 0 || depInput.value === '0') {
          groupSelect.insertAdjacentHTML('beforeend', '<option value="0">Не найдено</option>');
          resolve();
        };
        // const department = State[depInput.value];
        const department = AppState[depInput.value];
        if (department.groups.length !== 0) {
          groupSelect.insertAdjacentHTML('beforeend', '<option value="0" selected>Без группы</option>');
          for (let group of department.groups) {
            groupSelect.insertAdjacentHTML('beforeend', `<option value="${group.id}">${group.name}</option>`);
          };
        } else {
          groupSelect.insertAdjacentHTML('beforeend', '<option value="0">Не найдено</option>');
        };
        resolve();
      }).then(() => {
        groupSelect.disabled = false;
      });
    });
    const newGroupInput = document.querySelector('#new_group');
    groupSelect.addEventListener('focus', changeGroupHandler);
    groupSelect.addEventListener('change', changeGroupHandler);
    function changeGroupHandler() {
      if (groupSelect.value === 0 || groupSelect.value === '0') {
        newGroupInput.disabled = false;
        newGroupInput.closest('.field').classList.remove('hidden');
      } else {
        newGroupInput.disabled = true;
        newGroupInput.closest('.field').classList.add('hidden');
      };
    }
  };
  try {
    new Promise(resolve => {
      addFormInit();
      resolve();
    }).then(endLoad());
    const themeSwitcher = document.querySelector('#theme_form_input');
    themeSwitcher.addEventListener('change', () => {
      themeSwitcher.disabled = true;
      startLoad();
      new Promise(resolve => {
        let activeForm = null;
        const formList = [document.querySelector('#add_person'), document.querySelector('#edit_person'), document.querySelector('#delete_person'), document.querySelector('#add_person_photo'), document.querySelector('#errors_and_changes'), document.querySelector('#improvement')];
        switch (themeSwitcher.value) {
          case '1':
            activeForm = formList[1];
            break;
          case '2':
            activeForm = formList[2];
            break;
          case '3':
            activeForm = formList[3];
            break;
          case '4':
            activeForm = formList[4];
            break;
          case '5':
            activeForm = formList[5];
            break;
          default:
            activeForm = formList[0];
        };
        for (let form of formList) {
          form.classList.add('hidden');
        };
        activeForm.classList.remove('hidden');
        resolve();
      }).then(() => {
        themeSwitcher.disabled = false;
        endLoad();
      });
    });
    document.querySelector('#form_block').addEventListener('click', event => {
      event.preventDefault();
      const submitBtn = event.target.closest('.btn');
      if (!submitBtn || submitBtn === null) return;
      if (submitBtn.dataset.lock === 'true') return;
      buttonLock(submitBtn);
      switchButtonMode(submitBtn, 2);
      const form = submitBtn.closest('form');
      startLoad();
      new Promise((resolve, reject) => {
        clearFieldStyle(form);
        let formData = [];
        let errorsValidate = [];
        for (let i = 0, l = form.elements.length; i < l; i++) {
          const element = form.elements[i];
          if ((element.required || element.required === 'true') && (element.value === '' || element.value === '0')) {
            errorsValidate.push({
              field: element.name,
              message: 'Это поле обязательно для заполнения!'
            });
          };
          switch (element.type) {
            case 'submit':
            case 'button':
            case 'hidden':
              continue;
            case 'select-one':
              formData.push({
                name: element.name,
                nameru: element.dataset.nameru,
                value: element.selectedOptions[0].innerHTML
              });
              break;
            default:
              formData.push({
                name: element.name,
                nameru: element.dataset.nameru,
                value: element.value
              });
          };
          let textRegexp;
          switch (element.type) {
            case 'tel':
              textRegexp = new RegExp(/^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/);
              if (element.value === '') break;
              if (!textRegexp.test(element.value)) {
                errorsValidate.push({
                  field: element.name,
                  message: 'Неверный формат (+7xxxxxxxxxx)'
                });
              };
              break;
            case 'email':
              textRegexp = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i);
              if (element.value === '') break;
              if (!textRegexp.test(element.value)) {
                errorsValidate.push({
                  field: element.name,
                  message: 'Неверный формат (example@example.com)'
                });
              };
              break;
            case 'text':
            case 'textarea':
              textRegexp = new RegExp(/[^0-9a-zA-Zа-яА-Я-()№ёЁ/"'.,:\s\t]+/iu);
              if (textRegexp.test(element.value)) {
                errorsValidate.push({
                  field: element.name,
                  message: 'Введите допустимое значение (символы A-Z, a-z, А-Я, а-я, 0-9, точка, запятая, дефис, двоеточие)'
                });
              };
              break;
            default:
              break;
          };
        };
        if (errorsValidate.length > 0) reject(errorsValidate);
        resolve(formData);
      }).then(response => {
        const theme = form.elements.theme.value;
        const mail = new Mail(theme, ['KuznetsovGS@ckba.local', 'KuznetsovSS@ckba.local', 'KuzyevMS@ckba.local'], response).getMail();
        window.location.href = mail;
      }).then(() => {
        buttonUnlock(submitBtn);
        switchButtonMode(submitBtn, 1);
        endLoad();
      }).catch(error => {
        buttonUnlock(submitBtn);
        switchButtonMode(submitBtn, 0);
        if (Array.isArray(error)) {
          for (let errItem of error) {
            const errElem = form.elements[errItem.field];
            errElem.classList.add('input_error');
            errElem.closest('.field').querySelector('.field__message').innerHTML = errItem.message;
          };
          endLoad();
          return;
        };
        alert('Возникла непредвиденная ошибка! Обратитесь к администратору.');
        console.error(error);
        endLoad();
      });
    });
  } catch (error) {
    alert('Возникла непредвиденная ошибка! Обратитесь к администратору.');
    console.error(error);
  };
});
