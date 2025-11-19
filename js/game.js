// Основной игровой класс - простая рабочая версия
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
        
        this.init();
    }
    
    init() {
        console.log('Initializing game...');
        
        this.loadElements();
        this.setupEventListeners();
        this.loadGame();
        this.simulateLoading();
    }
    
    loadElements() {
        console.log('Loading DOM elements...');
        
        // Загружаем все необходимые элементы
        this.elements = {
            // Экран загрузки
            loadingScreen: document.getElementById('loading-screen'),
            loadingBar: document.getElementById('loading-bar'),
            
            // Основные экраны
            mainMenu: document.getElementById('main-menu'),
            gameScreen: document.getElementById('game-screen'),
            settingsScreen: document.getElementById('settings-screen'),
            creditsScreen: document.getElementById('credits-screen'),
            
            // Игровые элементы
            background: document.getElementById('background'),
            character: document.getElementById('character'),
            speakerName: document.getElementById('speaker-name'),
            dialogueText: document.getElementById('dialogue-text'),
            choicesContainer: document.getElementById('choices-container'),
            
            // Кнопки меню
            playButton: document.getElementById('play-button'),
            continueButton: document.getElementById('continue-button'),
            settingsButton: document.getElementById('settings-button'),
            creditsButton: document.getElementById('credits-button'),
            settingsBack: document.getElementById('settings-back'),
            creditsBack: document.getElementById('credits-back'),
            backButton: document.getElementById('back-button'),
            soundToggle: document.getElementById('sound-toggle'),
            
            // Настройки
            musicVolume: document.getElementById('music-volume'),
            sfxVolume: document.getElementById('sfx-volume')
        };
        
        console.log('Elements loaded:', this.elements);
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Основные кнопки меню
        this.elements.playButton?.addEventListener('click', () => this.startNewGame());
        this.elements.continueButton?.addEventListener('click', () => this.continueGame());
        this.elements.settingsButton?.addEventListener('click', () => this.showSettings());
        this.elements.creditsButton?.addEventListener('click', () => this.showCredits());
        this.elements.settingsBack?.addEventListener('click', () => this.hideSettings());
        this.elements.creditsBack?.addEventListener('click', () => this.hideCredits());
        this.elements.backButton?.addEventListener('click', () => this.backToMenu());
        this.elements.soundToggle?.addEventListener('click', () => this.toggleSound());
        
        // Настройки громкости
        this.elements.musicVolume?.addEventListener('input', (e) => {
            if (window.audioManager) {
                audioManager.setMusicVolume(e.target.value);
            }
        });
        
        this.elements.sfxVolume?.addEventListener('input', (e) => {
            if (window.audioManager) {
                audioManager.setSfxVolume(e.target.value);
            }
        });
        
        // Клик по тексту для пропуска анимации
        this.elements.dialogueText?.addEventListener('click', () => {
            if (this.isTyping) {
                this.skipTyping();
            }
        });
        
        console.log('Event listeners setup completed');
    }
    
    simulateLoading() {
        console.log('Starting loading simulation...');
        
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
                    this.hideLoadingScreen();
                }, 500);
            }
        }, intervalTime);
    }
    
    hideLoadingScreen() {
        if (this.elements.loadingScreen && this.elements.mainMenu) {
            this.elements.loadingScreen.style.display = 'none';
            this.elements.mainMenu.style.display = 'flex';
            this.isLoading = false;
            console.log('Game ready');
        }
    }
    
    startNewGame() {
        console.log('Starting new game');
        this.gameData = {
            currentScene: "start",
            inventory: [],
            visitedScenes: [],
            choices: {}
        };
        
        this.showScreen('game-screen');
        this.showScene("start");
    }
    
    continueGame() {
        console.log('Continuing game');
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
        if (screenName === 'game-screen' && window.audioManager) {
            setTimeout(() => {
                audioManager.playMusic("ambient");
            }, 100);
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
        if (confirm("Вы уверены, что хотите вернуться в меню? Весь прогресс будет сохранен.")) {
            if (window.audioManager) {
                audioManager.stopMusic();
            }
            this.saveGame();
            this.showScreen('main-menu');
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
    
    playSound(soundName) {
        if (!window.audioManager) return;
        
        try {
            audioManager.playSound(soundName);
        } catch (error) {
            console.warn("Error playing sound:", soundName, error);
        }
    }
    
    showScene(sceneId) {
        console.log('Showing scene:', sceneId);
        
        // Останавливаем текущую анимацию текста, если она есть
        this.skipTyping();
        
        // Проверяем существование сцены
        if (!story[sceneId]) {
            console.error("Сцена не найдена:", sceneId);
            this.showScene("start");
            return;
        }
        
        const scene = story[sceneId];
        
        // Обновляем фон
        if (this.elements.background && scene.background) {
            this.elements.background.style.backgroundImage = `url('${scene.background}')`;
        }
        
        // Обновляем персонажа
        if (this.elements.character && scene.character) {
            this.elements.character.style.backgroundImage = `url('${scene.character}')`;
        }
        
        // Обновляем музыку
        if (scene.music && window.audioManager) {
            setTimeout(() => {
                audioManager.playMusic(scene.music);
            }, 50);
        }
        
        // Воспроизводим звук сцены
        if (scene.sound && window.audioManager) {
            setTimeout(() => {
                this.playSound(scene.sound);
            }, 200);
        }
        
        // Показываем имя говорящего
        if (this.elements.speakerName) {
            this.elements.speakerName.textContent = scene.speaker || "";
        }
        
        // Начинаем анимацию текста
        if (this.elements.dialogueText && scene.text) {
            this.typeText(scene.text, this.elements.dialogueText);
        }
        
        // Очищаем и добавляем кнопки выбора
        if (this.elements.choicesContainer) {
            this.elements.choicesContainer.innerHTML = '';
            
            if (scene.choices && scene.choices.length > 0) {
                scene.choices.forEach(choice => {
                    const button = document.createElement('div');
                    button.className = 'choice-button';
                    button.textContent = choice.text;
                    
                    button.addEventListener('click', () => {
                        // Воспроизводим звук клика
                        this.playSound("click");
                        
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
        }
        
        // Сохраняем текущую сцену
        this.gameData.currentScene = sceneId;
        if (!this.gameData.visitedScenes.includes(sceneId)) {
            this.gameData.visitedScenes.push(sceneId);
        }
        
        this.saveGame();
    }
    
    typeText(text, element) {
        // Останавливаем предыдущую анимацию, если она есть
        if (this.currentTextInterval) {
            clearInterval(this.currentTextInterval);
            this.currentTextInterval = null;
        }
        
        // Сбрасываем состояние
        this.isTyping = true;
        this.fullText = text;
        element.textContent = '';
        
        let i = 0;
        this.currentTextInterval = setInterval(() => {
            if (i < text.length) {
                // Добавляем по одному символу
                element.textContent += text.charAt(i);
                i++;
            } else {
                // Текст полностью напечатан
                clearInterval(this.currentTextInterval);
                this.currentTextInterval = null;
                this.isTyping = false;
            }
        }, this.textSpeed);
    }
    
    skipTyping() {
        if (this.currentTextInterval) {
            clearInterval(this.currentTextInterval);
            this.currentTextInterval = null;
        }
        
        if (this.isTyping && this.elements.dialogueText) {
            this.elements.dialogueText.textContent = this.fullText;
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
    window.game = new Game();
});
