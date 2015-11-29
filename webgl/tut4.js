window.addEventListener('load', eventHandler);

var gl1;
var canvas;
var shaderProgram;
var triangleVertexBuffer;
var triangleVertexColorBuffer;

function eventHandler() {
  document.getElementsByClassName("acgavtitle")[4].addEventListener("click", startup);
}

function createGLContext(canvas) {
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

function loadShaderFromDOM(id) {
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
shader = gl1.createShader(gl1.FRAGMENT_SHADER); 
} else if (shaderScript.type == "x-shader/x-vertex") { 
//call WebGL function createShader() to create vertx shader obj.
shader = gl1.createShader(gl1.VERTEX_SHADER); 
} else { 
return null; 
} 

//load the shader source code (shaderSource) to the shader object.
gl1.shaderSource(shader, shaderSource); 
gl1.compileShader(shader); //compile the shader

//check compiling status.
if (!gl1.getShaderParameter(shader, gl1.COMPILE_STATUS)) { 
alert(gl1.getShaderInfoLog(shader)); 
return null; 
}
 
return shader; 
} 



function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs1");
  fragmentShader = loadShaderFromDOM("shader-fs1");
  shaderProgram = gl1.createProgram();
  gl1.attachShader(shaderProgram, vertexShader);
  gl1.attachShader(shaderProgram, fragmentShader);
  gl1.linkProgram(shaderProgram);

  if (!gl1.getProgramParameter(shaderProgram, gl1.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl1.useProgram(shaderProgram);
  
  shaderProgram.vertexPositionAttribute = 
gl1.getAttribLocation(shaderProgram, "aVertexPosition"); 
  shaderProgram.vertexColorAttribute = gl1.getAttribLocation(shaderProgram, 
"aVertexColor");
  
  gl1.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  // For the triangle we want to use per-vertex color so
  // the vertexColorAttribute, aVertexColor, in the vertex shader
  // is enabled
  gl1.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

}

function setupBuffers() {
    //triangle vertices
  triangleVertexBuffer = gl1.createBuffer();
  gl1.bindBuffer(gl1.ARRAY_BUFFER, triangleVertexBuffer);
  var triangleVertices = [
  0.0,  0.5,  0.0,  // V0
        0.5, -0.5,  0.0,  // V1
       -0.5, -0.5,  0.0,  // V2
  ];

  gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(triangleVertices), 
gl1.STATIC_DRAW);
  triangleVertexBuffer.itemSize = 3;
  triangleVertexBuffer.numberOfItems = 3;
 
  // Triangle vertex colours
  triangleVertexColorBuffer = gl1.createBuffer();
  gl1.bindBuffer(gl1.ARRAY_BUFFER, triangleVertexColorBuffer);
  var colors = [
            1.0, 0.0, 0.0, 1.0, //v0
            0.0, 1.0, 0.0, 1.0, //v1
            0.0, 0.0, 1.0, 1.0  //v2
        ];

  gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(colors), gl1.STATIC_DRAW);
  triangleVertexColorBuffer.itemSize = 4;
  triangleVertexColorBuffer.numberOfItems = 3;
}

function draw() { 
  gl1.viewport(0, 0, gl1.viewportWidth, gl1.viewportHeight);
  gl1.clear(gl1.COLOR_BUFFER_BIT);

    
  // Make vertex buffer "triangleVertexBuffer" the current buffer
  gl1.bindBuffer(gl1.ARRAY_BUFFER, triangleVertexBuffer);
  
  // Link the current buffer to the attribute "aVertexPosition" in
  // the vertex shader
  gl1.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
triangleVertexBuffer.itemSize, gl1.FLOAT, 
false, 0, 0);
  
  // Make color buffer "triangleVertexColorBuffer" the current buffer
  gl1.bindBuffer(gl1.ARRAY_BUFFER, triangleVertexColorBuffer);    
  // Link the current buffer to the attribute "aVertexColor" in
  // the vertex shader
  gl1.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
triangleVertexColorBuffer.itemSize, gl1.FLOAT, 
false, 0, 0);
  gl1.drawArrays(gl1.TRIANGLES, 0, triangleVertexBuffer.numberOfItems);
}

function startup() {
  canvas = document.getElementById("myGLCanvas2");
  gl1 = WebGLDebugUtils.makeDebugContext(createGLContext(canvas));
  setupShaders(); 
  setupBuffers();
  gl1.clearColor(1.0, 1.0, 1.0, 1.0);
  
  draw();  
}
