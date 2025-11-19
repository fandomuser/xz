// Аудио менеджер
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.isMuted = false;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.audioContext = null;
        
        this.initAudioContext();
        this.loadSounds();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn("Web Audio API не поддерживается:", error);
        }
    }
    
    loadSounds() {
        // Базовые звуки которые должны быть
        const soundFiles = {
            click: 'audio/sfx/click.wav',
            footsteps: 'audio/sfx/footsteps.wav',
            door: 'audio/sfx/door-creak.wav',
            whisper: 'audio/sfx/whisper.wav',
            heartbeat: 'audio/sfx/heartbeat.wav',
            ghostWhisper: 'audio/sfx/ghost-whisper.wav',
            realityBreak: 'audio/sfx/reality-break.wav',
            memoryFlash: 'audio/sfx/memory-flash.wav',
            ritualChant: 'audio/sfx/ritual-chant.wav'
        };
        
        const musicFiles = {
            main: 'audio/music/main-theme.mp3',
            ambient: 'audio/music/creepy-ambient.mp3',
            tension: 'audio/music/tension.mp3',
            memoryTheme: 'audio/music/memory-theme.mp3',
            ritualMusic: 'audio/music/ritual-music.mp3',
            truthTheme: 'audio/music/truth-theme.mp3'
        };
        
        // Загружаем звуки с обработкой ошибок
        Object.entries(soundFiles).forEach(([name, path]) => {
            this.sounds[name] = new Audio(path);
            this.sounds[name].volume = this.sfxVolume;
            this.sounds[name].preload = 'auto';
            
            // Обработка ошибок загрузки
            this.sounds[name].addEventListener('error', (e) => {
                console.warn(`Не удалось загрузить звук ${name}:`, path, e);
                // Создаем заглушку для отсутствующих звуков
                this.createFallbackSound(name);
            });
        });
        
        // Загружаем музыку с обработкой ошибок
        Object.entries(musicFiles).forEach(([name, path]) => {
            this.music[name] = new Audio(path);
            this.music[name].loop = true;
            this.music[name].volume = this.musicVolume;
            this.music[name].preload = 'metadata';
            
            this.music[name].addEventListener('error', (e) => {
                console.warn(`Не удалось загрузить музыку ${name}:`, path, e);
            });
        });
    }
    
    createFallbackSound(name) {
        // Создаем простой звук-заглушку через Web Audio API
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Разные звуки для разных типов
            switch(name) {
                case 'click':
                    oscillator.frequency.value = 800;
                    break;
                case 'door':
                    oscillator.frequency.value = 300;
                    break;
                case 'heartbeat':
                    oscillator.frequency.value = 100;
                    break;
                default:
                    oscillator.frequency.value = 440;
            }
            
            gainNode.gain.value = this.sfxVolume;
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
            
        } catch (error) {
            console.warn("Не удалось создать заглушку для звука:", name, error);
        }
    }
    
    playMusic(trackName) {
        if (this.isMuted) return;
        
        try {
            // Останавливаем всю музыку
            Object.values(this.music).forEach(track => {
                if (track && !track.paused) {
                    track.pause();
                    track.currentTime = 0;
                }
            });
            
            // Воспроизводим нужный трек
            const track = this.music[trackName];
            if (track) {
                track.volume = this.musicVolume;
                track.play().catch(e => {
                    console.log("Автовоспроизведение музыки заблокировано:", e);
                    // Показываем сообщение что нужно взаимодействие
                    this.showPlayMessage();
                });
            } else {
                console.warn("Музыкальный трек не найден:", trackName);
            }
        } catch (error) {
            console.error("Ошибка воспроизведения музыки:", error);
        }
    }
    
    showPlayMessage() {
        // Можно добавить кнопку "Включить звук" в интерфейсе
        console.log("Для воспроизведения музыки требуется взаимодействие пользователя");
    }
    
    stopMusic() {
        Object.values(this.music).forEach(track => {
            if (track && !track.paused) {
                track.pause();
                track.currentTime = 0;
            }
        });
    }
    
    playSound(soundName) {
        if (this.isMuted) return;
        
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                // Сбрасываем звук на начало если он уже играет
                sound.currentTime = 0;
                sound.volume = this.sfxVolume;
                
                sound.play().catch(e => {
                    console.log(`Не удалось воспроизвести звук ${soundName}:`, e);
                    // Пробуем создать и воспроизвести заглушку
                    this.createFallbackSound(soundName);
                });
            } else {
                console.warn("Звук не найден:", soundName);
                this.createFallbackSound(soundName);
            }
        } catch (error) {
            console.error("Ошибка воспроизведения звука:", error);
            this.createFallbackSound(soundName);
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = volume;
        Object.values(this.music).forEach(track => {
            if (track) {
                track.volume = volume;
            }
        });
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = volume;
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = volume;
            }
        });
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            Object.values(this.music).forEach(track => {
                if (track) track.volume = 0;
            });
            Object.values(this.sounds).forEach(sound => {
                if (sound) sound.volume = 0;
            });
        } else {
            Object.values(this.music).forEach(track => {
                if (track) track.volume = this.musicVolume;
            });
            Object.values(this.sounds).forEach(sound => {
                if (sound) sound.volume = this.sfxVolume;
            });
        }
        
        return this.isMuted;
    }
    
    // Метод для принудительного разрешения аудио контекста (решает проблему автовоспроизведения)
    async unlockAudio() {
        if (!this.audioContext) return;
        
        try {
            // Создаем пустой буфер и воспроизводим его
            const buffer = this.audioContext.createBuffer(1, 1, 22050);
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start();
            
            // Разблокируем аудио контекст
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
        } catch (error) {
            console.warn("Не удалось разблокировать аудио:", error);
        }
    }
}

// Создаем глобальный экземпляр аудио менеджера
const audioManager = new AudioManager();

// Разблокируем аудио при первом взаимодействии пользователя
document.addEventListener('click', function unlockAudio() {
    audioManager.unlockAudio();
    document.removeEventListener('click', unlockAudio);
}, { once: true });
