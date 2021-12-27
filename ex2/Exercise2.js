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
    uColorId: -1
    // add local parameters for attributes and uniforms here
};

// we keep all the parameters for drawing a specific object together
// Alle Parameter der Objekte!
var rectangleObject = {
    buffer: -1,
    colorBuffer: -1,
    textureBuffer: -1
};

var rectangleObject2= {
    buffer: -1
};

var lennaTxt = {
    textureObj: {}
}

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    loadTexture("lena512.png");
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
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexTextureId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");

    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "u_color");
    ctx.uSample2DId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.uUseColor = gl.getUniformLocation(ctx.shaderProgram, "uUseColor");

}

function setUpStandardBuffer(){
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
        -0.5,-0.5,
        -0.5, 0.8,
        0.8,-0.5,
        0.8,0.8
    ]
    rectangleObject.buffer = gl.createBuffer();
    //Binden des Buffers
    // Übergeben der Vertexe an den GL Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    rectangleObject.colorBuffer = gl.createBuffer()

    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.5, 0.5, 0.0, 1.0
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


    var textureCoord = [
        0.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ]

    rectangleObject.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord), gl.STATIC_DRAW);
}

function setUpInterleavedBuffer(){
    // add code here to setup the buffers for drawing an object
    // Always vertex, color, texture
    var bufferValues = [
        -0.5,-0.5,
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0,
        -0.5, 0.8,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0,
        0.8,-0.5,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0,
        0.8,0.8,
        0.5, 0.5, 0.0, 1.0,
        1.0, 1.0
    ]

    rectangleObject.buffer = gl.createBuffer();
    //Binden des Buffers
    // Übergeben der Vertexe an den GL Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferValues), gl.STATIC_DRAW);
}

/**
 * Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 */
function initTexture(image, textureObject) {
    // create a new texture
    gl.bindTexture(gl.TEXTURE_2D, textureObject);

    // set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // Was passiert beim skalieren?
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    //turn texture off again
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Load an image as a texture.
 * @param imageUrl The Url of the image to load.
 */
function loadTexture(imageUrl) {
    var image = new Image();
    // create a texture Object
    lennaTxt.textureObj = gl.createTexture();
    image.onload = function(){
        initTexture(image, lennaTxt.textureObj);
        // redraw after loading the texture
        draw();
    }
    // Setting of the image
    image.src = imageUrl;
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    setUpInterleavedBuffer();
}

function bindStandardBuffers(){
    //Binden des Buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    //Verbindet den aktuellen Buffer mit der Vertexvariable, 2 gibt die Anzahl Komponenten an und float den Datentypen
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
    gl.enableVertexAttribArray(ctx.aVertexColorId);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
    gl.enableVertexAttribArray(ctx.aVertexTextureId);
}

function bindInterleavedBuffer(){
    //Binden des Buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    //Verbindet den aktuellen Buffer mit der Vertexvariable, 2 gibt die Anzahl Komponenten an und float den Datentypen
    // Stride -> 32 / 8 * (2+4+2) = 32
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);
    gl.vertexAttribPointer(ctx.aVertexColorId, 4, gl.FLOAT, false, 32, 8);
    gl.enableVertexAttribArray(ctx.aVertexColorId);
    gl.vertexAttribPointer(ctx.aVertexTextureId, 2, gl.FLOAT, false, 32, 24);
    gl.enableVertexAttribArray(ctx.aVertexTextureId);
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

    bindInterleavedBuffer();

    // Setzen der Texture0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lennaTxt.textureObj);
    gl.uniform1i(ctx.uSample2DId, 0);
    gl.uniform1i(ctx.uUseColor, 0);

    //gl.uniform4fv(ctx.uColorId, [0.0, 1.0, 0.0, 1.0]);

    //Gibt an wie es gezeichnet wird
    //Ungefuellt
    //gl.drawArrays(gl.LINE_LOOP, 0, 4);

    //Gefuellt
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}