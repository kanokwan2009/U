/* =====================================================
   ECHOES OF AETHER
   RPG GAME ENGINE
===================================================== */

let player = {
    name: "Aren",
    level: 1,

    hp: 120,
    maxHp: 120,

    mp: 50,
    maxMp: 50,

    exp: 0,
    nextExp: 100,

    attack: 22,
    defense: 8,

    gold: 100,

    potions: 3
};

let enemy = null;

let storyIndex = 0;

const story = [
    "คืนหนึ่ง ในป่าเอเธเรีย เสียงระฆังดังขึ้นจากสถานที่ที่ไม่มีใครเคยพบมาก่อน",
    "Aren ตื่นขึ้นพร้อมกับตราประหลาดบนมือของเขา",
    "ทันใดนั้น เสียงหนึ่งก็ดังขึ้นในหัว...",
    "“หากเจ้าต้องการรู้ความจริง จงตามเสียงของข้าไปยังหอคอยแห่งความทรงจำ”",
    "การเดินทางของ Aren จึงเริ่มต้นขึ้น..."
];

/* ==============================
   SCREEN SYSTEM
============================== */

function showScreen(id) {

    document.querySelectorAll(".screen")
        .forEach(screen => screen.classList.remove("active"));

    document.getElementById(id)
        .classList.add("active");
}

/* ==============================
   START
============================== */

function startGame() {

    player = {
        name: "Aren",
        level: 1,
        hp: 120,
        maxHp: 120,
        mp: 50,
        maxMp: 50,
        exp: 0,
        nextExp: 100,
        attack: 22,
        defense: 8,
        gold: 100,
        potions: 3
    };

    storyIndex = 0;

    showScreen("storyScreen");

    showStory();
}

function showStory() {

    document.getElementById("storyText")
        .textContent = story[storyIndex];
}

function nextStory() {

    storyIndex++;

    if (storyIndex >= story.length) {

        showScreen("gameScreen");

        updateUI();

        log("คุณเข้าสู่ป่าเอเธเรีย");

        return;
    }

    showStory();
}

/* ==============================
   UI
============================== */

function updateUI() {

    document.getElementById("level").textContent =
        player.level;

    document.getElementById("hpText").textContent =
        `${player.hp}/${player.maxHp}`;

    document.getElementById("mpText").textContent =
        `${player.mp}/${player.maxMp}`;

    document.getElementById("expText").textContent =
        `${player.exp}/${player.nextExp}`;

    document.getElementById("hpBar").style.width =
        `${player.hp / player.maxHp * 100}%`;

    document.getElementById("mpBar").style.width =
        `${player.mp / player.maxMp * 100}%`;

    document.getElementById("expBar").style.width =
        `${player.exp / player.nextExp * 100}%`;
}

/* ==============================
   LOG
============================== */

function log(text) {

    const box = document.getElementById("gameLog");

    box.innerHTML += `<div>› ${text}</div>`;

    box.scrollTop = box.scrollHeight;
}

/* ==============================
   EXP / LEVEL
============================== */

function gainExp(amount) {

    player.exp += amount;

    log(`ได้รับ EXP ${amount}`);

    while (player.exp >= player.nextExp) {

        player.exp -= player.nextExp;

        player.level++;

        player.nextExp =
            Math.floor(player.nextExp * 1.35);

        player.maxHp += 25;
        player.maxMp += 10;

        player.hp = player.maxHp;
        player.mp = player.maxMp;

        player.attack += 5;
        player.defense += 2;

        log(`🎉 LEVEL UP! ตอนนี้ Lv.${player.level}`);
    }

    updateUI();
}

/* ==============================
   EXPLORE
============================== */

function explore() {

    const chance = Math.random();

    if (chance < .65) {

        startBattle();

    } else if (chance < .85) {

        player.gold += 25;

        log("คุณพบถุงเหรียญ 25 Gold!");

        updateUI();

    } else {

        player.hp = Math.min(
            player.maxHp,
            player.hp + 20
        );

        log("คุณพบแหล่งน้ำลึกลับ HP +20");

        updateUI();
    }
}

/* ==============================
   ENEMIES
============================== */

