/*

    ● A new player object should be created every time a new user logs in. It should contain all the information
    about the player - name, position in the game etc. 
    
    ● For now it can just have the name property. It
    should also be able to read and write player

    -> databaseReference.on() creates a listener which keeps listening to the
    gameState from the database. When the gameState is changed in
    the database, the function passed as an argument to it is executed.
  
    Note: Here the function is directly written inside the .on() listener.
  
    -> databaseReference.update() will update the database reference.
    Here "/" refers to the main database inside which gameState is created.
  
    writing code to create objects even though the blueprint/ CLASS isn't
    defined yet. This is called writing code using abstraction.

*/

class Player {
  constructor() {
    this.index = null;
    this.distance = 4000;
    this.name = null;
    this.rank = null;
  }

  /*
    function definition to retrieve existing value of playerCount from database
  */
  getCount() {
    var playerCountRef = databaseObj.ref("playerCount");
    playerCountRef.on("value", function (data) {
      playerCount = data.val();
    });
  }

  /*
    function definition to change existing value of playerCount to a 
    new one based on the value of paramter passed in the database
  */
  updateCount(countInput) {
    databaseObj.ref("/").update({
      playerCount: countInput,
    });
  }

  /*
    function definition to retrieve existing value of CarsAtEnd from database
  */
  getCarsAtEnd() {
    databaseObj.ref("CarsAtEnd").on("value", (data) => {
      this.rank = data.val();
      carsAtFinishLine = data.val();
    });
  }

  /*
    function definition to change existing value of CarsAtEnd to a 
    new one based on the value of paramter passed in the database
  */
  static updateCarsAtEnd(rankInput) {
    databaseObj.ref("/").update({
      CarsAtEnd: rankInput
    });
  }

  /*
    function defintiion to change existing value of NAME to a new one based based on the indes(number of the playerObj)
    according value of paramter passed in the database.
  
    .set() is used to set the value in the database
  */
  updatePlayerInfo() {
    var playerIndex = "players/player" + this.index;
    databaseObj.ref(playerIndex).set({
      name: this.name,
      distance: this.distance,
      rank: this.rank,
    });
  }

  /*
    Static functions are those common functions which are called by the
    class themselves rather than by objects of the class. We use the
    'static' keyword before the function to make it a static function. 
  
    function definition to retrieve existing players records: name and distance 
    value for all registered players according to the index in the database  
  
    The players data will be stored as JSON - since the firebase database
    structure is of JSON type
  */
  static getPlayerInfo() {
    var playerInfoRef = databaseObj.ref("players");
    playerInfoRef.on("value", (data) => {
      allPlayers = data.val();
    });
  }

  /*
    function definition to delete records of all 4 player
  */
  static deletePlayerInfo(){
    var playerInfoRef = databaseObj.ref("players");
    playerInfoRef.remove();
  }
}
