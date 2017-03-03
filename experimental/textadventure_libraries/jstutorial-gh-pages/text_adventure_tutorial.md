# Text Adventure Tutorial

In Javascript there are some powerful data structures for organizing your
code and information. You can also build your own, and I'll show you
how to do that soon, but it is amazing what you can do just with what
is built in. Three of the key structures are lists and objects. Also, 
it is important to know that when I talk about "strings" I mean text, 
which is a string of characters, generally surrounded by either single 
quotes `'like this'` or double quotes `"like this"`.

## Objects

Objects are a lot like dictionaries: there is something you use to
look something else up. With a real dictionary you use the spelling
of a word to look up its definition. With Javascript objects, you
can use a wide variety of objects to look up other objects. The
objects you look up can be anything: strings, functions, even lists or
even other objects you have defined. The objects you use to look up with 
are required to be things that cannot change, but usually they are strings.

For convenience we call the things we use to look up with "keys" and
the things that are looked up "values". In the case of a
dictionary, the key is the spelling of a word, and the value is the
definition.

There are two ways to create a object and assign it to a variable, in
this example the variable is "my_lookup". There is the object()
constructor function, and the literal notation.  For now we will use the
literal notation and work on creating new object constructors later. The
literal notation looks like this: 

``` javascript
var my_lookup = {one:1, two:2, three:'xyzzy'}; // literal constructor
```

We declare our variable with the "var" keyword, then surround our object 
with curly braces ("{" and "}").  Inside the curly braces we have key/value
pairs separated by commas.  The key comes first, followed by a colon (":"), 
then the value.  The keys in the literal notation are usually interpreted
as strings, even though we have not surrounded them with quotation marks.
You can also use the quotation marks, which is slightly safer, since there
are a handful of words which Javascript holds in reserve for itself, and if
you use those words without quotation marks you will have an error.

Once we have a object, we can change the value of the keys, add new key/
value pairs, remove key/value pairs, or loop through all the keys:

``` javascript
alert(my_lookup['one']); // prints '1' in a pop-up window

my_lookup['one'] = 'flugelhorn'; // the key 'one' is now associated with the value 'flugelhorn'

my_lookup.one = 'matterhorn'; // the key 'one' is now associated with the value 'matterhorn'

my_lookup['four'] = 'this is the value of the key "four"'; // add a new key, my_lookup now has four key/value pairs

delete my_lookup['one']; // remove a key/value pair, my_lookup now has keys 'two', 'three', and 'four'

for (var key in my_lookup){
    alert(key + ' => ' + my_lookup[key]); // will print each key with its value, in random order
}
```

The last point is important: objects do not keep any specific order for
their keys. If you need to have the keys in order, you need to sort
them first. Usually this is not a problem.

For more information on objects and things you can do with them: 
http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Object

## Lists

If you do need ordering, then you would generally use lists. Lists
keep what you put into them in order. They can grow or shrink as you
put things in or take them out, and you can put pretty much anything
into a list, including objects or other lists. Getting or putting an
item into a list looks a lot like getting or putting an item into a
object, except the keys are always integers. By now you probably know,
or can guess, that the first item in a list is 0, followed by 1, then
2, etc. A list is also an object, and it has a length key that you can
use to find out how many things are in the list.  Since the last item in
a list is always at the index list.length - 1, you can use that to move
backwards through a list.

``` javascript
var my_list = [1,2,3,4]; // create a literal list
```

So far my_list may not be what you expect. What is the value of
my_list[1]?

``` javascript
alert(my_list[1]) // prints 2 because the indexes (like keys) of the list start with 0
my_list = [4,8,16,32];
alert(my_list[1]) // prints 8
```

You can change any value in a list

``` javascript
my_list[2] = "new value of two"
```

You can add new values to the end of a list

``` javascript
my_list.push(64)
```

And you can go through all the values of a list:

``` javascript
for (var i = 0; i < list.length; i++){
	alert(value);
}
```

OK, so what does all of this have to do with games?

With just this amount of Javascript, we can make a simple game. Well, almost, we're still missing a couple of pieces. We need to be able to print things we can respond to the player, and we need the player to be able to tell the program what to do next.


