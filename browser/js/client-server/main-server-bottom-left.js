function Utils() {
    this.width = view.size.width;
    this.height = view.size.height;
    this.verticalCenter = this.height / 2;
    this.horizontalCenter = this.width / 2;
    this.center = [this.horizontalCenter, this.verticalCenter];
    this.columnPartition = 24;
    this.rowPartition = 24;
    this.column = this.width / this.columnPartition;
    this.row = this.height / this.rowPartition;
    this.leftOffsetColumn = 0;
    this.rightOffsetColumn = 0;
    this.topOffsetRow = 0;
    this.bottomOffsetRow = 0;
    this.leftOffset = 0;
    this.rightOffset = 0;
    this.topOffset = 0;
    this.bottomOffset = 0;
    this.leftRightOffset = 0;
    this.topBottomOffset = 0;
}

Utils.prototype.setLeftRightOffset = function() {
    this.leftOffset = this.column * this.leftOffsetColumn;
    this.rightOffset = this.column * this.rightOffsetColumn;
    this.leftRightOffset = this.leftOffset + this.rightOffset;
}

Utils.prototype.setTopBottomOffset = function() {
    this.topOffset = this.row * this.topOffsetRow;
    this.bottomOffset = this.row * this.bottomOffsetRow;
    this.topBottomOffset = this.topOffset + this.bottomOffset;
};
Utils.prototype.setOffsets = function(arr) {
    this.topOffsetRow = arr[0];
    this.rightOffsetColumn = arr[1];
    this.bottomOffsetRow = arr[2];
    this.leftOffsetColumn = arr[3];
    this.setLeftRightOffset();
    this.setTopBottomOffset();
};
Utils.prototype.getLeftRightStepSize = function(num) {
    return (this.width - this.leftRightOffset) / (num + 1)
};
Utils.prototype.getTopBottomStepSize = function(num) {
    return (this.height - this.topBottomOffset) / (num + 1)
};
Utils.prototype.createLeftRightIntervals = function(num) {
    var steps = [];
    var stepSize = this.getLeftRightStepSize(num)
    for (var i = 1; i <= num; i++) {
        steps.push(stepSize * i + this.leftOffset)
    }
    return steps;
};
Utils.prototype.createTopBottomIntervals = function(num) {
    var steps = [];
    var stepSize = this.getTopBottomStepSize(num)
    for (var i = 1; i <= num; i++) {
        steps.push(stepSize * i + this.topOffset)
    }
    return steps;
};
Utils.prototype.drawGridLines = function(lrNum, tbNum) {
    var lrSteps = this.createLeftRightIntervals(lrNum);
    var tbSteps = this.createTopBottomIntervals(tbNum);
    for (var i = 0; i < lrNum; i++) {
        var path = new Path.Line({
            from: [lrSteps[i], 0],
            to: [lrSteps[i], this.height],
            strokeColor: 'black'
        })
    }
    for (var i = 0; i < tbNum; i++) {
        var path = new Path.Line({
            from: [0, tbSteps[i]],
            to: [this.width, tbSteps[i]],
            strokeColor: 'black'
        })
    }
    // create crosshair / center-lines
    var path = new Path.Line({
        from: [0, this.verticalCenter],
        to: [this.width, this.verticalCenter],
        strokeColor: 'red'
    })
    var path = new Path.Line({
        from: [this.horizontalCenter, 0],
        to: [this.horizontalCenter, this.height],
        strokeColor: 'red'
    })
}

var utils = new Utils();
var view4 = new View4('Space Time Paradigm Visualization');
view4.init();

var portrait = false;

function init() {
    if (window.innerHeight > window.innerWidth) {
        portrait = true;
    }

    document.ontouchmove = function(event) {
        event.preventDefault();
    }
}

init();

function onFrame(event) {
    view4.animate(event);
}

function onResize(event) {

}


// SOCKET EVENTS

socket.on('dhol', function(data) {

    var randomShake = view4.animations.randomizeShake;

    var randomizer = function(circle, index) {
        randomShake.destinationArray[index] = (Point.random() * view.size - circle.position) / 30;
    }
    view4.items.circles.forEach(randomizer);

    randomShake.currentFrame = 1;
    randomShake.ready = true;

});

socket.on('modernsynth', function(data) {
    console.log('test');
    var location = Point.random()*view.size
    var bringToPoint = view4.animations.bringToPoint;
    var pointFocusFunction = function(circle, index) {
        bringToPoint.destinationArray[index] = (location - circle.position) / 15;
    }
    view4.items.circles.forEach(pointFocusFunction);

    bringToPoint.direction = 1;
    bringToPoint.currentFrame = 1;
    bringToPoint.ready = true;
})

