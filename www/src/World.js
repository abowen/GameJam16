var World = (function() {
    function World() {
        this.init_condition = {

        };

        this.humansKilled = 0;

        this.win_conditions = {
            rituals_performed: 3
        };

        this.player = {
            souls_collected: 0,
            rituals_performed: 0
        };

        this.enemy = {
            humans_devoured: 0,
            rituals_performed: 0,
            difficulty: 5
        };

        this.screenShake {
            effect = 0,
                counter = [5, 10, 15]
        }

        var max = this.screenShake.counter.max();
        this.world.setBounds(-max, -max, this.game.width + max, this.game.height + 2);
    };

    World.prototype.devourHuman = function(human) {
        this.player.humans_devoured += 1;
        this.killHuman(human);
    };

    World.prototype.screenShake = function(effect) {
        var min = -effect;
        var max = effect;
        this.game.camera.x += Math.floor(Math.random() * (max - min + 1)) + min;
        this.game.camera.y += Math.floor(Math.random() * (max - min + 1)) + min;
    };

    World.prototype.calculateScreenShake = function() {
        var isItTimeToScreenShakePartyYet = this.screenShake.counter.indexOf(this.player.souls_collected) == 0;

        if (isItTimeToScreenShakePartyYet) {
            console.log('!@#! screen shake party up !@#!')
            this.screenShake.effect = this.screenShake.counter.shift();
        } else {
            console.log('!@#! screen shake baby party !@#!')
            this.screenShake.effect = 1;
        }

        var screenShakeTimer = isItTimeToScreenShakePartyYet ? 2000 : 250;
        setTimeout(function() {
            this.screenShake.effect = 0;
            console.log('!@#! screen shake party down !@#!')
        }.bind(this), screenShakeTimer);
    };

    World.prototype.sacrificeHuman = function(human) {
        this.player.souls_collected += 1;
        this.killHuman(human);
    };

    World.prototype.updateScore = function() {};

    World.prototype.killHuman = function(human) {
        // Tint the world
        if (this.humansKilled < 16) {
            this.humansKilled++;

            var tintValue = 16 - this.humansKilled;
            var hexString = tintValue.toString(16);
            hexString = hexString + hexString;
            var tintColour = '0xff' + hexString + 'ff';
            //console.log(this.humansKilled + " " + tintColour);
            //  human.groundLayer.tint = tintColour;
            //  human.backgroundLayer.tint = tintColour;
        }
    }

    return World;
})();