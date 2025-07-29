// Загрузка данных
fetch('moon_data.json')
    .then(response => response.json())
    .then(data => {
        const calendarData = data.calendar;
        let currentMonth = new Date().getMonth();
        let currentDayData = null;
        window.elementTimer = null;
        
        // Инициализация
        document.getElementById('current-year').textContent = data.year;
        
        // Отображение календаря
        function renderCalendar(month) {
            const calendarGrid = document.getElementById('calendar-grid');
            calendarGrid.innerHTML = '';
            
            const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                              "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
            document.getElementById('current-month').textContent = monthNames[month];
            
            // Получаем первый день месяца и день недели
            const firstDay = new Date(data.year, month, 1);
            const startingDay = firstDay.getDay();
            
            // Пустые ячейки перед первым днем
            for (let i = 0; i < (startingDay === 0 ? 6 : startingDay - 1); i++) {
                calendarGrid.appendChild(createEmptyDay());
            }
            
            // Дни месяца
            const daysInMonth = new Date(data.year, month + 1, 0).getDate();
            const today = new Date();
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${data.year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const dayData = calendarData.find(d => d.date === dateStr);
                
                if (dayData) {
                    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === data.year;
                    calendarGrid.appendChild(createDayElement(dayData, isToday));
                    
                    if (isToday) {
                        updateDayDetails(dayData);
                    }
                }
            }
        }
        
        function createDayElement(dayData, isToday = false) {
            const dayElement = document.createElement('div');
            dayElement.className = `day ${dayData.phase.toLowerCase()} ${isToday ? 'today' : ''}`;
            
            let directionIcon = '';
            if (dayData.direction === 'left') directionIcon = '←';
            if (dayData.direction === 'right') directionIcon = '→';
            
            let luckyIndicator = '';
            if (dayData.is_lucky) {
                luckyIndicator = dayData.lucky_type === 'left' ? '←' : '→';
            }
            
            dayElement.innerHTML = `
                <div class="day-number">${dayData.day}</div>
                <div class="moon-phase">${getMoonIcon(dayData.phase)}</div>
                <div class="lunar-day">${dayData.lunar_day}</div>
                <div class="direction">${directionIcon}</div>
                ${dayData.is_lucky ? `<div class="lucky">${luckyIndicator}</div>` : ''}
            `;
            
            dayElement.addEventListener('click', () => updateDayDetails(dayData));
            return dayElement;
        }
        
        function createEmptyDay() {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            return emptyDay;
        }
        
        function getMoonIcon(phase) {
            switch(phase) {
                case 'Новолуние': return '🌑';
                case 'Полнолуние': return '🌕';
                case 'Растущая': return '🌒';
                case 'Убывающая': return '🌘';
                default: return '';
            }
        }
        
        function updateCurrentElementInfo() {
            if (!currentDayData) return;
            
            const now = new Date();
            const currentTimeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            document.getElementById('current-time').textContent = `Текущее время: ${currentTimeStr}`;

            let activeElement = null;
            let nextElement = null;
            let timeLeft = 0;

            for (const [element, periods] of Object.entries(currentDayData.elements)) {
                for (const period of periods) {
                    const start = new Date(`${currentDayData.date}T${period.start}:00`);
                    const end = new Date(`${currentDayData.date}T${period.end}:00`);
                    
                    if (now >= start && now < end) {
                        activeElement = element;
                        timeLeft = Math.round((end - now) / 1000);
                        
                        const nextIndex = (Object.keys(currentDayData.elements).indexOf(element) + 1) % 5;
                        nextElement = Object.keys(currentDayData.elements)[nextIndex];
                        break;
                    }
                }
                if (activeElement) break;
            }

            if (activeElement) {
                document.getElementById('active-element').innerHTML = `
                    <span class="element-name ${activeElement.toLowerCase()}">${activeElement}</span>
                    <span class="time-left">${formatTime(timeLeft)}</span>
                `;
                
                document.getElementById('next-element').textContent = `Следующий: ${nextElement}`;
            } else {
                document.getElementById('active-element').textContent = 'Нет активного элемента';
                document.getElementById('next-element').textContent = '';
            }
        }
        
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        
        function updateDayDetails(dayData) {
            currentDayData = dayData;
            
            document.getElementById('today-date').textContent = `${dayData.date} (${dayData.weekday})`;
            document.getElementById('sunrise').textContent = dayData.sunrise;
            document.getElementById('sunset').textContent = dayData.sunset;
            document.getElementById('moon-phase').textContent = dayData.phase;
            document.getElementById('lunar-day').textContent = dayData.lunar_day;
            document.getElementById('direction').textContent = dayData.direction;
            document.getElementById('moonrise').textContent = dayData.moonrise;
            document.getElementById('moonset').textContent = dayData.moonset;
            
            const luckyIndicator = document.getElementById('lucky-indicator');
            if (dayData.is_lucky) {
                luckyIndicator.textContent = `Lucky ${dayData.lucky_type === 'left' ? '←' : '→'}`;
                luckyIndicator.className = `lucky-${dayData.lucky_type}`;
            } else {
                luckyIndicator.textContent = '';
                luckyIndicator.className = '';
            }
            
            updateCurrentElementInfo();
            clearInterval(window.elementTimer);
            window.elementTimer = setInterval(updateCurrentElementInfo, 1000);
        }
        
        // Навигация по месяцам
        document.getElementById('prev-month').addEventListener('click', () => {
            currentMonth = (currentMonth - 1 + 12) % 12;
            renderCalendar(currentMonth);
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            currentMonth = (currentMonth + 1) % 12;
            renderCalendar(currentMonth);
        });
        
        // Первоначальная отрисовка
        renderCalendar(currentMonth);
    })
    .catch(error => console.error('Error loading calendar data:', error));
	if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./live/moon/sw.js');
}