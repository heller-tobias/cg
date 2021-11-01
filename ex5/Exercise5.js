//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

var filledCube;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aVertexColorId: -1,
    aTextureCoordId: -1,
    uProjectionMatId: -1,
    uModelViewMat: -1,
    uSampler: -1,
    uEnableTexture: -1
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
    setUpBackfaceCulling();
    setUpAttributesAndUniforms();
    setUpBuffers();
    setUpFilledCube();
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
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aTextureCoord");

    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelViewMat = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMat");
    ctx.uSampler = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.uEnableTexture = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    setUpProjectionMatrix();
}

function setUpFilledCube() {
    filledCube =  FilledCube(gl, [[0,0,1,1.0],[1,0,0,1.0],[0,1,0,1.0],[1,1,0,1.0],[1,0,1,1.0],[0.4,0.4,0.4,1.0]], "lena512.png",);
}

/**
 * SetUp Backface Culling.
 */
function setUpBackfaceCulling() {
    gl.frontFace (gl.CCW ) ; // defines how the front face is drawn -> CCW -> Counter Clock Wise!
    gl.cullFace (gl.BACK ) ; // defines which face should be culled -> Die rückwärtigen Flächen weglassen
    gl.enable (gl.CULL_FACE ) ; // enables culling

    //gl.enable (gl.DEPTH_TEST) ;
}

function setUpModel(timestamp, position){
    var modelViewMat = mat4.create () ;
    mat4.lookAt(modelViewMat, [-3,0,1.5], [-1,0,0.8], [0,0,1]);
    mat4.translate(modelViewMat,modelViewMat, vec3.fromValues(position[0], position[1], position[2]));
    mat4.rotate(modelViewMat, modelViewMat, timestamp * 0.001, [0.0,0.0,1.0]);

    gl.uniformMatrix4fv ( ctx.uModelViewMat , false , modelViewMat ) ;
}

function setUpProjectionMatrix(){
    // Set up the world coordinates
    var projectionMat = mat4.create () ;
    //0.785 = 45°
    //2 -> 160° ca.
    //Exercise 2
    mat4.perspective(projectionMat, 1.5, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.1, 10)

    //Exercise 3

    //mat4.frustum(projectionMat, -1, 1, -1, 1, 0.1, 10);
    gl.uniformMatrix4fv ( ctx.uProjectionMatId , false , projectionMat ) ;

/*
    mat3.fromScaling ( projectionMat , [2.0/ gl.drawingBufferWidth , 2.0/ gl.drawingBufferHeight ]) ;
    gl.uniformMatrix4fv ( ctx.uProjectionMatId , false , projectionMat ) ;*/
}

function drawAnimated(timestamp){
    // calculate time since last call
    draw(timestamp);
    // request the next frame
    window.requestAnimationFrame ( drawAnimated ) ;
}


/**
 * Draw the scene.
 */
function draw(timestamp = 0) {
    console.log("Drawing");
    //Immer loeschen vor dem Zeichnen!
    gl . clear (gl.COLOR_BUFFER_BIT)
    setUpModel(timestamp, [0,1.0,0]);
    filledCube.drawWithTexture(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.uEnableTexture, ctx.uSampler, ctx.aTextureCoordId);

    setUpModel(timestamp, [0,-1.0,0]);
    filledCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.uEnableTexture, ctx.uSampler, ctx.aTextureCoordId);
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
