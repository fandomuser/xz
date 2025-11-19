// Аудио менеджер - упрощенная и надежная версия
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.isMuted = false;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        
        console.log("AudioManager created");
        this.loadSounds();
    }
    
    loadSounds() {
        // Базовые звуки с fallback
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
            console.log(`Звук загружен: ${name}`);
        });
        
        audio.addEventListener('error', (e) => {
            console.warn(`Ошибка загрузки звука ${name}: ${path}`, e);
            // Создаем fallback
            this.sounds[name] = {
                play: () => this.playFallbackSound(fallbackFreq, 0.1),
                isFallback: true
            };
        });
        
        // Сохраняем звук
        this.sounds[name] = audio;
    }
    
    loadMusic(name, path) {
        const audio = new Audio();
        audio.src = path;
        audio.volume = this.musicVolume;
        audio.loop = true;
        audio.preload = 'metadata';
        
        audio.addEventListener('canplaythrough', () => {
            console.log(`Музыка загружена: ${name}`);
        });
        
        audio.addEventListener('error', (e) => {
            console.warn(`Ошибка загрузки музыки ${name}: ${path}`, e);
        });
        
        this.music[name] = audio;
    }
    
    playFallbackSound(frequency, duration) {
        if (this.isMuted) return;
        
        try {
            // Создаем простой beep через Web Audio API если доступно
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            gainNode.gain.value = this.sfxVolume * 0.3;
            
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            oscillator.stop(audioContext.currentTime + duration);
            
        } catch (error) {
            console.warn("Не удалось создать fallback звук:", error);
        }
    }
    
    playMusic(trackName) {
        if (this.isMuted || !this.music[trackName]) return;
        
        try {
            // Останавливаем всю музыку
            this.stopMusic();
            
            const track = this.music[trackName];
            if (track) {
                track.volume = this.musicVolume;
                track.play().catch(e => {
                    console.log("Автовоспроизведение музыки заблокировано");
                });
            }
        } catch (error) {
            console.error("Ошибка воспроизведения музыки:", error);
        }
    }
    
    stopMusic() {
        Object.values(this.music).forEach(track => {
            if (track) {
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
            
            if (sound) {
                // Сбрасываем на начало если звук уже играет
                sound.currentTime = 0;
                sound.volume = this.sfxVolume;
                
                sound.play().catch(e => {
                    console.log(`Не удалось воспроизвести звук ${soundName}`);
                    // Пробуем fallback
                    this.playFallbackSound(800, 0.1);
                });
            }
        } catch (error) {
            console.error("Ошибка воспроизведения звука:", error);
            // Всегда пробуем fallback при ошибке
            this.playFallbackSound(800, 0.1);
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = volume / 100;
        Object.values(this.music).forEach(track => {
            if (track) {
                track.volume = this.musicVolume;
            }
        });
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = volume / 100;
        Object.values(this.sounds).forEach(sound => {
            if (sound && !sound.isFallback) {
                sound.volume = this.sfxVolume;
            }
        });
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            // Приглушаем всю музыку
            Object.values(this.music).forEach(track => {
                if (track) {
                    track.volume = 0;
                }
            });
        } else {
            // Восстанавливаем громкость
            Object.values(this.music).forEach(track => {
                if (track) {
                    track.volume = this.musicVolume;
                }
            });
        }
        
        return this.isMuted;
    }
}

// Создаем глобальный экземпляр аудио менеджера
const audioManager = new AudioManager();
