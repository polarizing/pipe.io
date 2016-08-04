

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

function onMouseMove(event) {
    // Each time the mouse is moved, set the content of
    // the point text to describe the position of the mouse:
    text.content = 'Your position is: ' + event.point.toString();
}

// // View Event Handler
// var frameHandler = function(event) {
//     // Every frame, rotate the path by 3 degrees:
//     path.rotate(3);
// };

// view.on({
//     frame: frameHandler
// });


// De-bugging
socket.emit('debug', debug.view);
