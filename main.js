//creat a 'main' state that will contain the game

var mainState = {

    //executed at beginning. load images and sounds.
    preload: function(){
        //load bird sprite
        game.load.image('bird', 'assets/jotaro.png');

        //load pipe
        game.load.image('pipe', 'assets/menacing.png');

        //load backgrounds
        game.load.image('background0', 'assets/background.png');
        game.load.image('background', 'assets/steely.png');
        game.load.image('background2', 'assets/steely2.png');
        game.load.image('background3', 'assets/steely3.png');
        game.load.image('background4', 'assets/steely4.png');
        game.load.image('background5', 'assets/steely5.png');

        //load sounds
        game.load.audio('jump', 'assets/ora.wav');
        game.load.audio('welcome', 'assets/start.wav');


    },

    //Called after preload. set up game, display sprites, etc.
    create: function(){

        this.background = game.add.image(0, 0, 'background0');

        //Set up physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //display bird at pos x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        //add physics to bird
        game.physics.arcade.enable(this.bird);

        //call jump when spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.titleScreen = game.add.text(20, 50, "Welcome to Flappy Jotaro!\nPress Spacebar to ora\nthe shit out of Steely Dan!", {font: "30px Arial", fill: "#ffffff", boundsAlignH: "center"});

        this.sadbois = game.add.text(20, 400, "play on desktop loser", {font: "30px Arial", fill: "#ffffff", boundsAlignH: "center"});

        var isStarted = false;

        //Add sound to game
        this.jumpSound = game.add.audio('jump');
        this.thankSound = game.add.audio('thanks');
        this.startSound = game.add.audio('welcome');

        this.startSound.play();
    },

    startGame: function(){
        this.pipes = game.add.group();

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#ffffff" });

        //Move bird anchor
        this.bird.anchor.setTo(-0.2, 0.5);

        this.titleScreen.destroy();
        this.sadbois.destroy();

        this.bird.isStarted = true;

        this.background.destroy();
        this.background = game.add.image(0, 0, 'background');
        game.world.sendToBack(this.background);

    },

    //called once per frame. use for game logic
    update: function(){
        if (this.bird.isStarted){
            this.bird.body.gravity.y = 1000;


            if (this.bird.angle < 20)
                this.bird.angle += 1;

            if (this.score === 5){
                this.background.destroy();
                this.background = game.add.image(0, 0, 'background2');
                game.world.sendToBack(this.background);
            } else if (this.score === 10){
                this.background.destroy();
                this.background = game.add.image(0, 0, 'background3');
                game.world.sendToBack(this.background);
            } else if (this.score === 15){
                this.background.destroy();
                this.background = game.add.image(0, 0, 'background4');
                game.world.sendToBack(this.background);
            } else if (this.score === 20){
                this.background.destroy();
                this.background = game.add.image(0, 0, 'background5');
                game.world.sendToBack(this.background);
            }
        } else {
            this.bird.body.gravity.y = 0;
        }

        if (this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();

        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);


    },

    //jump the bird
    jump: function(){

        //do not jump if dead
        if (this.bird.alive == false)
            return;

        //add vertical velocity to bird
        this.bird.body.velocity.y = -350;

        if (!this.bird.isStarted){
            this.startGame();
        }

        //add vertical velocity to bird
        this.bird.body.velocity.y = -350;

        //create animation on the bird
        var animation = game.add.tween(this.bird);

        //change angle of bird to -20 deg in 100 ms
        animation.to({angle: -10}, 100);

        //start animation
        animation.start();

        //Alternate version of above three lines: game.add.tween(this.bird).to({angle: -20}, 100).start();

        //Play jump sound
        this.jumpSound.play();

    },

    //Restart the game
    restartGame: function(){
        //start the 'main' state, which restarts
        this.jumpSound.stop();
        this.startSound.stop();
        game.state.start('main');
    },

    addOnePipe: function(x, y){
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function(){
        //Randomly pick number between 1 and 5
        //This will be hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        //Add 6 big pipes
        //with one big hole at position 'hole' and 'hole + 1'
        for(var i = 0; i < 8; i++){
            if (i != hole && i != hole + 1 && i != hole + 2)
                this.addOnePipe(400, i * 60 + 10);
        }
        this.score += 1;
        this.labelScore.text = this.score;
    },

};

//init Phaser and create 400px by 490px game
var game = new Phaser.Game(400, 490);

//add mainstate, call it 'main'
game.state.add('main', mainState);

//Start the state (starts the game)
game.state.start('main');