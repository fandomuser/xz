// Аудио менеджер - исправленная версия
class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = new Map();
        this.isMuted = false;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.audioContext = null;
        this.isAudioUnlocked = false;
        this.globalGainNode = null;
        
        this.init();
    }
    
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.globalGainNode = this.audioContext.createGain();
            this.globalGainNode.connect(this.audioContext.destination);
            
            await this.loadSounds();
            this.setupAudioUnlock();
        } catch (error) {
            console.warn("Web Audio API не поддерживается:", error);
            this.setupHTML5Audio();
        }
    }
    
    setupAudioUnlock() {
        const unlockAudio = () => {
            if (this.isAudioUnlocked || !this.audioContext) return;
            
            try {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                
                // Создаем и воспроизводим короткий беззвучный буфер
                const buffer = this.audioContext.createBuffer(1, 1, 22050);
                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(this.audioContext.destination);
                source.start();
                source.stop(this.audioContext.currentTime + 0.001);
                
                this.isAudioUnlocked = true;
                console.log("Аудио разблокировано");
                
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('keydown', unlockAudio);
                document.removeEventListener('touchstart', unlockAudio);
            } catch (error) {
                console.warn("Не удалось разблокировать аудио:", error);
            }
        };
        
        document.addEventListener('click', unlockAudio, { once: true });
        document.addEventListener('keydown', unlockAudio, { once: true });
        document.addEventListener('touchstart', unlockAudio, { once: true });
    }
    
    setupHTML5Audio() {
        console.log("Используется HTML5 Audio fallback");
    }
    
    async loadSounds() {
        const soundConfigs = {
            click: 'audio/sfx/click.mp3',
            footsteps: 'audio/sfx/footsteps.wav',
            door: 'audio/sfx/door-creak.wav',
            whisper: 'audio/sfx/whisper.wav',
            heartbeat: 'audio/sfx/heartbeat.wav',
            ghostWhisper: 'audio/sfx/ghost-whisper.wav',
            realityBreak: 'audio/sfx/reality-break.wav',
            memoryFlash: 'audio/sfx/memory-flash.wav',
            ritualChant: 'audio/sfx/ritual-chant.wav'
        };
        
        const musicConfigs = {
            main: 'audio/music/main-theme.mp3',
            ambient: 'audio/music/creepy-ambient.mp3',
            tension: 'audio/music/tension.mp3',
            memoryTheme: 'audio/music/memory-theme.mp3',
            ritualMusic: 'audio/music/ritual-music.mp3',
            truthTheme: 'audio/music/truth-theme.mp3'
        };
        
        // Загружаем звуки
        const soundPromises = Object.entries(soundConfigs).map(([name, path]) => 
            this.loadSound(name, path)
        );
        
        // Загружаем музыку
        const musicPromises = Object.entries(musicConfigs).map(([name, path]) => 
            this.loadMusic(name, path)
        );
        
        await Promise.all([...soundPromises, ...musicPromises]);
    }
    
    loadSound(name, path) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.src = path;
            audio.volume = this.sfxVolume;
            audio.preload = 'auto';
            
            const handleLoad = () => {
                console.log(`Звук загружен: ${name}`);
                this.sounds.set(name, audio);
                resolve(audio);
            };
            
            const handleError = () => {
                console.warn(`Ошибка загрузки звука: ${name}`, path);
                // Создаем fallback
                this.sounds.set(name, {
                    play: () => this.playFallbackSound(800, 0.1),
                    isFallback: true
                });
                resolve();
            };
            
            audio.addEventListener('canplaythrough', handleLoad, { once: true });
            audio.addEventListener('error', handleError, { once: true });
            
            audio.load();
        });
    }
    
    loadMusic(name, path) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.src = path;
            audio.volume = this.musicVolume;
            audio.loop = true;
            audio.preload = 'metadata';
            
            audio.addEventListener('canplaythrough', () => {
                console.log(`Музыка загружена: ${name}`);
                this.music.set(name, audio);
                resolve(audio);
            }, { once: true });
            
            audio.addEventListener('error', () => {
                console.warn(`Ошибка загрузки музыки: ${name}`);
                resolve();
            }, { once: true });
            
            audio.load();
        });
    }
    
    playFallbackSound(frequency, duration) {
        if (!this.audioContext || this.isMuted) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.globalGainNode);
            
            oscillator.frequency.value = frequency;
            gainNode.gain.value = this.sfxVolume * 0.3;
            
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            oscillator.stop(this.audioContext.currentTime + duration);
            
        } catch (error) {
            console.warn("Ошибка fallback звука:", error);
        }
    }
    
    playMusic(trackName) {
        if (this.isMuted || !this.music.has(trackName)) return;
        
        try {
            // Останавливаем всю музыку
            this.stopMusic();
            
            const track = this.music.get(trackName);
            if (track) {
                track.volume = this.musicVolume;
                track.currentTime = 0;
                
                track.play().catch(e => {
                    console.log("Автовоспроизведение заблокировано:", e);
                });
            }
        } catch (error) {
            console.error("Ошибка воспроизведения музыки:", error);
        }
    }
    
    stopMusic() {
        this.music.forEach(track => {
            if (track && typeof track.pause === 'function') {
                track.pause();
                track.currentTime = 0;
            }
        });
    }
    
    playSound(soundName) {
        if (this.isMuted || !this.sounds.has(soundName)) return;
        
        try {
            const sound = this.sounds.get(soundName);
            
            if (sound.isFallback) {
                sound.play();
                return;
            }
            
            if (sound) {
                sound.currentTime = 0;
                sound.volume = this.sfxVolume;
                
                sound.play().catch(e => {
                    console.log(`Не удалось воспроизвести звук ${soundName}:`, e);
                    this.playFallbackSound(800, 0.1);
                });
            }
        } catch (error) {
            console.error("Ошибка воспроизведения звука:", error);
            this.playFallbackSound(800, 0.1);
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.music.forEach(track => {
            if (track && typeof track.volume !== 'undefined') {
                track.volume = this.musicVolume;
            }
        });
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(sound => {
            if (sound && typeof sound.volume !== 'undefined' && !sound.isFallback) {
                sound.volume = this.sfxVolume;
            }
        });
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.music.forEach(track => {
                if (track && typeof track.volume !== 'undefined') {
                    track.volume = 0;
                }
            });
        } else {
            this.music.forEach(track => {
                if (track && typeof track.volume !== 'undefined') {
                    track.volume = this.musicVolume;
                }
            });
        }
        
        return this.isMuted;
    }
}

// Создаем глобальный экземпляр
const audioManager = new AudioManager();
