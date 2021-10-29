//Berechnungsgenauigkeit
precision mediump float;

varying vec4 vColor;

// For uniform color, not used anymore!
uniform vec4 u_color;


//Berechnung der Pixelfarbe
void main() {
     // For setting from varying
     gl_FragColor = vColor;
}