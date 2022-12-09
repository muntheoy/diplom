window.addEventListener('load', function() {
    class Mail {
        constructor (theme = '', to = [], fields = []) {
            this.theme = theme;
            this.to = to;
            this.fields = fields;
        }

        setTheme = theme => {
            this.theme = theme; 
        }

        setAddresse = (addresse = []) => {
            this.to = addresse; 
        }

        setFields = (fields = []) => {
            this.fields = fields;
        }

        getMail = () => {
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
                    body += encodeURIComponent( `${this.fields[i].nameru}: ${this.fields[i].value}\n` );
                };

                return `${adresser}?${copyTo}&${theme}&${body}`;
            } catch(error) {
                console.error('При формировании сообщения возникла ошибка:', error);
            };
        }
    };

    //f Функция переключения кнопки с отображением результата (выкл-0/успех-1/загрузка-2)
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

    //f Функция установки стилей и атрибутов заблокированной кнопки
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

    //f Функция удаления стилей и атрибутов для разблокированной кнопки
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

    // Возврашает HTML элемента таблицы
    function getMailingItemHTML(person) {
        return `<tr>
            <td class="table__items mailing__table_1">
                <input type="checkbox" name="email" value="${person.email}" tabindex="${person.index}" checked>
            </td>
            <td class="table__items mailing__table_2">${person.index}</td>
            <td class="table__items mailing__table_3">${person.surname} ${person.name} ${person.patronymic}</td>
            <td class="table__items mailing__table_4" title="${person.department_name}">${person.department_shortname}</td>
            <td class="table__items mailing__table_5">${person.email}</td>
        </tr>`;
    };

    // Возврашает HTML элемента таблицы
    function getMailingLeadersItemHTML(person) {
        return `<tr>
            <td class="table__items mailing__table_6">
                <input type="checkbox" name="email" value="${person.email}" tabindex="${person.index}" checked>
            </td>
            <td class="table__items mailing__table_7">${person.index}</td>
            <td class="table__items mailing__table_8">${person.surname} ${person.name} ${person.patronymic}</td>
            <td class="table__items mailing__table_9">${person.email}</td>
        </tr>`;
    };

    // Обработчик перехода к рассылке
    function goToMailingHandler(event) {
        event.preventDefault();
        const button = event.target.closest('.btn');
        if (button.dataset.lock === 'true') return;

        buttonLock(button);
        switchButtonMode(button, 2);

        new Promise( (resolve, reject) => {
            const form = event.target.closest('form');
            const checkboxList = form.elements.email;
            
            let mailingList = [];
            for (let i = 0, l = checkboxList.length; i < l; i++) {
                if (checkboxList[i].checked) mailingList.push(checkboxList[i].value);
            };
            
            if (mailingList.length === 0) reject('Не удалось сформировать список для получения ссылки!');
        
            const link = new Mail('', mailingList).getMail();
            window.open(link);
            resolve();
        })
        .then( () => {
            buttonUnlock(button);
            switchButtonMode(button, 1);
        })
        .catch( error => {
            alert('Возникла ошибка при формировании ссылки! Обратитесь к администратору.');
            console.log(error);
            buttonUnlock(button);
            switchButtonMode(button, 0);
        });
    };


    try {
        new Promise( (resolve, reject) => {
            if (!State) reject('Критическая ошибка! Отсутствуют данные подразделений.');

            const leadersListElement = document.querySelector('#mailing_leadership');
            const depLeadersListElement = document.querySelector('#mailing_leadership_dep');

            let i = 0;
            if (State.leadership.staff === undefined) reject('Не удалось загрузить список руководителей предприятия!');
            for (let personMemo in State.leadership.staff) {
                const curPerson = State.leadership.staff[personMemo];
                const personHTML = getMailingLeadersItemHTML( {
                    ...curPerson,
                    department_name: State.leadership.name, 
                    department_shortname: State.leadership.short_name,
                    index: i+1,
                } );
                leadersListElement.insertAdjacentHTML('beforeend', personHTML);
                i++;
            };

            let j = 0;
            for (let depMemo in State) {
                const curDep = State[depMemo];
                const personHTML = getMailingItemHTML( {
                    ...curDep.staff[curDep.boss_memo], 
                    department_name: curDep.name, 
                    department_shortname: curDep.short_name,
                    index: j+1,
                } );
                depLeadersListElement.insertAdjacentHTML('beforeend', personHTML);
                j++;
            };

            document.querySelector('#go_mailing_leaderships').addEventListener('click', goToMailingHandler);
            document.querySelector('#go_mailing_leaderships_dep').addEventListener('click', goToMailingHandler);

            resolve();


        })
        .then( () => {
            document.querySelector('#content_wrap .overlay').classList.add('hidden');
            document.querySelector('#content_wrap .overlay svg').classList.remove('spin'); 
        })
        .catch( error => {
            alert(error);
        }); 
    } catch(error) {
        alert('Возникла непредвиденная ошибка! Обратитесь к администратору.');
        console.error(error);
    };
});