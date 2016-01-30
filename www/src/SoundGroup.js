var SoundGroup = (function() {
    function SoundGroup(game_state, soundNames) {
    	this.game_state = game_state;
    	this.soundNames = soundNames;
    	this.sounds = [];

    	this.preload();
    };

    SoundGroup.prototype.preload = function(){
		for (var i = 0;i<this.soundNames.length;i++)
    	{
    		var soundName = this.soundNames[i];
    		// TODO: Fairly certain there is a Phaser default configuration for this
        	this.game_state.load.audio(soundName, 'asset/sfx/'+soundName+'.mp3');
		}
    };

    SoundGroup.prototype.create = function(){
		for (var i = 0;i<this.soundNames.length;i++)
    	{
    		var soundName = this.soundNames[i]
			var sound = this.game_state.game.add.audio(soundName);
            this.sounds.push(sound);
        }
    };

    SoundGroup.prototype.playRandomSound = function(){
        this.sounds[this.game_state.game.rnd.between(0, this.sounds.length - 1)].play();
    }

    return SoundGroup;
})();