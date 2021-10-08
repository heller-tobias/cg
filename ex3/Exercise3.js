//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1
    // add local parameters for attributes and uniforms here
};

// we keep all the parameters for drawing a specific object together
// Alle Parameter der Objekte!
var rectangleObject = {
    buffer: -1,
    colorBuffer: -1,
};

var ball= {
    position: -1
};

var player1= {
    position: -1
};

var player2= {
    position: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here
    gl.clearColor(0.0,0.0,0.0,1);
    
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    // add code here to get the ids of attributes and uniform variables from the shaders
    // Shader Programm wurde oben mit Vertex und Fragment geladen
    // Linking auf die VertexPositions Variable im Vertexshader!
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");

    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "u_color");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");

}

function setUpFirstRectangle(){
    // add code here to setup the buffers for drawing an object
    //Float 32 Array!

    //Koordinaten von -1 bis +1
    //Ohne Füllung
    /*var vertices = [
        -0.5,-0.5,
        -0.5, 0.5,
        0.8,0.5,
        0.8,-0.5
    ]*/

    //Mit Fuellung
    var vertices = [
        -50.0,-50.0,
        -50.0, 50,
        50.0,-50.0,
        50.0,50.0
    ]
    rectangleObject.buffer = gl.createBuffer();
    //Binden des Buffers
    // Übergeben der Vertexe an den GL Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    rectangleObject.colorBuffer = gl.createBuffer()

    var colors = [
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
}


/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    setUpFirstRectangle();
}

function drawWithTransformation(modelMat){
    gl.uniformMatrix3fv ( ctx.uModelMatId , false , modelMat ) ;
    //Gefuellt
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}




/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    //Immer loeschen vor dem Zeichnen!
    gl.clear(gl.COLOR_BUFFER_BIT);
    // add drawing routines here

    //Binden des Buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    //Verbindet den aktuellen Buffer mit der Vertexvariable, 2 gibt die Anzahl Komponenten an und float den Datentypen
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
    gl.vertexAttribPointer(ctx.aVertexColorId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexColorId);

    // Set up the world coordinates
    var projectionMat = mat3.create () ;
    mat3.fromScaling ( projectionMat , [2.0/ gl.drawingBufferWidth , 2.0/ gl.drawingBufferHeight ]) ;
    gl.uniformMatrix3fv ( ctx.uProjectionMatId , false , projectionMat ) ;

    //Ball
    var modelMat = mat3.create () ;
    mat3.translate(modelMat,modelMat, vec2.fromValues(-100, -200));
    mat3.scale(modelMat,modelMat, vec2.fromValues(0.2, 0.2));
    drawWithTransformation(modelMat);

    //Player left
    var modelMat = mat3.create () ;
    mat3.translate(modelMat,modelMat, vec2.fromValues(-350, -200));
    mat3.scale(modelMat, modelMat, vec2.fromValues(0.1, 1));
    drawWithTransformation(modelMat);

    //Player right
    var modelMat = mat3.create () ;
    mat3.translate(modelMat,modelMat, vec2.fromValues(350, 150));
    mat3.scale(modelMat, modelMat, vec2.fromValues(0.1, 1));
    drawWithTransformation(modelMat);

    //Center line
    var modelMat = mat3.create () ;
    mat3.scale(modelMat, modelMat, vec2.fromValues(0.2, 6));
    drawWithTransformation(modelMat);

    //gl.uniform4fv(ctx.uColorId, [0.0, 1.0, 0.0, 1.0]);

    //Gibt an wie es gezeichnet wird
    //Ungefuellt
    //gl.drawArrays(gl.LINE_LOOP, 0, 4);
}