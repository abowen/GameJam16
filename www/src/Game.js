/* jshint browser:true */
// create BasicGame Class
BasicGame = {

};

// create Game function in BasicGame
BasicGame.Game = function(game) {};
BasicGame.YouWin = function(game) {};
BasicGame.YouLose = function(game) {};

var cursors;

// set Game function prototype
BasicGame.Game.prototype = {
    init: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        this.scale.setUserScale(2, 2, 0, 0);
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();
    },

    preload: function() {
        this.load.tilemap('tileset', 'asset/tileset.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tileset_multi', 'asset/tileset_multi.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'asset/tiles.png');
        this.load.image('tilesdarkgreen', 'asset/tilesdarkgreen.png');

        //http://phaser.io/examples/v2/sprites/spritesheet        
        this.load.spritesheet('character', 'asset/images/character_spritesheet_32.png', 32, 32, 12);
        this.load.spritesheet('enemy', 'asset/images/enemy_spritesheet_64.png', 64, 64, 10);
        this.load.spritesheet('offering_stone', 'asset/images/offering_stone_32.png', 32, 32, 8);
        this.load.spritesheet('human', 'asset/images/human_spritesheet_16.png', 16, 16, 30);
        this.load.spritesheet('humanparts', 'asset/images/humanparts_spritesheet_8.png', 8, 8, 4);
        this.load.spritesheet('ghost', 'asset/images/ghost_spritesheet_16.png', 16, 16, 10);
        this.load.spritesheet('slime', 'asset/images/slime_spritesheet_16.png', 16, 16, 12);

        this.load.image('scoreIcon', 'asset/images/character_16.png');
        this.load.image('summon', 'asset/images/summon_32.png');
        this.load.image('angel', 'asset/images/angel_16.png');
        this.load.image('keyboardLeft', 'asset/images/keyboardLeft.png');
        this.load.image('keyboardUp', 'asset/images/keyboardUp.png');
        this.load.image('keyboardDown', 'asset/images/keyboardDown.png');
        this.load.image('keyboardRight', 'asset/images/keyboardRight.png');
        this.load.image('keyboardCtrl', 'asset/images/keyboardCtrl.png');
        this.load.image('keyboardSpacebar', 'asset/images/keyboardSpacebar.png');
        this.load.image('powerup', 'asset/images/powerup.png')

        //http://phaser.io/examples/v2/audio/sound-complete
        var screamNames = ['screamWilhelm',
            'screamCalzon',
            'scream_1',
            'scream_2',
            'scream_3',
            'scream_4',
            'scream_5',
            'scream_6',
            'scream_7',
            'scream_8',
            'scream_9',
            'scream_10'
        ];
        this.screamSoundGroup = new SoundGroup(this, 'sfx', screamNames);

        var angelNames = ['angel_1', 'angel_2'];
        this.angelSoundGroup = new SoundGroup(this, 'sfx', angelNames);

        var eatingNames = ['eating_1', 'eating_2'];
        this.eatingSoundGroup = new SoundGroup(this, 'sfx', eatingNames);

        var summonNames = ['summon_1', 'summon_2'];
        this.summonSoundGroup = new SoundGroup(this, 'sfx', summonNames);

        var vomitNames = ['vomit_1', 'vomit_2'];
        this.vomitSoundGroup = new SoundGroup(this, 'sfx', vomitNames);


        this.load.audio('intro_music', 'asset/music/intro_music.mp3');

        var levelMusicNames = ['level_music_1', 'level_music_2', 'level_music_3'];
        this.levelMusicSoundGroup = new SoundGroup(this, 'music', levelMusicNames);    
    },

    create: function() {        
        //this.game.add.plugin(Phaser.Plugin.Debug);
        this.initialiseGameState();

        this.summonLayer = this.game.add.physicsGroup();

        // Keyboard controls
        this.instructionLayer = this.game.add.group();
        this.instructionLayer.z = 5;
        this.instructionLayer.destroyChildren = true;

        // People killed rating      
        this.scoreLayer = this.game.add.group();
        this.scoreLayer.z = 4;

        // Moving objects that are blocked by mountains
        this.bodyParts = this.game.add.group();
        this.characters = this.game.add.group();
        this.characters.enableBody = true;
        this.characters.z = 3;

        this.powerUp = new PowerUp(this, 10, 16);

        //http://phaser.io/examples/v2/input/cursor-key-movement
        cursors = this.game.input.keyboard.createCursorKeys();
        this.game.ai = new Ai();

        this.offeringStone = new OfferingStone(this, 'OfferingStone', this.world.centerX, this.world.centerY, 'offering_stone');
        this.character = new Character(this, this.world.centerX / 2, this.world.centerY, 'character');
        this.enemy = new Enemy(this, 'Enemy', this.world.centerX + (this.world.centerX / 2), this.world.centerY, 'enemy');

        this.characters.addChild(this.character);
        this.characters.enableBody = true;
        this.game.physics.arcade.enable(this.characters);

        // Summon those fools from dark earth                
        this.runRitualKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.runRitualKey.onDown.add(this.runRitual, this);

        ////// EFFECTS
        this.bloodParticles = this.make.bitmapData(3, 3);
        this.bloodParticles.rect(0, 0, 4, 4, COLOR_BLOOD);
        this.bloodParticles.update();

        this.bloodEmitter = this.add.emitter(0, 0, 128);
        this.bloodEmitter.makeParticles(this.bloodParticles);
        this.bloodEmitter.gravity = 100;
        this.bloodEmitter.setAlpha(1, 0.2, 500);

        this.vomitParticles = this.make.bitmapData(3, 3);
        this.vomitParticles.rect(0, 0, 6, 6, COLOR_VOMIT);
        this.vomitParticles.update();

        this.vomitEmitter = this.add.emitter(0, 0, 128);
        this.vomitEmitter.makeParticles(this.vomitParticles);
        this.vomitEmitter.gravity = 100;
        this.vomitEmitter.setAlpha(1, 0.2, 500);

        ////// SOUND EFFECTS
        this.screamSoundGroup.create();
        this.angelSoundGroup.create();
        this.eatingSoundGroup.create();
        this.summonSoundGroup.create();
        this.vomitSoundGroup.create();

        ////// MUSIC
        // http://phaser.io/examples/v2/audio/loop
        this.levelMusicSoundGroup.create();

        // MP3's take time to decode, we can make a call back if required
        this.game.sound.setDecodedCallback(this.levelMusicSoundGroup.sounds, this.startMusic, this);

        // TODO: set this per level
        setInterval(this.spawnHuman.bind(this), 500);
        setInterval(this.spawnSlime.bind(this), 2500);
                
        // Instruction information        
        this.instructionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.instructionKey.onDown.add(this.clearInstructions, this);

        var keys = ['keyboardLeft', 'keyboardRight', 'keyboardUp', 'keyboardDown', 'keyboardSpacebar', 'keyboardCtrl'];
        var keyX = 30;

        var keyY = GAME_HEIGHT - 75;
        for (var i = 0; i < keys.length; i++) {
            var keySprite = this.add.sprite(keyX, keyY, keys[i]);
            keySprite.scale.setTo(0.75);
            keySprite.alpha = 0.5;
            keyX += keySprite.width + 10;
            keySprite.anchor.set(0, 0);
            this.instructionLayer.addChild(keySprite);
        }
    },

    clearInstructions: function() {
        this.instructionLayer.destroy();
    },

    startMusic: function() {
        console.log("MUSIC START PARTY");
        this.levelMusicSoundGroup.playNextSound(true);
    },

    stopMusic: function() {
        this.levelMusicSoundGroup.stopSound();
    },

    gameResized: function(width, height) {

        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    },

    initialiseGameState: function() {
        this.world_state = new World(this);
    },

    update: function() {
        this.physics.arcade.collide(this.backgroundLayer, this.characters);
        this.physics.arcade.collide(this.backgroundLayer, this.enemies);

        if (cursors.up.isDown) {
            this.character.moveUp();
        } else if (cursors.down.isDown) {
            this.character.moveDown();
        } else if (cursors.left.isDown) {
            this.character.moveLeft();
        } else if (cursors.right.isDown) {
            this.character.moveRight();
        } else {
            this.character.stop();
        }

        // TODO: All values and logic could belong in world.
        var screenShakeEffect = this.world_state.screenShake.effect;
        if (screenShakeEffect > 0) {
            console.log('!@#! screen shaking and partying !@#!')
            this.world_state.cameraShake(screenShakeEffect);
        }

        this.vomitEmitter.emitX = this.enemy.x;
        this.vomitEmitter.emitY = this.enemy.y;
        this.bloodEmitter.emitX = this.enemy.x;
        this.bloodEmitter.emitY = this.enemy.y;
    },

    summonCollisionHandler: function(sourceEntity, destinationEntity) {
        var summon = new Summon(
            this.game_state,
            sourceEntity.x, -20,
            sourceEntity.x,
            sourceEntity.y);

        if (sourceEntity.summonCollision)
        {
            sourceEntity.summonCollision(destinationEntity);
        }
        if (destinationEntity.summonCollision)
        {
            destinationEntity.summonCollision(sourceEntity);
        }
    },

    // Perform a ritual
    runRitual: function() {
        this.character.runRitual();
    },

    spawnHuman: function() {
        var startTile = this.game.houseTiles[this.game.rnd.between(0, this.game.houseTiles.length - 1)];
        var human = new Human(this, startTile.worldX + 8, startTile.worldY + 8, 'human');
        this.humans.addChild(human);
    },

    spawnSlime: function() {
        var startTile = this.game.houseTiles[this.game.rnd.between(0, this.game.houseTiles.length - 1)];
        
        var slimeProps = {
            spriteSheet: 'slime',
            name: 'slime',
            group: 'slimes',
            master: 'character',
            followingSpeed: 30,
            speed: 10
        }
        
        var slime = new FollowingMob(this, startTile.worldX + 8, startTile.worldY + 8, slimeProps);
        this.slimes.addChild(slime);
    },
        
    gameOver: function (win) {
        "use strict";

        this.stopMusic();
        if (win) {
            this.game.state.start("YouWin", true, false, null, "YouWin");
        } else {
            this.game.state.start("YouLose", true, false, null, "YouLose");

        }
    }
};

