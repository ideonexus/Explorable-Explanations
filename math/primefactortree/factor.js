// Simple trial-division factoring
var factor = function(n){
    var factors = [];
    var f = 2; // Initial factor
    while(f * f <= n && factors.length == 0){ // We only want the first factor
        if(n % f === 0){ // Is divisible
            factors.push(f); 
            n /= f;
        }else{
            f++;
        }
    }
    if(n !== 1){ // Final factor
        factors.push(n);
    }
    return factors;
}

// Recursively factor n and build a tree object
var recursiveFactor = function(n, i){
    var factors = factor(n);
    if(factors.length === 2){
        // Populate an array object to contain the factors of n
        var ret = [
          {
            value: factors[0],
            factors: recursiveFactor(factors[0], true)
          },
          
{            value: factors[1],
            factors: recursiveFactor(factors[1], true)
          }
        ];
        // Populate the first item in the tree
        // Subsequent calls will skip this step when the i flag is set
        if(!i){
          ret = {
            value: n,
            factors: ret
          }
        }
        return ret;
    }else{
        return null; // n is prime
    }
}

// Rendering options
var options = {
  canvasId: "tree",
  offset: {x: 20, y: 30},
  size: {width: 800, height: 600},
  fontSize: 13,
  padding: 5,
  lineThickness: 3,
  colors: {
    background: "#fff",
    label: {
      background: "#555",
      text: "#fff"
    }
  }
};
options.center = {x: options.size.width / 2, y: options.fontSize + options.padding};

// Recursively render tree nodes to a canvas
var recursiveRender = function(node, x, y){
  if(!x) x = 0;
  if(!y) y = 0;
  var canvas = document.getElementById(options.canvasId);
  var context = canvas.getContext("2d");
  // Recurse through children and draw lines to them
  if(node.factors){
    context.strokeStyle = options.colors.label.background;
    context.lineWidth = options.lineThickness;
    if(node.factors[0]){
      recursiveRender(node.factors[0], x - options.offset.x, y + options.offset.y);
      context.beginPath();
      context.moveTo(x + options.center.x, y + options.center.y + options.fontSize / 2);
      context.lineTo(x - options.offset.x + options.center.x, y + options.offset.y + options.center.y - options.fontSize / 2);
      context.stroke();
    }
    if(node.factors[1]){
      recursiveRender(node.factors[1], x + options.offset.x, y + options.offset.y);
      context.beginPath();
      context.moveTo(x + options.center.x, y + options.center.y + options.fontSize / 2);
      context.lineTo(x + options.offset.x + options.center.x, y + options.offset.y + options.center.y - options.fontSize / 2);
      context.stroke();
    }
  }
  // Draw label background
  var textWidth = context.measureText(node.value).width;
  console.log(textWidth);
  context.fillStyle = options.colors.label.background;
  context.fillRect(x + options.center.x - textWidth / 2 - options.padding, y + options.center.y - options.fontSize / 2 - options.padding, textWidth + options.padding * 2, options.fontSize + options.padding * 2);
  // Draw label text
  context.fillStyle = options.colors.label.text;
  context.font = "bold " + options.fontSize + "px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(node.value, x + options.center.x, y + options.center.y);
}

window.onload = function(){

  var drawTree = function(){
    var data = recursiveFactor(document.getElementById("val").value);
    var canvas = document.getElementById(options.canvasId);
    var context = canvas.getContext("2d");
    // Resize canvas
    canvas.width = options.size.width;
    canvas.height = options.size.height;
    // Clear canvas
    context.fillStyle = options.colors.background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Render
    recursiveRender(data);
  }

  document.getElementById("val").onchange = drawTree;
  drawTree();

}