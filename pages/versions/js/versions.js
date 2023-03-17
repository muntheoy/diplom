window.addEventListener('load', function () {
  const wrapElement = document.querySelector('#versions_list');
  function startLoad() {
    const overlay = document.querySelector('#content_wrap .overlay');
    overlay.classList.remove('hidden');
    overlay.querySelector('svg').classList.add('spin');
  };
  function endLoad() {
    const overlay = document.querySelector('#content_wrap .overlay');
    overlay.classList.add('hidden');
    overlay.querySelector('svg').classList.remove('spin');
  };
  try {
    startLoad();
    new Promise((resolve, reject) => {
      if (!Versions || Versions === undefined || Versions === null) reject('Не удалось загрузить список версий!');
      if (Versions.length === 0) reject('Список версий пуст!');
      for (let versionData of Versions) {
        wrapElement.insertAdjacentHTML('beforeend', `<h3 class="versions__subtitle subtitle">${versionData.version}</h3>`);
        wrapElement.insertAdjacentHTML('beforeend', `<span class="versions__date-release">Добавлено ${versionData.date_release}</span>`);
        wrapElement.insertAdjacentHTML('beforeend', `<div class="versions__description-text">${versionData.description}</div>`);
      };
      resolve();
    }).then(() => {
      endLoad();
    }).catch(error => {
      if (typeof error === 'string') {
        alert(error);
      } else {
        alert('Возникла непредвиденная ошибка');
        console.error(error);
      }
    });
  } catch (error) {
    alert('Возникла непредвиденная ошибка! Обратитесь к администратору.');
    console.error(error);
  };
});
