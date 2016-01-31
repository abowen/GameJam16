var Summon = (function(){
    function Summon(game_state, x, y, targetX, targetY){
        properties = {
            group: 'summonLayer',
            spritesheet: 'summon'
        };

        Prefab.call(this, game_state, name, {x:x, y:y}, properties);

        this.speed = 5;
        this.timer = 1000;
        var game = game_state.game;
        game.physics.enable(this);
        
        this.anchor.set(0.5);

        this.animate(targetX, targetY);
    };

    Summon.prototype = Object.create(Phaser.Sprite.prototype);
    Summon.prototype.constructor = Summon;

    Summon.prototype.kill = function() { this.destroy(); };

    Summon.prototype.animate = function(targetX, targetY) {
        var summonSpeed = 500;
        this.fallTween = game.add.tween(this);
        this.fallTween.to({
            x: targetX,
            y: targetY
        }, summonSpeed, Phaser.Easing.Quadratic.Out);

        this.fallTween.start();

        this.tweenRotate = game.add.tween(this);
        this.tweenRotate.to({
            angle: 200
        }, summonSpeed, Phaser.Easing.Linear.None);
        this.tweenRotate.start();

        setTimeout(function(){
            this.killTween = game.add.tween(this)
            this.killTween.to({
                width:0,
                height:0
            }, summonSpeed, Phaser.Easing.Quadratic.Out);


            this.killTween.onComplete.add(function(){
                this.kill();
            }, this);

            this.killTween.start();


        }.bind(this), this.timer);

        this.game_state.summonSoundGroup.playRandomSound();
    };


    return Summon;
})();