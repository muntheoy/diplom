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
  const AppSettings = typeof Settings !== 'undefined' && Settings ? Settings : {
    // MOCK DATA
    support: ['ivanovii', 'petrovps', 'smirnovad']
  };
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
  function getSupportCardHTML(person) {
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
      };
    };
    return `<div class="support__card card">
                    <div class="card__img">
                        <img src="${photoLink}" alt="">
                    </div>
                    <h4 class="card__name">${person.surname} ${person.name} ${person.patronymic}</h4>
                    <div class="card__email">
                        <a href="mailto:${person.email}">${person.email}</a>
                    </div>
                    <div class="card__phone">${person.work_phone}</div>
                </div>`;
  };
  function getMarchPerson(query) {
    let result = [];
    // for (let depMemo in State) {
    for (let depMemo in AppState) {
      // const department = State[depMemo];
      const department = AppState[depMemo];
      // const departmentPersonal = State[depMemo].staff;
      const departmentPersonal = AppState[depMemo].staff;
      for (let personMemo in departmentPersonal) {
        let person = departmentPersonal[personMemo],
          compare = new RegExp(query, 'i');
        if (compare.test(personMemo)) return person;
      };
    };
    return 0;
  };
  function getSupportList() {
    let supportList = [];
    // if (!Settings || !Settings.support || Settings.support.length === 0) {
    if (!AppSettings || !AppSettings.support || AppSettings.support.length === 0) {
      alert('Не удалось загрузить список сотрудников! Отсутствует объект настроек.');
      return;
    };
    // for (const supportMemo of Settings.support) {
    for (const supportMemo of AppSettings.support) {
      const compare = getMarchPerson(supportMemo);
      if (compare && compare !== 0 && compare !== undefined && typeof compare === 'object') supportList.push(compare);
    };
    return supportList;
  };
  try {
    new Promise((resolve, reject) => {
      const supportWrap = document.querySelector('#support_wrap');
      const personList = getSupportList();
      for (const person of personList) {
        supportWrap.insertAdjacentHTML('beforeend', getSupportCardHTML(person));
      };
      resolve();
    }).then(() => {
      const overlay = document.querySelector('.overlay');
      overlay.classList.add('hidden');
      overlay.querySelector('svg').classList.remove('spin');
    });
  } catch (error) {
    alert('Возникла непредвиденная ошибка! Обратитесь к администратору.');
    console.error(error);
  };
});
