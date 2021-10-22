/**
 *
 * Define a wire frame cube with methods for drawing it.
 *
 * @param gl the webgl context
 * @param color the color of the cube
 * @returns object with draw method
 * @constructor
 */
function WireFrameCube ( gl , color ) {
    function defineVertices ( gl ) {
// define the vertices of the cube
        var vertices = [
            -0.5,-0.5,-0.5,
            0.5,-0.5,-0.5,
            0.5,-0.5,0.5,
            -0.5,-0.5,0.5,
            -0.5,0.5,-0.5,
            0.5,0.5,-0.5,
            0.5,0.5,0.5,
            -0.5,0.5,0.5,
        ];
        var buffer = gl.createBuffer () ;
        gl.bindBuffer ( gl.ARRAY_BUFFER , buffer ) ;
        gl.bufferData ( gl.ARRAY_BUFFER , new Float32Array (vertices) , gl.STATIC_DRAW ) ;
        return buffer;
    }
    function defineEdges ( gl ) {
        // define the edges for the cube , there are 12 edges in a cube
        var vertexIndices = [
            0,1,
            1,2,
            2,3,
            0,3,
            0,4,
            4,5,
            1,5,
            2,6,
            6,7,
            3,7,
            4,7,
            5,6
        ];
        var buffer = gl.createBuffer () ;
        gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER , buffer ) ;
        gl.bufferData ( gl.ELEMENT_ARRAY_BUFFER , new Uint16Array (vertexIndices) , gl.STATIC_DRAW ) ;
        return buffer;
    }
    return {
        bufferVertices : defineVertices ( gl ) ,
        bufferEdges : defineEdges ( gl ) ,
        color : color ,
        draw : function ( gl , aVertexPositionId , aVertexColorId ) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);
            gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0);
        }
    }
}