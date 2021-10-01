//Wird durch Buffer übergeben (vec2 -> Vektor mit Länge 2)
attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexTextureCoord;

varying vec4 vColor;
varying vec2 vTextureCoord;

void main () {
    //Muss immer GL Position auf etwas setzen!
    vColor = aVertexColor;
    vTextureCoord = aVertexTextureCoord;
    gl_Position = vec4(aVertexPosition, 0, 1);
}