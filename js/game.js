// Основной игровой класс
class Game {
    constructor() {
        this.currentScene = "start";
        this.gameData = {
            currentScene: "start",
            inventory: [],
            visitedScenes: [],
            choices: {}
        };
        
        this.isLoading = true;
        this.textSpeed = 30;
        
        this.init();
    }
    
    init() {
        this.loadElements();
        this.setupEventListeners();
        this.loadGame();
        this.simulateLoading();
    }
    
    loadElements() {
        // Загрузка элементов DOM
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
    }
    
    setupEventListeners() {
        // Кнопки меню
        this.elements.playButton.addEventListener('click', () => this.startNewGame());
        this.elements.continueButton.addEventListener('click', () => this.continueGame());
        this.elements.settingsButton.addEventListener('click', () => this.showSettings());
        this.elements.creditsButton.addEventListener('click', () => this.showCredits());
        this.elements.settingsBack.addEventListener('click', () => this.hideSettings());
        this.elements.creditsBack.addEventListener('click', () => this.hideCredits());
        this.elements.backButton.addEventListener('click', () => this.backToMenu());
        this.elements.soundToggle.addEventListener('click', () => this.toggleSound());
        
        // Настройки громкости
        this.elements.musicVolume.addEventListener('input', (e) => {
            audioManager.setMusicVolume(e.target.value / 100);
        });
        
        this.elements.sfxVolume.addEventListener('input', (e) => {
            audioManager.setSfxVolume(e.target.value / 100);
        });
    }
    
    simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    this.elements.loadingScreen.style.display = 'none';
                    this.elements.mainMenu.style.display = 'flex';
                    this.isLoading = false;
                }, 500);
            }
            this.elements.loadingBar.style.width = `${progress}%`;
        }, 200);
    }
    
    startNewGame() {
        this.gameData = {
            currentScene: "start",
            inventory: [],
            visitedScenes: [],
            choices: {}
        };
        
        this.elements.mainMenu.style.display = 'none';
        this.elements.gameScreen.style.display = 'flex';
        audioManager.playMusic("ambient");
        this.showScene("start");
    }
    
    continueGame() {
        this.elements.mainMenu.style.display = 'none';
        this.elements.gameScreen.style.display = 'flex';
        this.showScene(this.gameData.currentScene);
    }
    
    showSettings() {
        this.elements.mainMenu.style.display = 'none';
        this.elements.settingsScreen.style.display = 'flex';
    }
    
    hideSettings() {
        this.elements.settingsScreen.style.display = 'none';
        this.elements.mainMenu.style.display = 'flex';
    }
    
    showCredits() {
        this.elements.mainMenu.style.display = 'none';
        this.elements.creditsScreen.style.display = 'flex';
    }
    
    hideCredits() {
        this.elements.creditsScreen.style.display = 'none';
        this.elements.mainMenu.style.display = 'flex';
    }
    
    backToMenu() {
        if (confirm("Вы уверены, что хотите вернуться в меню? Весь прогресс будет сохранен.")) {
            this.elements.gameScreen.style.display = 'none';
            this.elements.mainMenu.style.display = 'flex';
            audioManager.stopMusic();
            this.saveGame();
        }
    }
    
    toggleSound() {
        const isMuted = audioManager.toggleMute();
        this.elements.soundToggle.textContent = isMuted ? "🔇 БЕЗ ЗВУКА" : "🔊 ЗВУК";
    }
    
    showScene(sceneId) {
        const scene = story[sceneId];
        if (!scene) {
            console.error("Сцена не найдена:", sceneId);
            this.showScene("start");
            return;
        }
        
        // Обновляем фон
        this.elements.background.style.backgroundImage = `url('${scene.background}')`;
        
        // Обновляем персонажа
        this.elements.character.style.backgroundImage = `url('${scene.character}')`;
        
        // Обновляем музыку
        if (scene.music) {
            audioManager.playMusic(scene.music);
        }
        
        // Воспроизводим звук
        if (scene.sound) {
            audioManager.playSound(scene.sound);
        }
        
        // Показываем имя говорящего и текст
        this.elements.speakerName.textContent = scene.speaker;
        this.typeText(scene.text, this.elements.dialogueText);
        
        // Очищаем и добавляем кнопки выбора
        this.elements.choicesContainer.innerHTML = '';
        scene.choices.forEach(choice => {
            const button = document.createElement('div');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                audioManager.playSound("click");
                this.makeChoice(choice.next);
            });
            this.elements.choicesContainer.appendChild(button);
        });
        
        // Сохраняем текущую сцену
        this.gameData.currentScene = sceneId;
        if (!this.gameData.visitedScenes.includes(sceneId)) {
            this.gameData.visitedScenes.push(sceneId);
        }
        
        this.saveGame();
    }
    
    typeText(text, element) {
        let i = 0;
        element.innerHTML = '';
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, this.textSpeed);
    }
    
    makeChoice(nextScene) {
        this.showScene(nextScene);
    }
    
    saveGame() {
        localStorage.setItem('iAmNotSubhanSave', JSON.stringify(this.gameData));
    }
    
    loadGame() {
        const savedGame = localStorage.getItem('iAmNotSubhanSave');
        if (savedGame) {
            this.gameData = JSON.parse(savedGame);
            this.elements.continueButton.style.display = 'block';
        } else {
            this.elements.continueButton.style.display = 'none';
        }
    }
}

// Запускаем игру когда страница загружена
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});