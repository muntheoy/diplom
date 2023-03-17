window.addEventListener('load', function () {
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
    for (let depMemo in State) {
      const department = State[depMemo];
      const departmentPersonal = State[depMemo].staff;
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
    if (!Settings || !Settings.support || Settings.support.length === 0) {
      alert('Не удалось загрузить список сотрудников! Отсутствует объект настроек.');
      return;
    };
    for (const supportMemo of Settings.support) {
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
