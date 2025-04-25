document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('mapid').setView([55.75, 37.61], 4); // Начальная позиция карты на Москву
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Координаты аэропортов
    const berlin = [52.5200, 13.4050];
    const tokyo = [35.6895, 139.6917];

    // Добавление маркеров для аэропортов
    L.marker(berlin).addTo(map)
        .bindPopup('Аэропорт Берлина')
        .openPopup();
    L.marker(tokyo).addTo(map)
        .bindPopup('Аэропорт Токио')
        .openPopup();

    let points = []; // Хранение координат выбранных точек
    let markers = []; // Хранение маркеров
    let line = null; // Хранение линии

    // Клик по карте добавляет точку
    map.on("click", e => {
        if (points.length === 2) return; // Ограничиваем выбор до двух точек
        
        points.push(e.latlng);
        const marker = L.circleMarker([points[points.length - 1].lat, points[points.length - 1].lng])
            .bindTooltip(`Координаты: (${points[points.length - 1].lat}, ${points[points.length - 1].lng})`)
            .addTo(map);
        markers.push(marker);

        if (points.length === 2) {
            // Рисуем линию между двумя точками
            line = L.polyline(points, {color: 'red'}).addTo(map);
        }
    });

    // Функция расчета расстояния
    async function calculateDistance() {
        if (points.length !== 2) return alert("Необходимо выбрать ровно две точки!");

        // Создаем AJAX-запрос на сервер
        await fetch("/distance", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Обязательный заголовок для передачи JSON
            },
            body: JSON.stringify({
                start: [points[0].lat, points[0].lng],
                end: [points[1].lat, points[1].lng]
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = `Расстояние между аэропортами: ${data.distance} километров.`;
        })
        .catch(err => console.error('Ошибка:', err));
    }

    // Функция для удаления всех маркеров и линии
    function clearMarkers() {
        points = [];
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        if (line) {
            map.removeLayer(line);
            line = null;
        }
        document.getElementById('result').innerText = '';
    }

    // Добавляем кнопку для запуска функции расчета
    const button = document.createElement('button');
    button.textContent = 'Рассчитать расстояние';
    button.onclick = calculateDistance;
    document.body.appendChild(button);

    // Добавляем кнопку для очистки маркеров
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Очистить маркеры';
    clearButton.onclick = clearMarkers;
    document.body.appendChild(clearButton);
});
