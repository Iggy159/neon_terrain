#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

varying float vElevation;
uniform float uTime;
uniform float uElevation;

float getElevation(vec2 _position) {

    float elevation = 0.0;

    //float tunnel = Math.sin((position * 0.6) * 0.8);

    vec2 position = _position;
    position.x -= uTime * 0.9;
    //position.y += uTime * 0.1;

    elevation += cnoise3(vec3(
        (position * 1.3) * 0.2,
        0.0
    )) * 1.8;

    elevation += cnoise3(vec3(
        (position * 15.0) * 0.3,
        0.0
    )) * 0.09;

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