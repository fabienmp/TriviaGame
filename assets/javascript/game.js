function Character(name, initialAttack, counterAttack, lifePoints) {
    this.name = name,
        this.attackPtsIncrease = initialAttack,
        this.attackPts = initialAttack,
        this.counterAttackPts = counterAttack,
        this.lifePts = lifePoints,
        this.attack = function () {
            var currentAttackPts = this.attackPts;
            this.attackPts += this.attackPtsIncrease;
            return currentAttackPts;
        },
        this.counterAttack = function () {
            return this.counterAttackPts;
        },
        this.takeAttack = function (attackStrength) {
            this.lifePts -= attackStrength;
            if (this.lifePts < 0)
                this.lifePts = 0;
        }

}

var game = new starWarsGame();
window.CURRENT_GAME = game;
window.CURRENT_GAME.init();