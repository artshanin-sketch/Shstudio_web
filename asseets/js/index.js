document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы только когда страница загрузилась
    const cursor = document.getElementById('cursor');
    const cursorBackdrop = document.querySelector('.cursor-backdrop');
    const cursorText = document.querySelector('.cursor-text');
    
    const videoContainer = document.getElementById('videoContainer');
    const skipBtn = document.getElementById('skipBtn');
    const skipUi = document.getElementById('skipUi');
    const video = document.getElementById('mainVideo');
    const body = document.body;
    const html = document.documentElement;
    const videoClickArea = document.getElementById('videoClickArea');
    
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutPanel = document.getElementById('aboutPanel');
    const closePanelBtn = document.getElementById('closePanelBtn');

    // --- КУРСОР (АНИМАЦИЯ) ---
    let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
    let cursorX = window.innerWidth/2, cursorY = window.innerHeight/2;
    let isCursorActive = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
    });

    function animate() {
        const distX = mouseX - cursorX;
        const distY = mouseY - cursorY;
        cursorX += distX * 0.08; 
        cursorY += distY * 0.08;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursor.style.transform = `translate(-50%, -50%)`;

        const velocity = Math.sqrt(distX*distX + distY*distY);
        const stretch = Math.min(velocity * 0.002, 0.15); 
        const angle = Math.atan2(distY, distX);

        if (isCursorActive) {
            cursorBackdrop.style.transform = `rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch})`;
            
            let textShiftX = distX * 0.15;
            let textShiftY = distY * 0.15;
            const maxShift = 50;
            const shiftLen = Math.sqrt(textShiftX*textShiftX + textShiftY*textShiftY);
            if (shiftLen > maxShift) {
                const ratio = maxShift / shiftLen;
                textShiftX *= ratio; textShiftY *= ratio;
            }
            cursorText.style.transform = `translate(${textShiftX}px, ${textShiftY}px)`;
        }
        requestAnimationFrame(animate);
    }
    animate();

    // --- ЛОГИКА КУРСОВА / ЗВУКА ---
    // Курсор показываем, если НЕ открыта панель "О нас"
    videoClickArea.addEventListener('mouseenter', () => {
        if (!aboutPanel.classList.contains('open')) {
            isCursorActive = true;
            cursor.classList.add('visible');
        }
    });
    
    videoClickArea.addEventListener('mouseleave', () => {
        isCursorActive = false;
        cursor.classList.remove('visible');
        cursorBackdrop.style.transform = `scale(1)`;
        cursorText.style.transform = `translate(0, 0)`;
    });
    
    // Клик по видео (Звук)
    videoClickArea.addEventListener('click', () => {
        // Звук можно менять, если мы в интро ИЛИ если видео свернуто
        if (body.classList.contains('noscroll') || body.classList.contains('scrolled-state')) {
             if (video.muted) {
                video.muted = false; video.volume = 1.0; cursorText.innerText = "ВЫКЛ";
            } else {
                video.muted = true; cursorText.innerText = "ЗВУК";
            }
        }
    });

    // --- КНОПКА ПРОПУСТИТЬ ---
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            skipUi.classList.add('ui-hidden');
            
            // Прячем курсор на секунду
            isCursorActive = false;
            cursor.classList.remove('visible');
            
            // 1. Активируем состояние свернутого видео
            body.classList.add('scrolled-state');
            
            // 2. СНИМАЕМ БЛОКИРОВКУ СКРОЛЛА
            body.classList.remove('noscroll');
            html.classList.remove('noscroll');
            
            video.muted = true;
        });
    }

    // --- ЛОГИКА ПАНЕЛИ "О НАС" ---
    if (aboutBtn) {
        aboutBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            aboutPanel.classList.add('open');
            // Блокируем скролл, когда открыта панель
            body.classList.add('noscroll'); 
            html.classList.add('noscroll');
            // Убираем взаимодействие с видео
            videoClickArea.style.pointerEvents = 'none';
        });
    }

    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', () => {
            aboutPanel.classList.remove('open');
            
            // Если мы уже прошли интро (видео свернуто) - разблокируем скролл
            if (body.classList.contains('scrolled-state')) {
                body.classList.remove('noscroll');
                html.classList.remove('noscroll');
                videoClickArea.style.pointerEvents = 'auto'; // Возвращаем клики видео
            } else {
                // Если мы открыли панель прямо из интро (теоретически), скролл должен остаться заблокирован
                // Но у нас кнопка "О нас" скрыта в интро, так что это редкий кейс.
                videoClickArea.style.pointerEvents = 'auto'; 
            }
        });
    }

    // --- ЛОГИКА СКРОЛЛА (РАЗВОРОТ ВИДЕО) ---
    let isExpanded = false;
    
    window.addEventListener('scroll', () => {
        // Работаем только если видео свернуто и панель закрыта
        if (!body.classList.contains('scrolled-state') || aboutPanel.classList.contains('open')) return;
        
        const scrollY = window.scrollY;
        
        // Если прокрутили больше 100px вниз
        if (scrollY > 100) {
            if (!isExpanded) {
                body.classList.add('expanded-state');
                isExpanded = true;
            }
        } else {
            if (isExpanded) {
                body.classList.remove('expanded-state');
                isExpanded = false;
            }
        }
    });
});