# Intro to Javascript

As you're no doubt aware, Javascript is the programming language that is built into web browsers. These days it is used for more than just web pages and web applications (two flavours of the same thing), but also runs on web servers and in games and applications. Javascript seems to be everywhere, and a basic knowledge of it can go a long way. For our purposes today we will just focus on Javascript in the web browser, and for simplicity we'll just deal with one browser, Firefox, for reasons which should be obvious.

Other good starting points for learning about Javascript include:

* [Javascript for Cats](http://jsforcats.com/)
* [Eloquent Javascript](http://eloquentjavascript.net/)

And for looking up more details, APIs, etc.

* [Mozilla Developers Network](https://developer.mozilla.org/en-US/docs/JavaScript)
* [Can I Use?](http://caniuse.com/) Great resource for finding support of new browser features.

## Life in the Browser

Javascript in the browser is a bit different from traditional programming languages that are compiled into applications or run as scripts on the command line. The browser provides a context that Javascript has evolved in, features and constraints which are specific to the web environment. The browser provides an environment not only for Javascript, of course, but for HTML, CSS, and media files such as images and videos, all co-existing as a "web page." Javascript running in a page has access to all of these, so you can use it to change the structure, style, and content of the page in an infinite number of ways. We'll look mainly at adding new content to the page for data visualization, but the principles are the same for any kind of processing you want to do within a page, from the simplest hover animation to a full-featured game.

When we access HTML or CSS from Javascript, they are a little different than we we simply write tags or styles into a text document. HTML gets parsed by the browser for display and is stored in what is known as the Document Object Model, or DOM. The DOM includes objects for each tag, the attributes of each tag, and for other objects like the `document` itself, and the `window` the document is displayed in. CSS is also parsed into a form that is accessible from Javascript, both as an array of `Stylesheet` objects attached to the document, and `style` objects that are attached to each tag. Tags that have been parsed into the DOM are referred to as elements, but you can also create new elements from Javascript and insert them into the document. In the next sections, we'll explore a few of the objects you can use from Javascript to explore and modify the webpage.

### Browser

``` javascript
alert(navigator.doNotTrack);
```

### Window

All global values are actually properties of the window object. So when we say `document` we are really saying `window.document` and when we create a new value with `var` or `function` it is a property of the window unless it is contained in another function or object.

``` javascript
window.resizeTo(500,300);
```
### Document

``` javascript
document.body;
```

Finding things:

``` javascript
document.getElementsByClassName('important'); // get all elements with class="important"
```

``` javascript
document.querySelector('.outerclass .innerclass');
```

### DOM (HTML)

Creating a DIV and moving it around in an ellipse. You can see the following page at [sample](div.html);

``` html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Moving Div Example</title>
	<style>
	 /* put style rules here */
	</style>
</head>

<body id="home">

	<h1>Moving Div Example</h1>

	<script>
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.top = '50px';
	div.style.left = '50px';
	div.style.width = '25px';
	div.style.height = '25px';
	div.style.backgroundColor = 'red';
	document.body.appendChild(div);
	
	var frame = 0;
	var width = window.innerWidth;
	var height = window.innerHeight;
	var degree = Math.PI / 180;
	function moveDiv(){
		frame = frame + 1;
		var angle = degree * frame;
		var x = Math.cos(angle) * width * .4 + width/2;
		var y = Math.sin(angle) * height * .4 + height/2;
		div.style.left = Math.floor(x) + 'px';
		div.style.top = Math.floor(y) + 'px';
		setTimeout(moveDiv, 30);
	}
	moveDiv();
	</script>
</body>
</html>
```

Moving an SVG circle around in an ellipse [SVG example](svg.html)

``` html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Moving an SVG circle</title>
	<style>
		document, body{ height: 100%; }
		svg{top: 0; left: 0; position: absolute;}
	</style>
</head>

<body id="home">
	<svg width="100%" height="100%">
		<circle id="circle" r="25" cx="50" cy="50" fill="#F00" />
	</svg>

	<h1>Moving an SVG Circle</h1>

	<script>
	var circle = document.getElementById('circle');
	var frame = 0;
	var width = window.innerWidth;
	var height = window.innerHeight;
	var degree = Math.PI / 180;
	function moveDiv(){
		frame = frame + 1;
		var angle = degree * frame;
		var x = Math.cos(angle) * width * .4 + width/2;
		var y = Math.sin(angle) * height * .4 + height/2;
		circle.setAttribute('cx', Math.floor(x) + 'px');
		circle.setAttribute('cy', Math.floor(y) + 'px');
		setTimeout(moveDiv, 30);
	}
	moveDiv();
	</script>
</body>
</html>
```

Changing things


``` javascript
document.querySelector('a.sprite').setAttribute('href', 'http://example.com/');
```

``` javascript
document.querySelector('a.sprite').addEventListener('click', function(evt){ /* notify google before follwing link */ });
```

Adding stuff

``` javascript
var mydiv = document.createElement('div');
```
``` javascript
document.body.appendChild(mydiv);
```

### Style (CSS)

``` javascript
document.querySelector('.redblock').style.backgroundColor = '#F00';
```

``` javascript
document.querySelector('.blueblock').className = 'redblock';
```

### Drawing (SVG)

``` javascript
var circle = document.createElementNS('svg:circle', 'http://www.w3.org/2000/svg');
```

``` javascript
document.body.appendChild(circle);
```

### Events (Actions)

text

### Timers

``` javascript
setTimeout(function(){alert('hello');}, 1000);
```

## Exploring with developer tools

text

## Basic Drawing with SVG

text

## Basic Updates with SVG

text

## Introducing the D3 library

text

## Reading in Data

text

### Strings (text), numbers, booleans

text

### Arrays

text

### Objects

text

## Putting it all together - a simplified version of Collusion

text