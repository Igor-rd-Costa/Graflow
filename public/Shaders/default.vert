#version 300 es
precision mediump float;

layout(std140) uniform Transforms {
    mat4 viewProj;
    mat4 model;
};

in vec3 vPosition;
in vec3 vColor;
in vec2 vTexCoord;

out vec2 fTexCoord;
out vec3 fColor;

void main()
{
    gl_Position = viewProj * model * vec4(vPosition, 1.0);
    fTexCoord = vTexCoord;
    fColor = vColor;
}