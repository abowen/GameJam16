var SoundGroup = (function() {
    function SoundGroup(game_state, soundNames) {
    	this.game_state = game_state;
    	this.soundNames = soundNames;
    	this.sounds = [];
    	
    	this.preload();
    };

    SoundGroup.prototype.preload = function(){
		for (var i;i<soundNames.length;i++)
    	{
    		var soundName = soundNames[i];
    		// TODO: Fairly certain there is a Phaser default configuration for this
        	this.game_state.load.audio(soundName, 'asset/sfx/'+soundName+'.mp3');
		}
    };

    SoundGroup.prototype.create = function(){
		for (var i;i<soundNames.length;i++)
    	{
			var sound = this.game.add.audio(soundNames[i]);
            this.sounds.push(sound);
        }
    };

    SoundGroup.prototype.playRandomSound = function(){
        this.sounds[this.game.rnd.between(0, this.sounds.length - 1)].play();
    }

    return SoundGroup;
})();