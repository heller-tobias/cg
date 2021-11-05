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
    setUpZBuffer();
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
    setupProjectionMatrix();
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
}

/**
 * SetUp ZBuffer Algorithm.
 */
function setUpZBuffer(){
    gl.enable (gl.DEPTH_TEST) ;
}

function setUpModel(timestamp, position, viewMat){
    mat4.translate(viewMat, viewMat, vec3.fromValues(position[0], position[1], position[2]));
    mat4.rotate(viewMat, viewMat, timestamp * 0.001, [0.0,0.0,1.0]);

    gl.uniformMatrix4fv ( ctx.uModelViewMat , false , viewMat ) ;
}

function setupProjectionMatrix(){
    // Set up the world coordinates
    var projectionMat = mat4.create () ;
    mat4.perspective(projectionMat, 1.8, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.01, 10)
    gl.uniformMatrix4fv ( ctx.uProjectionMatId , false , projectionMat ) ;
}

function setupModelViewFront(timestamp, position){
    var viewMat = mat4.create () ;
    mat4.lookAt(viewMat, [0,-2,0.0], [0.0,0,0.0], [0,0,1]);
    setUpModel(timestamp, position, viewMat);
}

function setupModelViewTop(timestamp, position){
    var viewMat = mat4.create () ;
    mat4.lookAt(viewMat, [0,0,2], [0,0,0], [0,1,0]);
    setUpModel(timestamp, position, viewMat);
}

function setupModelViewLeft(timestamp, position){
    var viewMat = mat4.create () ;
    mat4.lookAt(viewMat, [-3,0,1], [0,0,0], [0,0,1]);
    setUpModel(timestamp, position, viewMat);
}

function setupModelViewRight(timestamp, position){
    var viewMat = mat4.create () ;
    mat4.lookAt(viewMat, [3,0,1], [0,0,0], [0,0,1]);
    setUpModel(timestamp, position, viewMat);
}

function drawAnimated(timestamp){
    // calculate time since last call
    draw(timestamp);
    // request the next frame
    window.requestAnimationFrame ( drawAnimated ) ;
}

function drawCubes(timestamp = 0, modelView){
    modelView(timestamp, [1.0,0.0,0]);
    filledCube.drawWithTexture(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.uEnableTexture, ctx.uSampler, ctx.aTextureCoordId);

    modelView(timestamp, [-1.0,0.0,0]);
    filledCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.uEnableTexture, ctx.uSampler, ctx.aTextureCoordId);
}

function drawCubesFrom4Perspectives(timestamp){
    gl.viewport(0, 0, gl.canvas.width / 2, gl.canvas.height / 2);
    drawCubes(timestamp, setupModelViewLeft);

    gl.viewport(gl.canvas.width / 2, 0, gl.canvas.width / 2, gl.canvas.height / 2);
    drawCubes(timestamp, setupModelViewRight);

    gl.viewport(0, gl.canvas.height / 2, gl.canvas.width / 2, gl.canvas.height / 2);
    drawCubes(timestamp, setupModelViewTop);

    gl.viewport(gl.canvas.width / 2, gl.canvas.height / 2, gl.canvas.width / 2, gl.canvas.height / 2);
    drawCubes(timestamp, setupModelViewFront);
}

/**
 * Draw the scene.
 */
function draw(timestamp = 0) {
    console.log("Drawing");
    //Immer loeschen vor dem Zeichnen!
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    drawCubesFrom4Perspectives(timestamp);
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
