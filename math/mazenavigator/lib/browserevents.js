//////////////////////////////////////////////////////////////////////////////
// browserevents.js
//////////////////////////////////////////////////////////////////////////////
// This module contains some methods which are called by the HTML document
// when certain browser events occur.
//////////////////////////////////////////////////////////////////////////////

/**
 * Called by the HTML body tag when page is loaded.
 */
function pageLoaded()
{
    newGame();
    
    //add events for window changing size
    window.addEventListener('resize', windowResized, false);
    window.addEventListener('orientationchange', windowResized, false);
    
    windowResized();
    
    //add listener for animationFrame
    window.requestAnimationFrame(animationFrame)
}
