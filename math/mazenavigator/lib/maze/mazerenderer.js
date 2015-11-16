//////////////////////////////////////////////////////////////////////////////
// mazerenderer.js
//////////////////////////////////////////////////////////////////////////////
// Contains functions for drawing the maze in the canvas element defined in
// index.html
//////////////////////////////////////////////////////////////////////////////

function renderMaze(mazeCanvas)
{
    
    var ctx = mazeCanvas.getContext("2d");    
    
    var tileWidth = mazeCanvas.width/MAZE_SIZE;
    var tileHeight = mazeCanvas.height/MAZE_SIZE;
    
    ctx.strokeStyle = WALL_COLOUR;
    ctx.lineWidth = 2;
    
    //loop through cells of the maze and draw lines
    for(var x = 0; x<MAZE_SIZE; x++)
    {
        for(var y = 0; y<MAZE_SIZE; y++)
        {
            //render NS wall
            
            if(walls_ns[x][y])
            {
                
                //calculate the start coords of this NS line            
                var nsStartX = (x * tileWidth) + tileWidth;
                var nsStartY = (y * tileHeight);
                
                //calculate the end coords of this NS line
                var nsEndX = (x * tileWidth) + tileWidth;
                var nsEndY = (y * tileHeight) + tileHeight;
                
                //render this NS line
                ctx.beginPath();
                ctx.moveTo(nsStartX,nsStartY);
                ctx.lineTo(nsEndX,nsEndY);
                ctx.closePath();
                ctx.stroke();
            }
            
                
            //render EW wall
            
            if(walls_ew[x][y])
            {
                
                //calculate the start coords of this EW line
                var ewStartX = x * tileWidth;
                var ewStartY = y * tileHeight + tileHeight;
                
                //calculate the end coords of this EW line
                var ewEndX = x * tileWidth + tileWidth;
                var ewEndY = y * tileHeight + tileHeight;
                
                //render this EW wall
                ctx.beginPath();
                ctx.moveTo(ewStartX,ewStartY);
                ctx.lineTo(ewEndX,ewEndY);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
    
    //render the goal in the bottom-right corner
    var goalX = GOAL_CELL.x * tileWidth;
    var goalY = GOAL_CELL.y * tileHeight;
    
    var goalWidth = tileWidth*0.7;
    var goalHeight = tileHeight*0.7;
    
    ctx.fillStyle=GOAL_COLOUR;
    
    ctx.fillRect(goalX + (tileWidth * 0.15), //x
                 goalY + (tileHeight * 0.15), //y
                 goalWidth, goalHeight);
}