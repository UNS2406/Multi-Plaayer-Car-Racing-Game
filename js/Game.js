/*

    ● Game object  should be able to hold the state of the game. It should be able to display form when the game state is 0(WAIT) 
    or the game when the game state is 1(PLAY) or leaderboard when the game state is 2(END).
    ● GAMESTATES: 0 WAIT
              1 START
              2 END

*/

class Game {
  /*   
    writing code to create objects even though the blueprint/CONSTRUCTOR isn't
    defined yet. This is called writing code using abstraction 
  */
  constructor() {}

  /*
    function definition to get/read/retrieve existing value of gameState from database
  */
  getState() {
    var gameStateRef = databaseObj.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }

  /*
    function definition to change existing value of gameState to a 
    new one based on the value of paramter passed in the database
  */
  updateState(stateInput) {
    databaseObj.ref("/").update({
      gameState: stateInput,
    });
  }

  /*
        function defintion to start the GAME i.e. gameState will remain in WAIT(0) state 
        displaying the FORM until all 4 players are registered
    */
  async start() {
    image(
      startbg,
      displayWidth / 2,
      displayHeight / 2,
      displayWidth,
      displayHeight * 5
    );

    if (gameState === 0) {
      //as long as gameState is on WAIT
      playerObj = new Player(); //generate a new playerObj

      var playerCountRef = await databaseObj.ref("playerCount").once("value");
      if (playerCountRef.exists()) {
        playerCount = playerCountRef.val();
        playerObj.getCount(); //get the number of players registered
      }

      formObj = new Form(); //create new formObj for registration
      formObj.display(); //display the generated formObj
    }

    car1 = createSprite(100, 200);
    car1.addImage("car1_img", car1_img);
    car2 = createSprite(300, 200);
    car2.addImage("car2_img", car2_img);
    car3 = createSprite(500, 200);
    car3.addImage("car3_img", car3_img);
    car4 = createSprite(700, 200);
    car4.addImage("car4_img", car4_img);
    cars = [car1, car2, car3, car4];
  }

  /*
    function defintion to activate the gameObj to START 1 mode and 
    aligned all players to starting positions at the start line
  */
  play() {
    formObj.hide();
    //textSize(30);
    //text("Game Start", 120, 100);

    /*
        static function call to retrieve existing playerObj records: name and distance 
        value for all registered players according to the index in the database  
    */
    Player.getPlayerInfo();

    /*
        function call to retrieve existing value of CarsAtEnd from database
    */
    playerObj.getCarsAtEnd();

    if (allPlayers !== undefined) {
      background(rgb(198, 135, 103));
      image(track, 0, -displayHeight * 4, displayWidth, displayHeight * 5);
      //var display_position = 100;

      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 200;
      var y;

      //for every playerObj object inside allPlayers
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data from the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index - 1].x = x;
        cars[index - 1].y = y;

        if (index === playerObj.index) {
          cars[index - 1].shapeColor = "red";

          //assigning camera with the same position with the car
          camera.position.x = displayWidth / 2;
          camera.position.y = cars[index - 1].y;

          //Creating an indicator
          fill("yellow");
          stroke("yellow");
          strokeWeight(10);
          ellipse(x, y, 90, 90);
        }

        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120, display_position);
      }
    }

    if (
      keyIsDown(UP_ARROW) &&
      playerObj.index !== null &&
      playerObj.distance < 5600
    ) {
      playerObj.distance += 30;

      /*
        function call to change existing value in the data base of distance and name to a 
        new one based on the value of captured 
      */
      playerObj.updatePlayerInfo();
      console.log("Distance covered during race: " + playerObj.distance);

      console.log("carsAtFinishLine : " + carsAtFinishLine);
    }
    if (keyIsDown(DOWN_ARROW) && playerObj.index !== null) {
      playerObj.distance -= 30;

      /*
        function call to change existing value in the data base of distance and name to a 
        new one based on the value of captured 
      */
      playerObj.updatePlayerInfo();
    }
    if (playerObj.distance == 5230) {
      console.log("inside function");
      playerObj.rank += 1;

      /*
        function definition to change existing value of CarsAtEnd to a 
        new one based on the value of paramter passed in the database
      */
      Player.updateCarsAtEnd(playerObj.rank);

      /*
        function call to change existing value in the data base of distance and name to a 
        new one based on the value of captured 
      */
      playerObj.updatePlayerInfo();
    }
    drawSprites();
  }

  end() {
    //background(startbg);
    background(rgb(198, 135, 103));
    imageMode(CENTER);
    image(startbg, displayWidth / 2, displayHeight / 2, width, height);

    strokeWeight(5);
    stroke(0);
    textSize(100);
    fill(rgb(97, 0, 181));
    text("Game                             Over", displayWidth / 5-10, 250);

    /*
      static function call to retrieve existing playerObj records: name and distance 
      value for all registered players according to the index in the database  
    */ 
    Player.getPlayerInfo();
   
    var ranks = [];
    var display_position = 120;
    for (var plr in allPlayers) {
      ranks.push(allPlayers[plr].rank);
    }
    ranks.sort(function (a, b) {
      return a - b;
    });

    console.log(" ranks:             " + ranks);
    for (var r = 0; r < 5; r = r + 1) {
      for (var plr in allPlayers) {

        display_position += 200;
        if (ranks[r] === allPlayers[plr].rank) {
          //Creating background color around text
          fill("yellow");
          stroke("yellow");
          strokeWeight(0);
          rect(120, display_position, 1200, 90);

          stroke(0);
          fill(0);
          textSize(50);
          text(
            allPlayers[plr].name +
              "               :               " +
              allPlayers[plr].distance +
              "               :               " +
              allPlayers[plr].rank,
            120,
            display_position + 50
          );
        }
      }
    }
  }

 
}

/*

    -> databaseReference.on() creates a listener which keeps listening to the
    gameState from the database. When the gameState is changed in
    the database, the function passed as an argument to it is executed.
    Note: Here the function is directly written inside the .on() listener.

    -> databaseReference.update() will update the database reference.
    Here "/" refers to the main database inside which gameState is created.

    writing code to create objects even though the blueprint/ CLASS isn't
    defined yet. This is called writing code using abstraction

*/
