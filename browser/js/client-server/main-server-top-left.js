var scope = new paper.PaperScope();
I have 2 canvas element to deal with :


<canvas id="canvas_1"></canvas>
<canvas id="canvas_2"></canvas>

var canvas_1 = document.getElementById('canvas_1');
scope.setup(canvas_1);
 
var canvas_2 = document.getElementById('canvas_2');
scope.setup(canvas_2)


var view_1 = scope.View._viewsById['canvas_1'];

view_1._project.activate();

