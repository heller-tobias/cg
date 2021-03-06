precision mediump float;

uniform bool uEnableTexture;
uniform bool uEnableLighting;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;

varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

varying vec3 vColor;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

const float ambientFactor = 0.2;
const float shininess = 15.0;
// Wie viel wird reflektiert?
// Anteil der spiegelnden Reflexion
const vec3 specularMaterialColor = vec3(0.8, 0.8, 1.0);

//metallisch
// -> Mehr Blau

void main() {
    vec3 baseColor = vColor;
    if (uEnableTexture) {
        baseColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;
    }

    if (uEnableLighting) {
        // calculate light direction as seen from the vertex position
        vec3 lightDirectionEye = normalize(uLightPosition - vVertexPositionEye3);
        vec3 normal = normalize(vNormalEye);

        // ambient lighting
        vec3 ambientColor = ambientFactor * baseColor.rgb;

        // diffuse lighting
        float diffuseFactor = 0.9;
        // diffuse color should not negatively impact the lightning color
        vec3 diffuseColor = diffuseFactor * vColor.rgb * uLightColor * clamp(dot(normal, lightDirectionEye), 0.0, 1.0);

        // specular lighting
        vec3 specularColor = vec3(0, 0, 0);
        bool enableSpecular = true;

        if (enableSpecular  && (diffuseFactor > 0.0)) {
            vec3 reflectionDir = normalize(reflect(-lightDirectionEye, normal));
            // Fix direction is opposite, we need from vertex to eye not eye to vertex
            vec3 eyeDir = - normalize(vVertexPositionEye3);
            //shouldn't be negative
            float cosPhi = clamp(y, 0.0, 1.0);
            float specularFactor = shininess;
            specularColor = (specularMaterialColor * uLightColor) * pow(cosPhi, specularFactor);
            //multiplikativ
        }
        vec3 color = ambientColor + diffuseColor + specularColor;
        gl_FragColor = vec4(color, 1.0);
    }
    else {
        gl_FragColor = vec4(baseColor, 1.0);
    }
}