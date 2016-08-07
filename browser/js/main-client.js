var portrait = false;

function init() {
    if (window.innerHeight > window.innerWidth) {
        portrait = true;
    }

    document.ontouchmove = function(event){
        event.preventDefault();
    }
}

init();

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

function View1(name) {
    this.layer = new Layer();
    this.items = {};
    this.name = name;
    this.init = function() {
        this.layer.setName(name);
        this.draw();
        this.setBackground('#D45346');
        this.addListeners();
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
            size: [view.size.width, view.size.height],
            strokeColor: 'white',
            selected: true
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

    this.shake = function() {
        controller.currentView.animations.beacons.currentFrame = 0;
        socket.emit('snare:shake', {});

    };

    this.animations = {
        circles: { currentFrame: 0, seconds: 0 },
        rings: { currentFrame: 0, seconds: 0 },
        beacons: { currentFrame: 0, seconds: 1 }
    };

    this.addListeners = function() {

        this.items.circles.circleEntities[0].circle.on('mousedown', function() {
            socket.emit('snare:clap', {});
        })
        this.items.circles.circleEntities[1].circle.on('mousedown', function() {
            socket.emit('snare:clap', {});
        })
        this.items.circles.circleEntities[2].circle.on('mousedown', function() {
            socket.emit('drum:bass', {});
        })
        this.items.circles.circleEntities[3].circle.on('mousedown', function() {
            socket.emit('drum:bass', {});
        })
    }
}

function View2(name) {
    this.rootLayer = new Layer();
    this.layers = [];
    this.items = {};
    this.name = name;
    this.init = function() {
        // "Root View Layer -> this.layer"
        // this.setBackground();

        // "Child Layers -> this.layers"
        obj = { layers: 3, layerNames: ['topLayer', 'middleLayer', 'bottomLayer'] }
        for (var i = 0; i < obj.layers; i++) {
            this.layers.push(new Layer());
            this.layers[i].setName(obj.layerNames[i])
        }
        this.draw();
        this.addListeners();
    };
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
    }
    this.draw = function() {
        var triangleColors = ['#FA9F42', '#4A2040', '#0B6E4F'];
        var numTrianglesPerLayer = 90;
        var triangleOpacity = 0.85;
        var triangleMaxSize = Math.min(utils.width, utils.height) / 10;
        var triangleMinSize = Math.min(utils.width, utils.height) / 20;
        var triangles = new Triangles();

        // Create triangles for each layer
        this.layers.forEach(function(layer, idx) {
            layer.activate();
            for (var i = 0; i < numTrianglesPerLayer; i++) {
                var sx = Math.random() * utils.width;
                var sy = Math.random() * utils.height;
                var r = Math.random() * triangleMaxSize;
                r = r >= triangleMinSize ? r : triangleMinSize;
                triangles.createTriangle(new Point(sx, sy), r, triangleColors[idx], triangleOpacity);
            }
        })
        triangles.randomRotate();
        this.items['triangles'] = triangles;
    };

    this.setBackground = function(color) {

        var rect = new Path.Rectangle({
            point: [0, 0],
            size: [view.size.width, view.size.height],
            strokeColor: 'white',
            selected: true
        });
        rect.sendToBack();
        rect.fillColor = color;
    };

    this.shake = function() {
        this.animations.triangleRotate.direction = (Math.round(Math.random()) == 0) ? 1 : -1;
        this.animations.triangleRotate.currentFrame = 1;
        this.animations.triangleRotate.ready = true;
        socket.emit('maracas', {});
    }

    this.addListeners = function() {

        var shift = this.animations.triangleShift;
        view.on('mousedown', function(event) {
            shift.xDirection = event.point.x > utils.width / 2 ? 1 : -1;
            shift.yDirection = event.point.y > utils.height / 2 ? 1 : -1;
            shift.currentFrame = 1;
            shift.ready = true;
            socket.emit('fingerCymbal', {});
        })
    }

    this.animate = function(event) {

        var self = this;

        // ROTATE ANIMATION
        var rotate = this.animations.triangleRotate;

        if (rotate.ready && rotate.currentFrame <= rotate.seconds * 30) {
            this.layers[0].children.forEach(function(child) {
                child.rotate(15 * rotate.direction)
            })
            this.layers[1].children.forEach(function(child) {
                child.rotate(7 * rotate.direction)
            })
            this.layers[2].children.forEach(function(child) {
                child.rotate(3 * rotate.direction)
            })
            rotate.currentFrame++;

            if (rotate.currentFrame % 15 === 0) {
                rotate.direction *= -1
            }
        }

        // SHIFT ANIMATION
        var shift = this.animations.triangleShift;

        if (shift.currentFrame <= shift.seconds * 30 && shift.ready) {
            this.layers[2].translate(shift.constants.xMove * 1 * shift.xDirection, shift.constants.yMove * 1 * shift.yDirection);
            this.layers[1].translate(shift.constants.xMove * 0.33 * shift.xDirection, shift.constants.yMove * 0.33 * shift.yDirection);
            this.layers[0].translate(shift.constants.xMove * 0.12 * shift.xDirection, shift.constants.yMove * 0.12 * shift.yDirection)
            shift.currentFrame++;
            if (shift.currentFrame % 15 === 0) {
                shift.xDirection *= -1;
                shift.yDirection *= -1;
            }
        }

    }

    this.animations = {
        triangleRotate: { ready: false, currentFrame: 1, seconds: 1, direction: 1 },
        triangleShift: { ready: true, currentFrame: 1, seconds: 1, xDirection: 1, yDirection: 1, constants: { xMove: utils.width / 200, yMove: utils.height / 200 } }
    };
}

