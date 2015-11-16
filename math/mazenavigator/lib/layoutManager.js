//////////////////////////////////////////////////////////////////////////////
// layoutManager.cs
//////////////////////////////////////////////////////////////////////////////
// This file contains the functions that allow the game's user interface
// to adapt when the window is resized.  This reactive behaviour is 
// achieved by editing the layout values for the various DIVs and buttons
// that must be moved.
//
// One important thing to note is that a DOM element can be moved from
// one div to another simply by appendChild'ing it to the destination.  The
// element will move since it can only be in one place at a time.
//////////////////////////////////////////////////////////////////////////////

function windowResized()
{
    //The div that holds buttons before the canvas (i.e. left pane horizontal)
    var controlsPanelBefore = document.getElementById("controlsPanelBefore");
    
    //The div that holds buttons after the canvas
    var controlsPanelAfter = document.getElementById("controlsPanelAfter");
    
    var canvas = document.getElementById("gameCanvas");
    
    var buttonUp = document.getElementById("button-up");
    var buttonRight = document.getElementById("button-right");
    var buttonDown = document.getElementById("button-down");
    var buttonLeft = document.getElementById("button-left");
    
    //List of all buttons in the order they should appear
    var allButtons = [buttonLeft,buttonUp,buttonDown,buttonRight];
    
    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;
    
    //new canvas size according to window dimensions - canvas will always
    //be a square 
    var newCanvasSize = null;
    
    //determine if the window is oriented horizontally
    var horizontal = (Math.min(winWidth,winHeight) == winHeight);
    
    //browser is in landscape mode!
    if(horizontal)
    {
        //canvas should be as tall as possible with some room left for 
        //buttons (8% on either side - this will only apply if window
        //is very thin)
        newCanvasSize = Math.min(winHeight,(0.84*winWidth));
        
        //each control panel should fill half of screen size - canvas size
        var cPanelWidth = ((winWidth-newCanvasSize)/2)+"px";
        var cPanelHeight = "100%";
        
        //calculate CP sizes
        
        controlsPanelBefore.style.width = cPanelWidth;
        controlsPanelBefore.style.height = cPanelHeight;
        
        controlsPanelAfter.style.width = cPanelWidth;
        controlsPanelAfter.style.height = cPanelHeight;
        
        //add the first two buttons to the 'before' panel        
        controlsPanelBefore.appendChild(buttonUp);
        controlsPanelBefore.appendChild(buttonLeft);
        
        //calculate button sizes and apply
        
        var buttonWidth = cPanelWidth;
        var buttonHeight = "50%";
        
        for(var i = 0; i<allButtons.length; i++)
        {
            
            allButtons[i].style.width = buttonWidth;
            allButtons[i].style.height = buttonHeight;
            
        }
        
        //position the canvas at the right edge of the left control panel  
        canvas.style.left = cPanelWidth;        
    }
    
    //browser is in portrait mode!
    else
    {
        //Make canvas as wide as possible while 
        newCanvasSize = Math.min(winWidth,(0.92*winHeight));
        
        //make bottom control panel fill the rest of the space
        controlsPanelAfter.style.width = "100%";
        controlsPanelAfter.style.height = (winHeight-newCanvasSize)+"px";
        
        //calculate button size
        var buttonWidth = (winWidth/4)-5;
        var buttonHeight = winHeight-newCanvasSize;
        
        for(var i = 0; i<allButtons.length; i++)
        {
            //add all buttons to bottom panel (top will disappear when empty)
            controlsPanelAfter.appendChild(allButtons[i]);
            
            //apply button size
            allButtons[i].style.width = buttonWidth+"px";
            allButtons[i].style.height = buttonHeight+"px";
            
            
        }
        
        //make sure the canvas hugs the left edge
        canvas.style.left = "0px";
    }
    
    //apply the canvas size
    canvas.style.height = newCanvasSize+"px";
    canvas.style.width = newCanvasSize+"px";

}