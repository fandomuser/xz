// Основной игровой класс - исправленная версия
class Game {
    constructor() {
        this.currentScene = "start";
        this.gameData = {
            currentScene: "start",
            inventory: [],
            visitedScenes: [],
            choices: {},
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
        
        console.log('Game constructor called');
    }
    
    async init() {
        console.log('Initializing game...');
        
        try {
            this.loadElements();
            this.setupEventListeners();
            this.loadGame();
            await this.simulateLoading();
            await this.initializeAudio();
        } catch (error) {
            console.error('Error in init:', error);
            this.showErrorScreen();
        }
    }
    
    async initializeAudio() {
        // Используем глобальный audioManager
        if (window.audioManager) {
            this.audioManager = window.audioManager;
            console.log("Audio manager initialized");
        } else {
            console.warn("Audio manager not available");
        }
    }
    
    loadElements() {
        console.log('Loading DOM elements...');
        
        // Основные элементы
        this.elements = {
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
        
        // Проверяем критические элементы
        if (!this.elements.loadingScreen || !this.elements.loadingBar) {
            console.error('Critical elements not found:', {
                loadingScreen: !!this.elements.loadingScreen,
                loadingBar: !!this.elements.loadingBar
            });
            throw new Error('Critical loading elements not found');
        }
        
        console.log('All elements loaded successfully');
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Кнопки меню
        this.setupButton(this.elements.playButton, () => this.startNewGame());
        this.setupButton(this.elements.continueButton, () => this.continueGame());
        this.setupButton(this.elements.settingsButton, () => this.showSettings());
        this.setupButton(this.elements.creditsButton, () => this.showCredits());
        this.setupButton(this.elements.settingsBack, () => this.hideSettings());
        this.setupButton(this.elements.creditsBack, () => this.hideCredits());
        this.setupButton(this.elements.backButton, () => this.backToMenu());
        this.setupButton(this.elements.soundToggle, () => this.toggleSound());
        
        // Настройки громкости
        if (this.elements.musicVolume) {
            this.elements.musicVolume.addEventListener('input', (e) => {
                if (this.audioManager) {
                    this.audioManager.setMusicVolume(e.target.value / 100);
                }
            });
        }
        
        if (this.elements.sfxVolume) {
            this.elements.sfxVolume.addEventListener('input', (e) => {
                if (this.audioManager) {
                    this.audioManager.setSfxVolume(e.target.value / 100);
                }
            });
        }
        
        // Обработка клика по тексту
        if (this.elements.dialogueText) {
            this.elements.dialogueText.addEventListener('click', () => {
                if (this.isTyping) {
                    this.skipTyping();
                } else if (this.pendingScene) {
                    this.processPendingScene();
                }
            });
        }

        this.setupTouchEvents();
        console.log('Event listeners setup completed');
    }
    
    setupButton(element, handler) {
        if (element && handler) {
            element.addEventListener('click', handler);
        }
    }
    
    setupTouchEvents() {
        // Добавляем touch события для мобильных устройств
        const touchElements = [
            this.elements.playButton,
            this.elements.continueButton,
            this.elements.settingsButton,
            this.elements.creditsButton,
            this.elements.settingsBack,
            this.elements.creditsBack,
            this.elements.backButton,
            this.elements.soundToggle
        ];
        
        touchElements.forEach(element => {
            if (element) {
                element.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    element.style.transform = 'scale(0.95)';
                }, { passive: false });
                
                element.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    element.style.transform = '';
                    element.click();
                }, { passive: false });
            }
        });
    }
    
    simulateLoading() {
        return new Promise((resolve) => {
            console.log('Starting loading simulation...');
            
            let progress = 0;
            const maxProgress = 100;
            const intervalTime = 20;
            
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
                        resolve();
                    }, 500);
                }
            }, intervalTime);
        });
    }
    
    hideLoadingScreen() {
        if (this.elements.loadingScreen && this.elements.mainMenu) {
            this.elements.loadingScreen.style.display = 'none';
            this.elements.mainMenu.style.display = 'flex';
            this.isLoading = false;
            console.log('Game ready - main menu shown');
        }
    }
    
    showErrorScreen() {
        console.error('Showing error screen');
        if (this.elements.loadingScreen && this.elements.mainMenu) {
            this.elements.loadingScreen.style.display = 'none';
            this.elements.mainMenu.style.display = 'flex';
        }
    }
    
    startNewGame() {
        console.log('Starting new game');
        this.gameData = {
            currentScene: "start",
            inventory: [],
            visitedScenes: [],
            choices: {},
            sanity: 100
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
            console.log(`Showing screen: ${screenName}`);
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
        if (confirm("Вы уверены, что хотите вернуться в меню? Весь прогресс будет сохранен.")) {
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
            if (this.elements.soundToggle) {
                this.elements.soundToggle.textContent = isMuted ? "🔇 БЕЗ ЗВУКА" : "🔊 ЗВУК";
            }
        }
    }
    
    playSound(soundName) {
        if (!this.audioManager) return;
        
        try {
            this.audioManager.playSound(soundName);
        } catch (error) {
            console.warn("Error playing sound:", soundName, error);
        }
    }
    
    showScene(sceneId) {
        console.log('Showing scene:', sceneId);
        
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
        // Останавливаем текущую анимацию текста
        this.skipTyping();
        
        // Проверяем существование сцены
        if (!story[sceneId]) {
            console.error("Scene not found:", sceneId);
            sceneId = "start";
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
        if (this.elements.background && background) {
            this.elements.background.style.backgroundImage = `url('${background}')`;
        }
    }
    
    updateCharacter(character) {
        if (this.elements.character && character) {
            this.elements.character.style.backgroundImage = `url('${character}')`;
        }
    }
    
    updateAudio(music, sound) {
        if (this.audioManager) {
            if (music) {
                this.audioManager.playMusic(music);
            }
            
            if (sound) {
                this.playSound(sound);
            }
        }
    }
    
    updateText(speaker, text) {
        if (this.elements.speakerName) {
            this.elements.speakerName.textContent = speaker || "";
        }
        
        if (this.elements.dialogueText && text) {
            this.typeText(text, this.elements.dialogueText);
        }
    }
    
    updateChoices(choices) {
        if (!this.elements.choicesContainer) return;
        
        this.elements.choicesContainer.innerHTML = '';
        
        if (!choices || choices.length === 0) {
            // Если нет выбора, добавляем кнопку продолжения
            const continueButton = document.createElement('div');
            continueButton.className = 'choice-button';
            continueButton.textContent = 'Продолжить';
            continueButton.addEventListener('click', () => {
                this.playSound("click");
                this.showScene("start");
            });
            this.elements.choicesContainer.appendChild(continueButton);
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
            
            this.elements.choicesContainer.appendChild(button);
        });
    }
    
    typeText(text, element) {
        this.skipTyping();
        
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
        
        if (this.isTyping && this.elements.dialogueText) {
            this.elements.dialogueText.textContent = this.fullText;
            this.finishTyping();
        }
    }
    
    finishTyping() {
        this.isTyping = false;
        this.currentTextInterval = null;
    }
    
    saveSceneProgress(sceneId) {
        this.gameData.currentScene = sceneId;
        if (!this.gameData.visitedScenes.includes(sceneId)) {
            this.gameData.visitedScenes.push(sceneId);
        }
        this.saveGame();
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
    window.game.init();
});
