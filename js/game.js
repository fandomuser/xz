// Основной игровой класс
class Game {
    constructor() {
        console.log('Game constructor called');
        
        this.currentScene = "start";
        this.gameData = {
            currentScene: "start",
            inventory: [],
            visitedScenes: [],
            choices: {}
        };
        
        this.isLoading = true;
        this.textSpeed = 30;
        this.isTyping = false;
        this.currentTextInterval = null;
        this.fullText = "";
        this.audioInitialized = false;
        
        try {
            this.init();
        } catch (error) {
            console.error('Error in Game constructor:', error);
            this.showErrorScreen();
        }
    }
    
    init() {
        console.log('Initializing game...');
        
        try {
            this.loadElements();
            this.setupEventListeners();
            this.loadGame();
            this.simulateLoading();
            this.initializeAudio();
        } catch (error) {
            console.error('Error in init:', error);
            this.showErrorScreen();
        }
    }
    
    initializeAudio() {
        // Инициализируем аудио после загрузки страницы
        if (window.audioManager) {
            this.audioInitialized = true;
            console.log("Audio manager initialized");
        } else {
            console.warn("Audio manager not available");
        }
    }
    
    loadElements() {
        console.log('Loading DOM elements...');
        
        // Проверяем существование всех элементов
        const elements = {
            loadingScreen: document.getElementById('loading-screen'),
            loadingBar: document.getElementById('loading-bar'),
            mainMenu: document.getElementById('main-menu'),
            gameScreen: document.getElementById('game-screen'),
            settingsScreen: document.getElementById('settings-screen'),
            creditsScreen: document.getElementById('credits-screen'),
            
            background: document.getElementById('background'),
            character: document.getElementById('character'),
            speakerName: document.getElementById('speaker-name'),
            dialogueText: document.getElementById('dialogue-text'),
            choicesContainer: document.getElementById('choices-container'),
            
            playButton: document.getElementById('play-button'),
            continueButton: document.getElementById('continue-button'),
            settingsButton: document.getElementById('settings-button'),
            creditsButton: document.getElementById('credits-button'),
            settingsBack: document.getElementById('settings-back'),
            creditsBack: document.getElementById('credits-back'),
            backButton: document.getElementById('back-button'),
            soundToggle: document.getElementById('sound-toggle'),
            
            musicVolume: document.getElementById('music-volume'),
            sfxVolume: document.getElementById('sfx-volume')
        };
        
        // Проверяем, что все основные элементы существуют
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.warn(`Element ${key} not found`);
            }
        }
        
        this.elements = elements;
        
        // Проверяем критически важные элементы
        if (!this.elements.loadingScreen || !this.elements.loadingBar) {
            throw new Error('Critical loading elements not found');
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        try {
            // Кнопки меню
            if (this.elements.playButton) {
                this.elements.playButton.addEventListener('click', () => this.startNewGame());
            }
            if (this.elements.continueButton) {
                this.elements.continueButton.addEventListener('click', () => this.continueGame());
            }
            if (this.elements.settingsButton) {
                this.elements.settingsButton.addEventListener('click', () => this.showSettings());
            }
            if (this.elements.creditsButton) {
                this.elements.creditsButton.addEventListener('click', () => this.showCredits());
            }
            if (this.elements.settingsBack) {
                this.elements.settingsBack.addEventListener('click', () => this.hideSettings());
            }
            if (this.elements.creditsBack) {
                this.elements.creditsBack.addEventListener('click', () => this.hideCredits());
            }
            if (this.elements.backButton) {
                this.elements.backButton.addEventListener('click', () => this.backToMenu());
            }
            if (this.elements.soundToggle) {
                this.elements.soundToggle.addEventListener('click', () => this.toggleSound());
            }
            
            // Настройки громкости
            if (this.elements.musicVolume) {
                this.elements.musicVolume.addEventListener('input', (e) => {
                    if (window.audioManager) {
                        audioManager.setMusicVolume(e.target.value / 100);
                    }
                });
            }
            
            if (this.elements.sfxVolume) {
                this.elements.sfxVolume.addEventListener('input', (e) => {
                    if (window.audioManager) {
                        audioManager.setSfxVolume(e.target.value / 100);
                    }
                });
            }
            
            // Обработка клика по тексту для ускорения/пропуска
            if (this.elements.dialogueText) {
                this.elements.dialogueText.addEventListener('click', () => {
                    if (this.isTyping) {
                        this.skipTyping();
                    }
                });
            }

            // Добавляем тач-события для мобильных устройств
            this.setupTouchEvents();
            
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }
    
    setupTouchEvents() {
        // Добавляем тач-события для всех интерактивных элементов
        const interactiveElements = [
            this.elements.playButton,
            this.elements.continueButton,
            this.elements.settingsButton,
            this.elements.creditsButton,
            this.elements.settingsBack,
            this.elements.creditsBack,
            this.elements.backButton,
            this.elements.soundToggle
        ];
        
        interactiveElements.forEach(element => {
            if (element) {
                // Добавляем touchstart для мгновенного отклика
                element.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    element.style.transform = 'scale(0.96)';
                    element.style.backgroundColor = '#700202';
                });
                
                element.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    element.style.transform = '';
                    element.style.backgroundColor = '';
                    
                    // Для звуков на мобильных - небольшая задержка
                    setTimeout(() => {
                        element.click();
                    }, 50);
                });
                
                element.addEventListener('touchcancel', (e) => {
                    e.preventDefault();
                    element.style.transform = '';
                    element.style.backgroundColor = '';
                });
            }
        });
        
        // Обработка тач-событий для кнопок выбора
        if (this.elements.choicesContainer) {
            this.elements.choicesContainer.addEventListener('touchstart', (e) => {
                if (e.target.classList.contains('choice-button')) {
                    e.target.style.transform = 'scale(0.96)';
                    e.target.style.backgroundColor = '#700202';
                }
            }, { passive: true });
            
            this.elements.choicesContainer.addEventListener('touchend', (e) => {
                if (e.target.classList.contains('choice-button')) {
                    e.target.style.transform = '';
                    e.target.style.backgroundColor = '';
                }
            }, { passive: true });
        }
        
        // Обработка тапа по тексту для пропуска
        if (this.elements.dialogueText) {
            this.elements.dialogueText.addEventListener('touchstart', (e) => {
                if (this.isTyping) {
                    this.skipTyping();
                }
            }, { passive: true });
        }
    }
    
    // Добавляем определение типа устройства
    isMobileDevice() {
        return (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
        );
    }
    
    simulateLoading() {
        console.log('Starting loading simulation...');
        
        try {
            let progress = 0;
            const maxProgress = 100;
            const intervalTime = 30;
            
            const interval = setInterval(() => {
                progress += 1;
                
                if (this.elements.loadingBar) {
                    this.elements.loadingBar.style.width = `${progress}%`;
                }
                
                if (progress >= maxProgress) {
                    clearInterval(interval);
                    console.log('Loading complete');
                    
                    setTimeout(() => {
                        if (this.elements.loadingScreen && this.elements.mainMenu) {
                            this.elements.loadingScreen.style.display = 'none';
                            this.elements.mainMenu.style.display = 'flex';
                            this.isLoading = false;
                            console.log('Game ready');
                        }
                    }, 500);
                }
            }, intervalTime);
        } catch (error) {
            console.error('Error in loading simulation:', error);
            // Если загрузка сломалась, показываем меню сразу
            if (this.elements.loadingScreen && this.elements.mainMenu) {
                this.elements.loadingScreen.style.display = 'none';
                this.elements.mainMenu.style.display = 'flex';
            }
        }
    }
    
    showErrorScreen() {
        console.error('Showing error screen');
        // Простой fallback - показываем меню
        const loadingScreen = document.getElementById('loading-screen');
        const mainMenu = document.getElementById('main-menu');
        
        if (loadingScreen && mainMenu) {
            loadingScreen.style.display = 'none';
            mainMenu.style.display = 'flex';
        }
    }
    
    startNewGame() {
        console.log('Starting new game');
        try {
            this.gameData = {
                currentScene: "start",
                inventory: [],
                visitedScenes: [],
                choices: {}
            };
            
            if (this.elements.mainMenu && this.elements.gameScreen) {
                this.elements.mainMenu.style.display = 'none';
                this.elements.gameScreen.style.display = 'flex';
            }
            
            // Задержка для стабильности аудио
            setTimeout(() => {
                if (window.audioManager && this.audioInitialized) {
                    audioManager.playMusic("ambient");
                }
            }, 100);
            
            this.showScene("start");
        } catch (error) {
            console.error('Error starting new game:', error);
        }
    }
    
    continueGame() {
        console.log('Continuing game');
        try {
            if (this.elements.mainMenu && this.elements.gameScreen) {
                this.elements.mainMenu.style.display = 'none';
                this.elements.gameScreen.style.display = 'flex';
            }
            this.showScene(this.gameData.currentScene);
        } catch (error) {
            console.error('Error continuing game:', error);
        }
    }
    
    showSettings() {
        if (this.elements.mainMenu && this.elements.settingsScreen) {
            this.elements.mainMenu.style.display = 'none';
            this.elements.settingsScreen.style.display = 'flex';
        }
    }
    
    hideSettings() {
        if (this.elements.settingsScreen && this.elements.mainMenu) {
            this.elements.settingsScreen.style.display = 'none';
            this.elements.mainMenu.style.display = 'flex';
        }
    }
    
    showCredits() {
        if (this.elements.mainMenu && this.elements.creditsScreen) {
            this.elements.mainMenu.style.display = 'none';
            this.elements.creditsScreen.style.display = 'flex';
        }
    }
    
    hideCredits() {
        if (this.elements.creditsScreen && this.elements.mainMenu) {
            this.elements.creditsScreen.style.display = 'none';
            this.elements.mainMenu.style.display = 'flex';
        }
    }
    
    backToMenu() {
        if (confirm("Вы уверены, что хотите вернуться в меню? Весь прогресс будет сохранен.")) {
            if (this.elements.gameScreen && this.elements.mainMenu) {
                this.elements.gameScreen.style.display = 'none';
                this.elements.mainMenu.style.display = 'flex';
            }
            if (window.audioManager) {
                audioManager.stopMusic();
            }
            this.saveGame();
        }
    }
    
    toggleSound() {
        if (window.audioManager) {
            const isMuted = audioManager.toggleMute();
            if (this.elements.soundToggle) {
                this.elements.soundToggle.textContent = isMuted ? "🔇 БЕЗ ЗВУКА" : "🔊 ЗВУК";
            }
        }
    }
    
    playSoundSafe(soundName) {
        if (!window.audioManager || !this.audioInitialized) {
            console.log("Audio not ready for:", soundName);
            return;
        }
        
        try {
            // Небольшая задержка для стабильности
            setTimeout(() => {
                audioManager.playSound(soundName);
            }, 10);
        } catch (error) {
            console.warn("Error playing sound:", soundName, error);
        }
    }
    
    showScene(sceneId) {
        console.log('Showing scene:', sceneId);
        
        try {
            // Останавливаем текущую анимацию текста, если она есть
            this.skipTyping();
            
            // Защита от несуществующих сцен
            if (!story[sceneId]) {
                console.error("Сцена не найдена:", sceneId);
                this.showScene("development_note");
                return;
            }
            
            const scene = story[sceneId];
            
            // Обновляем фон
            if (this.elements.background) {
                this.elements.background.style.backgroundImage = `url('${scene.background}')`;
            }
            
            // Обновляем персонажа
            if (this.elements.character) {
                this.elements.character.style.backgroundImage = `url('${scene.character}')`;
            }
            
            // Для мобильных устройств делаем текст немного больше
            if (this.isMobileDevice() && this.elements.dialogueText) {
                this.elements.dialogueText.style.fontSize = '1rem';
            }
            
            // Обновляем музыку с задержкой
            if (scene.music && window.audioManager && this.audioInitialized) {
                setTimeout(() => {
                    audioManager.playMusic(scene.music);
                }, 50);
            }
            
            // Воспроизводим звук сцены с задержкой
            if (scene.sound && window.audioManager && this.audioInitialized) {
                setTimeout(() => {
                    this.playSoundSafe(scene.sound);
                }, 200);
            }
            
            // Показываем имя говорящего
            if (this.elements.speakerName) {
                this.elements.speakerName.textContent = scene.speaker;
            }
            
            // Начинаем анимацию текста
            if (this.elements.dialogueText) {
                this.typeText(scene.text, this.elements.dialogueText);
            }
            
            // Очищаем и добавляем кнопки выбора
            if (this.elements.choicesContainer) {
                this.elements.choicesContainer.innerHTML = '';
                scene.choices.forEach(choice => {
                    const button = document.createElement('div');
                    button.className = 'choice-button';
                    button.textContent = choice.text;
                    
                    // Обработчик клика с улучшенной логикой звуков
                    button.addEventListener('click', () => {
                        // Всегда сначала воспроизводим звук клика
                        this.playSoundSafe("click");
                        
                        // Если текст еще печатается, сначала показываем его полностью
                        if (this.isTyping) {
                            this.skipTyping();
                            // Задержка перед переходом
                            setTimeout(() => {
                                this.makeChoice(choice.next);
                            }, 150);
                        } else {
                            // Немедленный переход если текст уже показан
                            this.makeChoice(choice.next);
                        }
                    });
                    
                    this.elements.choicesContainer.appendChild(button);
                });
            }
            
            // Сохраняем текущую сцену
            this.gameData.currentScene = sceneId;
            if (!this.gameData.visitedScenes.includes(sceneId)) {
                this.gameData.visitedScenes.push(sceneId);
            }
            
            this.saveGame();
            
        } catch (error) {
            console.error('Error showing scene:', error);
            this.showScene("development_note");
        }
    }
    
    typeText(text, element) {
        try {
            // Останавливаем предыдущую анимацию, если она есть
            if (this.currentTextInterval) {
                clearInterval(this.currentTextInterval);
                this.currentTextInterval = null;
            }
            
            // Сбрасываем состояние
            this.isTyping = true;
            this.fullText = text;
            element.innerHTML = '';
            
            let i = 0;
            this.currentTextInterval = setInterval(() => {
                if (i < text.length) {
                    // Добавляем по одному символу
                    element.innerHTML += text.charAt(i);
                    i++;
                } else {
                    // Текст полностью напечатан
                    clearInterval(this.currentTextInterval);
                    this.currentTextInterval = null;
                    this.isTyping = false;
                }
            }, this.textSpeed);
        } catch (error) {
            console.error('Error typing text:', error);
            element.innerHTML = text;
            this.isTyping = false;
        }
    }
    
    skipTyping() {
        if (this.currentTextInterval) {
            clearInterval(this.currentTextInterval);
            this.currentTextInterval = null;
        }
        
        if (this.isTyping && this.elements.dialogueText) {
            this.elements.dialogueText.innerHTML = this.fullText;
            this.isTyping = false;
        }
    }
    
    makeChoice(nextScene) {
        this.showScene(nextScene);
    }
    
    saveGame() {
        try {
            localStorage.setItem('iAmNotSubhanSave', JSON.stringify(this.gameData));
        } catch (error) {
            console.error('Error saving game:', error);
        }
    }
    
    loadGame() {
        try {
            const savedGame = localStorage.getItem('iAmNotSubhanSave');
            if (savedGame) {
                this.gameData = JSON.parse(savedGame);
                if (this.elements.continueButton) {
                    this.elements.continueButton.style.display = 'block';
                }
            } else {
                if (this.elements.continueButton) {
                    this.elements.continueButton.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error loading game:', error);
        }
    }
}

// Запускаем игру когда страница загружена
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, starting game...');
    try {
        window.game = new Game();
        
        // Дополнительная инициализация аудио после полной загрузки
        setTimeout(() => {
            if (window.audioManager) {
                window.game.audioInitialized = true;
                console.log("Audio fully initialized");
            }
        }, 1000);
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        const loadingScreen = document.getElementById('loading-screen');
        const mainMenu = document.getElementById('main-menu');
        if (loadingScreen && mainMenu) {
            loadingScreen.style.display = 'none';
            mainMenu.style.display = 'flex';
        }
    }
});

// Добавляем обработчик ошибок
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});
