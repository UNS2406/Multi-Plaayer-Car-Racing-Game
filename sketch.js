/*
C-39: Car racing gameObj stage 5

Developer:

Goals: 
● Add a track in the background.
● Replace the car sprites with images of real cars.
● Write a condition to end the gameObj.

*/

//Declare variables for gameObj objects and behaviour indicators(FLAGS)
var canvas, backgroundImage;
var database;

var formObj;
var gameObj, gameState;
var playerObj, playerCount, allPlayers;

var carsAtFinishLine;

var car1, car2, car3, car4, cars;
var startbg, endImage, track, car1_img, car2_img, car3_img, car4_img;

//Create Media library and load to use it during the course of the software
//executed only once at the start of the program
function preload() {
  startbg = loadImage("../images/startbg.jpeg");
  // endImage = loadImage("../images/background.jpg");

  track = loadImage("../images/track.jpeg");
  car1_img = loadImage("../images/car1.png");
  car2_img = loadImage("../images/car2.png");
  car3_img = loadImage("../images/car3.png");
  car4_img = loadImage("../images/car4.png");
  ground = loadImage("../images/ground.png");
}

//define the initial environment of the software(before it is used)
//by defining the declared variables with default values
function setup() {
  createCanvas(displayWidth - 20, displayHeight - 30);

  //initialize the database-
  databaseObj = firebase.database();

  gameObj = new Game();

  gameState = 0; //0=WAIT, 1=PLAY, 2=END

  //function call to READ/RETRIEVE/GET existing value of gameState from database
  gameObj.getState();

  //function call to start the GAME i.e. gameState will activate  0 WAIT state
  gameObj.start();
}

//All modifications, changes, conditions, manipulations, actionscommands to be executed and checked, continuously or applied throughout the program are written inside function draw.
//function draw is executed for every frame created since the start of the program.
function draw() {
  background(startbg);

  //conditions for GAMESTATE to change from 0 to 1 to 2
  if (playerCount === 4 && carsAtFinishLine < 4 ) {
 
    /*
             function call to change existing value of gameState to a 
             new one based on the value of paramter passed in the database
        */
    gameObj.updateState(1);
  }

  if (gameState === 1) {
    clear();
    /*
            function call to activate the gameObj to START 1 mode and 
            aligned all players to starting positions at the start line
        */
    gameObj.play();
  }

  if (carsAtFinishLine === 4) {
    console.log("carsAtFinishLine before updating GS to 2: " + carsAtFinishLine);
    /*
        function call to change existing value of gameState to a 
        new one based on the value of paramter passed in the database
    */
    gameObj.updateState(2);
  }

  if (gameState === 2) {
    /*
     function call to activate the gameObj to START 1 mode and 
     aligned all players to starting positions at the start line
    */
    gameObj.end();
  }
}

/* READ READ READ READ

CRUD - creating READING UPDATING DELETING

.ref() is used to refer to the location of the
database value(field) we care about.

.on() creates a listener which keeps
listening to the changes in the database.

.set() is used to set the value in the
database



READ READ READ READ */
