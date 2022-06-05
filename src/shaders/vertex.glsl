#pragma glslify: cnoise3 = require('glsl-noise/simplex/3d')

varying float vElevation;
uniform float uTime;
uniform float uElevation;
uniform float uElevationValleyFrequency;
uniform float uElevationGeneral;
uniform float uElevationGeneralFrequency;

float getElevation(vec2 _position) {

    float elevation = 0.0;

    vec2 position = _position;
    position.x -= uTime * 1.5;
    
    float valleyStrength = cos((position.y * 3.1415) * 0.1) * 0.39;
    elevation -= valleyStrength * 8.;

    elevation += cnoise3(vec3(
        (position * .75) * .2,
        0.0
    )) * 3.5;

    elevation += cnoise3(vec3(
        (position * 7.0) * 0.09,
        0.0
    )) * 0.75;

    elevation += cnoise3(vec3(
        (position * 25.5) * 0.09,
        0.0
    )) * .15;

    elevation += uElevation;

    return elevation;
}

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = getElevation(modelPosition.xz);

    modelPosition.y += elevation;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vElevation = elevation;
}