// create Game function in BasicGame
BasicGame.YouWin.prototype = {
    init: function() {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();

    },
    preload: function() {
        this.load.image('background', 'asset/images/you_win.png');

        this.load.audio('winMusic', 'asset/music/win_music.mp3');        
    },
    create: function() {
        // Add logo to the center of the stage
        this.background = this.add.sprite(
            this.world.centerX, // (centerX, centerY) is the center coordination
            this.world.centerY,
            'background');
        // Set the anchor to the center of the sprite
        this.background.anchor.setTo(0.5, 0.5);

        this.music = this.game.add.audio('winMusic');
        this.game.sound.setDecodedCallback([this.music], this.startMusic, this);
    },

    startMusic: function() {
        this.music.play();
    }
};


// create Game function in BasicGame
BasicGame.YouLose.prototype = {
    init: function() {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();

    },
    preload: function() {
        this.load.image('background', 'asset/images/you_lose.png');

        this.load.audio('loseMusic', 'asset/music/lose_music.mp3');
    },
    create: function() {
        // Add logo to the center of the stage
        this.background = this.add.sprite(
            this.world.centerX, // (centerX, centerY) is the center coordination
            this.world.centerY,
            'background');
        // Set the anchor to the center of the sprite
        this.background.anchor.setTo(0.5, 0.5);

        this.music = this.game.add.audio('loseMusic');
        this.game.sound.setDecodedCallback([this.music], this.startMusic, this);
    },

    startMusic: function() {
        this.music.play();
    }
};