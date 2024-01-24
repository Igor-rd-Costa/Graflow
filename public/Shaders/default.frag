#version 300 es
precision mediump float;

in vec2 fTexCoord;
in vec3 fColor;

out vec4 color;

uniform sampler2D myTexture;

void main()
{
    color = texture(myTexture, fTexCoord);
}