function View3(name) {
    this.rootLayer = new Layer();
    this.layers = [];
    this.items = {};
    this.name = name;
    this.init = function() {
        this.rootLayer.setName(name);
        this.draw();
        this.setBackground('#113');
        this.addListeners();
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
            selected: true
        });
        rect.sendToBack();
        rect.fillColor = color;
    };
    this.shake = function(event) {
        var pulse = this.animations.pulse;
        if (pulse.lastCall && ((new Date()).getTime() - pulse.lastCall < pulse.seconds * 1000)) {
            pulse.anotherCall = true;
        } else {
            pulse.currentFrame = 1;
            pulse.ready = true;
            pulse.lastCall = new Date().getTime();
        }

        socket.emit('snare:shake', {});
    }
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
    this.addListeners = function() {
        var pulse = this.animations.pulse;
        view.on('mousedown', function(event) {
            if (pulse.lastCall && ((new Date()).getTime() - pulse.lastCall < pulse.seconds * 1000)) {
                pulse.anotherCall = true;
            } else {
                pulse.currentFrame = 1;
                pulse.ready = true;
                pulse.lastCall = new Date().getTime();
            }
        })
    }
}

function View4(name) {
    this.rootLayer = new Layer();
    this.layers = [];
    this.items = {};
    this.name = name;
    this.init = function() {
        this.rootLayer.setName(name);
        this.draw();
        this.setBackground('black');
        this.addListeners();
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
            selected: true
        });
        rect.sendToBack();
        rect.fillColor = color;
    };
    this.shake = function(event) {
        var randomShake = this.animations.randomizeShake;

        var randomizer = function(circle, index) {
            randomShake.destinationArray[index] = (Point.random() * view.size - circle.position) / 30;
        }

            this.items.circles.forEach(randomizer);

            randomShake.currentFrame = 1;
            randomShake.ready = true;

        socket.emit('snare:shake', {});
    }
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

    this.addListeners = function() {
        
        var bringToPoint = this.animations.bringToPoint;
        var self = this;

        view.on('mousedown', function(event) {

            var location = event.point;
            var pointFocusFunction = function(circle, index) {
                bringToPoint.destinationArray[index] = (location - circle.position) / 15;
            }

            self.items.circles.forEach(pointFocusFunction);

            bringToPoint.direction = 1;
            bringToPoint.currentFrame = 1;
            bringToPoint.ready = true;
        })
    }
}

