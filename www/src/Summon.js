var Summon = (function(){
    function Summon(game, x, y, targetX, targetY){
        properties = {
            group: 'summonLayer',
            spritesheet: 'summon'
        };

        Prefab.call(this, game, name, {x:x, y:y}, properties);

        this.speed = 5;
        this.game = game;
        this.timer = 1000;

        this.game.physics.enable(this);
        this.anchor.set(0.5);

        var summonSpeed = 500;

        this.fallTween = this.game.add.tween(this);
        this.fallTween.to({
            x: targetX,
            y: targetY
        }, summonSpeed, Phaser.Easing.Quadratic.Out);

        this.fallTween.start();

        this.tweenRotate = this.game.add.tween(this);
        this.tweenRotate.to({
            angle: 200
        }, summonSpeed, Phaser.Easing.Linear.None);
        this.tweenRotate.start();

        setTimeout(function(){
            this.kill();
        }.bind(this), this.timer);
    };

    Summon.prototype = Object.create(Phaser.Sprite.prototype);
    Summon.prototype.constructor = Summon;


    return Summon;
})();