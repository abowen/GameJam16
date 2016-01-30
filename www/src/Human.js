var Human = (function() {
	function Human(game, x, y, sprite) {
		MovingSprite.call(this, game, x, y, sprite);
		this.speed = 1;
		this.body.allowGravity = false;

		this.framesPerSecond = 10;
        this.followers = [];
        
        this.setAnimation();
		this.moves = ['moveUp', 'moveDown', 'moveLeft', 'moveRight'];
		this.lastMove = null;
	};

	Human.prototype = Object.create(MovingSprite.prototype);
	Human.prototype.constructor = Human;

	Human.prototype.setAnimation = function() {
		this.animations.add('down', [0, 1, 2, 3, 4, 5], this.framesPerSecond, true);
        this.animations.add('right', [18, 19, 20, 21, 22, 23], this.framesPerSecond, true);
        this.animations.add('up', [12, 13, 14, 15, 16, 17], this.framesPerSecond, true);
        this.animations.add('left', [6, 7, 8, 9, 10, 11], this.framesPerSecond, true);
	};
    
    Human.prototype.addFollower = function(follower){
        this.followers.push(follower);
        follower.follow(this);
    };

	Human.prototype.update = function() {
		var moveIn = this.lastMove;
		if (!this.lastMove || Math.random() > 0.98) {
			moveIn = this.moves[Math.floor(Math.random() * 10) % 4];
		}
		this[moveIn]();
		this.lastMove = moveIn;

		if (this.y > this.game.height || this.y < 0 || this.x > this.game.height || this.x < 0) this.destroy();
	};

	return Human;
})();