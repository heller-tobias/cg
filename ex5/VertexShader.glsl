//Wird durch Buffer übergeben (vec2 -> Vektor mit Länge 2)
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aTextureCoord;

varying vec4 vColor;
varying vec2 vTextureCoord ;

uniform mat4 uProjectionMat;
uniform mat4 uModelViewMat;

void main () {
    //Muss immer GL Position auf etwas setzen!
    vColor = aVertexColor;
    vTextureCoord = aTextureCoord;

    vec4 position = vec4(aVertexPosition, 1);
    gl_Position = uProjectionMat * uModelViewMat * position;
}