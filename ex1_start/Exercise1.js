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
    aUniformColor: -1
    // add local parameters for attributes and uniforms here
};

// we keep all the parameters for drawing a specific object together
// Alle Parameter der Objekte!
var rectangleObject = {
    buffer: -1
};

var rectangleObject2= {
    buffer: -1
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
    gl.clearColor(0.5,0.5,0.5,1);
    
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
    ctx.aUniformColor = gl.getUniformLocation(ctx.shaderProgram, "u_color");
}

function setUpFirstRectangle(){
    // add code here to setup the buffers for drawing an object
    rectangleObject.buffer = gl.createBuffer()

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
        -0.1,-0.5,
        -0.1, 0.5,
        0.8,-0.5,
        0.8,0.5
    ]

    //Binden des Buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    // Übergeben der Vertexe an den GL Buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function setUpSecondRectangle(){
    // add code here to setup the buffers for drawing an object
    rectangleObject2.buffer = gl.createBuffer()

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
        -0.8,-0.5,
        -0.8, 0.5,
        -0.2,-0.5,
        -0.2,0.5
    ]

    //Binden des Buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject2.buffer);
    // Übergeben der Vertexe an den GL Buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}


/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    setUpFirstRectangle();
    setUpSecondRectangle();
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

    gl.uniform4fv(ctx.aUniformColor, [0.0, 1.0, 0.0, 1.0]);

    //Gibt an wie es gezeichnet wird
    //Ungefuellt
    //gl.drawArrays(gl.LINE_LOOP, 0, 4);

    //Gefuellt
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    //Binden des Buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject2.buffer);

    //Verbindet den aktuellen Buffer mit der Vertexvariable, 2 gibt die Anzahl Komponenten an und float den Datentypen
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniform4fv(ctx.aUniformColor, [0.0, 0.0, 0.0, 1.0]);

    //Gibt an wie es gezeichnet wird
    //Ungefuellt
    //gl.drawArrays(gl.LINE_LOOP, 0, 4);

    //Gefuellt
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}