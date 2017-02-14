$(document).ready(function() {
    //set these values to do calculations on success rows
    var x = 1;
    var o = 4;
    //keep track of turns
    var turn = 0;
    //default
    var computer = "O",
        human = "X";
    var id;
    //beginning state of board
    var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    //all possible indices that can win
    var success = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ];

    $("#who").html('Play as <span class ="highlight" id = "chooseX">X</span> or <span class ="highlight" id = "chooseO">O</span>?');

    //choose to play as X or O, then initiate game
    $("#who").on('click', "#chooseX, #chooseO", function() {

        var selection = this.id;
        if (selection === "chooseO") {
            $("#who").show().text("O's turn");
            computer = "X", human = "O";
            start1Play();
            AImove(board);
        } else {
            $("#who").show().text("X's turn");
            start1Play();
        }

    });

    //check if anyone has won by adding up all the success rows, 
      //if sums to 3, human wins, else if it sums to 12, computer wins
    function checkWin(board, turn) {
        for (var i = 0; i < success.length; i++) {
            var sum = 0;
            for (var j = 0; j < success[i].length; j++) {
                var index = success[i][j];
                sum += board[index];
            }
            if (sum === 3) {
                return 1;
            } else if (sum === 12) {
                return 2;
            }
            sum = 0;
        }
        if (turn >= 9) {
            return 3;
        }
        return 0;
    }

    //interprets result from checkWin and displays winner, then resets board
    function getWinner(result) {

        if (result === 1) {
            $("#who").text(human + " wins!");
            $("td").empty();
            setTimeout(function() {
                reset();
            }, 1000);
        } else if (result === 2) {
            $("#who").text(computer + " wins!");
            $("td").empty();
            setTimeout(function() {
                reset();
            }, 1000);
        } else if (result === 3) {
            $("#who").text("Draw!");
            $("td").empty();
            setTimeout(function() {
                reset();
            }, 1000);

        }

    }

    function AImove(board) {
        var sum = 0;
        var almostWin = [];
        var block = [];
        var allEmptyIndices = [];
        for (var i = 0; i < success.length; i++) {
            var emptyIndex;
            for (var j = 0; j < success[i].length; j++) {
                //add index to sum of a success row
                var index = success[i][j];
                sum += board[index];
                if (board[index] === 0) {
                    emptyIndex = success[i][j];
                    //if an empty index isn't already in allEmptyIndices, add it
                    if (allEmptyIndices.indexOf(emptyIndex) === -1) {
                        allEmptyIndices.push(emptyIndex);
                    }
                }
            }
            //after the inner for loop, if a sum adds to 8, that means AI is about to win
            //store the index of the winning empty slot
            if (sum === 8) {
                almostWin.push(emptyIndex);
                // else if sum adds to 2, that means human is about to win
                //store the index of the empty slot to block
            } else if (sum === 2) {
                block.push(emptyIndex);
            }
            //reset sum to 0 at the end of the outer for loop
            sum = 0;
        }
        //if almostWin has a value in it, computer will move there and win the game
        if (almostWin.length > 0) {
            id = "#" + almostWin[0].toString();
            $(id).text(computer).text(computer);
            board[almostWin[0]] = 4;
            turn += 1;
            return;
            //if computer is not about to win, check if it needs to block the human and move there
        } else if (block.length > 0) {
            board[block[0]] = 4;
            id = "#" + block[0].toString();
            $(id).text(computer).text(computer);
            turn += 1;
            return;
            //else put it somewhere random
        } else {
            var random = Math.floor(Math.random() * allEmptyIndices.length);
            board[allEmptyIndices[random]] = 4;
            id = "#" + allEmptyIndices[random].toString();
            $(id).text(computer);
            turn += 1;
            return;
        }
    }

    //initialize the game
    function start1Play() {
        $("td").one('click', function() {
            var slot = $(this);
            //if a slot is empty
            if (slot.text() === "") {
                $("#who").text(computer + "'s turn");
                turn += 1;
                slot.text(human);
                board[eval(this.id)] = x;

                var result = checkWin(board, turn);
                if (result === 0) {
                    AImove(board);
                } else {
                    getWinner(result);
                    return;
                }
                result = checkWin(board, turn);
                if (result !== 0) {
                    getWinner(result);
                    return;
                } else {
                    setTimeout(function() {
                        $("#who").text(human + "'s turn");
                    }, 500);
                }

            }
        });

    }

    function reset() {
        $("#who").html('Play as <span class ="highlight" id = "chooseX">X</span> or <span class ="highlight" id = "chooseO">O</span>?');
        $("td").empty();
        $("td").removeClass("animated zoomIn");
      
        computer = "O";
        human = "X";
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        turn = 0;
    }


});