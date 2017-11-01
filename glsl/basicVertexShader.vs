precision highp float;
attribute vec3 aVertexPosition;
varying vec4 position;

void main(void) 
{
	gl_Position = vec4(aVertexPosition, 1.0);
	position = vec4(aVertexPosition.x, aVertexPosition.y, 0, 1.0);
}
