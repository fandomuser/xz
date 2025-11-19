// Основной игровой класс - оптимизированная версия
class Game {
    constructor() {
        this.currentScene = "start";
        this.gameData = {
            currentScene: "start",
            inventory: [],
            visitedScenes: new Set(),
            choices: new Map(),
            sanity: 100
        };
        
        this.isLoading = true;
        this.isRunning = false;
        this.textSpeed = 30;
        this.isTyping = false;
        this.currentTextInterval = null;
        this.fullText = "";
        this.audioManager = null;
        
        this.elements = {};
        this.pendingScene = null;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadElements();
            this.setupEventListeners();
            this.loadGame();
            this.simulateLoading();
            await this.initializeAudio();
        } catch (error) {
            console.error('Ошибка инициализации:', error);
            this.showErrorScreen();
        }
    }
    
    async initializeAudio() {
        // Ждем инициализации аудио менеджера
        if (window.audioManager) {
            this.audioManager = window.audioManager;
            // Даем время на загрузку аудио
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log("Аудио менеджер готов");
        } else {
            console.warn("Аудио менеджер не доступен");
        }
    }
    
    loadElements() {
        const elementIds = [
            'loading-screen', 'loading-bar', 'main-menu', 'game-screen',
            'settings-screen', 'credits-screen', 'background', 'character',
            'speaker-name', 'dialogue-text', 'choices-container', 'play-button',
            'continue-button', 'settings-button', 'credits-button', 'settings-back',
            'credits-back', 'back-button', 'sound-toggle', 'music-volume', 'sfx-volume'
        ];
        
        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
        
        // Проверяем критические элементы
        if (!this.elements.loadingScreen || !this.elements.loadingBar) {
            throw new Error('Критические элементы не найдены');
        }
        
        return Promise.resolve();
    }
    
    setupEventListeners() {
        // Кнопки меню
        this.setupButton('play-button', () => this.startNewGame());
        this.setupButton('continue-button', () => this.continueGame());
        this.setupButton('settings-button', () => this.showSettings());
        this.setupButton('credits-button', () => this.showCredits());
        this.setupButton('settings-back', () => this.hideSettings());
        this.setupButton('credits-back', () => this.hideCredits());
        this.setupButton('back-button', () => this.backToMenu());
        this.setupButton('sound-toggle', () => this.toggleSound());
        
        // Настройки громкости
        if (this.elements['music-volume']) {
            this.elements['music-volume'].addEventListener('input', (e) => {
                if (this.audioManager) {
                    this.audioManager.setMusicVolume(e.target.value / 100);
                }
            });
        }
        
        if (this.elements['sfx-volume']) {
            this.elements['sfx-volume'].addEventListener('input', (e) => {
                if (this.audioManager) {
                    this.audioManager.setSfxVolume(e.target.value / 100);
                }
            });
        }
        
        // Обработка текста
        if (this.elements['dialogue-text']) {
            this.elements['dialogue-text'].addEventListener('click', () => {
                if (this.isTyping) {
                    this.skipTyping();
                } else if (this.pendingScene) {
                    this.processPendingScene();
                }
            });
            
            // Тач-события для мобильных
            this.elements['dialogue-text'].addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.isTyping) {
                    this.skipTyping();
                } else if (this.pendingScene) {
                    this.processPendingScene();
                }
            }, { passive: false });
        }
        
        this.setupTouchEvents();
    }
    
    setupButton(elementId, handler) {
        if (this.elements[elementId]) {
            this.elements[elementId].addEventListener('click', handler);
        }
    }
    
    setupTouchEvents() {
        const touchElements = [
            'play-button', 'continue-button', 'settings-button', 'credits-button',
            'settings-back', 'credits-back', 'back-button', 'sound-toggle'
        ];
        
        touchElements.forEach(elementId => {
            const element = this.elements[elementId];
            if (!element) return;
            
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                element.style.transform = 'scale(0.96)';
                element.style.opacity = '0.8';
            }, { passive: false });
            
            element.addEventListener('touchend', (e) => {
                e.preventDefault();
                element.style.transform = '';
                element.style.opacity = '';
                setTimeout(() => element.click(), 50);
            }, { passive: false });
            
            element.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                element.style.transform = '';
                element.style.opacity = '';
            }, { passive: false });
        });
        
        // Обработка выбора для мобильных
        if (this.elements['choices-container']) {
            this.elements['choices-container'].addEventListener('touchstart', (e) => {
                if (e.target.classList.contains('choice-button')) {
                    e.target.style.transform = 'scale(0.96)';
                    e.target.style.opacity = '0.8';
                }
            }, { passive: true });
            
            this.elements['choices-container'].addEventListener('touchend', (e) => {
                if (e.target.classList.contains('choice-button')) {
                    e.target.style.transform = '';
                    e.target.style.opacity = '';
                }
            }, { passive: true });
        }
    }
    
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    
    simulateLoading() {
        return new Promise((resolve) => {
            let progress = 0;
            const maxProgress = 100;
            const intervalTime = 20;
            
            const interval = setInterval(() => {
                progress += 1;
                
                if (this.elements['loading-bar']) {
                    this.elements['loading-bar'].style.width = `${progress}%`;
                }
                
                if (progress >= maxProgress) {
                    clearInterval(interval);
                    setTimeout(() => {
                        this.hideLoadingScreen();
                        resolve();
                    }, 500);
                }
            }, intervalTime);
        });
    }
    
    hideLoadingScreen() {
        if (this.elements['loading-screen'] && this.elements['main-menu']) {
            this.elements['loading-screen'].style.display = 'none';
            this.elements['main-menu'].style.display = 'flex';
            this.isLoading = false;
        }
    }
    
    showErrorScreen() {
        if (this.elements['loading-screen'] && this.elements['main-menu']) {
            this.elements['loading-screen'].style.display = 'none';
            this.elements['main-menu'].style.display = 'flex';
        }
    }
    
    startNewGame() {
        console.log('Запуск новой игры');
        
        this.gameData = {
            currentScene: "start",
            inventory: [],
            visitedScenes: new Set(["start"]),
            choices: new Map(),
            sanity: 100
        };
        
        this.showScreen('game-screen');
        this.showScene("start");
    }
    
    continueGame() {
        console.log('Продолжение игры');
        this.showScreen('game-screen');
        this.showScene(this.gameData.currentScene);
    }
    
    showScreen(screenName) {
        // Скрываем все экраны
        const screens = ['main-menu', 'game-screen', 'settings-screen', 'credits-screen'];
        screens.forEach(screen => {
            if (this.elements[screen]) {
                this.elements[screen].style.display = 'none';
            }
        });
        
        // Показываем нужный экран
        if (this.elements[screenName]) {
            this.elements[screenName].style.display = 'flex';
        }
        
        // Для игрового экрана запускаем музыку
        if (screenName === 'game-screen' && this.audioManager) {
            setTimeout(() => {
                this.audioManager.playMusic("ambient");
            }, 300);
        }
    }
    
    showSettings() {
        this.showScreen('settings-screen');
    }
    
    hideSettings() {
        this.showScreen('main-menu');
    }
    
    showCredits() {
        this.showScreen('credits-screen');
    }
    
    hideCredits() {
        this.showScreen('main-menu');
    }
    
    backToMenu() {
        if (confirm("Вернуться в меню? Прогресс будет сохранен.")) {
            if (this.audioManager) {
                this.audioManager.stopMusic();
            }
            this.saveGame();
            this.showScreen('main-menu');
        }
    }
    
    toggleSound() {
        if (this.audioManager) {
            const isMuted = this.audioManager.toggleMute();
            if (this.elements['sound-toggle']) {
                this.elements['sound-toggle'].textContent = isMuted ? "🔇 БЕЗ ЗВУКА" : "🔊 ЗВУК";
            }
        }
    }
    
    playSound(soundName) {
        if (!this.audioManager) return;
        
        try {
            setTimeout(() => {
                this.audioManager.playSound(soundName);
            }, 10);
        } catch (error) {
            console.warn("Ошибка воспроизведения звука:", soundName, error);
        }
    }
    
    showScene(sceneId) {
        if (this.isTyping) {
            this.pendingScene = sceneId;
            this.skipTyping();
            return;
        }
        
        this.processScene(sceneId);
    }
    
    processPendingScene() {
        if (this.pendingScene) {
            const sceneId = this.pendingScene;
            this.pendingScene = null;
            this.processScene(sceneId);
        }
    }
    
    processScene(sceneId) {
        console.log('Переход к сцене:', sceneId);
        
        // Останавливаем текущую анимацию
        this.skipTyping();
        
        // Проверяем существование сцены
        if (!story[sceneId]) {
            console.error("Сцена не найдена:", sceneId);
            this.processScene("development_note");
            return;
        }
        
        const scene = story[sceneId];
        
        // Обновляем визуальные элементы
        this.updateBackground(scene.background);
        this.updateCharacter(scene.character);
        
        // Обновляем аудио
        this.updateAudio(scene.music, scene.sound);
        
        // Обновляем текст
        this.updateText(scene.speaker, scene.text);
        
        // Обновляем выборы
        this.updateChoices(scene.choices);
        
        // Сохраняем прогресс
        this.saveSceneProgress(sceneId);
    }
    
    updateBackground(background) {
        if (this.elements['background'] && background) {
            this.elements['background'].style.backgroundImage = `url('${background}')`;
        }
    }
    
    updateCharacter(character) {
        if (this.elements['character'] && character) {
            this.elements['character'].style.backgroundImage = `url('${character}')`;
        }
    }
    
    updateAudio(music, sound) {
        if (this.audioManager) {
            if (music) {
                setTimeout(() => {
                    this.audioManager.playMusic(music);
                }, 50);
            }
            
            if (sound) {
                setTimeout(() => {
                    this.playSound(sound);
                }, 200);
            }
        }
    }
    
    updateText(speaker, text) {
        if (this.elements['speaker-name']) {
            this.elements['speaker-name'].textContent = speaker || "";
        }
        
        if (this.elements['dialogue-text'] && text) {
            this.typeText(text, this.elements['dialogue-text']);
        }
    }
    
    updateChoices(choices) {
        if (!this.elements['choices-container']) return;
        
        this.elements['choices-container'].innerHTML = '';
        
        if (!choices || choices.length === 0) {
            // Если нет выбора, добавляем кнопку продолжения
            const continueButton = document.createElement('div');
            continueButton.className = 'choice-button';
            continueButton.textContent = 'Продолжить';
            continueButton.addEventListener('click', () => {
                this.playSound("click");
                this.pendingScene = "start"; // или другая логика продолжения
            });
            this.elements['choices-container'].appendChild(continueButton);
            return;
        }
        
        choices.forEach(choice => {
            const button = document.createElement('div');
            button.className = 'choice-button';
            button.textContent = choice.text;
            
            button.addEventListener('click', () => {
                this.playSound("click");
                
                if (this.isTyping) {
                    this.pendingScene = choice.next;
                    this.skipTyping();
                } else {
                    this.showScene(choice.next);
                }
            });
            
            this.elements['choices-container'].appendChild(button);
        });
    }
    
    typeText(text, element) {
        this.skipTyping(); // Останавливаем предыдущую анимацию
        
        this.isTyping = true;
        this.fullText = text;
        element.textContent = '';
        
        let index = 0;
        this.currentTextInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                this.finishTyping();
            }
        }, this.textSpeed);
    }
    
    skipTyping() {
        if (this.currentTextInterval) {
            clearInterval(this.currentTextInterval);
            this.currentTextInterval = null;
        }
        
        if (this.isTyping && this.elements['dialogue-text']) {
            this.elements['dialogue-text'].textContent = this.fullText;
            this.finishTyping();
        }
    }
    
    finishTyping() {
        this.isTyping = false;
        this.currentTextInterval = null;
    }
    
    saveSceneProgress(sceneId) {
        this.gameData.currentScene = sceneId;
        this.gameData.visitedScenes.add(sceneId);
        this.saveGame();
    }
    
    saveGame() {
        try {
            // Преобразуем Set в Array для сохранения
            const saveData = {
                ...this.gameData,
                visitedScenes: Array.from(this.gameData.visitedScenes),
                choices: Array.from(this.gameData.choices)
            };
            localStorage.setItem('iAmNotSubhanSave', JSON.stringify(saveData));
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        }
    }
    
    loadGame() {
        try {
            const saved = localStorage.getItem('iAmNotSubhanSave');
            if (saved) {
                const loaded = JSON.parse(saved);
                this.gameData = {
                    ...loaded,
                    visitedScenes: new Set(loaded.visitedScenes || []),
                    choices: new Map(loaded.choices || [])
                };
                
                if (this.elements['continue-button']) {
                    this.elements['continue-button'].style.display = 'block';
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            this.gameData.visitedScenes = new Set(["start"]);
        }
    }
}

// Инициализация игры после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запуск игры...');
    
    // Даем время на загрузку аудио менеджера
    setTimeout(() => {
        try {
            window.game = new Game();
        } catch (error) {
            console.error('Критическая ошибка инициализации:', error);
            // Аварийный показ меню
            const loadingScreen = document.getElementById('loading-screen');
            const mainMenu = document.getElementById('main-menu');
            if (loadingScreen && mainMenu) {
                loadingScreen.style.display = 'none';
                mainMenu.style.display = 'flex';
            }
        }
    }, 100);
});

// Глобальный обработчик ошибок
window.addEventListener('error', (event) => {
    console.error('Глобальная ошибка:', event.error);
});
