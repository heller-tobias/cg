/**
 *
 * Define a filled sphere with methods for drawing it.
 *
 * @param gl the webgl context
 * @param colors the colors of the sides
 * @param textureUrl a URL of the texture if available.
 * @returns object with draw method
 * @constructor
 */
function FilledSphere( gl , colors, textureUrl = "" ) {
    function defineVertices ( gl ) {
// define the vertices of the cube
        var vertices = [
            //Side 0
            -0.5,-0.5,-0.5, //0
            0.5,-0.5,-0.5,  //1
            0.5,-0.5,0.5,   //2
            -0.5,-0.5,0.5,  //3
            //Side 1
            0.5,-0.5,-0.5,  //4
            0.5,0.5,-0.5,  //5
            0.5,0.5,0.5,   //6
            0.5,-0.5,0.5,  //7
            //Side 2
            0.5,-0.5,0.5,   //8
            0.5,0.5,0.5,    //9
            -0.5,0.5,0.5,  //10
            -0.5,-0.5,0.5,  //11
            //Side 3
            -0.5,0.5,-0.5,  //12
            -0.5,0.5,0.5,   //13
            0.5,0.5,0.5,   //14
            0.5,0.5,-0.5,  //15
            //Side 4
            -0.5,-0.5,-0.5, //16
            -0.5,0.5,-0.5,  //17
            0.5,0.5,-0.5,  //18
            0.5,-0.5,-0.5,  //19
            //Side 5
            -0.5,-0.5,-0.5, //20
            -0.5,-0.5,0.5,   //21
            -0.5,0.5,0.5,   //22
            -0.5,0.5,-0.5   //23
        ];
        var buffer = gl.createBuffer () ;
        gl.bindBuffer ( gl.ARRAY_BUFFER , buffer ) ;
        gl.bufferData ( gl.ARRAY_BUFFER , new Float32Array (vertices) , gl.STATIC_DRAW ) ;
        return buffer;
    }
    function defineTriangles ( gl ) {
        // define the triangles for the cube , there are 12 triangles in a cube
        var vertexIndices = [
            0,1,2,
            2,3,0,
            4,5,6,
            6,7,4,
            8,9,10,
            10,11,8,
            12,13,14,
            14,15,12,
            16,17,18,
            18,19,16,
            20,21,22,
            22,23,20
        ];
        var buffer = gl.createBuffer () ;
        gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER , buffer ) ;
        gl.bufferData ( gl.ELEMENT_ARRAY_BUFFER , new Uint16Array (vertexIndices) , gl.STATIC_DRAW ) ;
        return buffer;
    }

    function defineColors ( gl ) {
        var colorIndices = [
            colors[0][0], colors[0][1], colors[0][2],  colors[0][3],
            colors[0][0], colors[0][1], colors[0][2],  colors[0][3],
            colors[0][0], colors[0][1], colors[0][2],  colors[0][3],
            colors[0][0], colors[0][1], colors[0][2],  colors[0][3],
            colors[1][0], colors[1][1], colors[1][2],  colors[1][3],
            colors[1][0], colors[1][1], colors[1][2],  colors[1][3],
            colors[1][0], colors[1][1], colors[1][2],  colors[1][3],
            colors[1][0], colors[1][1], colors[1][2],  colors[1][3],
            colors[2][0], colors[2][1], colors[2][2],  colors[2][3],
            colors[2][0], colors[2][1], colors[2][2],  colors[2][3],
            colors[2][0], colors[2][1], colors[2][2],  colors[2][3],
            colors[2][0], colors[2][1], colors[2][2],  colors[2][3],
            colors[3][0], colors[3][1], colors[3][2],  colors[3][3],
            colors[3][0], colors[3][1], colors[3][2],  colors[3][3],
            colors[3][0], colors[3][1], colors[3][2],  colors[3][3],
            colors[3][0], colors[3][1], colors[3][2],  colors[3][3],
            colors[4][0], colors[4][1], colors[4][2],  colors[4][3],
            colors[4][0], colors[4][1], colors[4][2],  colors[4][3],
            colors[4][0], colors[4][1], colors[4][2],  colors[4][3],
            colors[4][0], colors[4][1], colors[4][2],  colors[4][3],
            colors[5][0], colors[5][1], colors[5][2],  colors[5][3],
            colors[5][0], colors[5][1], colors[5][2],  colors[5][3],
            colors[5][0], colors[5][1], colors[5][2],  colors[5][3],
            colors[5][0], colors[5][1], colors[5][2],  colors[5][3],
        ];
        var buffer = gl.createBuffer () ;
        gl.bindBuffer ( gl.ARRAY_BUFFER , buffer ) ;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorIndices), gl.STATIC_DRAW);
        return buffer;
    }

    function defineTextureCoord(gl){
        var textureCoord = [
            1.0, 0.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            //Side 3
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            //Side 4
            1.0, 0.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            //Side 5
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
        ]

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord), gl.STATIC_DRAW);
        return buffer;
    }

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
    function defineTexture(gl) {
        if(textureUrl === ""){
            console.log("Texture not available")
            return;
        }
        var image = new Image();
        // create a texture Object
        var textureObj = gl.createTexture();
        image.onload = function(){
            initTexture(image, textureObj);
            // redraw after loading the texture
            draw();
        }
        // Setting of the image
        image.src = textureUrl;
        return textureObj;
    }

    return {
        bufferVertices : defineVertices ( gl ) ,
        bufferTriangles : defineTriangles ( gl ) ,
        bufferColors: defineColors(gl),
        textureCoord: defineTextureCoord(gl),
        textureObj: defineTexture(gl),

        draw : function ( gl , aVertexPositionId , aVertexColorId, uEnableTexture) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
            gl.vertexAttribPointer(aVertexColorId, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexColorId);

            gl.uniform1i(uEnableTexture, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferTriangles);
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        },
        drawWithTexture(gl, aVertexPositionId , aVertexColorId, uEnableTexture, aSampler, aTextureCoord){
            gl.uniform1i(uEnableTexture, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoord);
            gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aTextureCoord);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.textureObj);
            gl.uniform1i(aSampler, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
            gl.vertexAttribPointer(aVertexColorId, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexColorId);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferTriangles);
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        }
    }
}