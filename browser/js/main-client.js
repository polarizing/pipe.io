

// var blueSquare = Path.Rectangle(new Point(0, 0), new Size (50, 50));
// blueSquare.fillColor = 'blue';

// var newLayer = new Layer();
// newLayer.activate();    // so that redCircle will be added to newLayer
// var redCircle = Path.Circle(new Point(100, 100), 50);
// redCircle.fillColor = 'red';

// newLayer.remove();      // this prevents the redCircle from being drawn
// project.layers.push(newLayer);  // now the redCircle is back



var debug = {
    view: {
        autoUpdate: view.autoUpdate,
        element: view.element,
        pixelRatio: view.pixelRatio,
        resolution: view.resolution,
        bounds: view.bounds,
        size: view.size,
        center: view.center,
        zoom: view.zoom,
        matrix: view.matrix
    },
    event: {
        onFrame: null,
        onMouseDown: null,
        onMouseDrag: null,
        onMouseUp: null,
        onClick: null,
        onDoubleClick: null,
        onMouseMove: null,
        onMouseEnter: null,
        onMouseLeave: null,
    }
}

view.onMouseEnter = function (event) {

}

view.onMouseDown = function (event) {
    socket.emit('snare:tap', 'snare tap')
}


// Create a point-text item at {x: 30, y: 30}:
var text = new PointText(new Point(30, 30));
text.fillColor = 'black';

text.content = 'Move your mouse over the view, to see its position';

// function onMouseMove(event) {
//     // Each time the mouse is moved, set the content of
//     // the point text to describe the position of the mouse:
//     text.content = 'Your position is: ' + event.point.toString();
// }

// // View Event Handler
// var frameHandler = function(event) {
//     // Every frame, rotate the path by 3 degrees:
//     path.rotate(3);
// };

// view.on({
//     frame: frameHandler
// });
var layer2 = new Layer();
layer2.activate();

var rect = new Path.Rectangle({
    point: [0,0],
    size: [view.size.width, view.size.height],
    strokeColor: '#113',
    selected: true

})

rect.sendToBack();
rect.fillColor = '#113'

// var circEnd = new Path.Circle(view.center, Math.min(view.size.width, view.size.height)/4);
// circEnd.fillColor = "white";
// circEnd.sendToFront();

// function createCircle(radius, color) {
//     var circ = new Path.Circle(view.center, radius);
//     circ.fillColor = color;
//     return circ;
// }

var colors = ['#FAE8EB', '#DE9151', '#385F71', '#95F9E3', '#F4989C']

var starting = Math.min(view.size.width, view.size.height)/3;
var org = starting;

var circles = [];
colors.forEach(function(val, ind) {
    var newCirc = new Path.Circle(view.center, starting);
    newCirc.fillColor = val;
    //newCirc.sendToFront();
    circles.push(newCirc);
    starting = org*(1-0.2*(1+ind));
})

var msDown = false;
// ['#363938', '#386567', '#5C4134', '#C4A778', '#CE9B59']

var counter = 0;

function onMouseDown(event) {

    // msDown = true;
    // view.play();

    // setTimeout(function() {
    //     msDown = false;
    //     view.pause();
    // }, 500)

    counter = 0;
    okayToGo = true
}

var idx = 1;
var iMinus = 1;

var okayToGo = false;

function onFrame(event) {

   if (counter < 60 && okayToGo) {
      circles.forEach(function(circle) {
        var newRadius = circle.bounds.width/2 + org*0.01*iMinus;
        var scale = (newRadius/(circle.bounds.width/2));
        circle.scale(scale);
        console.log(idx, newRadius, scale)
        circle.fillColor.hue += 5;
     })
    counter++;
    idx++;
     if (idx%15 == 0) iMinus *= -1;
   }
}

// De-bugging
socket.emit('debug', debug.view);
