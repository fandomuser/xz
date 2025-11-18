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
    escape_door: {
        background: 'images/backgrounds/dark-corridor.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты выбегаешь в коридор, но оказываешься в лабиринте тёмных переходов. Стены покрыты странными иероглифами, которые, кажется, двигаются в полумраке. Ты слышишь шаги позади себя... Они становятся всё ближе.",
        music: "tension",
        sound: "footsteps",
        choices: [
            { text: "Бежать налево", next: "run_left" },
            { text: "Бежать направо", next: "run_right" },
            { text: "Спрятаться в нише", next: "hide_niche" }
        ]
    },
    run_left: {
        background: 'images/backgrounds/dark-corridor.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты бежишь налево, но коридор внезапно обрывается тупиком. Стены начинают искажаться и смыкаться перед тобой. Голос преследует тебя: 'Беги, если хочешь, но ты никуда не денешься от себя'. Впереди появляется тусклый свет...",
        music: "tension",
        sound: "heartbeat",
        choices: [
            { text: "Бежать к свету", next: "run_to_light" },
            { text: "Свернуть в боковой проход", next: "take_side_passage" },
            { text: "Остановиться и сдаться", next: "surrender" }
        ]
    },
    run_to_light: {
        background: 'images/backgrounds/basement.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты бежишь к свету и оказываешься в подвале. В центре комнаты стоит тот самый алтарь, который ты видел в своих воспоминаниях. На нём лежит открытая книга, а вокруг горят свечи. Ты понимаешь, что это место тебе знакомо...",
        music: "main",
        choices: [
            { text: "Подойти к алтарю", next: "approach_altar" },
            { text: "Осмотреть комнату", next: "examine_room" },
            { text: "Попытаться найти другой выход", next: "find_exit" }
        ]
    },
    approach_altar: {
        background: 'images/backgrounds/ritual-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Подойдя к алтарю, ты замечаешь странные символы, которые, кажется, пульсируют в такт твоему сердцебиению. В центре алтаря лежит старинная книга с металлической застёжкой. На обложке выгравировано то самое имя - 'Субхан'.",
        music: "main",
        sound: "whisper",
        choices: [
            { text: "Открыть книгу", next: "open_book" },
            { text: "Осмотреть символы внимательнее", next: "examine_symbols" },
            { text: "Отойти от алтаря", next: "examine_room" }
        ]
    },
    open_book: {
        background: 'images/backgrounds/ritual-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты открываешь книгу. Страницы исписаны на непонятном языке, но иллюстрации ясно показывают ужасающие сцены жертвоприношений. Вдруг книга начинает светиться, и ты слышишь голос в своей голове: 'Наконец-то ты нашёл меня, Субхан.'",
        music: "main",
        sound: "whisper",
        choices: [
            { text: "Закрыть книгу и отойти", next: "close_book" },
            { text: "Продолжить читать", next: "continue_reading" },
            { text: "Спросить 'Кто ты?'", next: "ask_who" }
        ]
    },
    ask_who: {
        background: 'images/backgrounds/ritual-room.jpg',
        character: 'images/characters/creature.png',
        speaker: "Голос",
        text: "Я - часть тебя, Субхан. Тот, кого ты пытался забыть. Мы заключили сделку, помнишь? Ты хотел власти, а я... я хотел свободы. Теперь пришло время выполнить твою часть соглашения.",
        music: "main",
        sound: "whisper",
        choices: [
            { text: "Я не Субхан!", next: "deny_subhan" },
            { text: "Какую сделку?", next: "ask_deal" },
            { text: "Что ты от меня хочешь?", next: "ask_want" }
        ]
    },
    deny_subhan: {
        background: 'images/backgrounds/ritual-room.jpg',
        character: 'images/characters/creature.png',
        speaker: "Голос",
        text: "О, но ты ошибаешься. Посмотри внимательнее. Ты всегда был Субханом. Ты просто забыл. Забыл о ритуалах, о жертвах, о нашей силе. Но сейчас ты вспомнишь всё...",
        music: "main",
        sound: "heartbeat",
        choices: [
            { text: "Бежать!", next: "run_away" },
            { text: "Это невозможно!", next: "impossible" },
            { text: "Что я сделал?", next: "what_did_i_do" }
        ]
    },
    run_away: {
        background: 'images/backgrounds/abandoned-hospital.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты бежишь через заброшенное крыло больницы, но коридоры начинают искажаться и смыкаться перед тобой. Голос преследует тебя: 'Беги, если хочешь, но ты никуда не денешься от себя'. Впереди появляется тусклый свет операционной...",
        music: "tension",
        sound: "footsteps",
        choices: [
            { text: "Бежать к операционной", next: "run_to_surgery" },
            { text: "Свернуть вглубь коридора", next: "deeper_corridor" },
            { text: "Остановиться и сдаться", next: "surrender_final" }
        ]
    }
    // Можно добавить ещё много сцен...
};