// $(window).resize(resizeAndRedrawCanvas);

// function resizeAndRedrawCanvas()
// {

//   project.clear();
//   // console.log('hi');
//   // what if we had something else? -- check back
//   view.viewSize = new Size($(window).width()/2, $(window).height()/2);
//   utils = new Utils();
//   view2 = new View2('Triangle Visualization');
//   view2.init();
// }


function View4(name) {
    this.rootLayer = new Layer();
    this.layers = [];
    this.items = {};
    this.name = name;
    this.init = function() {
        this.rootLayer.setName(name);
        this.draw();
        this.setBackground('black');
    }

    this.activate = function() {
        project.layers.push(this.rootLayer);
        this.layers.forEach(function(layer) {
            project.layers.push(layer);
        })
    }
    this.toggleVisible = function() {
        this.rootLayer.visible = !this.rootLayer.visible;
        this.layers.forEach(function(layer) {
            layer.visible = !this.rootLayer.visible;
        })
    }
    this.remove = function() {
        this.rootLayer.remove();
        this.layers.forEach(function(layer) {
            layer.remove();
        })
    };
    this.draw = function() {
        var circles = new Circles();

        var numCircles = 150;

        var circleColors = ['#55C1FF', '#FFFB46', '#EC058E', '#00F6ED'];

        for (var i = 0; i < numCircles; i++) {
            circles.createCircle(Point.random() * view.size, Math.min(utils.width, utils.height) / 25, chance.pick(circleColors), 0.6);

            circles.circleEntities[i].circle.scale(i / numCircles);
        }

        this.items.circles = circles;
    }
    this.setBackground = function(color) {
        var rect = new Path.Rectangle({
            point: [0, 0],
            size: [view.size.width, view.size.height],
            strokeColor: 'white',
            selected: false
        });
        rect.sendToBack();
        rect.fillColor = color;
    };
    this.animate = function(event) {

        var randomShake = this.animations.randomizeShake;
        var bringToPoint = this.animations.bringToPoint;

        var movingCircles = function(circle) {
            circle.position.x += circle.bounds.width / 20;

            if (circle.bounds.left > utils.width) circle.position.x = -circle.bounds.width;

            circle.fillColor.hue += Math.random() * 5;
        }

        var randomCircleMotion = function(circle, index) {
            circle.position += randomShake.destinationArray[index]
        }

        var pointFocusMotion = function(circle, index) {
            circle.position += bringToPoint.destinationArray[index]
        }

        var randomizer = function(circle, index) {
            randomShake.destinationArray[index] = (Point.random() * view.size - circle.position) / 30;
        }

        if (randomShake.currentFrame <= 30 && randomShake.ready) {
            this.items.circles.forEach(randomCircleMotion);

            randomShake.currentFrame++;
        }

        if (bringToPoint.currentFrame <= 15 && bringToPoint.ready) {
            this.items.circles.forEach(pointFocusMotion);

            bringToPoint.currentFrame++;
            if (bringToPoint.currentFrame == 15) {
                bringToPoint.ready = false;
                this.items.circles.forEach(randomizer);
                randomShake.currentFrame = 1;
                randomShake.ready = true;
            }
        }

        if (!bringToPoint.ready) {
            this.items.circles.forEach(movingCircles)
        }

    };

    this.animations = {
        randomizeShake: { ready: false, currentFrame: 0, seconds: 1, destinationArray: [] },
        bringToPoint: { ready: false, currentFrame: 0, seconds: 1, direction: 1, destinationArray: [] }
    };

}


function Circles() {
    this.circleEntities = new Array();
    this.createCircle = function(center, radius, color, opacity) {
        var circle = new Circle(center, radius, color, opacity);
        this.circleEntities.push(circle);
    }
    this.removeCircle = function(x, y) {
        for (var i = this.circleEntities.length - 1; i >= 0; i--) {
            if (this.circleEntities[i].center[0] === x && this.circleEntities[i].center[1] === y) {
                this.circleEntities[i].remove();
                this.circleEntities.splice(i, 1);
            }
        }
    }
    this.forEach = function(func) {
        this.circleEntities.forEach(function(entity, index) {
            func(entity.circle, index);

        })
    }

}

function Circle(center, radius, color, opacity) {
    this.center = center;
    this.radius = radius;
    this.circle = draw(center, radius, color, opacity);

    function draw(center, radius, color, opacity) {
        var circle = new Path.Circle({
            center: center,
            radius: radius,
            fillColor: color,
            opacity: opacity || 1
        })
        return circle;
    }

    this.remove = function() {
        this.circle.remove();
    }
}