``` javascript

function print(text){
	// to print some text we first create a new paragraph tag, like having a <p></p> in HTML
	var p = document.createElement('p');
	// Then we put our text inside the new p element
	p.innerHTML = text;
	// We add our p element to the document as the last thing in the html body
	document.body.appendChild(p);
	// The player may have scrolled the page, so make sure we scroll to make the new text visible
	p.scrollIntoView();
}

```

Here is a simple example game. See if you can extend it to do some
more things, like dropping an item (or all items), or the 'look'
command to show the long description and the room's contents. What
else would be good to add?

To try out this game, visit http://dethe.github.com/jstutorial/adventure.html

``` javascript
//
// Simple dungeon game
//

var character = {'inventory': [], 'location': 'west room'};

var dungeon = {
    'west room': {
        'short_description': 'west room',
        'long_description': 'the west end of a sloping east-west passage of barren rock',
        'contents': ['pail of water', 'dragon tooth'],
        'exits': {'east': 'centre room'}
    },
    'east room': {
        'short_description': 'east room',
        'long_description': 'a room of finished stone with high arched ceiling and soaring columns',
        'contents': [],
        'exits': {'west': 'centre room'}
    },
    'centre room': {
        'short_description': 'centre room',
        'long_description': 'the very heart of the dungeon, a windowless chamber lit only by the eerie light of glowing fungi high above',
        'contents': ['golden key', 'spiral hourglass'],
        'exits': {'east': 'east room', 'west': 'west room'}
    }
};

function command_split(str){
	var parts = str.split(/\s+/); // splits string into an array of words, taking out all whitespace
	var command = parts.shift(); // command is the first word in the array, which is removed from the array
	var object = parts.join(' '); // the rest of the words joined together.  If there are no other words, this will be an empty string
	return [command, object];
}

var room, command, verb, obj;

function remove(array, item){
	var idx = array.indexOf(item);
	if (idx > -1){
		array.splice(idx,1);
	}
}

function tryToMove(room, direction){
    if(room.exits[direction]){
        character.location = room.exits[direction];
        room = dungeon[character.location];
		describe(room);
    }else{
        print('You cannot go that way');
	}
}

function printInventory(){
    print('You are carrying:');
    character['inventory'].forEach(function(item){
        print('&nbsp;&nbsp;&nbsp;&nbsp;', item);
	});
}

function describe(room){
	if(!room.visited){
		print ('you are in ' + room.long_description);
	}else{
		room.visited = true;
		print (room.short_description);
	}
	var exits = Object.keys(room.exits);
	if (exits.length > 1){
		var last_exit = exits.pop();
		print('there are exits to the ' + exits.join(', ') + ' and ' + last_exit);
	}else{
		print('there is an exit to the ' + exits[0]);
	}
    room['contents'].forEach(function(item){
        print('There is a ' + item + ' here');
	});
}

describe(dungeon[character.location]);

function getOneCommand(){
    room = dungeon[character['location']];
    command = command_split(prompt(room['short_description'] + ' > '));
    verb = command[0];
    obj = command[1];
    console.log('verb: ' + verb + ', object: ' + obj);
    if (['east', 'west', 'north', 'south', 'up', 'down', 'in', 'out	'].indexOf(verb) > -1){
		tryToMove(room, verb);
    }else if (verb === 'inventory'){
		printInventory();
	}else if (verb === 'quit'){
        print('Goodbye');
        return;
	}else if (verb === 'take'){
        if (obj === 'all'){
            if (room['contents']){
                room.contents.slice().forEach(function(item){ // .slice() makes a copy of the list so removing items works
                    print('You pick up the ' + item);
                    character['inventory'].push(item);
					remove(room['contents'], item);
				});
            }else{
                print('There is nothing to take!');
			}
        }else{
            room['contents'].slice().forEach(function(item){
                if (item.indexOf(obj) > -1){ // does the word in obj match any part of the text of item?
                    print('You pick up the ' + item)
                    character['inventory'].push(item);
					remove(room['contents'], item);
				}
			});
		}
	}
	setTimeout(getOneCommand, 0);
}
getOneCommand();
```

