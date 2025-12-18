 document.addEventListener('DOMContentLoaded', () => {
            const fadeDelay = 3500; 
            const img = document.getElementById('preloaderImg');
            setTimeout(() => { if (img) img.classList.add('hidden'); }, fadeDelay);

            // === ВАЖНО: КОЛИЧЕСТВО КАРТИНОК В ПАПКЕ ===
            const TOTAL_IMAGES = 16; 
            // ==========================================

            const galleryModal = document.getElementById('galleryModal');
            const videoModal = document.getElementById('videoModal');
            const imgA = document.getElementById('imgA');
            const imgB = document.getElementById('imgB');
            let activeImgElement = imgA; 
            let hiddenImgElement = imgB; 

            const galleryLoader = document.getElementById('galleryLoader');
            
            const btnOpen = document.getElementById('openGalleryBtn');
            const btnClose = document.getElementById('galleryClose');
            const videoOpenBtn = document.getElementById('openVideoBtn');
            const videoClose = document.getElementById('videoClose');
            const timeToggle = document.getElementById('timeToggle');
            const seasonToggle = document.getElementById('seasonToggle');
            
            let currentSeason = 'Summer'; 
            let currentTime = 'Day';      
            let currentImgIndex = 1;
            
            let isAnimating = false;

            function switchImage(targetIndex, animationType) {
                if (isAnimating) return;
                isAnimating = true;

                const folderName = `${currentSeason}_${currentTime}`;
                const path = `projects/20/img/${folderName}/${targetIndex}.jpg`;
                
                galleryLoader.style.display = 'block';
                hiddenImgElement.src = path;
                
                hiddenImgElement.onload = () => {
                    galleryLoader.style.display = 'none';
                    activeImgElement.className = 'gallery-image visible'; 
                    hiddenImgElement.className = 'gallery-image'; 

                    if (animationType === 'slide-next') {
                        hiddenImgElement.style.transform = 'translateX(100px)';
                        hiddenImgElement.style.opacity = '0';
                        void hiddenImgElement.offsetWidth;
                        activeImgElement.classList.add('slide-left');
                        hiddenImgElement.classList.add('visible'); 
                        hiddenImgElement.style.transform = ''; 
                        hiddenImgElement.style.opacity = '';
                    } 
                    else if (animationType === 'slide-prev') {
                        hiddenImgElement.style.transform = 'translateX(-100px)';
                        hiddenImgElement.style.opacity = '0';
                        void hiddenImgElement.offsetWidth;
                        activeImgElement.classList.add('slide-right');
                        hiddenImgElement.classList.add('visible');
                        hiddenImgElement.style.transform = ''; 
                        hiddenImgElement.style.opacity = '';
                    } 
                    else if (animationType === 'fade') {
                        activeImgElement.classList.add('blur');
                        hiddenImgElement.classList.add('visible'); 
                    }

                    setTimeout(() => {
                        activeImgElement.className = 'gallery-image'; 
                        activeImgElement.style.transform = '';
                        activeImgElement.style.opacity = '';
                        activeImgElement.style.filter = '';
                        hiddenImgElement.className = 'gallery-image visible'; 
                        let temp = activeImgElement;
                        activeImgElement = hiddenImgElement;
                        hiddenImgElement = temp;
                        currentImgIndex = targetIndex;
                        isAnimating = false;
                    }, 600); 
                };

                hiddenImgElement.onerror = () => {
                    galleryLoader.style.display = 'none';
                    isAnimating = false;
                };
            }

            // ОТКРЫТИЕ ГАЛЕРЕИ
            btnOpen.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Закрываем видео если открыто
                if (videoModal.classList.contains('active')) {
                    videoModal.classList.remove('active');
                }
                
                // Открываем галерею
                galleryModal.classList.add('active');
                const folderName = `${currentSeason}_${currentTime}`;
                activeImgElement.src = `projects/20/img/${folderName}/${currentImgIndex}.jpg`;
                activeImgElement.className = 'gallery-image visible';
                hiddenImgElement.className = 'gallery-image';
            });
            
            // ЗАКРЫТИЕ ГАЛЕРЕИ
            btnClose.addEventListener('click', () => {
                galleryModal.classList.remove('active');
            });

            // ОТКРЫТИЕ ВИДЕО
            videoOpenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Закрываем галерею если открыта
                if (galleryModal.classList.contains('active')) {
                    galleryModal.classList.remove('active');
                }
                
                // Открываем видео
                videoModal.classList.add('active');
                
                // Перезагружаем плеер для корректной работы
                const rutubePlayer = document.getElementById('rutubePlayer');
                const currentSrc = rutubePlayer.src;
                rutubePlayer.src = '';
                setTimeout(() => {
                    rutubePlayer.src = currentSrc;
                }, 100);
            });
            
            // ЗАКРЫТИЕ ВИДЕО
            videoClose.addEventListener('click', () => {
                videoModal.classList.remove('active');
                
                // Останавливаем видео
                const rutubePlayer = document.getElementById('rutubePlayer');
                rutubePlayer.src = rutubePlayer.src;
            });

            // НАВИГАЦИЯ ПО ГАЛЕРЕЕ
            document.getElementById('nextBtn').addEventListener('click', () => {
                let nextIndex = currentImgIndex + 1;
                if (nextIndex > TOTAL_IMAGES) nextIndex = 1; 
                switchImage(nextIndex, 'slide-next');
            });

            document.getElementById('prevBtn').addEventListener('click', () => {
                let prevIndex = currentImgIndex - 1;
                if (prevIndex < 1) prevIndex = TOTAL_IMAGES; 
                switchImage(prevIndex, 'slide-prev');
            });

            // ПЕРЕКЛЮЧАТЕЛИ ВРЕМЕНИ И СЕЗОНА
            seasonToggle.addEventListener('click', () => {
                seasonToggle.classList.toggle('active');
                const bg = seasonToggle.querySelector('.toggle-bg');
                currentSeason = seasonToggle.classList.contains('active') ? 'Winter' : 'Summer';
                bg.className = currentSeason === 'Winter' ? 'toggle-bg bg-winter' : 'toggle-bg bg-summer';
                switchImage(currentImgIndex, 'fade');
            });

            timeToggle.addEventListener('click', () => {
                timeToggle.classList.toggle('active');
                const bg = timeToggle.querySelector('.toggle-bg');
                currentTime = timeToggle.classList.contains('active') ? 'Night' : 'Day';
                bg.className = currentTime === 'Night' ? 'toggle-bg bg-night' : 'toggle-bg bg-day';
                switchImage(currentImgIndex, 'fade');
            });

            // Закрытие галереи по клику на фон
            galleryModal.addEventListener('click', (e) => {
                if (e.target === galleryModal) {
                    galleryModal.classList.remove('active');
                }
            });

            // Закрытие видео по клику на фон
            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) {
                    videoModal.classList.remove('active');
                    const rutubePlayer = document.getElementById('rutubePlayer');
                    rutubePlayer.src = rutubePlayer.src;
                }
            });

            // Управление с клавиатуры
            document.addEventListener('keydown', (e) => {
                // Если открыта галерея
                if (galleryModal.classList.contains('active')) {
                    switch(e.key) {
                        case 'Escape':
                            galleryModal.classList.remove('active');
                            break;
                        case 'ArrowLeft':
                            document.getElementById('prevBtn').click();
                            break;
                        case 'ArrowRight':
                            document.getElementById('nextBtn').click();
                            break;
                    }
                }
                
                // Если открыто видео
                if (videoModal.classList.contains('active')) {
                    if (e.key === 'Escape') {
                        videoModal.classList.remove('active');
                        const rutubePlayer = document.getElementById('rutubePlayer');
                        rutubePlayer.src = rutubePlayer.src;
                    }
                }
            });
        });