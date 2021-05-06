//Screen Initiation-----------------------------------------------------
var screen = document.getElementById('screen'); //Canvas initiation
var dimensions = screen.getContext('2d');

// dimensions.fillStyle = 'black';
dimensions.scale(25, 25);

var fallTracking = 0;
var fallTiming = 400;
var previousTime = 0;
var amountOfShapes = 'ABCDEF';
var grid = storeShape(12,14);
var colorSelection = ['white','red','purple','yellow','green','blue'];
var currentShape = {position: {x: 4, y: 0}, shape: shapes('A')};


  function storeShape(shapeWidth, shapeHeight)
   {
      var shape = [];
      while (shapeHeight--)
      {
          shape.push(new Array(shapeWidth).fill('-'));
      }
      return shape;
  }

  //Shape Construction-----------------------------------------------------
  function shapes(options)
  {
    if (options == 'A') //shapeSeesaw
    {
      return [['-', '-', '-'],
             ['0', '0', '0'],
             ['-', '0', '-']];
    }
    else if (options == 'B') //shapeLine
    {

     return [['-', '1', '-', '-'],
             ['-', '1', '-', '-'],
             ['-', '1', '-', '-'],
             ['-', '1', '-', '-']];
    }
    else if (options == 'C') //shapeRightAngle
    {
      return [['2', '-'],
             ['2', '2']];
    }
    else if (options == 'D') //shapeHockeyStick
    {
      return [['-', '3', '-'],
              ['-', '3', '-'],
              ['-', '3', '3']];
    }
    else if (options == 'E')//shapeStaircase
    {
      return [['-', '4', '4'],
              ['4', '4', '-'],
              ['-', '-', '-']];
    }
    else if (options == 'F') //shapeSmallLine
    {
      return [['-', '-'],
             ['5', '5']];
    }
  }
//Collision & Stacking Analysis--------------------------------------
  function collision(grid, currentShape)
  {
     var [objShape, objPosition] = [currentShape.shape, currentShape.position];
    for (var y = 0; y < objShape.length; ++y)
    {
      for (var x = 0; x < objShape[y].length; ++x)
      {
        if (objShape[y][x] !== '-' && (grid[y + objPosition.y] && grid[y + objPosition.y][x + objPosition.x]) !== '-')
        {
          return 1;
        }
      }
    }
    return 0;
  }


//Updating Screen------------------------------------------------------
  function print()
  {
   dimensions.fillStyle = 'rgb(32,32,32)';
   dimensions.fillRect(0,0, 300, 500);
   printShape(grid,{x: 0, y: 0});
   var x = printShape(currentShape.shape, currentShape.position);
   x;
  }

  function printShape(shape, difference)
  {
    //r stands for row
    shape.forEach((r, y) =>
     {
        r.forEach((val, x) =>
        {
            if (val !== '-')
            {
                dimensions.fillStyle = colorSelection[val];
                dimensions.fillRect(difference.x + x, difference.y + y, 1, 1);
            }
        });
    });
  }

//Updating grid that tracks shapes
  function updateGrid(grid, currentShape)
  {
    currentShape.shape.forEach((r,y) =>
    {
        r.forEach((val, x) =>
        {
            if (val !== '-')
            {
                grid[y + currentShape.position.y][x + currentShape.position.x] = val;
            }
        });
    });
}

function randomGenerator()
{
  randomHelper();
  if (collision(grid, currentShape))
  {
    grid.forEach(r => r.fill('-'));
  }
}

function randomHelper()
{
  currentShape.shape = shapes(amountOfShapes[amountOfShapes.length * Math.random() | 0]);
  currentShape.position.x = (grid[0].length  / 2 | 0) - (currentShape.shape[0].length / 2 | 0);
  currentShape.position.y = 0;
}

function fall()
{
  currentShape.position.y+=1;
  if (collision(grid, currentShape))
  {
    currentShape.position.y--;
    updateGrid(grid, currentShape);
    randomGenerator();
  }
  fallTracking = 0;
}


function flipCurrentShape(flipDirection)
{
  var position = currentShape.position.x;
  var difference = 1;
  flipShape(currentShape.shape, flipDirection);
  while (collision(grid, currentShape))
  {
    currentShape.position.x += difference;
    if (difference > 0)
    {
      difference = 1;
    }
    else
    {
      difference = -1;
    }
    difference = -(difference * 2);
    if (difference > currentShape.shape[0].length)
    {
        callFlip(flipDirection);
        return;
   }
  }
}

function callFlip(flipDirection)
{
  flipShape(currentShape.shape, -flipDirection);
  currentShape.position.x = position;
}

//Keyboard Movement------------------------
document.addEventListener('keydown', e => {
    if (e.keyCode === 37) //ArrowLeft
    {
      currentShape.position.x -= 1;
      if (collision(grid,currentShape))
      {
        currentShape.position.x += 1;
      }
    }
    else if (e.keyCode === 32)
     {
          flipCurrentShape(-1);
     }
    else if (e.keyCode === 39) //ArrowRight
    {
      currentShape.position.x += 1;
      if (collision(grid,currentShape))
      {
        currentShape.position.x -= 1;
      }
    }
    else if (e.keyCode === 40)
    {
      fall();
    }

});

function flipShape(shape, flipDirection)
{
  flipCoordinates(shape,flipDirection);
  if (!(flipDirection > 0))
  {
    shape.reverse();
  }
  else
  {
    shape.forEach(r => r.reverse());
  }
}


function flipCoordinates(shape,flipDirection)
{
  for (var i = 0; i < shape.length; ++i)
  {
    for (var j = 0;  j < i; ++j)
    {
        [shape[j][i], shape[i][j]] = [shape[i][j], shape[j][i]];
    }
  }
}

function refresh(t = 0)
{
  var newTime = (t - previousTime);
  var timeToPrevious = t;

    previousTime = timeToPrevious;
    fallTracking += (newTime);

    if (fallTracking > fallTiming)
    {
      fall();
    }
    print();
    requestAnimationFrame(refresh);
}

refresh();
