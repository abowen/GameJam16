var SummonFromHell = (function(){
    function SummonFromHell(game_state, originX, originY){
        this.gameState = game_state;
        this.totalSummonCount = 0;
        this.destroyCount = 0;
        this.inEffect = false;
        this.originX = originX;
        this.originY = originY;
    };

    SummonFromHell.prototype = Object.create({});
    SummonFromHell.prototype.constructor = SummonFromHell;

    SummonFromHell.prototype.unleash = function() {
        if(this.inEffect) return;
        this.inEffect = true;

        console.log(">> summon from hell <<");
        this.gameState.hyena.play();
        this.gameState.humans.forEach(function(human) { human.summonCollision(null); });
        this.totalSummonCount = this.destroyCount = 0;
        
        var radius = 25;
        var summonCount = 4;
        var angleIncr = 360 / summonCount;
        var layers = this.gameState.rnd.between(3, 5);
        for(var j = 0; j < layers; j++) {
            var angle = 0;
            for(var i = 0; i < summonCount; i++) {
                var targetX = (radius * Math.cos(this.gameState.math.degToRad(angle))) + this.originX;
                var targetY = (radius * Math.sin(this.gameState.math.degToRad(angle))) + this.originY;
                
                angle += angleIncr;

                var summon = new Summon(
                    this.gameState,
                    targetX, -20,
                    targetX,
                    targetY
                );
                summon.events.onDestroy.add(this.onDestroy, this);

                this.totalSummonCount++;
            }
            radius *= 2;
            angleIncr /= 2;
            summonCount *= 2;
        }
    };

    SummonFromHell.prototype.onDestroy = function() {
        console.log("summon destroyed!");
        console.log(this.totalSummonCount);
        this.destroyCount++;
        console.log(this.destroyCount);
        if(this.destroyCount == this.totalSummonCount) {
            console.log("all summons destroyed!!!");
            this.gameState.humans.forEach(function(human) { human.isSummoned = false; });
            this.inEffect = false;
        }
    };

    return SummonFromHell;
})();