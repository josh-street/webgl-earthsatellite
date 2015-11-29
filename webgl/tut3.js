window.addEventListener('load', eventHandler);

var gl;
var canvas;
var shaderProgram;
var vertexBuffer;

function eventHandler() {
	var hi = document.getElementsByClassName("acgavtitle")[3].addEventListener("click", startup1);
}

function startup1(){
 	// retrieve html canvas
 	canvas = document.getElementById('myGLCanvas1');
 	// create webgl context. Here the debugging context is created by calling a function in library "webgl-debug.js"
 	gl = WebGLDebugUtils.makeDebugContext(createGLContext1(canvas));
 	setupShaders1();
 	setupBuffers1();
 	// Set the colour to draw with
 	gl.clearColor(0.0, 0.0, 0.0, 1.0);
 	draw1();
}

function createGLContext1(canvas){
 	var names = ['webgl', 'experimental-webgl'];
 	var context = null;
 	for (var i=0; i < names.length; i++){
 		try{
 			context = canvas.getContext(names[i]);
 		} catch(e){}
 		if (context){
 			break
 		}
 	}
 	if (context) {
 		context.viewportWidth = canvas.width;
 		context.viewportHeight = canvas.height;
 	} else {
 		alert("Failed to create WebGL context!")
 	}
 	return context;
}

function loadShaderFromDOM1(id) { 
var shaderScript = document.getElementById(id); 

// If there is no shader scripts, the function exist
if (!shaderScript) { 
return null; 
} 

// Otherwise loop through the children for the found DOM element and 
// build up the shader source code as a string 
var shaderSource = ""; 
var currentChild = shaderScript.firstChild; 
while (currentChild) { 
if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE 
shaderSource += currentChild.textContent; 
} 
currentChild = currentChild.nextSibling; 
} 

//Create a WebGL shader object according to type of shader, i.e., //vertex or fragment shader.
var shader; 
if (shaderScript.type == "x-shader/x-fragment") { 
//call WebGL function createShader() to create fragment 
//shader object
shader = gl.createShader(gl.FRAGMENT_SHADER); 
} else if (shaderScript.type == "x-shader/x-vertex") { 
//call WebGL function createShader() to create vertx shader obj.
shader = gl.createShader(gl.VERTEX_SHADER); 
} else { 
return null; 
} 

//load the shader source code (shaderSource) to the shader object.
gl.shaderSource(shader, shaderSource); 
gl.compileShader(shader); //compile the shader

//check compiling status.
if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { 
alert(gl.getShaderInfoLog(shader)); 
return null; 
}
 
return shader; 
} 

function setupShaders1() { 
//Create vertex and fragment shdaers
vertexShader = loadShaderFromDOM1("shader-vs"); 
fragmentShader = loadShaderFromDOM1("shader-fs"); 

//create a webgl program object
shaderProgram = gl.createProgram(); 

//load the shaders to the program object
gl.attachShader(shaderProgram, vertexShader); 
gl.attachShader(shaderProgram, fragmentShader); 

//link shaders and check linking status
gl.linkProgram(shaderProgram); 
if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { 
alert("Failed to setup shaders"); 
} 

//activate the program
gl.useProgram(shaderProgram); 

//add a property to the shader program object. The property is the //attribute in the vertex shader, which has been loaded to the program //object. Function getAttribLocation() finds the pointer to this //attribute
shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition"); 
gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute); 
} 


function setupBuffers1() { 
//A buffer object is first created by calling gl.createBuffer() 
vertexBuffer = gl.createBuffer(); 
//Then bind the buffer to gl.ARRAY_BUFFER, which is the WebGL built-in //buffer where the vertex shader will fetch data from
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); 

//Actual coordinates for the vertices
var triangleVertices = [ 
0.0,  0.5, 0.0, 
  -0.5, -0.5, 0.0, 
0.5, -0.5, 0.0 
]; 
//Load the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), 
gl.STATIC_DRAW); 
//Add properties to vertexBuffer object
vertexBuffer.itemSize = 3;      //3 coordinates of each vertex
vertexBuffer.numberOfItems = 3; //3 vertices in all in this buffer
} 


function draw1() { 
	//setup a viewport that is the same as the canvas using
	//function viewport(int x, int y, sizei w, sizei h)
//where x and y give the x and y window coordinates of the //viewport’s lower left corner and w and h give the viewport’s width //and height.
gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight); 

//fill the canvas with solid colour. Default is black
//If other colour is desirable using function gl.clearColor (r,g,b,a)
gl.clear(gl.COLOR_BUFFER_BIT); 

//Inform webgl pipeline with pointer of the attribute //"aVertexPosition". Still remember it?
gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
vertexBuffer.itemSize, gl.FLOAT, false, 0, 0); 

//Draw the triangle
gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems); 
}  



