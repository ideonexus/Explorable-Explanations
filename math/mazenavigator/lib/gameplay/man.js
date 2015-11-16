//////////////////////////////////////////////////////////////////////////////
// man.js
//////////////////////////////////////////////////////////////////////////////
// Contains functions and data relating to the man that the player moves
// on screen.
//////////////////////////////////////////////////////////////////////////////

var manPosition = new MazeCell(0,0);

var _oldPosition = null;

var manMoved = false;

//////////////////////////////////////////////////////////////////////////////
// INITIALIZE MAN
//////////////////////////////////////////////////////////////////////////////

function initializeMan()
{
    //start man at top-left corner
    manPosition = new MazeCell(0,0);
    
    //flag man as moved so he is drawn
    manMoved = true;
}

//////////////////////////////////////////////////////////////////////////////
// MOVE MAN
//////////////////////////////////////////////////////////////////////////////

/**
 * Tries to move the man in the specified direction.  Valid directions are
 * "up", "down", "left", "right" - value should be a string."
 */
function moveMan(direction)
{
    var newPos = new MazeCell(manPosition.x,manPosition.y);
    
    //calculate change in position based on direction input
    switch(direction)
    {
        case "up":
            newPos.y -= 1;
            break;
        
        case "right":
            newPos.x += 1;
            break;
            
        case "down":
            newPos.y += 1;
            break;
            
        case "left":
            newPos.x -= 1;
            break;
    }
    
    //assert cells are neighbours - this will stop man going out of edge
    if(!areNeighbours(newPos,manPosition))
    {
        return;
    }
    
    //check if there is a wall between current/destination mazeCell
    if(wallBetween(newPos,manPosition))
    {
        return;
    }    

    //save old position to be cleared.
    _oldPosition = manPosition;
    
    //save the new position as current
    manPosition = newPos;
    
    //flag man as moved so he gets redrawn next animation frame
    manMoved = true;
    
    _checkWin();
    
}

//////////////////////////////////////////////////////////////////////////////
// DRAW MAN
//////////////////////////////////////////////////////////////////////////////

function drawMan()
{
    var gameCanvas = document.getElementById("gameCanvas");
    
    var ctx = gameCanvas.getContext('2d');
    
    //width/height of a full maze cell
    var tileWidth = gameCanvas.width/MAZE_SIZE;
    var tileHeight = gameCanvas.height/MAZE_SIZE;
    
    //shrink man slightly to fit inside cell
    var manWidth = tileWidth*0.7;
    var manHeight = tileHeight*0.7;
    
    //check if we need to clear the old position of the man
    if(_oldPosition != null)
    {
        
        var oldMazeCellDrawX = _oldPosition.x * tileWidth;
        var oldMazeCellDrawY = _oldPosition.y * tileHeight;
        
        ctx.fillStyle = BACKGROUND_COLOUR;
        
        ctx.fillRect(oldMazeCellDrawX + 3,
                     oldMazeCellDrawY + 3,
                     tileWidth-6, tileHeight-6);
                     
        ctx.fillStyle = TRAIL_COLOUR;
        
        ctx.fillRect(oldMazeCellDrawX + (tileWidth*0.4),
                     oldMazeCellDrawY + (tileHeight*0.4),
                     tileWidth*0.15, tileHeight*0.15);
    }
    
    //drawn the new position of the man
    var manDrawX = manPosition.x * tileWidth;
    var manDrawY = manPosition.y * tileHeight;
    
    ctx.fillStyle=MAN_COLOUR;
    
    ctx.fillRect(manDrawX + (tileWidth * 0.15), //x
                 manDrawY + (tileHeight * 0.15), //y
                 manWidth, manHeight);
}

//////////////////////////////////////////////////////////////////////////////
// CHECK WIN
//////////////////////////////////////////////////////////////////////////////

function _checkWin()
{
    if(manPosition.x == GOAL_CELL.x && manPosition.y == GOAL_CELL.y)
    {
        alert("You are the maze master!");
        
        newGame();
    }
}