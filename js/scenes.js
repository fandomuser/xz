// Данные сцен игры
const story = {
    start: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "???",
        text: "Ты просыпаешься в тёмной больничной палате. Голова раскалывается, и ты не помнишь, как сюда попал. В воздухе витает странный запах - смесь дезинфекции и чего-то... гниющего. Единственный источник света - мерцающая лампа на потолке.",
        music: "ambient",
        sound: "heartbeat",
        choices: [
            { text: "Осмотреться вокруг", next: "look_around" },
            { text: "Попытаться вспомнить, что произошло", next: "try_remember" },
            { text: "Кричать о помощи", next: "scream" }
        ]
    },

    look_around: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты видишь, что находишься в заброшенной больничной палате. Окна заколочены досками, а на стенах видны царапины, будто кто-то пытался выбраться. В углу ты замечаешь тёмное пятно, похожее на кровь. На полу валяется сломанный монитор.",
        music: "ambient",
        choices: [
            { text: "Подойти к заколоченному окну", next: "approach_window" },
            { text: "Исследовать стены", next: "examine_walls" },
            { text: "Осмотреть тёмное пятно", next: "examine_stain" }
        ]
    },

    try_remember: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты закрываешь глаза и пытаешься сосредоточиться. Всплывают обрывки воспоминаний: тёмная фигура, странный ритуал, крики... Имя 'Субхан' постоянно возникает в твоих мыслях, но ты не понимаешь, что оно значит. Голова начинает болеть ещё сильнее.",
        music: "tension",
        sound: "whisper",
        choices: [
            { text: "Попытаться вспомнить больше", next: "remember_more" },
            { text: "Прекратить пытаться вспомнить - слишком больно", next: "start" },
            { text: "Сосредоточиться на имени 'Субхан'", next: "focus_subhan" }
        ]
    },

    scream: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты кричишь изо всех сил, но звук будто поглощается стенами. В ответ ты слышишь лишь эхо собственного голоса. Внезапно дверь скрипит и приоткрывается... Из-за неё доносится тихий смех.",
        music: "tension",
        sound: "door",
        choices: [
            { text: "Быстро выбежать в дверь", next: "escape_door" },
            { text: "Осторожно подойти к двери", next: "approach_door" },
            { text: "Спрятаться и наблюдать", next: "hide_observe" }
        ]
    },

    development_note: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Система",
        text: "Эта ветка сюжета还在开发中 (в разработке). Создатели игры работают над продолжением!",
        choices: [
            { text: "Вернуться назад", next: "start" }
        ]
    }
};

// Автоматически создаем заглушки для всех недостающих сцен
const missingScenes = [
    'approach_window', 'examine_walls', 'examine_stain', 'remember_more', 'focus_subhan',
    'escape_door', 'approach_door', 'hide_observe', 'return_center', 'prepare_defense',
    'hide_bed', 'decipher_symbols', 'take_handle', 'examine_floor', 'understand_ritual',
    'listen_door', 'keep_silent', 'attack_figure', 'surrender_early', 'go_downstairs',
    'hide_under_stairs', 'run_to_light', 'take_side_passage', 'approach_altar', 'open_book',
    'ask_who', 'deny_subhan', 'run_away', 'subhan_past', 'subhan_experiment', 'experiment_disaster',
    'ask_about_wife', 'meet_other_souls', 'escape_plan', 'unite_souls', 'ritual_choice',
    'hospital_truth', 'first_patient', 'find_daughter', 'redemption_ending', 'replacement_ending',
    'destruction_ending', 'merge_ending'
];

// Создаем автоматические заглушки
missingScenes.forEach(sceneName => {
    if (!story[sceneName]) {
        story[sceneName] = story.development_note;
    }
});