const enemies = [

    {
        name: "Shadow Wolf",
        icon: "🐺",
        hp: 90,
        attack: 17,
        defense: 5,
        exp: 45,
        gold: 20
    },

    {
        name: "Forest Goblin",
        icon: "👺",
        hp: 110,
        attack: 19,
        defense: 7,
        exp: 55,
        gold: 30
    },

    {
        name: "Aether Beast",
        icon: "🐉",
        hp: 170,
        attack: 25,
        defense: 10,
        exp: 90,
        gold: 60
    },

    {
        name: "Guardian of Ruins",
        icon: "🗿",
        hp: 240,
        attack: 31,
        defense: 14,
        exp: 150,
        gold: 100
    }
];

/* ==============================
   BATTLE START
============================== */

function startBattle() {

    const template =
        enemies[Math.floor(Math.random() * enemies.length)];

    enemy = {
        ...template,
        maxHp: template.hp
    };

    document.getElementById("enemyName")
        .textContent = enemy.name;

    document.getElementById("enemyIcon")
        .textContent = enemy.icon;

    document.getElementById("battleMessage")
        .textContent = `${enemy.name} ปรากฏตัว!`;

    updateEnemyUI();

    showScreen("battleScreen");
}

/* ==============================
   ENEMY UI
============================== */

function updateEnemyUI() {

    document.getElementById("enemyHpText")
        .textContent =
        `${enemy.hp}/${enemy.maxHp}`;

    document.getElementById("enemyHpBar")
        .style.width =
        `${enemy.hp / enemy.maxHp * 100}%`;
}

/* ==============================
   DAMAGE SYSTEM
============================== */

function calculateDamage(attacker, defender) {

    let base =
        attacker.attack - defender.defense * .45;

    base += Math.random() * 8 - 4;

    return Math.max(1, Math.floor(base));
}

/* ==============================
   PLAYER ATTACK
============================== */

function attack() {

    if (!enemy) return;

    let damage =
        calculateDamage(player, enemy);

    /* Critical */

    const critical =
        Math.random() < .15;

    if (critical) {
        damage *= 2;
    }

    /* Dodge */

    const dodge =
        Math.random() < .08;

    if (dodge) {

        battleMessage("ศัตรูหลบการโจมตี!");

        enemyTurn();

        return;
    }

    enemy.hp -= damage;

    animateEnemyHit();

    showDamage("enemyDamage", damage);

    if (critical) {

        battleMessage(
            `💥 CRITICAL! คุณโจมตี ${damage} Damage`
        );

    } else {

        battleMessage(
            `คุณโจมตี ${damage} Damage`
        );
    }

    updateEnemyUI();

    if (enemy.hp <= 0) {

        winBattle();

        return;
    }

    setTimeout(enemyTurn, 700);
}

/* ==============================
   SKILL
============================== */

function useSkill() {

    if (player.mp < 15) {

        battleMessage("MP ไม่เพียงพอ!");

        return;
    }

    player.mp -= 15;

    let damage =
        Math.floor(player.attack * 1.8);

    damage += Math.floor(Math.random() * 10);

    enemy.hp -= damage;

    animateEnemyHit();

    showDamage("enemyDamage", damage);

    battleMessage(
        `🔥 Aether Slash! ${damage} Damage`
    );

    updateEnemyUI();
    updateUI();

    if (enemy.hp <= 0) {

        winBattle();

        return;
    }

    setTimeout(enemyTurn, 700);
}

/* ==============================
   ENEMY TURN
============================== */

function enemyTurn() {

    const dodge =
        Math.random() < .10;

    if (dodge) {

        battleMessage(
            "คุณหลบการโจมตีได้!"
        );

        return;
    }

    let damage =
        calculateDamage(enemy, player);

    player.hp -= damage;

    player.hp =
        Math.max(0, player.hp);

    animatePlayerHit();

    showDamage("playerDamage", damage);

    battleMessage(
        `${enemy.name} โจมตีคุณ ${damage} Damage`
    );

    updateUI();

    if (player.hp <= 0) {

        gameOver();
    }
}

/* ==============================
   POTION
============================== */

