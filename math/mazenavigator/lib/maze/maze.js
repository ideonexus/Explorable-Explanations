//////////////////////////////////////////////////////////////////////////////
// maze.js
//////////////////////////////////////////////////////////////////////////////
// This module contains the data structures for representing the maze,
// the current position of the player and functions for generating the
// maze as well as A* for solving the maze.  A* is used to solve the maze
// when positioning the end goal so that the end goal can be placed a
// fixed distance from the player.
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// CONSTANTS
//////////////////////////////////////////////////////////////////////////////

var MAZE_SIZE=13;

var GOAL_CELL = new MazeCell(MAZE_SIZE-1,MAZE_SIZE-1);

//////////////////////////////////////////////////////////////////////////////
// DATA CLASSES
//////////////////////////////////////////////////////////////////////////////

function MazeCell(x,y)
{
    if(x<0 || y < 0 || x>= MAZE_SIZE || y>=MAZE_SIZE)
    {
        throw "Invalid maze cell created: "+x+", "+y;
    }
    
    this.x = x;
    this.y = y;
}

MazeCell.prototype.isValid = function()
{
    if(this.x < 0 || this.x >= MAZE_SIZE  ||
       this.y < 0 || this.y >= MAZE_SIZE)
    {
        return false;
    }
    else
    {
        return true;
    }
}

MazeCell.prototype.getNeighbours = function()
{
    var neighbours = [];
    
    //check that we're inside bounds and append appropriate neighbours
    if(!this.isValid())
    {
        return [];
    }
    
    if(this.x > 0)
        neighbours.push(new MazeCell(this.x-1,this.y));
    
    if(this.y > 0)
        neighbours.push(new MazeCell(this.x,this.y-1));
    
    if(this.x < MAZE_SIZE-1)
        neighbours.push(new MazeCell(this.x+1,this.y));
    
    if(this.y < MAZE_SIZE-1)
        neighbours.push(new MazeCell(this.x,this.y+1));
    
    return neighbours;
    
}

//////////////////////////////////////////////////////////////////////////////
// GLOBAL DATA
//////////////////////////////////////////////////////////////////////////////


/**
 * The walls of the maze are represented by two 2D arrays of boolean
 * values. 
 *
 * walls_ns - holds the walls running from north to south blocking passage
 *            between east and west
 * walls_ew - holds the walls running from east to west blocking passage
*             between north and south 
 */
var walls_ns = null;
var walls_ew = null;


//////////////////////////////////////////////////////////////////////////////
// CREATE MAZE
//////////////////////////////////////////////////////////////////////////////

/**
 * This function is called by gameplay.js when the maze is to be 
 * regenerated.
 */
 
function generateMaze()
{
    //create the data structures for the maze walls
    _createArrays();
    
    //walk through the maze structure, removing walls to make a maze
    _removeMazeWalls();
}

//////////////////////////////////////////////////////////////////////////////
// WALL BETWEEN
//////////////////////////////////////////////////////////////////////////////

/**
 * This function returns true/false if there is a wall between the maze
 * cells specified.  Throws an error if the cells are not adjacent.
 */
function wallBetween(mazeCellA,mazeCellB)
{
    //assert that the cells are neighbours    
    if(!areNeighbours(mazeCellA,mazeCellB))
    {
        throw "Tried to test for wall between non-adjacent cells.";
        return;
    }
    
    //whether cells are horizontally aligned.
    var horizontal = false;
    
    if(mazeCellA.y == mazeCellB.y)
    {
        horizontal = true;
    }
    
    //test for walls based whether walls are horizontal or vertical
    if(horizontal)
    {
        //use the lowest value of x for wall index
        var minX = Math.min(mazeCellA.x,mazeCellB.x);
        
        return walls_ns[minX][mazeCellA.y];
    }
    else
    {
        var minY = Math.min(mazeCellA.y,mazeCellB.y);
        
        return walls_ew[mazeCellA.x][minY];
    }
}
 
//////////////////////////////////////////////////////////////////////////////
// CREATE ARRAYS
//////////////////////////////////////////////////////////////////////////////
 
/**
 * This private function initializes the walls arrays.
 */
  
function _createArrays()
{
    //create empty array for walls_ns
    walls_ns = _make2DBoolArray(MAZE_SIZE,true);;
    
    //create empty array for walls going east to west
    walls_ew = _make2DBoolArray(MAZE_SIZE,true);
}

//////////////////////////////////////////////////////////////////////////////
// REMOVE MAZE WALLS
//////////////////////////////////////////////////////////////////////////////

/**
 * This private function walks through the maze removing walls as it goes
 * using a depth-first search that is iterative rather than recursive.
 */
