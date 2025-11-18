// Аудио менеджер
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.isMuted = false;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        
        this.loadSounds();
    }
    
    loadSounds() {
        // Загрузка звуковых эффектов
        this.sounds = {
            click: new Audio('audio/sfx/click.wav'),
            footsteps: new Audio('audio/sfx/footsteps.wav'),
            door: new Audio('audio/sfx/door-creak.wav'),
            whisper: new Audio('audio/sfx/whisper.wav'),
            heartbeat: new Audio('audio/sfx/heartbeat.wav')
        };
        
        // Загрузка музыки
        this.music = {
            main: new Audio('audio/music/main-theme.mp3'),
            ambient: new Audio('audio/music/creepy-ambient.mp3'),
            tension: new Audio('audio/music/tension.mp3')
        };
        
        // Настройка музыки
        Object.values(this.music).forEach(track => {
            track.loop = true;
            track.volume = this.musicVolume;
        });
        
        // Настройка звуков
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.sfxVolume;
        });
    }
    
    playMusic(trackName) {
        if (this.isMuted) return;
        
        // Останавливаем всю музыку
        Object.values(this.music).forEach(track => {
            track.pause();
            track.currentTime = 0;
        });
        
        // Воспроизводим нужный трек
        if (this.music[trackName]) {
            this.music[trackName].volume = this.musicVolume;
            this.music[trackName].play().catch(e => console.log("Audio play failed:", e));
        }
    }
    
    stopMusic() {
        Object.values(this.music).forEach(track => {
            track.pause();
            track.currentTime = 0;
        });
    }
    
    playSound(soundName) {
        if (this.isMuted || !this.sounds[soundName]) return;
        
        // Создаем копию для одновременного воспроизведения
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = this.sfxVolume;
        sound.play().catch(e => console.log("Sound play failed:", e));
    }
    
    setMusicVolume(volume) {
        this.musicVolume = volume;
        Object.values(this.music).forEach(track => {
            track.volume = volume;
        });
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = volume;
        Object.values(this.sounds).forEach(sound => {
            sound.volume = volume;
        });
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            Object.values(this.music).forEach(track => track.volume = 0);
            Object.values(this.sounds).forEach(sound => sound.volume = 0);
        } else {
            Object.values(this.music).forEach(track => track.volume = this.musicVolume);
            Object.values(this.sounds).forEach(sound => sound.volume = this.sfxVolume);
        }
        
        return this.isMuted;
    }
}

// Создаем глобальный экземпляр аудио менеджера
const audioManager = new AudioManager();