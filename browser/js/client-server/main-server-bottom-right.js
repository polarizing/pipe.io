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
var view3 = new View3('Pulse Visualization');
view3.init();

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
    view3.animate(event);
}

function onResize(event) {

}

var pulse = view3.animations.pulse;

socket.on('africandrum', function(data) {

    if (pulse.lastCall && ((new Date()).getTime() - pulse.lastCall < pulse.seconds * 1000)) {
        pulse.anotherCall = true;
    } else {
        pulse.currentFrame = 1;
        pulse.ready = true;
        pulse.lastCall = new Date().getTime();
    }
})

socket.on('synthbass', function(data) {
    
    if (pulse.lastCall && ((new Date()).getTime() - pulse.lastCall < pulse.seconds * 1000)) {
        pulse.anotherCall = true;
    } 
    else {
        pulse.currentFrame = 1;
        pulse.ready = true;
        pulse.lastCall = new Date().getTime();
    }
})

// $(window).resize(resizeAndRedrawCanvas);

// function resizeAndRedrawCanvas()
// {

//     cn
//   project.clear();
//   // console.log('hi');
//   // what if we had something else? -- check back
//   view.viewSize = new Size($(window).width()/2, $(window).height()/2);
//   utils = new Utils();
//   view2 = new View2('Triangle Visualization');
//   view2.init();
// }

function View3(name) {
    this.rootLayer = new Layer();
    this.layers = [];
    this.items = {};
    this.name = name;
    this.init = function() {
        this.rootLayer.setName(name);
        this.draw();
        this.setBackground('#113');
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

        var circleRadiusMax = this.animations.pulse.circleRadiusMax;
        var circleRadius = circleRadiusMax;

        var circleColors = ['#FAE8EB', '#DE9151', '#385F71', '#95F9E3', '#F4989C'];
        var numCircles = circleColors.length;
        for (var i = 0; i < numCircles; i++) {
            circles.createCircle(utils.center, circleRadius, circleColors[i]);
            circleRadius = circleRadiusMax * (1 - 0.2 * (1 + i));
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
        var pulse = this.animations.pulse;

        var pulseAnimation = function(circle) {
            var newRadius = circle.bounds.width / 2 + pulse.circleRadiusMax * 0.01 * pulse.direction;
            var scale = (newRadius / (circle.bounds.width / 2));
            circle.scale(scale);
            circle.fillColor.hue += 5;
        }
        if (pulse.currentFrame <= pulse.seconds * 30 && pulse.ready) {
            this.items.circles.forEach(pulseAnimation);
            pulse.currentFrame++;
            if (pulse.currentFrame % 15 == 0) pulse.direction *= -1;
        } else if (pulse.anotherCall) {
            pulse.currentFrame = 1;
            pulse.lastCall = (new Date()).getTime();
            pulse.anotherCall = false;
        }

    };
    this.animations = {
        pulse: { ready: false, currentFrame: 0, seconds: 1, direction: 1, circleRadiusMax: Math.min(utils.width, utils.height) / 3, lastCall: null, anotherCall: false }
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