function ViewController() {
    this.views = [];
    this.currentView = null;
    this.addView = function(view) {
        this.views.push(view);
    }
    this.activateView = function(predicate) {
        var self = this;
        if (typeof predicate === 'string') {
            this.views.forEach(function(view) {
                if (view.name === predicate) {
                    self.currentView = view;
                }
            })
        } else if (typeof predicate === 'number') {
            this.currentView = this.views[predicate];
        }
    }
    this.removeView = function(predicate) {
        var self = this;
        if (typeof predicate === 'string') {
            this.views.forEach(function(view, idx) {
                if (view.name === predicate) {
                    self.currentView = null;
                    self.views.splice(idx, 1);
                }
            })
        } else if (typeof predicate === 'number') {
            self.currentView = null;
            self.views.splice(predicate);
        }
    }
}

var utils = new Utils();
var controller = new ViewController();
// controller.addView(new View1("Circle Visualization"));
// controller.activateView("Circle Visualization");
// controller.currentView.init();

controller.addView(new View2("Triangle Visualization"));
controller.activateView("Triangle Visualization");
controller.currentView.init();


// controller.addView(new View3("Color Pulse Visualization"));
// controller.activateView("Color Pulse Visualization");
// controller.currentView.init();

// controller.addView(new View4("Space Time Paradigm Visualization"));
// controller.activateView("Space Time Paradigm Visualization");
// controller.currentView.init();

function onFrame(event) {
    controller.currentView.animate(event);
}

function onResize(event) {
    // Whenever the window is resized, recenter the path:
    project.clear();
    utils = new Utils();

    // controller.removeView("Circle Visualization");
    // controller.addView(new View1("Circle Visualization"));
    // controller.activateView("Circle Visualization");
    // controller.currentView.init();

    controller.removeView("Triangle Visualization");
    controller.addView(new View2("Triangle Visualization"));
    controller.activateView("Triangle Visualization");
    controller.currentView.init();

    // controller.removeView("Color Pulse Visualization");
    // controller.addView(new View3("Color Pulse Visualization"));
    // controller.activateView("Color Pulse Visualization");
    // controller.currentView.init();

    // controller.removeView("Space Time Paradigm Visualization");
    // controller.addView(new View4("Space Time Paradigm Visualization"));
    // controller.activateView("Space Time Paradigm Visualization");
    // controller.currentView.init();
}


// ADD GLOBAl / WINDOW EVENT LISTENERS

function doOnOrientationChange() {
    switch (window.orientation) {
        case -90:
        case 90:
            // project.layers.push(layerOne);  // now the redCircle is back

            break;
        default:
            // alert('portrait');
            break;
    }
}

window.addEventListener('orientationchange', doOnOrientationChange);

var myShakeEvent = new Shake({
    threshold: 7, // optional shake strength threshold
    timeout: 150 // optional, determines the frequency of event generation
});

// setInterval(view1.items.beacons.animate, (1000 / 30));

myShakeEvent.start();

window.addEventListener('shake', shakeEventDidOccur, false);

//function to call when shake occurs
function shakeEventDidOccur() {

    controller.currentView.shake();

}

// END ADD EVENT LISTENERS

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

function Triangles() {
    this.triangleEntities = new Array();
    this.createTriangle = function(center, radius, color, opacity) {
        var triangle = new Triangle(center, radius, color, opacity);
        this.triangleEntities.push(triangle);
    }
    this.randomRotate = function() {
        this.triangleEntities.forEach(function(entity) {
            entity.triangle.rotate(Math.random() * 90);
        })
    }
}


function Triangle(center, radius, color, opacity) {
    this.center = center;
    this.radius = radius;
    this.triangle = draw(center, radius, color, opacity);

    function draw(center, radius, color, opacity) {
        var triangle = new Path.RegularPolygon(center, 3, radius);
        triangle.fillColor = color;
        triangle.opacity = opacity;
        return triangle;
    }

    this.remove = function() {
        this.triangle.remove();
    }
}
