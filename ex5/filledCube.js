/**
 *
 * Define a filled cube with methods for drawing it.
 *
 * @param gl the webgl context
 * @param colors the colors of the sides
 * @returns object with draw method
 * @constructor
 */
function FilledCube ( gl , colors ) {
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
            colors[0],
            colors[0],
            colors[0],
            colors[0],
            colors[1],
            colors[1],
            colors[1],
            colors[1],
            colors[2],
            colors[2],
            colors[2],
            colors[2],
            colors[3],
            colors[3],
            colors[3],
            colors[3],
            colors[4],
            colors[4],
            colors[4],
            colors[4],
            colors[5],
            colors[5],
            colors[5],
            colors[5],
        ];
        var buffer = gl.createBuffer () ;
        gl.bindBuffer ( gl.ARRAY_BUFFER , buffer ) ;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorIndices), gl.STATIC_DRAW);
        return buffer;
    }
    return {
        bufferVertices : defineVertices ( gl ) ,
        bufferTriangles : defineTriangles ( gl ) ,
        bufferColors: defineColors(gl),
        draw : function ( gl , aVertexPositionId , aVertexColorId ) {
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