window.addEventListener('load', function() {
    const marker_wrap = document.querySelector('#marker_wrap');
    const factorynames_list = document.querySelector('#factorynames_list');

    marker_wrap.addEventListener('mouseover', (event) => {
        const marker = event.target.closest('.map__marker');
        if (!marker || marker === null) return;

        const buildingId = marker.id;
        const nameListElements = document.querySelectorAll('.factorynames__items');

        try {
            const nameElement = undefined; 
            for (let i = 0, l = nameListElements.length; i < l; i++) {
                if (nameListElements[i].dataset.building === buildingId) nameListElements[i].classList.add('factorynames__items_active');
            };
        } catch(error) {
            //alert('Возникла непредвиденная ошибка! Обратитесь к администратору.');
            console.error(error);
        };
    });

    marker_wrap.addEventListener('mouseout', (event) => {
        const nameListElements = document.querySelectorAll('.factorynames__items');

        try { 
            for (let i = 0, l = nameListElements.length; i < l; i++) {
                nameListElements[i].classList.remove('factorynames__items_active');
            };
        } catch(error) {
            //alert('Возникла непредвиденная ошибка! Обратитесь к администратору.');
            console.error(error);
        };
    });

    factorynames_list.addEventListener('mouseover', (event) => {
        const nameElement = event.target.closest('.factorynames__items');
        if (!nameElement || nameElement === null) return;

        try { 
            const markerId = nameElement.dataset.building;
            document.querySelector(`#${markerId}`).classList.add('map__marker_active');
        } catch(error) {
            //alert('Возникла непредвиденная ошибка! Обратитесь к администратору.');
            console.error(error);
        };
    });

    factorynames_list.addEventListener('mouseout', (event) => {
        const markerListElements = document.querySelectorAll('.map__marker');

        try { 
            for (let i = 0, l = markerListElements.length; i < l; i++) {
                markerListElements[i].classList.remove('map__marker_active');
            };
        } catch(error) {
            //alert('Возникла непредвиденная ошибка! Обратитесь к администратору.');
            console.error(error);
        };
    });
});