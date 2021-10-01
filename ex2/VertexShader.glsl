//Wird durch Buffer übergeben (vec2 -> Vektor mit Länge 2)
attribute vec2 aVertexPosition;
attribute vec4 aColor;

varying vec4 vColor;

void main () {
    //Muss immer GL Position auf etwas setzen!
    vColor = aColor;
    gl_Position = vec4(aVertexPosition, 0, 1);
}