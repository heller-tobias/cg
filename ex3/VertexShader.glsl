//Wird durch Buffer übergeben (vec2 -> Vektor mit Länge 2)
attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;

varying vec4 vColor;
uniform mat3 uProjectionMat;
uniform mat3 uModelMat;

void main () {
    //Muss immer GL Position auf etwas setzen!
    vColor = aVertexColor;
    vec3 position = uProjectionMat * (uModelMat *  vec3(aVertexPosition, 1));
    gl_Position = vec4(position, 1);
}