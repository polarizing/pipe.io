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
var view1 = new View1('Circle Visualization');
view1.init();

var portrait = false;

function init() {
    if (window.innerHeight > window.innerWidth) {
        portrait = true;
    }

    document.ontouchmove = function(event){
        event.preventDefault();
    }
}

    console.log(view.size.width);


init();


// SERVER SIDED SOCKETS

var beacons = view1.animations.beacons;

socket.on('rimcymbal', function (data) {
  beacons.currentFrame = 0;
})



function onFrame (event) {
  view1.animate(event);
}

function onResize (event) {
  //   console.log('test');
  //   console.log(project.view.viewSize.width);
  // view1.remove();
  // project.activeLayer.removeChildren();
  // console.log(project);

  // utils = new Utils();
  //   project.clear();
  // view1 = new View1('Circle Visualization');

  // view1.init();

  // console.log(view1.items);
  // view1 = new View1('Circle Visualization');
  // view1.init();
  // console.log(project);
  // beacons = view1.animations.beacons;
  // socket.on('snare:shake', function (data) {
  //   beacons.currentFrame = 0;
  // })
}

function View1(name) {
    this.layer = new Layer();
    this.items = {};
    this.name = name;
    this.init = function() {
        // this.layer.setName(name);
        this.draw();
        this.setBackground('#0D5D56');  //D45346 //D44D5C // 9BC1BC  712F79  B0BEA9
    };
    this.activate = function() {
        project.layers.push(this.layer);
    };
    this.toggleVisible = function() {
        this.layer.visible = !this.layer.visible;
    };
    this.remove = function() {
        this.layer.remove();
    };
    this.draw = function() {
        utils.setOffsets([0, 2, 0, 2]);
        // utils.drawGridLines(4, 4);
        var circles = new Circles();
        var numCircles = 4;
        var circleIntervals = utils.createLeftRightIntervals(numCircles);
        var circleColors = ['#B3244E', '#DE8400', '#F0CC00', '#8A9C28'];
        for (var i = 0; i < numCircles; i++) {
            circles.createCircle([circleIntervals[i], utils.verticalCenter], utils.getLeftRightStepSize(4) * 0.3, circleColors[i]);
        }

        var rings = new Rings();
        var numRings = numCircles;
        var ringIntervals = circleIntervals;
        var ringColors = circleColors;
        var ringOpacity = 0.3;
        var ringWidth = 10;

        for (var i = 0; i < numRings; i++) {
            rings.createRing([ringIntervals[i], utils.verticalCenter], utils.getLeftRightStepSize(4) * 0.5, ringColors[i], ringWidth, ringOpacity);
        }

        var beacons = new Beacons();
        var numBeacons = numCircles;
        var beaconIntervals = circleIntervals;
        var beaconColor = 'blue';

        for (var i = 0; i < numBeacons; i++) {
            beacons.createBeacon(beaconIntervals[i], utils.verticalCenter, beaconColor);
        }

        this.items['circles'] = circles;
        this.items['rings'] = rings;
        this.items['beacons'] = beacons;
    };
    this.setBackground = function(color) {
        var rect = new Path.Rectangle({
            point: [0, 0],
            size: [utils.width, utils.height],
            strokeColor: 'white',
            selected: false
        });
        rect.sendToBack();
        rect.fillColor = color;
    };

    this.animate = function(event) {

        this.items.rings.ringEntities.forEach(function(entity) {
            entity.ring.strokeColor.hue += 1;
        })
        if (this.animations.beacons.currentFrame <= this.animations.beacons.seconds * 30) {
            this.items.beacons.beaconEntities.forEach(function(entity) {
                entity.animate();
            })
            this.animations.beacons.currentFrame++;
        } else {
            this.items.beacons.reset();
        }

    };

    this.animations = {
        circles: { currentFrame: 0, seconds: 0 },
        rings: { currentFrame: 0, seconds: 0 },
        beacons: { currentFrame: 0, seconds: 1 }
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

function Rings() {
    this.ringEntities = new Array();
    this.createRing = function(center, radius, ringColor, ringWidth, ringOpacity) {
            var ring = new Ring(center, radius, ringColor, ringWidth, ringOpacity);
            this.ringEntities.push(ring);
        }
}

function Ring(center, radius, ringColor, ringWidth, ringOpacity) {
    this.center = center;
    this.radius = radius;
    this.ringColor = ringColor;
    this.ringWidth = ringWidth;
    this.ringOpacity = ringOpacity
    this.ring = draw(center, radius, ringColor, ringWidth, ringOpacity);


    function draw(center, radius, ringColor, ringWidth, ringOpacity) {
        var ring = new Path.Circle({
            center: center,
            radius: radius,
            strokeColor: ringColor,
            strokeWidth: ringWidth,
            opacity: ringOpacity
        })
        return ring;
    }

    this.remove = function() {
        this.ring.remove();
    }
}

function Beacons() {
    this.beaconEntities = new Array();

    this.createBeacon = function(x, y, color) {
        var beacon = new Beacon(x, y, color);
        this.beaconEntities.push(beacon);
    };

    this.removeBeacon = function(x, y) {
        for (var i = this.beaconEntities.length - 1; i >= 0; i--) {
            if (this.beaconEntities[i].x === x && this.beaconEntities[i].y === y) {
                this.beaconEntities[i].remove();
                this.beaconEntities.splice(i, 1);
            }
        }
    };

    this.animate = function() {
        for (var i = this.beaconEntities.length - 1; i >= 0; i--) {
            this.beaconEntities[i].animate();
        }
    };

    this.reset = function() {
        for (var i = this.beaconEntities.length - 1; i >= 0; i--) {
            this.beaconEntities[i].reset();
        }
    }
}

function Beacon(x, y, color) {
    this.x = x;
    this.y = y;
    this.circle = draw(x, y, color, 1);
    this.circleTemp = draw(x, y, color, 0);
    this.count = 0;
    this.scale = 1;
    this.print = 1;

    function draw(x, y, color, alpha) {
        var circleToDraw = new Path.Circle(new Point(x, y), 1);
        circleToDraw.strokeColor = color;
        circleToDraw.strokeWidth = 6;
        circleToDraw.strokeColor.alpha = alpha;
        return circleToDraw;
    };

    this.remove = function() {
        this.circle.remove();
    };

    this.reset = function() {
        this.circle.scale(1 / this.scale);
        this.scale = 1;
        this.circle.strokeColor.alpha = 1;
        this.count = 0;
        this.print = 0;
    }

    this.animate = function() {
        if (this.count < 30) {
            var scaleFactor = 1.2;
            this.circle.scale(scaleFactor);
            this.scale = this.scale * scaleFactor;
            var alpha = this.circle.strokeColor.alpha - 0.025;
            this.circle.strokeColor.alpha = alpha;
        } else {
            this.circle.scale(1 / this.scale);
            this.scale = 1;
            this.circle.strokeColor.alpha = 1;
            this.count = 0;
            this.print = 0;
        }
        this.count++;
    };
}
