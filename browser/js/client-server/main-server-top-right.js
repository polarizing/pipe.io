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

// console.log(project);
var utils = new Utils();
var view2 = new View2('Triangle Visualization');
view2.init();

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

function onFrame (event) {
  view2.animate(event);
}

function onResize (event) {
  // project.clear();

  // utils = new Utils();
  // view2.remove();
  // view2 = new View2('Triangle Visualization');

  // view2.init();
  // view2.init();

}

$(window).resize(resizeAndRedrawCanvas);

function resizeAndRedrawCanvas()
{

}

// SOCKET STUFF SERVER SIDED
var shift = view2.animations.triangleShift;

socket.on('fingerCymbal', function(data) {
    shift.xDirection = data.x;
    shift.yDirection = data.y;
    shift.currentFrame = 1;
    shift.ready = true;
})

var triangleRotate = view2.animations.triangleRotate;
socket.on('maracas', function(data) {
        triangleRotate.direction = (Math.round(Math.random()) == 0) ? 1 : -1;
        triangleRotate.currentFrame = 1;
        triangleRotate.ready = true;
})

function View2(name) {
    this.rootLayer = new Layer();
    this.layers = [];
    this.items = {};
    this.name = name;
    this.init = function() {
        // "Root View Layer -> this.layer"
        // this.setBackground();
        this.setBackground('#F5E9E2');

        // "Child Layers -> this.layers"
        obj = { layers: 3, layerNames: ['topLayer', 'middleLayer', 'bottomLayer'] }
        for (var i = 0; i < obj.layers; i++) {
            this.layers.push(new Layer());
            this.layers[i].setName(obj.layerNames[i])
        }
        this.draw();
        // this.addListeners();
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
            selected: false
        });
        rect.sendToBack();
        rect.fillColor = color;
    };

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
        triangleShift: { ready: true, currentFrame: 1, seconds: 1, xDirection: 1, yDirection: 1, constants: { xMove: utils.width / 300, yMove: utils.height / 300 } }
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