function _removeMazeWalls()
{    
    //used to remember where we are in the search for backtracking
    var cellStack = [];
    
    //2d array of boolean values record what cells have been visited
    var visitedCells = _make2DBoolArray(MAZE_SIZE,false);
    
    //select random start point in the maze
    var startX = Math.floor(Math.random() * MAZE_SIZE);
    var startY = Math.floor(Math.random() * MAZE_SIZE);
    
    var currentCell = new MazeCell(startX,startY);
    
    visitedCells[startX][startY] = true;
    
    var nextCell = null;
    
    //while the current cell var is define (still cells on stack)
    while(currentCell != null)
    {
        var neighbours = _shuffleArray(currentCell.getNeighbours());
        
        for(idx = 0; idx < neighbours.length; idx++)
        {
            var n = neighbours[idx];
            
            //skip neighbours that have been visited
            if(visitedCells[n.x][n.y])
            {
                continue;
            }
            
            nextCell = n;
        }
        
        //all neighbours have been visited - try to backtrack
        if(nextCell == null)
        {
            if(cellStack.length > 0)
            {
                currentCell = cellStack.pop();
                continue;
            }
            else
            {
                currentCell = null;
                break;
            }
        }
        
        //the neighbour in nextCell has not been visited - remove wall
        _removeWallBetween(currentCell,nextCell);
        
        //mark next cell as visited
        visitedCells[nextCell.x][nextCell.y] = true;
        
        //push current cell onto backtracking stack
        cellStack.push(currentCell);
        
        //record new current cell
        currentCell = nextCell;
        
        //erase next cell so it can become a future neighbour
        nextCell = null;
    }
}

//////////////////////////////////////////////////////////////////////////////
// REMOVE WALL
//////////////////////////////////////////////////////////////////////////////

/**
 * This private function removes a wall between two cells.  Throws an error if
 * the cells are not adjacent or the wall has already been removed.
 */
function _removeWallBetween(mazeCellA,mazeCellB)
{
    
    //assert that the cells are neighbours    
    if(!areNeighbours(mazeCellA,mazeCellB))
    {
        throw "Tried to remove wall between non-adjacent cells";
        return;
    }
    
    //check if vertically aligned
    if(mazeCellA.x == mazeCellB.x)
    {
        //select the lowest idx of the two cells
        var yIdx = Math.min(mazeCellA.y,mazeCellB.y);
        
        //remove the ew wall
        walls_ew[mazeCellA.x][yIdx] = false;
    }
    
    //check if horizontally aligned
    if(mazeCellA.y == mazeCellB.y)
    {
        //select the lowest X idx of the two cells
        var xIdx = Math.min(mazeCellA.x, mazeCellB.x);
        
        //remove the ns wall
        walls_ns[xIdx][mazeCellA.y] = false;
    }
    
}  

//////////////////////////////////////////////////////////////////////////////
// ARE NEIGHBOURS
//////////////////////////////////////////////////////////////////////////////

/**
 * Returns boolean indicating whether the two cells are neighbours.
 */
function areNeighbours(mazeCellA,mazeCellB)
{

    var neighboursA = mazeCellA.getNeighbours();
    
    //loop through all of A's neighbours and see if b is equal to one of them
    for(idx = 0; idx < neighboursA.length; idx++)
    {
        if(neighboursA[idx].x == mazeCellB.x &&
           neighboursA[idx].y == mazeCellB.y)
        {
            return true;
        }               
    }
    
    return false;
}

//////////////////////////////////////////////////////////////////////////////
// MAKE 2D BOOL ARRAY
//////////////////////////////////////////////////////////////////////////////

/**
 * This private function creates a 2D bool array initialized true or false.
 * Convenience method for creating maze walls and visited cells arrays.
 */
function _make2DBoolArray(size,initialValue)
{
    var parentArray = new Array(size);
    
    //create the sub-arrays to hold boolean values
    for (var x = 0; x<size; x++)
    {
        parentArray[x] = new Array(size);
        
        //set all values to true
        for (var y = 0; y<size; y++)
        {
            parentArray[x][y] = initialValue;
        }
    }
    
    return parentArray;
}

//////////////////////////////////////////////////////////////////////////////
// SHUFFLE ARRAY
//////////////////////////////////////////////////////////////////////////////

/**
 * Shuffle included here since javascript doesn't have a shuffle built in.
 */
function _shuffleArray(array)
{
  var m = array.length, t, i;
  while (m > 0) 
  {
	i = Math.floor(Math.random() * m--);
	t = array[m];
	array[m] = array[i];
	array[i] = t;
  }
  return array;
}

