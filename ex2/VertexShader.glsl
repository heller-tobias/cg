//Wird durch Buffer übergeben (vec2 -> Vektor mit Länge 2)
attribute vec2 aVertexPosition;

void main () {
    //Muss immer GL Position auf etwas setzen!
    gl_Position = vec4(aVertexPosition, 0, 1);
}