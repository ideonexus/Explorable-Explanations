//////////////////////////////////////////////////////////////////////////////
// gameLoop.js
//////////////////////////////////////////////////////////////////////////////
// Defines the requestAnimationFrame call-back loop that is used to update
// the canvas.
//////////////////////////////////////////////////////////////////////////////

function animationFrame()
{
    if(manMoved)
    {        
        drawMan();
        
        manMoved = false;
    }
    
    window.requestAnimationFrame(animationFrame);
}

function newGame()
{
    clearCanvas();  
    
    //generate the initial maze
    generateMaze();
    
    //render the maze
    renderMaze(document.getElementById("gameCanvas"));
    
    initializeMan();
}

function clearCanvas()
{
    var gameCanvas = document.getElementById("gameCanvas");
    
    var ctx = gameCanvas.getContext("2d");
    
    ctx.fillStyle = BACKGROUND_COLOUR;
    
    ctx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
    
    //ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
}