function usePotion() {

    if (player.potions <= 0) {

        battleMessage(
            "คุณไม่มี Potion!"
        );

        return;
    }

    player.potions--;

    const heal = 45;

    player.hp =
        Math.min(
            player.maxHp,
            player.hp + heal
        );

    battleMessage(
        `🧪 ฟื้นฟู HP +${heal}`
    );

    updateUI();

    setTimeout(enemyTurn, 700);
}

/* ==============================
   ESCAPE
============================== */

function tryEscape() {

    const chance = Math.random();

    if (chance < .6) {

        battleMessage("คุณหนีสำเร็จ!");

        setTimeout(() => {

            showScreen("gameScreen");

        }, 600);

    } else {

        battleMessage(
            "หนีไม่สำเร็จ!"
        );

        setTimeout(enemyTurn, 500);
    }
}

/* ==============================
   WIN
============================== */

function winBattle() {

    const exp = enemy.exp;
    const gold = enemy.gold;

    player.gold += gold;

    battleMessage(
        `⚔️ ชนะ ${enemy.name}! +${exp} EXP +${gold} Gold`
    );

    gainExp(exp);

    setTimeout(() => {

        showScreen("gameScreen");

        log(
            `ชนะ ${enemy.name} และได้รับ ${gold} Gold`
        );

        enemy = null;

    }, 1300);
}

/* ==============================
   GAME OVER
============================== */

function gameOver() {

    battleMessage(
        "คุณพ่ายแพ้..."
    );

    setTimeout(() => {

        alert(
            "การเดินทางสิ้นสุดลง\nลองใหม่อีกครั้ง!"
        );

        showScreen("titleScreen");

    }, 1000);
}

/* ==============================
   ANIMATIONS
============================== */

function animateEnemyHit() {

    const el =
        document.querySelector(".enemy-fighter");

    el.classList.remove("hit");

    void el.offsetWidth;

    el.classList.add("hit");
}

function animatePlayerHit() {

    const el =
        document.querySelector(".player-fighter");

    el.classList.remove("hit");

    void el.offsetWidth;

    el.classList.add("hit");
}

function showDamage(id, damage) {

    const el =
        document.getElementById(id);

    el.textContent =
        `-${damage}`;

    el.classList.remove("show");

    void el.offsetWidth;

    el.classList.add("show");
}

/* ==============================
   BATTLE MESSAGE
============================== */

function battleMessage(text) {

    document.getElementById("battleMessage")
        .textContent = text;
}

/* ==============================
   INVENTORY
============================== */

function openInventory() {

    renderInventory();

    showScreen("inventoryScreen");
}

function closeInventory() {

    showScreen("gameScreen");
}

function renderInventory() {

    const box =
        document.getElementById("inventoryItems");

    box.innerHTML = `

        <div class="inventory-item">
            <span>🧪 Potion × ${player.potions}</span>
            <button onclick="useInventoryPotion()">
                ใช้
            </button>
        </div>

        <div class="inventory-item">
            <span>💰 Gold</span>
            <strong>${player.gold}</strong>
        </div>

        <div class="inventory-item">
            <span>⚔️ อาวุธ</span>
            <strong>Iron Sword</strong>
        </div>

    `;
}

function useInventoryPotion() {

    if (player.potions <= 0) return;

    player.potions--;

    player.hp =
        Math.min(
            player.maxHp,
            player.hp + 45
        );

    renderInventory();

    updateUI();
}

/* ==============================
   SAVE
============================== */

function saveGame() {

    localStorage.setItem(
        "aetherSave",
        JSON.stringify(player)
    );

    log("💾 บันทึกเกมเรียบร้อย");
}

function loadGame() {

    const data =
        localStorage.getItem("aetherSave");

    if (!data) {

        alert("ยังไม่มีข้อมูลเซฟ");

        return;
    }

    player =
        JSON.parse(data);

    showScreen("gameScreen");

    updateUI();

    log("โหลดข้อมูลการผจญภัยแล้ว");
}

/* ==============================
   KEYBOARD
============================== */

document.addEventListener("keydown", e => {

    if (!document
        .getElementById("battleScreen")
        .classList.contains("active")) return;

    if (e.key === "1") attack();

    if (e.key === "2") useSkill();

    if (e.key === "3") usePotion();

    if (e.key === "4") tryEscape();

});
