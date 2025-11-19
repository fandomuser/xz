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

    approach_window: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты подходишь к окну и пытаешься разглядеть что-то через щели между досками. Снаружи только густой туман и силуэты каких-то деревьев. Вдруг ты слышишь шаги за дверью... Они приближаются.",
        music: "tension",
        choices: [
            { text: "Быстро вернуться к центру комнаты", next: "return_center" },
            { text: "Приготовиться к обороне", next: "prepare_defense" },
            { text: "Спрятаться за кроватью", next: "hide_bed" }
        ]
    },

    examine_walls: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты внимательно изучаешь стены. Кроме царапин, ты замечаешь странные символы, нарисованные чем-то тёмным. Они напоминают тебе что-то... что-то из твоих кошмаров. Внезапно ты слышишь скрип двери.",
        music: "ambient",
        choices: [
            { text: "Быстро отвернуться от стены", next: "look_around" },
            { text: "Попытаться расшифровать символы", next: "decipher_symbols" },
            { text: "Прислушаться к звуку за дверью", next: "listen_door" }
        ]
    },

    examine_stain: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты подходишь к тёмному пятну. При ближайшем рассмотрении это действительно похоже на засохшую кровь. Рядом ты находишь сломанную ручку от чего-то... медицинского инструмента? Ты чувствуешь внезапный приступ тошноты.",
        music: "ambient",
        choices: [
            { text: "Отойти от пятна", next: "look_around" },
            { text: "Взять сломанную ручку", next: "take_handle" },
            { text: "Осмотреть пол вокруг", next: "examine_floor" }
        ]
    },

    remember_more: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты закрываешь глаза и пытаешься пробиться через боль. Воспоминания накатывают волной: ты в этой же комнате, но не один... с тобой кто-то ещё. Ты произносишь странные слова, рисуешь символы на полу... Кровь. Много крови.",
        music: "tension",
        sound: "heartbeat",
        choices: [
            { text: "Прекратить вспоминать", next: "start" },
            { text: "Попытаться понять, что за ритуал", next: "understand_ritual" }
        ]
    },

    focus_subhan: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты сосредотачиваешься на имени 'Субхан'. В памяти всплывают обрывки: ты в белом халате, проводишь какие-то эксперименты... Пациенты... Боли... Ты чувствуешь, что это как-то связано с тобой, но не можешь понять как именно.",
        music: "tension",
        choices: [
            { text: "Продолжить вспоминать", next: "remember_more" },
            { text: "Прекратить это", next: "start" }
        ]
    },

    approach_door: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты осторожно подходишь к двери. Сквозь щель видишь темный коридор. Внезапно дверь распахивается, и ты видишь высокую темную фигуру. 'Субхан...' - шепчет она.",
        music: "tension",
        sound: "door",
        choices: [
            { text: "Отступить назад", next: "start" },
            { text: "Спросить 'Кто ты?'", next: "ask_who" },
            { text: "Попытаться пройти мимо", next: "escape_door" }
        ]
    },

    hide_observe: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты быстро прячешься за шкафом. Дверь медленно открывается, и в комнату входит высокая тёмная фигура. Она осматривает комнату, её взгляд скользит прямо по тебе, но, кажется, не замечает. 'Я знаю, что ты здесь, Субхан...'",
        music: "tension",
        sound: "footsteps",
        choices: [
            { text: "Продолжать молчать", next: "keep_silent" },
            { text: "Выскочить и атаковать", next: "attack_figure" },
            { text: "Сдаться", next: "surrender_early" }
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

    run_right: {
        background: 'images/backgrounds/dark-corridor.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты бежишь направо и оказываешься перед лестницей, ведущей вниз. Снизу доносится странный гул, смешанный с тихими голосами. Шаги позади становятся громче.",
        music: "tension",
        sound: "footsteps",
        choices: [
            { text: "Спуститься вниз", next: "go_downstairs" },
            { text: "Вернуться назад", next: "escape_door" },
            { text: "Спрятаться под лестницей", next: "hide_under_stairs" }
        ]
    },

    hide_niche: {
        background: 'images/backgrounds/dark-corridor.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты заскакиваешь в тёмную нишу в стене. Шаги проходят мимо, но затем останавливаются. 'Я знаю, что ты здесь...' - говорит голос прямо за стеной. Ты чувствуешь, как ниша начинает сужаться.",
        music: "tension",
        sound: "whisper",
        choices: [
            { text: "Выскочить и бежать", next: "run_left" },
            { text: "Попытаться затаиться глубже", next: "hide_deeper" },
            { text: "Атаковать неожиданно", next: "ambush_attacker" }
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

    take_side_passage: {
        background: 'images/backgrounds/dark-corridor.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты сворачиваешь в боковой проход и оказываешься в маленькой комнате с множеством старых мониторов. На экранах мелькают искажённые лица. Одно из лиц кажется тебе знакомым... это твоё собственное лицо, но искажённое гримасой боли.",
        music: "tension",
        choices: [
            { text: "Присмотреться к мониторам", next: "watch_monitors" },
            { text: "Выйти из комнаты", next: "exit_monitor_room" },
            { text: "Разбить мониторы", next: "break_monitors" }
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
            { text: "Это невозможно!", next: "subhan_past" },
            { text: "Что я сделал?", next: "what_did_i_do" }
        ]
    },

    run_away: {
        background: 'images/backgrounds/abandoned-hospital.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты бежишь через заброшенное крыло больницы, но коридоры начинают искажаться и смыкаться перед тобой. Голос преследует тебя: 'Беги, если хочешь, но ты никуда не денешься от себя'. Впереди появляется тусклый свет старого дома...",
        music: "tension",
        sound: "footsteps",
        choices: [
            { text: "Бежать к дому", next: "run_to_house" },
            { text: "Свернуть вглубь леса", next: "deeper_forest" },
            { text: "Остановиться и сдаться", next: "surrender_final" }
        ]
    },

    // ==================== РАСШИРЕННЫЙ СЮЖЕТ ====================

    subhan_past: {
        background: 'images/backgrounds/old-hospital.jpg',
        character: 'images/characters/subhan.png',
        speaker: "Воспоминание",
        text: "Ты видишь себя в белом халате. 1998 год. Ты - доктор Субхан, гениальный хирург, одержимый идеей бессмертия. После смерти жены ты поклялся победить смерть любой ценой. Пациенты в палатах... они не просто пациенты. Они - материал для твоих экспериментов.",
        music: "memory-theme",
        sound: "memory-flash",
        choices: [
            { text: "Продолжить смотреть", next: "subhan_experiment" },
            { text: "Разорвать связь с прошлым", next: "reject_past" },
            { text: "Спросить о жене", next: "ask_about_wife" }
        ]
    },

    subhan_experiment: {
        background: 'images/backgrounds/laboratory.jpg',
        character: 'images/characters/subhan.png',
        speaker: "Воспоминание",
        text: "Ты стоишь перед сложным аппаратом. Пациент привязан к креслу. 'Процедура будет болезненной, но ты обретёшь бессмертие' - говоришь ты. Но что-то идёт не так. Крики, вспышки света, и... тишина. Ты понимаешь, что совершил нечто ужасное.",
        music: "memory-theme",
        sound: "ritual-chant",
        choices: [
            { text: "Узнать что произошло", next: "experiment_disaster" },
            { text: "Прервать воспоминание", next: "break_memory" },
            { text: "Искать способ исправить", next: "find_redemption" }
        ]
    },

    experiment_disaster: {
        background: 'images/backgrounds/laboratory.jpg',
        character: 'images/characters/assistant.png',
        speaker: "Ассистент",
        text: "Доктор, мы должны остановиться! Все пациенты... они не становятся бессмертными. Их души застревают между мирами! Мы создали проклятое место!",
        music: "tension",
        sound: "ghost-whisper",
        choices: [
            { text: "Приказать продолжать", next: "continue_experiment" },
            { text: "Остановить эксперименты", next: "stop_experiment" },
            { text: "Спросить о первом пациенте", next: "first_patient" }
        ]
    },

    ask_about_wife: {
        background: 'images/backgrounds/memory_fragment.jpg',
        character: 'images/characters/wife.png',
        speaker: "Елена",
        text: "Субхан, мой любимый... Зачем ты это делаешь? Я приняла свою смерть. Ты должен отпустить меня. Эта одержимость разрушает тебя.",
        music: "memory-theme",
        sound: "ghost-whisper",
        choices: [
            { text: "Попытаться воскресить её", next: "resurrect_wife" },
            { text: "Послушаться и остановиться", next: "listen_to_wife" },
            { text: "Спросить о её болезни", next: "wife_illness" }
        ]
    },

    meet_other_souls: {
        background: 'images/backgrounds/ghost_ward.jpg',
        character: 'images/characters/ghost.png',
        speaker: "Призрак",
        text: "Ты не первый, кого он поймал в эту ловушку. Я здесь уже 20 лет. Субхан использует наши души как батарейки для поддержания этого места. Но я нашёл слабость в его конструкции...",
        music: "ambient",
        sound: "ghost-whisper",
        choices: [
            { text: "Спросить о способе побега", next: "escape_plan" },
            { text: "Не доверять призраку", next: "distrust_ghost" },
            { text: "Спросить о других пленниках", next: "other_prisoners" }
        ]
    },

    escape_plan: {
        background: 'images/backgrounds/ghost_ward.jpg',
        character: 'images/characters/ghost.png',
        speaker: "Призрак",
        text: "Субхан спрятал своё сердце - физический якорь этого места. Это старый медицинский амулет его жены. Найди его и разбей - это ослабит его власть над нами. Но будь осторожен - он защищён хранителями.",
        music: "tension",
        choices: [
            { text: "Спросить где искать амулет", next: "amulet_location" },
            { text: "Предложить объединиться с другими душами", next: "unite_souls" },
            { text: "Решить действовать в одиночку", next: "solo_mission" }
        ]
    },

    unite_souls: {
        background: 'images/backgrounds/courtyard.jpg',
        character: 'images/characters/ghost.png',
        speaker: "Собрание душ",
        text: "Ты собрал остальных пленников. Их 7, включая тебя. Каждый рассказывает свою историю - как Субхан заманил их сюда под видом лечения. Вместе вы чувствуете силу, которой не было поодиночке. Но некоторые не уверены, что стоит доверять тебе...",
        music: "memory-theme",
        choices: [
            { text: "Атаковать сердце Субхана", next: "group_attack" },
            { text: "Устроить отвлекающий манёвр", next: "distraction_plan" },
            { text: "Попытаться договориться с Субханом", next: "negotiate_subhan" }
        ]
    },

    ritual_choice: {
        background: 'images/backgrounds/ritual_circle.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты нашёл древний ритуал очищения в старых записях Субхана. Но для его выполнения нужна жертва - либо твоя собственная душа, либо душа другого пленника. Выбор за тобой определит судьбу всех.",
        music: "ritual-music",
        sound: "ritual-chant",
        choices: [
            { text: "Пожертвовать собой", next: "self_sacrifice" },
            { text: "Пожертвовать другим пленником", next: "sacrifice_other" },
            { text: "Отказаться от ритуала", next: "reject_ritual" },
            { text: "Найти другой способ", next: "find_another_way" }
        ]
    },

    hospital_truth: {
        background: 'images/backgrounds/void.jpg',
        character: 'images/characters/creature.png',
        speaker: "Истина",
        text: "Эта больница никогда не существовала в реальном мире. Это психологическая тюрьма, созданная Субханом из обрывков памяти его жертв. Ты не просто пленник - ты фундаментальная часть этой конструкции. Без тебя всё это рухнет.",
        music: "truth-theme",
        sound: "reality-break",
        choices: [
            { text: "Попытаться разрушить конструкцию", next: "break_reality" },
            { text: "Искать Субхана в реальном мире", next: "find_real_subhan" },
            { text: "Принять свою роль хранителя", next: "accept_role" },
            { text: "Объединиться с другими душами", next: "merge_with_souls" }
        ]
    },

    first_patient: {
        background: 'images/backgrounds/old-hospital.jpg',
        character: 'images/characters/nurse.png',
        speaker: "Медсестра-призрак",
        text: "Первый пациент... это была я. Я доверяла доктору Субхану. Он обещал вылечить мою дочь. Но вместо этого он запер нас обеих здесь. Моя девочка... я не знаю, где она теперь.",
        music: "memory-theme",
        sound: "ghost-whisper",
        choices: [
            { text: "Пообещать найти её дочь", next: "find_daughter" },
            { text: "Спросить о других ранних пациентах", next: "early_patients" },
            { text: "Вернуться к главной цели", next: "escape_plan" }
        ]
    },

    find_daughter: {
        background: 'images/backgrounds/ghost_ward.jpg',
        character: 'images/characters/ghost.png',
        speaker: "Маленькая душа",
        text: "Мама? Это ты? Я так долго ждала... Я играла с тенями, но они стали злыми. Доктор сказал, что мы будем вместе, но он солгал.",
        music: "memory-theme",
        choices: [
            { text: "Объединить мать и дочь", next: "reunite_family" },
            { text: "Использовать дочь как рычаг", next: "leverage_daughter" },
            { text: "Оставить их в покое", next: "leave_them" }
        ]
    },

    // ==================== КОНЦОВКИ ====================

    redemption_ending: {
        background: 'images/backgrounds/real_world.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты пожертвовал собой, чтобы освободить все души. Больница медленно исчезает, а души пленников обретают покой. Ты чувствуешь, как твоё сознание растворяется, но знаешь - это была правильная цена. Мир наконец свободен от проклятия Субхана.",
        music: "ambient",
        choices: [
            { text: "Начать заново", next: "start" }
        ]
    },

    replacement_ending: {
        background: 'images/backgrounds/void.jpg',
        character: 'images/characters/player.png',
        speaker: "Новый Хранитель",
        text: "Ты занял место Субхана. Теперь ты - мастер этого места. Души остаются пленниками, но под твоим 'заботливым' руководством. Ты обрёл силу, но потерял человечность. Вечность растягивается перед тобой как бесконечный кошмар.",
        music: "main",
        choices: [
            { text: "Принять свою судьбу", next: "start" }
        ]
    },

    destruction_ending: {
        background: 'images/backgrounds/real_world.jpg',
        character: 'images/characters/player.png',
        speaker: "Освободитель",
        text: "Ты разрушил больницу, но ужас, который она сдерживала, вырвался в реальный мир. Ты свободен, но ценой тысяч жизний. По ночам ты до сих пор слышишь шёпот душ, которые проклинают твоё имя.",
        music: "tension",
        choices: [
            { text: "Жить с последствиями", next: "start" }
        ]
    },

    merge_ending: {
        background: 'images/backgrounds/void.jpg',
        character: 'images/characters/player.png',
        speaker: "Единство",
        text: "Ты объединился с другими душами, создав новую форму существования. Вы больше не пленники - вы стали чем-то большим. Больница исчезает, а ваше коллективное сознание начинает путешествие через измерения, неся с собой память о всех жертвах Субхана.",
        music: "truth-theme",
        choices: [
            { text: "Начать новое путешествие", next: "start" }
        ]
    },

    // ==================== ВСПОМОГАТЕЛЬНЫЕ СЦЕНЫ ====================

    return_center: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты быстро возвращаешься в центр комнаты. Шаги за дверью затихают. Кажется, что тебя не заметили. Теперь у тебя есть время подумать о следующем действии.",
        music: "ambient",
        choices: [
            { text: "Снова осмотреться", next: "look_around" },
            { text: "Подойти к двери", next: "approach_door" }
        ]
    },

    prepare_defense: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты хватаешь металлическую ножку от сломанной кровати и занимаешь оборонительную позицию. Дверь медленно открывается...",
        music: "tension",
        choices: [
            { text: "Атаковать первым", next: "attack_first" },
            { text: "Подождать", next: "wait_and_see" }
        ]
    },

    hide_bed: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты прячешься за кроватью. Дверь открывается, и в комнату входит высокая тень. Она медленно осматривает комнату, её взгляд останавливается на твоём укрытии.",
        music: "tension",
        choices: [
            { text: "Продолжать прятаться", next: "keep_hiding" },
            { text: "Выскочить и бежать", next: "escape_door" }
        ]
    },

    decipher_symbols: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Присмотревшись к символам, ты начинаешь понимать их значение. Это заклинания защиты... и заточения. Кто-то пытался защититься от чего-то в этой комнате. Один символ повторяется чаще других - он означает 'Субхан'.",
        music: "ambient",
        choices: [
            { text: "Продолжить изучение", next: "study_symbols" },
            { text: "Отойти от стены", next: "look_around" }
        ]
    },

    take_handle: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты поднимаешь сломанную ручку. Она холодная и скользкая. Внезапно в твоей голове проносятся образы: ты используешь этот инструмент для чего-то ужасного. Ты роняешь его от отвращения.",
        music: "tension",
        choices: [
            { text: "Осмотреть комнату", next: "look_around" },
            { text: "Попытаться вспомнить больше", next: "remember_more" }
        ]
    },

    examine_floor: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Осматривая пол вокруг пятна, ты замечаешь едва видимые следы, ведущие к стене. Кажется, кто-то или что-то было оттащено от этого места.",
        music: "ambient",
        choices: [
            { text: "Идти по следам", next: "follow_tracks" },
            { text: "Вернуться к осмотру комнаты", next: "look_around" }
        ]
    },

    understand_ritual: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты понимаешь, что это был ритуал призыва. Но что-то пошло не так. Существо, которое должно было служить тебе, стало твоим тюремщиком.",
        music: "tension",
        choices: [
            { text: "Попытаться вспомнить детали", next: "remember_ritual_details" },
            { text: "Прекратить вспоминать", next: "start" }
        ]
    },

    listen_door: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты прислушиваешься к звукам за дверью. Слышны тяжёлые шаги и тихое бормотание на непонятном языке. Кто-то определённо там есть.",
        music: "tension",
        choices: [
            { text: "Открыть дверь", next: "escape_door" },
            { text: "Спрятаться", next: "hide_observe" }
        ]
    },

    keep_silent: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты продолжаешь молчать. Фигура постояла ещё несколько минут, затем вышла, притворив дверь. Кажется, опасность миновала.",
        music: "ambient",
        choices: [
            { text: "Выйти из укрытия", next: "look_around" },
            { text: "Подождать ещё", next: "wait_longer" }
        ]
    },

    attack_figure: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты выскакиваешь из укрытия и атакуешь фигуру, но твои удары проходят сквозь неё. 'Глупый смертный...' - говорит она, прежде чем исчезнуть.",
        music: "tension",
        choices: [
            { text: "Осмотреть комнату", next: "look_around" },
            { text: "Выйти в коридор", next: "escape_door" }
        ]
    },

    surrender_early: {
        background: 'images/backgrounds/hospital-room.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты выходишь из укрытия с поднятыми руками. 'Я сдаюсь'. Фигура смеётся: 'О, Субхан, ты всегда был таким слабым...' Затем всё темнеет.",
        music: "tension",
        choices: [
            { text: "Проснуться снова", next: "start" }
        ]
    },

    go_downstairs: {
        background: 'images/backgrounds/basement.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты спускаешься по лестнице в тёмный подвал. В воздухе витает запах плесени и чего-то мёртвого.",
        music: "tension",
        choices: [
            { text: "Осмотреться", next: "examine_room" },
            { text: "Вернуться наверх", next: "escape_door" }
        ]
    },

    hide_under_stairs: {
        background: 'images/backgrounds/dark-corridor.jpg',
        character: 'images/characters/player.png',
        speaker: "Ты",
        text: "Ты прячешься под лестницей. Шаги проходят мимо, не заметив тебя.",
        music: "tension",
        choices: [
            { text: "Подождать", next: "wait_under_stairs" },
            { text: "Выйти и продолжить путь", next: "run_left" }
        ]
    },

    // ==================== ЗАГЛУШКИ ДЛЯ ОСТАЛЬНЫХ СЦЕН ====================

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
    'ask_deal', 'ask_want', 'what_did_i_do', 'reject_past', 'break_memory', 
    'find_redemption', 'continue_experiment', 'stop_experiment', 'resurrect_wife', 
    'listen_to_wife', 'wife_illness', 'distrust_ghost', 'other_prisoners', 
    'amulet_location', 'solo_mission', 'group_attack', 'distraction_plan', 
    'negotiate_subhan', 'self_sacrifice', 'sacrifice_other', 'reject_ritual', 
    'find_another_way', 'break_reality', 'find_real_subhan', 'accept_role', 
    'merge_with_souls', 'early_patients', 'reunite_family', 'leverage_daughter', 
    'leave_them', 'hide_deeper', 'ambush_attacker', 'examine_room', 'find_exit',
    'watch_monitors', 'exit_monitor_room', 'break_monitors', 'examine_symbols',
    'close_book', 'continue_reading', 'run_to_house', 'deeper_forest', 'surrender_final',
    'surrender', 'study_symbols', 'follow_tracks', 'remember_ritual_details',
    'wait_longer', 'wait_under_stairs', 'attack_first', 'wait_and_see',
    'keep_hiding'
];

// Создаем автоматические заглушки
missingScenes.forEach(sceneName => {
    if (!story[sceneName]) {
        story[sceneName] = story.development_note;
    }
});
