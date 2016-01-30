var PowerUp = (function() {
    function PowerUp(game_state, x, y) {
        properties = {
            group: 'powerUp',
            spritesheet: 'powerup'
        };
        Prefab.call(this, game_state, 'PowerUp', {x:x, y:y}, properties);
        game_state.game.physics.arcade.enable(this);
        this.anchor.set(0.5);
        this.height = 12;
        this.game = game_state.game;

        this.alpha = 0.7;
        this.width = 4;
        this.requriedKills = 10;
    };

    PowerUp.prototype = Object.create(Phaser.Sprite.prototype);
    PowerUp.prototype.constructor = PowerUp;


    PowerUp.prototype.setVelocity = function(x, y) {
        this.body.velocity.x = x;
        this.body.velocity.y = y;
    };

    PowerUp.prototype.addPower = function(){
        var powerRate = 620 / this.requriedKills;
        this.game.add.tween(this).to({
            width: this.width + powerRate,
            x: this.x + powerRate / 2
        }, 5000, "Expo.easeOut", true, 0);
    }

    return PowerUp;

})();