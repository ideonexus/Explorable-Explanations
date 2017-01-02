/*
 * © new Date().getFullYear() Milosz Kosmider and Adam Bielinski
 * License: http://www.dbad-license.org/
 */

(function() {
'use strict';

  var options = {
          minimumSpeed: 0.5     , // Cells per second
          acceleration: 0.05    , // Cells per second per second
       speedLossOnSlow: 0.2     , // Cells per second
             gridWidth: 30      , // Cells
            gridHeight: 20      , // Cells
    initialColumnCount: 5       , // Cells (columns)
         probabilities: {         // [0, 1]
           score: 1 / 10  , 
            slow: 1 / 120 ,
           block: 1 / 60  ,
         },
  };

  Object.freeze(options.probabilities);
  Object.freeze(options);

  document.addEventListener('DOMContentLoaded', function() {
//  var renderer = CanvasTyperdickRenderer.new(document.querySelector('.main'));
    var renderer = HtmlTyperdickRenderer.new(document.querySelector('.main'));
    var game = Game.new(options, renderer);
  });

  /*
   * Base: the base object, without which I never leave home
   */

  var Base = Object.create(Object.getPrototypeOf([]));

  Base.new = function() {
    var clone = Object.create(this);
    clone.initialize.apply(clone, arguments);
    return clone;
  };

  Base.initialize = function() {
  };

  /*
   * Timer: keeps the bullshit synchronized
   */

  var Timer = Object.create(Base);

  Timer.initialize = function() {
    this._tickActions = [];
    this._isPaused = true;
    this.reset();
  };

  Timer.getTotalElapsedTime = function() {
    return this._isPaused ? this._savedElapsedTime : Date.now() - this._previousTime;
  };

  Timer._tick = function() {
    var timer = this;
    function tick() {
      if (timer._isPaused) {
         return;
      }
      requestAnimationFrame(tick);

      var totalElapsedTime = timer.getTotalElapsedTime();
      timer._relativeElapsedTime = totalElapsedTime - timer._lastTickElapsedTime;

      timer._tickActions.forEach(function(tickAction) {
         tickAction(timer._relativeElapsedTime, totalElapsedTime);
      });

      timer._lastTickElapsedTime = totalElapsedTime;
    }
    tick();
  };

  Timer.run = function() {
    if (this._isPaused) {
      this._previousTime = Date.now() - this._savedElapsedTime;
      this._isPaused = false;
      this._tick();
    }
  };

  Timer.pause = function() {
    if (!this._isPaused) {
      this._savedElapsedTime = this.getTotalElapsedTime();
      this._isPaused = true;
    }
  };

  Timer.reset = function() {
    this._previousTime = Date.now();
    this._lastTickElapsedTime = 0;
    this._savedElapsedTime = 0;
    this._isPaused = true;
  };

  Timer.isPaused = function() {
    return this._isPaused;
  };

  Timer.addTickAction = function(tickAction) {
    this._tickActions.push(tickAction);
  };

  /*
   * Player: avatar of the frail human mind
   */

  var Player = Object.create(Base);

  Player.initialize = function(x, y) {
    this.x = x;
    this.y = y;
  };

  /*
   * Cell: the smallest unit of bullshit
   */

  var Cell = Object.create(Base);

  Cell.initialize = function() {
    this.type = 0;
    this.label = '';
    this.data = {};
  };

  Cell.modifiers = {
    score: 1 ,
     slow: 2 ,
    block: 4 ,
  };

  /*
   * Column: the medium unit of bullshit
   */

  var Column = Object.create(Base);

  Column.initialize = function() {
    this.data = {};
  };

  /*
   * Grid: the bullshit organizer
   */

  var Grid = Object.create(Base);

  Grid.initialize = function(width, height, probabilities) {
    this.width = width;
    this.height = height;

    this._bufferedWidth = this.width + 1; // plus 1 for the hidden column

    this._probabilities = probabilities;
    for (var x = 0; x < this._bufferedWidth; ++x) {
      var column = Column.new()
      for (var y = 0; y < this.height; ++y) {
        column.push(Cell.new());
      }
      this.push(column);
    }
  };

  Grid.getCell = function(x, y) {
    var column = this[x];
    if (column === undefined) {
      return undefined;
    }
    return this[x][y];
  };

  Grid.cycle = function() {
    var column = this[0];
    for (var y = 0; y < column.length; ++y) {
      var cell = column[y];

      // A string containing all the letters that can't be used for the current cell
      var clashingCellLabels = (
        // Two columns back, two cells above and below
        this[this.length - 2].slice(Math.max(y - 2, 0), y + 3).concat(

        // One column back, two cells above and below
        this[this.length - 1].slice(Math.max(y - 2, 0), y + 3)).concat(

        // Current column, two cells above
        column.slice(Math.max(y - 2, 0), y))
      ).reduce(function(labelString, cell) {
        return labelString + cell.label.toUpperCase();
      }, '');

      // A string containing all the valid letters
      var possibleCellLabels = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ').replace(new RegExp('[' + clashingCellLabels + ']', 'g'), '');

      // The single valid chosen letter
      var currentCellLabel = possibleCellLabels[parseInt(Math.random() * possibleCellLabels.length)];

      // Relabel and reset modifiers
      cell.label = currentCellLabel;
      cell.type = 0;

      // Apply new modifiers if the Gods will it
      for (var modifierName in this._probabilities) {
        if (Math.random() < this._probabilities[modifierName]) {
          cell.type |= Cell.modifiers[modifierName];
        }
      }
    }

    // Cycle the array
    this.push(this.shift());
  };

  Grid.toString = function() {
    var rows = [];
    var self = this;
    this.forEach(function(column, x) {
      column.forEach(function(cell, y) {
        rows[y] = (rows[y] || '') + (x === self.width ? '|' : '') + (cell.label || '-');
      });
    });
    return rows.join('\n');
  };

  /*
   * Game: that which gives the bullshit meaning
   */

  var Game = Object.create(Base);

  Game.initialize = function(options, renderer) {
    this._renderer = renderer;
    this._minimumSpeed = options.minimumSpeed; 
    this._acceleration = options.acceleration; 
    this._speedLossOnSlow = options.speedLossOnSlow; 

    this._speed = this._minimumSpeed;
    this._offset = 0;
    this._position = 0;
    this._score = 0;
    this._started = false;
    this._over = false;

    // Make a timer
    this._timer = Timer.new();

    // Create the player
    this._player = Player.new(options.gridWidth - options.initialColumnCount + 2, parseInt(options.gridHeight / 2));

    // Make a grid
    this._grid = Grid.new(options.gridWidth, options.gridHeight, options.probabilities);

    // Buffer up some columns so the player isn't just floating in nothingness
    for (var i = 0; i < options.initialColumnCount; ++i) {
      var column = this._grid.cycle();
    }

    // Clear some room around the player. The player can't be getting points right away. Jesus.
    var x = this._player.x,
      y = this._player.y;
    ([
      this._grid.getCell(x - 1, y - 1) , this._grid.getCell(x + 0, y - 1) , this._grid.getCell(x + 1, y - 1) ,
      this._grid.getCell(x - 1, y + 0) , this._grid.getCell(x + 0, y + 0) , this._grid.getCell(x + 1, y + 0) ,
      this._grid.getCell(x - 1, y + 1) , this._grid.getCell(x + 0, y + 1) , this._grid.getCell(x + 1, y + 1) ,
    ]).forEach(function(cell) {
      if (cell !== undefined) {
        cell.type = 0;
      }
    });

    // Hit it!
    this._renderer.handle('setup', this._grid, this._player);

    // Language note: "self" is for closing "this" under the callbacks below
    var self = this;

    // Try to move the grid once per tick
    this._timer.addTickAction(function(relativeElapsedTime, totalElapsedTime) {
      var relativeElapsedTimeInSeconds = relativeElapsedTime / 1000;
      self._offset += self._speed * relativeElapsedTimeInSeconds;
      self._position += self._speed * relativeElapsedTimeInSeconds;

      while (self._offset >= 1) {
        self._offset -= 1;
        self._grid.cycle();
        self._renderer.handle('cycle', self._grid);
        self._player.x -= 1;
        if (self._player.x < 0) {
          self.lose();
        }
      }

      self._renderer.handle('scroll', self._offset, self._position);
      self._renderer.handle('time', totalElapsedTime / 1000);
      self._renderer.handle('speed', self._speed);

      self._speed += self._acceleration * relativeElapsedTimeInSeconds;
    });

    /*
     * Input handling (TODO consider whether or not this should be in another module)
     */

    // Handle user input 
    window.addEventListener('keydown', function(event) {
      //  backspace          and tab  are nuisances
      if (event.which === 8 || event.which === 9) {
        event.preventDefault();
        return;
      }

      //       game over  or  modifier key was pressed                         or  not a letter
      else if (self._over || (event.shiftKey || event.ctrlKey || event.altKey) || (event.which < 65 || event.which > 91)) {
        return;
      }
      event.preventDefault();

      var label = String.fromCharCode(event.which);

      var x = self._player.x,
        y = self._player.y;
      var targetCell = null;

      // Find the right cell among the neighbors
      ([
        self._grid.getCell(x - 1, y - 1) , self._grid.getCell(x + 0, y - 1) , self._grid.getCell(x + 1, y - 1) ,
        self._grid.getCell(x - 1, y + 0) ,                                  , self._grid.getCell(x + 1, y + 0) ,
        self._grid.getCell(x - 1, y + 1) , self._grid.getCell(x + 0, y + 1) , self._grid.getCell(x + 1, y + 1) ,
      ]).forEach(function(cell, index) {
        if (cell !== undefined && cell.label === label) {
          targetCell = cell;
          x = self._player.x + index % 3 - 1;
          y = self._player.y + parseInt(index / 3) - 1;
        }
        return false;
      });

      // Nowhere to go.
      if (targetCell === null) {
        return;
      }

      // Can't go to a blocked cell. Sucka.
      if (targetCell.type & Cell.modifiers.block) {
        return;
      }

      // A slow cell will slow down the game.
      if (targetCell.type & Cell.modifiers.slow) {
        self._speed = Math.max(self._minimumSpeed, self._speed - self._speedLossOnSlow);
        targetCell.type &= ~Cell.modifiers.slow;
      }

      // A score cell will... well... give you points! Hehe!
      if (targetCell.type & Cell.modifiers.score) {
        self._score += 1;
        targetCell.type &= ~Cell.modifiers.score;
        self._renderer.handle('score', self._score);
      }

      self._renderer.handle('cell', targetCell);

      self._player.x = x;
      self._player.y = y;
      self._renderer.handle('move', self._player, targetCell);

      if (self._player.x < 0) {
        self.lose();
      }

      if (!self._started) {
        self.run();
        self._started = true;
        self._renderer.handle('start');
      }
    });

    // Handle window focussing and blurring
    window.addEventListener('focus', function() {
      if (self._started) {
        self.run();
      }
    });

    window.addEventListener('blur', function() {
      if (self._started) {
        self.pause();
      }
    });
  };

  Game.run = function() {
    if (!this._over) {
      this._timer.run();
      this._renderer.handle('run');
    }
  };

  Game.pause = function() {
    this._timer.pause();
    this._renderer.handle('pause');
  };

  Game.lose = function() {
    this._timer.pause();
    this._over = true;
    this._renderer.handle('lose', this._score, this._speed, this._timer.getTotalElapsedTime());
  };

  /*
   * Renderer: that which allows frail human minds to perceive and interact with the bullshit
   */

  var Renderer = Object.create(Base);

  Renderer.initialize = function() {
    this._handlers = {};
  };

  Renderer.handle = function(eventName) {
    var self = this;

    if (this._handlers[eventName] !== undefined) {
      var handlerArguments = Array.prototype.slice.call(arguments, 1);
      this._handlers[eventName].forEach(function(handler) {
        handler.apply(self, handlerArguments);
      });
    }
  };

  Renderer._addHandler = function(eventName, handler) {
    if (this._handlers[eventName] === undefined) {
      this._handlers[eventName] = [];
    }
    this._handlers[eventName].push(handler);
  };

  /*
   * TyperdickRenderer: common, but non-generic functionality
   */

  var TyperdickRenderer = Object.create(Renderer);

  TyperdickRenderer.initialize = function(mainNode) {
    Renderer.initialize.call(this);

    this._fontSizeMultiplier = 0.85;
    this._gameNode = mainNode.querySelector('.game');
    this._statusNode = mainNode.querySelector('.status');
    this._instructionsNode = mainNode.querySelector('.instructions');
    this._playerNode = mainNode.querySelector('.player');
    this._crosshairNode = mainNode.querySelector('.crosshair');
    this._loseOverlayNode = mainNode.querySelector('.lose.overlay');

    this._addHandler('lose', function(score, speed, time) {
      this._loseOverlayNode.querySelector('.tweet').setAttribute('href', 'https://twitter.com/intent/tweet?' + ([
        [    'text', 'I only scored ' + score + ' points in Typerdick: the dickishly hard typing game'] ,
//      ['hashtags', 'typerdick'                                                                      ] ,
        [     'url', 'http://typerdick.com'                                                           ] ,
      ]).map(function(item) {
        return encodeURIComponent(item[0]) + '=' + encodeURIComponent(item[1]);
      }).join('&'));
      this._loseOverlayNode.classList.add('visible');
    });

    this._addHandler('score', function(value) {
      this._statusNode.querySelector('.score.field').textContent = value;
    });

    this._addHandler('speed', function(value) {
      this._statusNode.querySelector('.speed.field').textContent = value.toFixed(2);
    });

    this._addHandler('time', function(value) {
      this._statusNode.querySelector('.time.field').textContent = value.toFixed(1);
    });
  };

  /*
   * HTMLRenderer: for browsers that don't support canvas
   */

  var HtmlTyperdickRenderer = Object.create(TyperdickRenderer);

  HtmlTyperdickRenderer.initialize = function(mainNode) {
    TyperdickRenderer.initialize.call(this, mainNode);

    this._previousGridOffset = 0;

    this._gridNode = mainNode.querySelector('.grid');

    this._addHandler('setup', function(grid, player) {
      var self = this;

      this._playerPosition = 0;

      grid.forEach(function(column, columnIndex) {
        var columnNode = document.createElement('div');
        columnNode.classList.add('column');
        column.forEach(function(cell, cellIndex) {
          var cellNode = document.createElement('div');
          cellNode.classList.add('cell');
          for (var modifierName in Cell.modifiers) {
            if (cell.type & Cell.modifiers[modifierName]) {
              cellNode.classList.add(modifierName);
            }
          }
          var labelNode = document.createElement('span');
          labelNode.classList.add('label');
          labelNode.textContent = cell.label;
          cellNode.appendChild(labelNode)
          columnNode.appendChild(cellNode);
          cell.data['node'] = cellNode;
        });
        column.data['node'] = columnNode;
        self._gridNode.appendChild(columnNode);
      });

      this.handle('resize', grid, player);

      // To prevent a glitchy-looking animation, show the player after CSS processing...
      setTimeout(function() {
        self._playerNode.classList.add('visible');
      });

      // We also start handling resizes automatically
      window.addEventListener('resize', function() {
        self.handle('resize', grid, player);
      });
    });

    this._addHandler('resize', function(grid, player) {

      // Wow. So work to get basic information. Very verbosity. Wow.
      var gameStyle = getComputedStyle(this._gameNode);
      var width = document.documentElement.clientWidth - parseInt(gameStyle.marginLeft.replace(/px$/, '')) - parseInt(gameStyle.marginRight.replace(/px$/, ''));
      var height = document.documentElement.clientHeight - this._statusNode.clientHeight - this._instructionsNode.clientHeight - parseInt(gameStyle.marginTop.replace(/px$/, '')) - parseInt(gameStyle.marginBottom.replace(/px$/, ''));

      // Cell size should always be such that we don't create scrollbars
      if (width / height > grid.width / grid.height) {
        this._cellSize = parseInt(height / grid.height);
      }
      else {
        this._cellSize = parseInt(width / grid.width);
      }

      var adjustedWidth = this._cellSize * grid.width;
      var adjustedHeight = this._cellSize * grid.height;

      // Resize the game
      this._gameNode.style.width = adjustedWidth + 'px';
      this._gameNode.style.height = adjustedHeight + 'px';

      // Resize the grid
      this._gridNode.style.width = adjustedWidth + this._cellSize + 'px';

      // Resize and relocate the player
      this._playerNode.style.left = -parseInt(this._cellSize * this._playerPosition) + 'px';
      this._crosshairNode.style.left = (parseInt(this._playerPosition) + player.x - 1) * this._cellSize + 'px';
      this._crosshairNode.style.top = (player.y - 1) * this._cellSize + 'px';
      this._crosshairNode.style.width = this._cellSize + 'px';
      this._crosshairNode.style.height = this._cellSize + 'px';
      this._crosshairNode.style.borderWidth = this._cellSize + 'px';

      var self = this;

      // Resize the cells
      grid.forEach(function(column, columnIndex) {
        var columnNode = column.data['node'];
        columnNode.style.height = grid.height * self._cellSize + 'px';
        columnNode.style.width = self._cellSize + 'px';
        columnNode.style.left = columnIndex * self._cellSize + 'px';
        column.forEach(function(cell, cellIndex) {
          var cellNode = cell.data['node'];
          cellNode.style.top = cellIndex * self._cellSize + 'px';
          cellNode.style.width = self._cellSize + 'px';
          cellNode.style.height = self._cellSize + 'px';
          cellNode.querySelector('.label').style.fontSize = parseInt(self._cellSize * self._fontSizeMultiplier) + 'px';
        });
      });
    });

    this._addHandler('start', function() {
      this._gameNode.classList.add('ongoing');
    });

    this._addHandler('run', function() {
      this._gameNode.classList.remove('paused');
    });

    this._addHandler('pause', function() {
      this._gameNode.classList.add('paused');
    });

    this._addHandler('cycle', function(grid) {
      var self = this;
      grid.forEach(function(column, columnIndex) {
        var columnNode = column.data['node'];
        if (columnIndex === grid.length - 1) {
          column.forEach(function(cell) {
            var cellNode = cell.data['node'];
            for (var modifierName in Cell.modifiers) {
              if (cell.type & Cell.modifiers[modifierName]) {
                cellNode.classList.add(modifierName);
              }
              else {
                cellNode.classList.remove(modifierName);
              }
            }
            cellNode.querySelector('.label').textContent = cell.label;
          });
        }
        columnNode.style.left = (columnIndex * self._cellSize) + 'px';
      });
    });

    this._addHandler('scroll', function(offset, position) {
      this._playerPosition = position;
      var currentGridOffset = parseInt(this._cellSize * offset);
      if (this._previousGridOffset !== currentGridOffset) {
        this._gridNode.style.left = -currentGridOffset + 'px';
        this._playerNode.style.left = -parseInt(this._cellSize * position) + 'px';
      }
      this._previousGridOffset = currentGridOffset;
    });

    this._addHandler('move', function(player, cell) {
      // Relocate the player
      this._crosshairNode.style.left = (parseInt(this._playerPosition) + player.x - 1) * this._cellSize + 'px';
      this._crosshairNode.style.top = (player.y - 1) * this._cellSize + 'px';
    });

    this._addHandler('cell', function(cell) {
      var cellNode = cell.data['node'];
      for (var modifierName in Cell.modifiers) {
        if (cell.type & Cell.modifiers[modifierName]) {
          cellNode.classList.add(modifierName);
        }
        else {
          cellNode.classList.remove(modifierName);
        }
      }
    });
  };

  /*
   * CanvasRenderer: the shape of things to come (they've not yet come)
   */

  var CanvasTyperdickRenderer = Object.create(TyperdickRenderer);

  CanvasTyperdickRenderer.initialize = function(mainNode) {
    TyperdickRenderer.initialize.call(this, mainNode);

    this._addHandler('setup', function(grid, player) {
      var self = this;

      this._playerPosition = 0;
      this._canvasNode = document.createElement('canvas');
      var gridNode = mainNode.querySelector('.grid');
      gridNode.style.right = '0';
      gridNode.appendChild(this._canvasNode);

      this._canvasContext = this._canvasNode.getContext('2d');

      this.handle('resize', grid, player);

      grid.forEach(function(column, columnIndex) {
        column.forEach(function(cell, cellIndex) {
          for (var modifierName in Cell.modifiers) {
            if (cell.type & Cell.modifiers[modifierName]) {
            }
          }
          self._canvasContext.fillText(cell.label, columnIndex * self._cellSize, cellIndex * self._cellSize);
        });
      });

      // To prevent a glitchy-looking animation, show the player after CSS processing...
      setTimeout(function() {
        self._playerNode.classList.add('visible');
      });

      // We also start handling resizes automatically
      window.addEventListener('resize', function() {
        self.handle('resize', grid, player);
      });
    });

    this._addHandler('resize', function(grid, player) {
      // Wow. So work to get basic information. Very verbosity. Wow.
      var gameStyle = getComputedStyle(this._gameNode);
      var width = document.documentElement.clientWidth - parseInt(gameStyle.marginLeft.replace(/px$/, '')) - parseInt(gameStyle.marginRight.replace(/px$/, ''));
      var height = document.documentElement.clientHeight - this._statusNode.clientHeight - this._instructionsNode.clientHeight - parseInt(gameStyle.marginTop.replace(/px$/, '')) - parseInt(gameStyle.marginBottom.replace(/px$/, ''));

      // Cell size should always be such that we don't create scrollbars
      if (width / height > grid.width / grid.height) {
        this._cellSize = parseInt(height / grid.height);
      }
      else {
        this._cellSize = parseInt(width / grid.width);
      }

      var adjustedWidth = this._cellSize * grid.width;
      var adjustedHeight = this._cellSize * grid.height;

      // Resize the game
      this._gameNode.style.width = adjustedWidth + 'px';
      this._gameNode.style.height = adjustedHeight + 'px';

      this._canvasNode.width = adjustedWidth;
      this._canvasNode.height = adjustedHeight;

      this._canvasNode.style.fontSize = parseInt(self._cellSize * self._fontSizeMultiplier) + 'px';

      // Resize and relocate the player
      this._playerNode.style.left = -parseInt(this._cellSize * this._playerPosition) + 'px';
      this._crosshairNode.style.left = (parseInt(this._playerPosition) + player.x - 1) * this._cellSize + 'px';
      this._crosshairNode.style.top = (player.y - 1) * this._cellSize + 'px';
      this._crosshairNode.style.width = this._cellSize + 'px';
      this._crosshairNode.style.height = this._cellSize + 'px';
      this._crosshairNode.style.borderWidth = this._cellSize + 'px';
    });

    this._addHandler('cycle', function(grid) {
    });

    this._addHandler('scroll', function(offset, position) {
      this._playerPosition = position;
      var currentGridOffset = parseInt(this._cellSize * offset);
      if (this._previousGridOffset !== currentGridOffset) {
        this._playerNode.style.left = -parseInt(this._cellSize * position) + 'px';
      }
      this._previousGridOffset = currentGridOffset;
    });

    this._addHandler('move', function(player, cell) {
      // Relocate the player
      this._crosshairNode.style.left = (parseInt(this._playerPosition) + player.x - 1) * this._cellSize + 'px';
      this._crosshairNode.style.top = (player.y - 1) * this._cellSize + 'px';
    });

    this._addHandler('cell', function(cell) {
      for (var modifierName in Cell.modifiers) {
        if (cell.type & Cell.modifiers[modifierName]) {
          ; // TODO
        }
        else {
          ; // TODO
        }
      }
    });
  };

})();
