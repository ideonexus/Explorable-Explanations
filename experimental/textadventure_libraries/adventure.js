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