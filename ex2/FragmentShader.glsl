//Berechnungsgenauigkeit
precision mediump float;

varying vec4 vColor;
varying vec2 vTextureCoord;

// For uniform color, not used anymore!
uniform vec4 u_color;
// For rendering a texture
uniform sampler2D uSampler;

//Berechnung der Pixelfarbe
void main() {
     // For setting from varying
     //gl_FragColor = vColor;
     // Gibt an welche Textur verwendet wird!
     gl_FragColor = texture2D(uSampler, vTextureCoord);
}