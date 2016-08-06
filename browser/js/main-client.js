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

view.onMouseEnter = function(event) {

}

view.onMouseDown = function(event) {
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
// var layer2 = new Layer();
// layer2.activate();

// var rect = new Path.Rectangle({
//     point: [0,0],
//     size: [view.size.width, view.size.height],
//     strokeColor: '#113',
//     selected: true

// })

// rect.sendToBack();
// rect.fillColor = '#113'

// // var circEnd = new Path.Circle(view.center, Math.min(view.size.width, view.size.height)/4);
// // circEnd.fillColor = "white";
// // circEnd.sendToFront();

// // function createCircle(radius, color) {
// //     var circ = new Path.Circle(view.center, radius);
// //     circ.fillColor = color;
// //     return circ;
// // }

// var colors = ['#FAE8EB', '#DE9151', '#385F71', '#95F9E3', '#F4989C']

// var starting = Math.min(view.size.width, view.size.height)/3;
// var org = starting;

// var circles = [];
// colors.forEach(function(val, ind) {
//     var newCirc = new Path.Circle(view.center, starting);
//     newCirc.fillColor = val;
//     //newCirc.sendToFront();
//     circles.push(newCirc);
//     starting = org*(1-0.2*(1+ind));
// })

// var msDown = false;
// // ['#363938', '#386567', '#5C4134', '#C4A778', '#CE9B59']

// var counter = 0;

// function onMouseDown(event) {

//     // msDown = true;
//     // view.play();

//     // setTimeout(function() {
//     //     msDown = false;
//     //     view.pause();
//     // }, 500)

//     counter = 0;
//     okayToGo = true
// }

// var idx = 1;
// var iMinus = 1;

// var okayToGo = false;

// function onFrame(event) {

//    if (counter < 60 && okayToGo) {
//       circles.forEach(function(circle) {
//         var newRadius = circle.bounds.width/2 + org*0.01*iMinus;
//         var scale = (newRadius/(circle.bounds.width/2));
//         circle.scale(scale);
//         console.log(idx, newRadius, scale)
//         circle.fillColor.hue += 5;
//      })
//     counter++;
//     idx++;
//      if (idx%15 == 0) iMinus *= -1;
//    }
// }

// var layer3 = new Layer();
// layer3.activate();

// var rect = new Path.Rectangle({
//     point: [0, 0],
//     size: [view.size.width, view.size.height],
//     strokeColor: '#113',
//     selected: true

// })

// rect.sendToBack();
// rect.fillColor = '#FFEEDB'

// var triColors = ['#FA9F42', '#4A2040', '#0B6E4F'];

// var triLayer1 = new Layer();
// var triLayer2 = new Layer();
// var triLayer3 = new Layer();

// var topLayer = triLayer1;
// var middleLayer = triLayer3;
// var bottomLayer = triLayer2;

// var layers = [triLayer1, triLayer2, triLayer3];


var width = view.size.width;
var height = view.size.height;
var alpha = 0.85;

// var maxSize = Math.min(width, height) / 10;

// var minSize = Math.min(width, height) / 20;

// triColors.forEach(function(color, idx) {
//     layers[idx].activate();
//     for (var i = 0; i < 90; i++) {
//         var sx = Math.random() * width;
//         var sy = Math.random() * height;
//         var r = Math.random() * maxSize;
//         r = r >= minSize ? r : minSize;
//         var tri = new Path.RegularPolygon(new Point(sx, sy), 3, r);
//         tri.fillColor = color;
//         tri.opacity = alpha;
//         tri.rotate(Math.random() * 90)
//     }
// })

// triLayer1.moveAbove(triLayer3);

// var xMove = width / 200;
// var yMove = height / 200;
// var iMinusX;
// var iMinusY;
// var idx = 1;
// var readyToStart = false;

// var idy = 1;
// var readyToRotate = false;
// var iMinus;

// function onMouseDown(event) {

//     iMinusX = event.point.x > width/2 ? 1 : -1;
//     iMinusY = event.point.y > height/2 ? 1 : -1;

//     idx =1;
//     readyToStart = true

// }

// function onMouseDown (event) {

//     console.log('double clicking')
//     iMinus = (Math.round(Math.random())==0) ? 1 : -1;

//     idy = 1;
//     readyToRotate = true;
// }

// function onFrame(event) {

//     if (idx < 30 && readyToStart) {

//         topLayer.translate(xMove * iMinusX, yMove * iMinusY);
//         // topLayer.children.forEach(function(child) {
//         //     child.rotate(15*iMinusX)
//         // })
//         middleLayer.translate(xMove * 0.33* iMinusX, yMove * 0.33 * iMinusY);
//         // middleLayer.children.forEach(function(child) {
//         //     child.rotate(7*iMinusX*-1)
//         // })
//         bottomLayer.translate(xMove * 0.12* iMinusX, yMove * 0.12 * iMinusY)
//         // bottomLayer.children.forEach(function(child) {
//         //     child.rotate(3*iMinusX)
//         // })
//         idx++;


//         if (idx % 15 === 0)  {
//             iMinusX *= -1;
//             iMinusY *= -1;
//         }
//     }

//     if (idy < 30 && readyToRotate) {

//         //topLayer.translate(xMove * iMinusX, yMove * iMinusY);
//         topLayer.children.forEach(function(child) {
//             child.rotate(15*iMinus)
//         })
//         //middleLayer.translate(xMove * 0.33* iMinusX, yMove * 0.33 * iMinusY);
//         middleLayer.children.forEach(function(child) {
//             child.rotate(7*iMinus)
//         })
//         //bottomLayer.translate(xMove * 0.12* iMinusX, yMove * 0.12 * iMinusY)
//         bottomLayer.children.forEach(function(child) {
//             child.rotate(3*iMinus)
//         })
//         idy++;


//         if (idy % 15 === 0)  {
//             iMinus *= -1
//         }
//     }
// }
var rect = new Path.Rectangle({
    point: [0, 0],
    size: [view.size.width, view.size.height],
    strokeColor: '#113',
    selected: true

})

rect.sendToBack();
rect.fillColor = 'black';

var floatLayer = new Layer();
floatLayer.activate();


var count = 150;

// var path = new Path.Circle({
//     center: [0, 0],
//     radius: Math.min(width, height)/25,
//     fillColor: 'yellow'
// });

var cirColors = ['#55C1FF', '#FFFB46', '#EC058E', '#00F6ED']

var circs = [];
for (var i = 0; i < count; i++) {
    var path = new Path.Circle({
        center: Point.random() * view.size,
        radius: Math.min(width, height) / 25
    })

    path.fillColor = chance.pick(cirColors);
    path.opacity = 0.6

    path.scale(i / count);

    circs.push(path);


}

// circs.forEach(function(circle) {
//     circle.fillColor = chance.pick(cirColors);

//     console.log(circle.fillColor, circle.fillColor.hue)
// })

// console.log(path.fillColor)

// var symbol = new Symbol(path);

// for (var i = 0; i < count; i++) {
//     var center = Point.random()*view.size;
//     var placedSymbol = symbol.place(center);
//     placedSymbol.scale(i/count);

var moveHomie = false;
var tracker = 1;

function onMouseDownEvent(arg) {

    var increment = arg ? 15 : 30;

    circs.forEach(function(circle, index) {
        destArray[index] = (Point.random() * view.size - circle.position) / 30;
    })

    tracker = 1;
    moveHomie = true;

}

function onMouseDown(event) {

    console.log('mouseDown event');
    onMouseDownEvent();

}


var destArray = [];

var trackerMove = 1;
var moveMoveHomie = false;
var moveDestArray = [];

var directionChanger = 1;



// function onMouseDown(event) {

//     var location = event.point;

//     console.log(location)
//     circs.forEach(function(circle, index) {
//         moveDestArray[index] = (location - circle.position)/15//*(index/count);
//         if (index%15==0) console.log(moveDestArray[index])
//     })

//     directionChanger = 1;
//     trackerMove = 1;
//     moveMoveHomie = true;
// }

function onFrame(event) {

    // for (var i = 0; i < count; i++) {
    //     var item = project.activeLayer.children[i];

    //     item.position.x += item.bounds.width/20;

    //     if (item.bounds.left > width) {
    //         item.position.x = -item.bounds.width;
    //     }

    //     //item.fillColor.hue += Math.random()*5;
    // }
    if (trackerMove <= 15 && moveMoveHomie) {
        circs.forEach(function(circle, index) {
            circle.position += moveDestArray[index] * directionChanger;
        })

        trackerMove++;

        if (trackerMove === 15) moveMoveHomie = false;
        if (trackerMove === 15) onMouseDownEvent();

    }

    if (tracker <= 30 && moveHomie) {

        circs.forEach(function(circle, index) {
            circle.position += destArray[index];
        })

        tracker++;
    }



    if (!moveMoveHomie) circs.forEach(function(circle) {
        circle.position.x += circle.bounds.width / 20;

        if (circle.bounds.left > width) {
            circle.position.x = -circle.bounds.width;
        }

        circle.fillColor.hue += Math.random() * 5;
    })

    //symbol.definition.fillColor.hue += 5;
}

// function onMouseDown(event) {
//     for (var i = 0; i < count; i++) {
//         var item = project.activeLayer.children[i];

//         symbol.definition.fillColor.hue += '5'
//     }
// }


// De-bugging
socket.emit('debug', debug.view);
