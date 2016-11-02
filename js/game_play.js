
!function () {
  'use strict';
  
/*=======================
  Creates Start, Game Board, and Win/Tie Screens
=======================*/   
  
//Start Screen
function startScreen () {
  
// creates disembodied elements to append to body
var $screenStartDiv = $('<div></div>');
var $screenStartPlayer = $('<h3></h3>');
var $screenStartHeader = $('<header></header>');
var $screenStarth1 = $('<h1></h1>');
var $screenStartAnchor = $('<a></a>');
var $screenStartP1 = $('<input>');
var $screenStartP2 = $('<input>');
var $screenStartCompButton = $('<a></a>');
  
//sets attributes of disembodied elements 
$screenStartDiv.attr({    
  class: 'screen screen-start',
  id: 'start'
});
$screenStartAnchor.attr({   //start game button
  href: '#',
  class: 'button',
  id: 'startGame'
});
$screenStartP1.attr({   //Player 1 name input
  type: 'text',
  id: 'player1input',
  placeholder: 'Player 1 Name'
});
$screenStartP1.css({
  margin: '20px'
});
$screenStartP2.attr({   ////Player 1 name input
  type: 'text',
  id: 'player2input',
  placeholder: 'Player 2 Name'
});
$screenStartCompButton.attr({   //Play computer button
  href: '#',
  class: 'button',
  id: 'computer'
});  
$screenStartAnchor.text('Start Game');
$screenStarth1.text('Tic Tac Toe'); 
$screenStartCompButton.text('Play Computer');

//Appends disembodied elements to header  
$screenStartHeader.append($screenStarth1);
$screenStartHeader.append($screenStartAnchor);
$screenStartPlayer.append($screenStartP1);  
$screenStartPlayer.append($screenStartP2);
$screenStartHeader.append($screenStartPlayer);
$screenStartHeader.append($screenStartCompButton);
$screenStartDiv.append($screenStartHeader);
//header appended to body after game board <div>  
  
$screenStartDiv.insertAfter('#board');    
}

//  Win Screen added to DOM
function winScreen () {
  
// creates disembodied elements to append to body
var $screenWin = $('<div></div>');
var $screenWinAnchor = $('<a></a>');
var $screenWinh1 = $('<h1></h1>');
var $screenWinHeader = $('<header></header>');
var $screenWinP = $('<p></p>');
$screenWinP.text('Winner');  
$screenWin.attr({
  class: 'screen screen-win',
  id: 'finish'
});
$screenWinP.attr('class', 'message');  
$screenWinAnchor.attr({   //new game button
  href: '#',
  class: 'button',
  });
$screenWinAnchor.text('New game');
$screenWinh1.text('Tic Tac Toe');
  
//Appends disembodied elements to header    
$screenWinHeader.append($screenWinh1);
$screenWinHeader.append($screenWinP);
$screenWinHeader.append($screenWinAnchor);
$screenWin.append($screenWinHeader);
  
//header appended to body after start <div>  
$screenWin.insertAfter('#start');   
}

//puts player name  below symbol on game board
function playerNames () {
  var $player1p = $('<h3></h3>');   //disembodies h3 element created
  $player1p.css({margin: '0px'});   //margin set to 0 to not cover gameboard
  $player1p.text(gamePlay.player1_name);    //user input for player name as text in h3 element
  $('#player1').append($player1p);    //appends player h3 elements to #player1 <li> in game board <div>
  
  //same as above but for player 2
  var $player2p = $('<h3></h3>');
  $player2p.css({margin: '0px'});
  $player2p.text(gamePlay.player2_name);
  $('#player2').append($player2p);
}

//click event handler for computer play
function computerButton () {
  $('#computer').on('click', function () {
    $('#player2input').toggle('disabled');    //player 2 name input hidden/unhidden if button clicked
    gamePlay.computerPlay = !gamePlay.computerPlay;   //sets computer.game play to either true/false if button clicked
  });
}

//Add programming, so that when the player clicks the start button the start screen disappears, the board appears, and the game begins. 

// event handler for start button
function gameStart () {
  $('#startGame').on('click', function () {
    //set player 1 to current player  
    $('#player1').addClass('active');
    gamePlay.player1_name = $("#player1input").val();   //capture user input for player1 name
    if (gamePlay.computerPlay === true) {   //if computer play is selected set player2 name
      gamePlay.player2_name = 'Computer';
    } else {
      gamePlay.player2_name = $("#player2input").val();   //capture user input for player2 name if not playing computer
    }
    $('#player1 h3').remove();    //remove player names from game board from previous games
    $('#player2 h3').remove();
    $('#player2input').text('Winner'); 
    playerNames();    //call function for player names on gameboard
    $('#start').hide();   //hide start screen
    $('#board').show();   //show game board
    gamePlay.currentPlayer();
    gamePlay.boxClick();
  });
}

//call functions to add html to DOM
startScreen(); 
winScreen();

//hide game board and win screens so only start screen shows
$('#board').hide();
$('#finish').hide();

//call button event handler functions
gameStart();
computerButton();  

/*=======================
  Game play
=======================*/  
  
var gamePlay = {
  
    winningCombos: {    //object containing arrays of winning combos of li boxes
      
      leftDown: $('.box:nth-of-type(3n+1)'),
    
      rightDown: $('.box:nth-of-type(3n+3)'),
      
      middleDown: $('.box:nth-of-type(3n+2)'),
      
      diagonalRight: $('.box:nth-of-type(4n+1)'),
      
      diagonalLeft: $('.box:nth-of-type(2n+3)'),
      
      acrossTop: $('.box:lt(3)'),
      
      acrossMiddle: $('.box').slice(3,6),
      
      acrossBottom: $('.box:gt(5)'),
    },
  
    win: false,   //set to true when winning combo is achievec
  
    tie: false,   //set to true if all boxes played and no combos achieved
  
    clickCounter: 0,    //used to determine how many boxes hav been played
  
    player1_name: '',   //stores player 1 name input from start screen
  
    player2_name: '',   //stores player 1 name input from start screen
  
    computerPlay: false,    //set to true if user is playing against computer
  
    //checks which player is current player and sets hover symbol
    currentPlayer: function () {
      if ($('#player1').hasClass('active')) { 
        this.hoverOver('url("img/o.svg")');
      } else {
        this.hoverOver('url("img/x.svg")');
      }
    },
    
    //hover event handler for game board boxes
    hoverOver: function (hoverSymbol) {   //background image used based on current player
      $('.box').hover(
          function () {   //hover over sets background image
            $(this).css('background-image' , hoverSymbol);
          },
          function () {   //hover off removes style property
            $(this).attr('style' , '');
          });
   },
  
    //event handler for clicking any box li element
    boxClick: function () {
      var that = this;    //stores gamePlay object as 'that' to call object methods in event handler
      $('.box').on('click', function () {
        var clickedBox = $(this);   //stores li element of clicked box
        that.markBox(clickedBox);   //calls marked box function
      });
    },
     
     
    //adds player symbol to played box  
    markBox: function (clickedBox) {
      if (!$(clickedBox).hasClass('box-filled-1') && !$(clickedBox).hasClass('box-filled-2')) {   //checks if box has already been played
        this.clickCounter++;
        if ($('#player1').hasClass('active')) {   //adds player symbol based on which player is active
          $(clickedBox).addClass('box-filled-1');
        } else if ($('#player2').hasClass('active') && this.computerPlay === false) { //adds player symbol if computer play is not selected
          $(clickedBox).addClass('box-filled-2');
        }
        this.randomNum();   //function for computer play
        if (this.win !== true && this.tie !== true) {   //checks if last play was tie or win
          $('.players').toggleClass('active');    //changes player turn
        } else {    //if win or tie reset game
          this.newGame();
          this.win = false;
          this.tie = false;
          this.clickCounter = 0;
        }
      }
      this.currentPlayer();   //changed hover symbol based on new player's turn
    },
    
    //check is player has three in a row
    checkWin: function (boxes) {
      //gets class of each box in combo
      var b1 = $(boxes[0]).attr('class');
      var b2 = $(boxes[1]).attr('class');
      var b3 = $(boxes[2]).attr('class');
      if (b1 === b2 && b1 === b3) {   //checks if each box class if same (class based on player)
        if (b1 === 'box box-filled-1') {    //if player 1
          $('#board').hide();   //hide game board
          $('#finish').addClass('screen-win-one');  //add player 1 win class for styling  
          this.computerPlay = false;
          if (this.player1_name.length !== 0) {   //if player name was inputed by user add name to win screen
            $('.message').text(this.player1_name + ' Won!');
          }
          $('#finish').show();  //show win screen
          this.win = true;    
        } else if (b1 === 'box box-filled-2') {   //same as player 1 above but for player 2
          $('#board').hide();
          $('#finish').addClass('screen-win-two');    //add player 2 win class for styling  
          this.computerPlay = false;
          if (this.player2_name.length !== 0) {
            $('.message').text(this.player2_name + ' Won!');
          }
          $('#finish').show();
           this.win = true;
        }
      }
    },
  
    //check is game is a tie
    tieGame: function () {
      if (this.clickCounter === 9 && this.win === false) {    //check all boxes played and no combos achieved
        $('#board').hide();   //hide game board
        $('#finish').addClass('screen-win-tie');    //add tie class for styling
        $('.message').text("It's a Tie!");
        $('#finish').show();
        this.tie = true;
        this.computerPlay = false;
      }
    },
  
    //checks if player has three n a row for each combo in winningCombos object  
    endGame: function () {
      $.each(gamePlay.winningCombos, function (key) {
        gamePlay.checkWin(gamePlay.winningCombos[key]);
      });
      this.tieGame();   //call function to check for tie game
    },
  
    //resets game play after win or tie
    //event handler for new game button
    newGame: function () {
      $('#finish .button').on('click', function () {
        $('#finish').hide();    //hide win screen
        $('#finish').attr('class' , 'screen screen-win');   //reset win screen class for styling
        $('#start').show();   //show start screen
        $('.box').attr('class', 'box');   //reset game board box class
        $('#player1').removeClass('active');  //reset active player
        $('#player2').removeClass('active');  //reset active player
        $('#player2input').show();    //show player2 input option
      });
    },
  
    //generates random number and selects game board box  
    randomNum: function () {
      this.endGame();   //check for win or tie
      if (this.computerPlay === true) {   //if player choose computer play
        var ranNum = Math.floor(Math.random() * 8);   //random numebr generator between 1 and 8
        var gameBoxes = $('.boxes').children();   //selects all box li elements
        var compPlay = gameBoxes[ranNum];   //selects random box base don random number
        this.computerGamePlay(compPlay);    
      }
    },
  
    //computer game play - random box played as player 2
    computerGamePlay: function (compPlay) {
        if (!$(compPlay).hasClass('box-filled-1') && !$(compPlay).hasClass('box-filled-2')) {   //box cannot have already been played
          $(compPlay).addClass('box-filled-2');   //add player 2 class for styling
          $('.players').toggleClass('active');    //switch to player 1
          this.clickCounter++;    //increment play counter
        } else {
          this.randomNum();   //if box has been played select new random box
        }
        this.endGame();   //check for win or tie
      },
};
  
}();
  