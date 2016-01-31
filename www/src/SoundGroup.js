var SoundGroup = (function() {
    function SoundGroup(game_state, subFolder, soundNames) {
    	this.game_state = game_state;
    	this.soundNames = soundNames;
    	this.sounds = [];
        this.soundIndex = -1;
        this.sound = null;        

    	this.preload(subFolder);        
    };

    SoundGroup.prototype.preload = function(subFolder){
		for (var i = 0;i<this.soundNames.length;i++)
    	{
    		var soundName = this.soundNames[i];
    		// TODO: Fairly certain there is a Phaser default configuration for this
        	this.game_state.load.audio(soundName, 'asset/'+subFolder+'/'+soundName+'.mp3');
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
        this.soundIndex = this.game_state.game.rnd.between(0, this.sounds.length - 1);
        this.sound = this.sounds[this.soundIndex];
        this.sound.play();
    };

    SoundGroup.prototype.playNextSound = function(isLoop){
        if (this.sound)
        {
            this.sound.stop();    
        }        

        if (this.soundIndex == (this.sounds.length-1)) {
            this.stopSound();
        } else {
            this.soundIndex++;
            this.sound = this.sounds[this.soundIndex];
            this.sound.play();            
        }

        if (isLoop)
        {
            this.sound.loopFull(0.6)
        }
    };

    SoundGroup.prototype.stopSound = function(){        
        this.sound.stop();
        this.soundIndex = -1;
    };

    return SoundGroup;
})();