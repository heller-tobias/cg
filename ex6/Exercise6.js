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

var filledSphere;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aVertexColorId: -1,
    aTextureCoordId: -1,
    aVertexNormalId: -1,
    uProjectionMatId: -1,
    uModelViewMat: -1,
    uNormalMat: -1,
    uSampler: -1,
    uEnableTexture: -1,
    uEnableLightning: -1,
    uLightPosition: -1,
    uLightColor: -1,
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
    setUpFilledSphere();
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
    ctx.aTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");

    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uModelViewMat = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uNormalMat = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");
    ctx.uSampler = gl.getUniformLocation(ctx.shaderProgram, "uSampler");

    ctx.uEnableTexture = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
    ctx.uEnableLightning = gl.getUniformLocation(ctx.shaderProgram, "uEnableLightning");
    ctx.uLightPosition = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColor = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
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

function setUpFilledSphere() {
    filledSphere =  SolidSphere(gl, 20, 20, [0.4,0.4,1.0]);
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

    var normalMatrix = mat3.create()
    mat3.normalFromMat4 (normalMatrix, viewMat) ;
    gl . uniformMatrix3fv (ctx.uNormalMatrixId , false , normalMatrix ) ;
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
    filledCube.drawWithTexture(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.uEnableTexture, ctx.uSampler, ctx.aTextureCoordId, ctx.aVertexNormalId);

    modelView(timestamp, [-1.0,0.0,0]);
    filledCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.uEnableTexture, ctx.aVertexNormalId);
}

function drawCubeAndSphere(timestamp = 0, modelView){
    modelView(timestamp, [1.0,0.0,0]);
    filledCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.uEnableTexture, ctx.aVertexNormalId);

    modelView(timestamp, [-1.0,0.0,0]);
    filledSphere.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId,ctx.aVertexNormalId);
}


function drawCubesFrom4Perspectives(timestamp){
    drawCubes(timestamp, setupModelViewLeft);
}

function enableLight(){
    gl.uniform1i(ctx.uEnableLightning, 1);
    gl.uniform3fv(ctx.uLightPosition, [0,0,3]);
    gl.uniform3fv(ctx.uLightColor, [1,1,0.8]);
}

function disableLight(){
    gl.uniform1i(ctx.uEnableLightning, 0);
    gl.uniform3fv(ctx.uLightPosition, [0,0,3]);
    gl.uniform3fv(ctx.uLightColor, [1,1,0.8]);
}

/**
 * Draw the scene.
 */
function draw(timestamp = 0) {
    console.log("Drawing");
    //Immer loeschen vor dem Zeichnen!
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    disableLight();
    drawCubeAndSphere(timestamp, setupModelViewFront);
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
