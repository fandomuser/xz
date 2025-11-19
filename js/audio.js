// Аудио менеджер
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.isMuted = false;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.audioContext = null;
        this.isAudioUnlocked = false;
        
        this.loadSounds();
        this.setupAudioUnlock();
    }
    
    setupAudioUnlock() {
        // Разблокируем аудио при первом взаимодействии пользователя
        const unlockAudio = () => {
            if (this.isAudioUnlocked) return;
            
            try {
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                
                // Пробуем воспроизвести тихий звук чтобы разблокировать аудио
                const silentSource = this.audioContext.createBufferSource();
                const buffer = this.audioContext.createBuffer(1, 1, 22050);
                silentSource.buffer = buffer;
                silentSource.connect(this.audioContext.destination);
                silentSource.start();
                silentSource.stop(this.audioContext.currentTime + 0.001);
                
                this.isAudioUnlocked = true;
                console.log("Аудио разблокировано!");
                
                // Убираем обработчики после успешной разблокировки
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('keydown', unlockAudio);
                document.removeEventListener('touchstart', unlockAudio);
            } catch (error) {
                console.warn("Не удалось разблокировать аудио:", error);
            }
        };
        
        // Добавляем обработчики для разблокировки
        document.addEventListener('click', unlockAudio, { once: true });
        document.addEventListener('keydown', unlockAudio, { once: true });
        document.addEventListener('touchstart', unlockAudio, { once: true });
    }
    
    loadSounds() {
        try {
            // Создаем AudioContext если поддерживается
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn("Web Audio API не поддерживается, используем HTML5 Audio:", error);
        }
        
        // Базовые звуки с путями
        const soundConfigs = {
            click: { path: 'audio/sfx/click.mp3', fallbackFreq: 800 },
            footsteps: { path: 'audio/sfx/footsteps.wav', fallbackFreq: 400 },
            door: { path: 'audio/sfx/door-creak.wav', fallbackFreq: 300 },
            whisper: { path: 'audio/sfx/whisper.wav', fallbackFreq: 600 },
            heartbeat: { path: 'audio/sfx/heartbeat.wav', fallbackFreq: 100 },
            ghostWhisper: { path: 'audio/sfx/ghost-whisper.wav', fallbackFreq: 500 },
            realityBreak: { path: 'audio/sfx/reality-break.wav', fallbackFreq: 200 },
            memoryFlash: { path: 'audio/sfx/memory-flash.wav', fallbackFreq: 1200 },
            ritualChant: { path: 'audio/sfx/ritual-chant.wav', fallbackFreq: 350 }
        };
        
        const musicConfigs = {
            main: 'audio/music/main-theme.mp3',
            ambient: 'audio/music/creepy-ambient.mp3', 
            tension: 'audio/music/tension.mp3',
            memoryTheme: 'audio/music/memory-theme.mp3',
            ritualMusic: 'audio/music/ritual-music.mp3',
            truthTheme: 'audio/music/truth-theme.mp3'
        };
        
        // Загружаем звуки эффектов
        Object.entries(soundConfigs).forEach(([name, config]) => {
            this.loadSound(name, config.path, config.fallbackFreq);
        });
        
        // Загружаем музыку
        Object.entries(musicConfigs).forEach(([name, path]) => {
            this.loadMusic(name, path);
        });
    }
    
    loadSound(name, path, fallbackFreq) {
        const audio = new Audio();
        audio.src = path;
        audio.volume = this.sfxVolume;
        audio.preload = 'auto';
        
        audio.addEventListener('canplaythrough', () => {
            console.log(`Звук ${name} загружен: ${path}`);
        });
        
        audio.addEventListener('error', (e) => {
            console.warn(`Ошибка загрузки звука ${name}: ${path}`, e);
            // Создаем fallback только если файл действительно не найден
            if (audio.error && audio.error.code === audio.error.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                this.sounds[name] = {
                    play: () => this.playFallbackSound(fallbackFreq, 0.1),
                    isFallback: true
                };
            } else {
                this.sounds[name] = audio;
            }
        });
        
        audio.addEventListener('load', () => {
            this.sounds[name] = audio;
        });
        
        // Пробуем загрузить
        audio.load().catch(e => {
            console.warn(`Не удалось загрузить звук ${name}:`, e);
            this.sounds[name] = {
                play: () => this.playFallbackSound(fallbackFreq, 0.1),
                isFallback: true
            };
        });
        
        this.sounds[name] = audio;
    }
    
    loadMusic(name, path) {
        const audio = new Audio();
        audio.src = path;
        audio.volume = this.musicVolume;
        audio.loop = true;
        audio.preload = 'metadata';
        
        audio.addEventListener('canplaythrough', () => {
            console.log(`Музыка ${name} загружена: ${path}`);
        });
        
        audio.addEventListener('error', (e) => {
            console.warn(`Ошибка загрузки музыки ${name}: ${path}`, e);
        });
        
        this.music[name] = audio;
    }
    
    playFallbackSound(frequency, duration) {
        if (!this.audioContext || this.isMuted) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            gainNode.gain.value = this.sfxVolume * 0.3; // Тише чем обычные звуки
            
            oscillator.start();
            
            // Плавное затухание
            gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                this.audioContext.currentTime + duration
            );
            
            oscillator.stop(this.audioContext.currentTime + duration);
            
        } catch (error) {
            console.warn("Не удалось создать fallback звук:", error);
        }
    }
    
    playMusic(trackName) {
        if (this.isMuted || !this.music[trackName]) return;
        
        try {
            // Останавливаем всю музыку
            Object.values(this.music).forEach(track => {
                if (track && typeof track.pause === 'function') {
                    track.pause();
                    track.currentTime = 0;
                }
            });
            
            const track = this.music[trackName];
            if (track && typeof track.play === 'function') {
                track.volume = this.musicVolume;
                track.play().catch(e => {
                    console.log("Автовоспроизведение музыки заблокировано, требуется взаимодействие");
                });
            }
        } catch (error) {
            console.error("Ошибка воспроизведения музыки:", error);
        }
    }
    
    stopMusic() {
        Object.values(this.music).forEach(track => {
            if (track && typeof track.pause === 'function') {
                track.pause();
                track.currentTime = 0;
            }
        });
    }
    
    playSound(soundName) {
        if (this.isMuted || !this.sounds[soundName]) return;
        
        try {
            const sound = this.sounds[soundName];
            
            if (sound.isFallback) {
                // Воспроизводим fallback звук
                sound.play();
                return;
            }
            
            if (sound && typeof sound.play === 'function') {
                // Сбрасываем на начало если звук уже играет
                sound.currentTime = 0;
                sound.volume = this.sfxVolume;
                
                sound.play().catch(e => {
                    console.log(`Не удалось воспроизвести звук ${soundName}:`, e);
                    // Пробуем fallback
                    this.playFallbackSound(800, 0.1);
                });
            }
        } catch (error) {
            console.error("Ошибка воспроизведения звука:", error, soundName);
            // Всегда пробуем fallback при ошибке
            this.playFallbackSound(800, 0.1);
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = volume;
        Object.values(this.music).forEach(track => {
            if (track && typeof track.volume !== 'undefined') {
                track.volume = volume;
            }
        });
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = volume;
        Object.values(this.sounds).forEach(sound => {
            if (sound && typeof sound.volume !== 'undefined' && !sound.isFallback) {
                sound.volume = volume;
            }
        });
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            // Приглушаем всю музыку
            Object.values(this.music).forEach(track => {
                if (track && typeof track.volume !== 'undefined') {
                    track.volume = 0;
                }
            });
        } else {
            // Восстанавливаем громкость
            Object.values(this.music).forEach(track => {
                if (track && typeof track.volume !== 'undefined') {
                    track.volume = this.musicVolume;
                }
            });
        }
        
        return this.isMuted;
    }
}

// Создаем глобальный экземпляр аудио менеджера
const audioManager = new AudioManager();

// Экспортируем для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = audioManager;
}

