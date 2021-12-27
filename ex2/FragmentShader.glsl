//Berechnungsgenauigkeit
precision mediump float;

varying vec4 vColor;
varying vec2 vTextureCoord;

// For uniform color, not used anymore!
uniform vec4 u_color;
// For rendering a texture
uniform sampler2D uSampler;

// Use color bit
uniform bool uUseColor;

//Berechnung der Pixelfarbe
void main() {
     // For setting from varying
     if(uUseColor){
          gl_FragColor = vColor;
     }else{
          // Gibt an welche Textur verwendet wird!
          gl_FragColor = texture2D(uSampler, vTextureCoord);
     }
}