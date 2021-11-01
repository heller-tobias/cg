//Berechnungsgenauigkeit
precision mediump float;
precision mediump float ;
varying vec4 vColor ;
varying vec2 vTextureCoord ;
uniform sampler2D uSampler ;
uniform int uEnableTexture ;

//Berechnung der Pixelfarbe
void main() {
     // For setting from varying
     if (uEnableTexture == 0) {
          gl_FragColor = vColor ;
     }
     else {
          gl_FragColor = texture2D ( uSampler , vTextureCoord ) ;
     }
}