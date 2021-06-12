const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 15;
const STRONG_ATTACK_VALUE = 20;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';// MODE_ATTACK = 0;
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';//MODE_STROG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValues() {
    const enteredValue = prompt('Maximimlife for you and Monster.','100');

    const parsedValue = parseInt(enteredValue);
    if(isNaN(parsedValue) || parsedValue <= 0) {
        throw{message : 'Invalid User Input, not a number!'}
    }
    return parsedValue;
}

let chosenMaxLife = getMaxLifeValues();

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
    };
    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_GAME_OVER:
            break;
        default:
            logEvent = {};
    }
    /*if (ev === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = 'MONSTER';
    } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target:'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
} else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
        event: ev,
        value: val,
        target: 'PLAYER',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
} else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry = {
        event: ev,
        value: val,
        target: 'PLAYER',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
} else if (ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
}*/
battleLog.push(logEntry);
}

function reset() {
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth =  chosenMaxLife;
    resetGame(chosenMaxLife);
}
function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const PlayerDamage =dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= PlayerDamage;
    writeToLog (
        LOG_EVENT_MONSTER_ATTACK, 
        PlayerDamage, 
        currentMonsterHealth, 
        currentPlayerHealth
        );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('YOU WOULD BE DEAD BUT THE BONUS LIFE SAVED YOU..!')
    }
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('YOU WON..!!');
        writeToLog (
            LOG_EVENT_GAME_OVER, 
            'PLAYER WON', 
            currentMonsterHealth, 
            currentPlayerHealth
            );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('YOU LOST..!!');
        writeToLog (
            LOG_EVENT_GAME_OVER, 
            'MONSTER WON', 
            currentMonsterHealth, 
            currentPlayerHealth
            );
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0){
        alert('MATCH DRAW !!');
        writeToLog (
            LOG_EVENT_GAME_OVER, 
            'A DRAW', 
            currentMonsterHealth, 
            currentPlayerHealth
            );
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
}

function atttackMonster(mode) {
    let maxDamage;
    let logEvent;
    if (mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog (
        logEvent, 
        damage, 
        currentMonsterHealth, 
        currentPlayerHealth
        );
    endRound();
}

function attackHandler() {
    atttackMonster('ATTACK');
}

function strongAttackHandler() {
   atttackMonster('STRONG_ATTACK');
}

function healPlayerHandler() {
    let healValue;
    let logEvent = LOG_EVENT_PLAYER_HEAL
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("YOU CAN'T HEAL MORE THAN YOUR INITIAL HEALTH");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }

    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog (
        logEvent, 
        healValue, 
        currentMonsterHealth, 
        currentPlayerHealth
        );
    endRound();
}

function printLogHandler() {
    for (let i = 0; i < 3; i++) {
        console.log('---------------')
    }
    // let j =0;
    // while (j < 3) {
    //     console.log('--------------');
    //     j++
    // }
    let i = 0;
    for (const logEntry of battleLog) {
        if (!lastLoggedEntry && lastLoggedEntry !== 0 || lastLoggedEntry < i) {
            console.log(`#${i}`);
            for (const key in logEntry) {
                console.log(`${key} => ${logEntry[key]}`);
            }
            lastLoggedEntry = i;
        break;

        }
        
        i++;
    }
    /*for (let i = 0; i < battleLog.length; i++) {
        console.log(battleLog[i]);
    }*/
    
    //console.log(battleLog);
    //for (let i =10; i > 0; i--) {
      //  console.log(i);
    //}
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);