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
    aVertexColorId: -1,
    uProjectionMatId: -1,
    uModelViewMat: -1
    // add local parameters for attributes and uniforms here
};

var lastUpdate = -1;

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.requestAnimationFrame(drawAnimated);
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
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelViewMat = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    setUpModel();
    setUpProjectionMatrix();
}

function setUpModel(){
    var modelViewMat = mat4.create () ;
    mat4.lookAt(modelViewMat, [-0.8,-2,0.2], [0,0,0], [0,0,1]);
    gl.uniformMatrix4fv ( ctx.uModelViewMat , false , modelViewMat ) ;
}

function setUpProjectionMatrix(){
    // Set up the world coordinates
    var projectionMat = mat4.create () ;
    //0.785 = 45°
    mat4.perspective(projectionMat, 2, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.1, 10)

    //mat4.frustum(projectionMat, -1, 1, -1, 1, 0.1, 10);
    gl.uniformMatrix4fv ( ctx.uProjectionMatId , false , projectionMat ) ;

/*
    mat3.fromScaling ( projectionMat , [2.0/ gl.drawingBufferWidth , 2.0/ gl.drawingBufferHeight ]) ;
    gl.uniformMatrix4fv ( ctx.uProjectionMatId , false , projectionMat ) ;*/
}

function drawAnimated(timestamp){
    // calculate time since last call
    draw();
    // request the next frame
    window.requestAnimationFrame ( drawAnimated ) ;
}


/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    //Immer loeschen vor dem Zeichnen!
    gl.clear(gl.COLOR_BUFFER_BIT);
    let wiredCube = new WireFrameCube(gl, [1,1,1,0.5]);
    wiredCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId);
}

// Key Handling
var key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}
