var Human = (function() {
    function Human(game_state, x, y, sprite) {
        MovingSprite.call(this, game_state, x, y, sprite);
        this.speed = 1;
        this.body.allowGravity = false;
        this.body.acceleration = {
            x: 0,
            y: this.game_state.game.rnd.between(-50, 50)
        };

        this.game_state.game.physics.arcade.enable(this);

        this.framesPerSecond = 15;

        this.setAnimation();
        
        this.devourHuman = function(human, character) {
            human.destroy();
            //update score may be?
        },

        this.humanHitsSummon = function(human, summon) {
//             if (!summon.fallTween.isRunning && human.alive) {
//                 var cloneH = this.game.add.sprite(summon.x, summon.y, 'summon');
//                 cloneH.anchor.set(0.5);
// 
//                 var cloneV = this.game.add.sprite(summon.x, summon.y, 'summon');
//                 cloneV.anchor.set(0.5);
// 
//                 human.kill();
//                 summon.kill();
// 
//                 var explosionSpeed = 250;
// 
//                 this.game.add.tween(cloneV.scale).to({
//                     x: 0.10,
//                     y: 10
//                 }, explosionSpeed, "Expo.easeOut", true, 0);
//                 this.game.add.tween(cloneH.scale).to({
//                     x: 10,
//                     y: 0.10
//                 }, explosionSpeed, "Expo.easeOut", true, 0);
//                 this.game.add.tween(cloneH).to({
//                     alpha: 0
//                 }, 250, "Linear", true, 250);
//                 this.game.add.tween(cloneV).to({
//                     alpha: 0
//                 }, 250, "Linear", true, 250);
// 
//                 var scream = this.game.screams[Math.floor(Math.random() * this.game.screams.length)];
//                 scream.play();
// 
//                 var ghost = new Ghost(this.game, human.x, human.y);
//                 human.addFollower(ghost);
// 
//                 // Tint the world
//                 if (this.humansKilled < 16) {
//                     this.humansKilled++;
// 
//                     var tintValue = 16 - this.humansKilled;
//                     var hexString = tintValue.toString(16);
//                     hexString = hexString + hexString;
//                     var tintColour = '0xff' + hexString + 'ff';
//                     //console.log(this.humansKilled + " " + tintColour);
//                     this.groundLayer.tint = tintColour;
//                     this.backgroundLayer.tint = tintColour;
//                 }
//             }
        }
    };

    Human.prototype = Object.create(MovingSprite.prototype);
    Human.prototype.constructor = Human;

    Human.prototype.setAnimation = function() {
        this.animations.add('down', [0, 1, 2, 3, 4, 5], this.framesPerSecond, true);
        this.animations.add('right', [18, 19, 20, 21, 22, 23], this.framesPerSecond, true);
        this.animations.add('up', [12, 13, 14, 15, 16, 17], this.framesPerSecond, true);
        this.animations.add('left', [6, 7, 8, 9, 10, 11], this.framesPerSecond, true);
    };

    Human.prototype.addFollower = function(follower) {
        this.followers.push(follower);
        follower.follow(this);
    };

    Human.prototype.update = function() {
        this.moveDown();
        this.game_state.game.physics.arcade.overlap(this, this.game_state.summonLayer, this.humanHitsSummon, null, this);
        this.game_state.game.physics.arcade.overlap(this, this.game_state.enemy, this.devourHuman, null, this);
        if (this.y > this.game_state.game.height) this.destroy();
    };

    return Human;
})();