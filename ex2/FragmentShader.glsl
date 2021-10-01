//Berechnungsgenauigkeit
precision mediump float;

uniform vec4 u_color;
varying vec4 vColor;

//Berechnung der Pixelfarbe
void main() {
     gl_FragColor = vColor;
}