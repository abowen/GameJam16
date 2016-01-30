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
                            'scream_10'];
        this.screamSoundGroup = new SoundGroup(this, screamNames);

        var angelNames = ['angel_1', 'angel_2'];
        this.angelSoundGroup = new SoundGroup(this, angelNames);

        var eatingNames = ['eating_1', 'eating_2'];
        this.eatingSoundGroup = new SoundGroup(this, eatingNames);

        var summonNames = ['summon_1', 'summon_2'];
        this.summonSoundGroup = new SoundGroup(this, summonNames);

        this.load.audio('gameMusic', 'asset/music/DarkExploration.mp3');        
    },

    create: function() {
        // TODO: Clearly remove before publishing
        this.game.add.plugin(Phaser.Plugin.Debug);

        this.createMap();
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
        //this.summonKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //this.summonKey.onDown.add(this.summonShit, this);

        // Yes it did
        // TODO: Replace with actual ritual stone logic
        this.runRitualKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        this.runRitualKey.onDown.add(this.runRitual, this);

        this.sacrificeFollowerKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.sacrificeFollowerKey.onDown.add(this.sacrificeFollower, this);

        ////// GORE EFFECTS
        this.bloodParticles = this.make.bitmapData(3, 3);
        this.bloodParticles.rect(0, 0, 4, 4, COLOR_BLOOD_RED);
        this.bloodParticles.update();

        this.emitter = this.add.emitter(0, 0, 128);
        this.emitter.makeParticles(this.bloodParticles);
        this.emitter.gravity = 100;
        this.emitter.setAlpha(1, 0.2, 500);    

        ////// SOUND EFFECTS
        this.screamSoundGroup.create();
        this.angelSoundGroup.create();
        this.eatingSoundGroup.create();
        this.summonSoundGroup.create();

        setInterval(this.spawnHuman.bind(this), 500);

        ////// MUSIC
        // http://phaser.io/examples/v2/audio/loop
        this.music = this.game.add.audio('gameMusic');        

        // MP3's take time to decode, we can make a call back if required
        this.game.sound.setDecodedCallback([this.music], this.startMusic, this);      
       
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
        this.music.loopFull(0.6);
    },

    stopMusic: function() {
        console.log("MUSIC ENDED");
        this.music.stop();
    },


    createMap: function(level) {
        level = level || 'L1';
        this.map = this.add.tilemap('tileset');
        this.map.addTilesetImage('tiles', 'tiles');
        this.map.addTilesetImage('tilesdarkgreen', 'tilesdarkgreen');

        this.map.setCollisionBetween(15, 16);
        //create layer
        this.groundLayer && this.groundLayer.destroy();
        this.groundLayer = this.map.createLayer('groundLayer_' + level);

        this.backgroundLayer && this.backgroundLayer.destroy();
        this.backgroundLayer = this.map.createLayer('backgroundLayer_' + level);
        this.backgroundLayer.sendToBack();
        this.groundLayer.sendToBack();
        var tiles = this.backgroundLayer.getTiles(0, 0, this.world.width, this.world.height);
        this.game.houseTiles = tiles.filter(function(f){return f.index === 2 || f.index === 3 || f.index === 155 || f.index === 156;});

        this.map.setCollision([5,6,7,8,9,10,13, 22,23, 24, 25, 26, 27, 39,40,41,42, 108,109, 110,113,114,115,116,117,118,119,125,126,127,130,131,133,134,136,144,142,143,148,149,150,151,152,153], true, this.backgroundLayer);
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
        if (screenShakeEffect > 0)
        {
            console.log('!@#! screen shaking and partying !@#!')
            this.world_state.cameraShake(screenShakeEffect);
        }
    },

    summonShit: function(human) {
        var summon = new Summon(
            this,
            human.x, -20,
            human.x,
            human.y);
    },

    // Perform a ritual
    runRitual: function() {
        if (this.character.followers.length > 4){
            console.log("It's happening");

            this.character.runRitual();
            this.world_state.runRitual(this.character);

            this.createMap("L2");
            this.world_state.reset();
            // TODO: Slow down humans & ogre for a temporary amount
            // TODO: Reduce size of ogre            
        }
    },

    // Sacrifice a follower to go faster
    sacrificeFollower: function() {
        if (this.character.followers.length > 0){
            console.log("88888ooooo--- TUUUUUUURRRRRBOOOOOOOOOOO))))>");

            var follower = this.character.followers.pop();
            this.character.sacrificeFollower(follower);
            this.world_state.sacrificeFollower(follower);       
        }
    },

    spawnHuman: function() {
        var startTile = this.game.houseTiles[this.game.rnd.between(0, this.game.houseTiles.length - 1)];
        var human = new Human(this, startTile.worldX + 8, startTile.worldY + 8, 'human');
        this.humans.addChild(human);
    },
    
    
    gameOver: function (win) {
        "use strict";
        
        this.stopMusic();
        if(win) {
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
    },
    create: function() {
        // Add logo to the center of the stage
        this.background = this.add.sprite(
            this.world.centerX, // (centerX, centerY) is the center coordination
            this.world.centerY,
            'background');
        // Set the anchor to the center of the sprite
        this.background.anchor.setTo(0.5, 0.5);

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

        this.load.audio('loseMusic', 'asset/music/CreepyGhostPiano.mp3');
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