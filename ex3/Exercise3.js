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
    transformationMat: -1,
    colorBuffer: -1,
    size: 2
};

var Direction = {
    UP: 1,
    DOWN: 2
}

var ball= {
    speed: 1,
    height: 20,
    width: 20,
    position: -1,
    transformationMat: -1,
};

var player1= {
    speed: 1,
    height: 100,
    width: 20,
    position: -1,
    transformationMat: -1,
};

var player2= {
    speed: 2,
    height: 100,
    width: 20,
    position: -1,
    transformationMat: -1,
    currentDirection: Direction.UP
};

var centerLine = {
    height: 600,
    width: 10,
    position: -1,
    transformationMat: -1,
}

var gameSize = {
    maxLeft: -400,
    maxRight: 400,
    maxDown: -300,
    maxUp: 300
}


var objects = [ball, centerLine, player1, player2]

var lastUpdate = -1;

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
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
    setUpObjects();
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

function setUpBall(){
    ball.position = [-100, -200]
    var modelMat = mat3.create () ;
    mat3.translate(modelMat,modelMat, vec2.fromValues(ball.position[0], ball.position[1]));
    mat3.scale(modelMat,modelMat, vec2.fromValues(ball.width / rectangleObject.size, ball.height / rectangleObject.size));
    ball.transformationMat = modelMat;
}

function setUpCenterLine(){
    centerLine.position = [0, 0]
    var modelMat = mat3.create();
    mat3.translate(modelMat,modelMat, vec2.fromValues(centerLine.position[0], centerLine.position[1]));
    mat3.scale(modelMat,modelMat, vec2.fromValues(centerLine.width / rectangleObject.size, centerLine.height / rectangleObject.size));
    centerLine.transformationMat = modelMat;
}

function setPlayer1(){
    var modelMat = mat3.create();
    mat3.translate(modelMat,modelMat, vec2.fromValues(player1.position[0], player1.position[1]));
    mat3.scale(modelMat,modelMat, vec2.fromValues(player1.width / rectangleObject.size, player1.height / rectangleObject.size));
    player1.transformationMat = modelMat;
}

function setPlayer2(){
    var modelMat = mat3.create();
    mat3.translate(modelMat,modelMat, vec2.fromValues(player2.position[0], player2.position[1]));
    mat3.scale(modelMat,modelMat, vec2.fromValues(player2.width / rectangleObject.size, player2.height / rectangleObject.size));
    player2.transformationMat = modelMat;
}

function setUpFirstRectangle(){
    //Mit Fuellung
    var vertices = [
        -1.0,-1.0,
        -1.0, 1,
        1.0,-1.0,
        1.0,1.0
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

function setUpObjects(){
    setUpBall();
    setUpCenterLine();
    player1.position = [-350, -150]
    setPlayer1();
    player2.position = [350, 180]
    setPlayer2();
}

function setUpWorldCoordinates(){
    // Set up the world coordinates
    var projectionMat = mat3.create () ;
    mat3.fromScaling ( projectionMat , [2.0/ gl.drawingBufferWidth , 2.0/ gl.drawingBufferHeight ]) ;
    gl.uniformMatrix3fv ( ctx.uProjectionMatId , false , projectionMat ) ;

}

function drawWithTransformation(modelMat){
    gl.uniformMatrix3fv ( ctx.uModelMatId , false , modelMat ) ;
    //Gefuellt
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function movePlayer1(time_difference){
    if(key._pressed[key.DOWN]){
        console.log("Down pressed");
        movePlayer(player1, Direction.DOWN, time_difference);
    }
    else if(key._pressed[key.UP]){
        console.log("Up pressed");
        movePlayer(player1, Direction.UP, time_difference);
    }
}

function movePlayer2(time_difference){
    console.log("move player 2");
    movePlayer(player2, player2.currentDirection, time_difference);

    if(player2.position[1] <= gameSize.maxDown + player2.height/2){
        player2.currentDirection = Direction.UP;
    }
    else if(player2.position[1] >= gameSize.maxUp - player2.height/2){
        player2.currentDirection = Direction.DOWN;
    }
}


function movePlayer(player, direction, time_difference){
    if(direction == Direction.DOWN){
        player.position = [player.position[0], Math.max(player.position[1] - time_difference * player.speed, gameSize.maxDown + player.height/2)]
    }else if(direction == Direction.UP){
        player.position = [player.position[0], Math.min(player.position[1] + time_difference * player.speed, gameSize.maxUp - player.height/2)]
    }
}

function drawAnimated(timestamp){
    // calculate time since last call
    time_difference = 1;
    movePlayer1(time_difference);
    movePlayer2(time_difference);

    //moveBall();
    // move or change objects
    setPlayer1();
    setPlayer2();
    draw();
    // request the next frame
    window.requestAnimationFrame ( drawAnimated ) ;
}

function drawWithOneAsBasis(){
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
}

function drawTransformedRectangle(modelMat){
    setUpWorldCoordinates();

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    //Verbindet den aktuellen Buffer mit der Vertexvariable, 2 gibt die Anzahl Komponenten an und float den Datentypen
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
    gl.vertexAttribPointer(ctx.aVertexColorId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexColorId);
    gl.uniformMatrix3fv ( ctx.uModelMatId , false , modelMat) ;
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
    //drawWithOneAsBasis();
    //drawCenterLine();
    //drawWithOneAsBasis();
    /*var modelMat = mat3.create () ;
    mat3.scale(modelMat, modelMat, vec2.fromValues(100, 50));
    drawTransformedRectangle(modelMat);*/
    for (let i in objects){
        console.log(objects[i]);
        drawTransformedRectangle(objects[i].transformationMat);
    }
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
