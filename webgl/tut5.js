window.addEventListener('load', eventHandler);

var gl1;
var canvas;
var shaderProgram;
var triangleVertexBuffer;
var triangleVertexColorBuffer;
var hexagonVertexBuffer;
var stripVertexBuffer;
var stripElementBuffer;


function eventHandler() {
  document.getElementsByClassName("acgavtitle")[4].addEventListener("click", startup2);
}

function createGLContext2(canvas) {
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

function loadShaderFromDOM2(id) {
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



function setupShaders2() {
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
  
  shaderProgram.vertexPositionAttribute = gl1.getAttribLocation(shaderProgram, "aVertexPosition"); 

  shaderProgram.vertexColorAttribute = gl1.getAttribLocation(shaderProgram, "aVertexColor");
  
  gl1.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  // For the triangle we want to use per-vertex color so
  // the vertexColorAttribute, aVertexColor, in the vertex shader
  // is enabled
  gl1.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

}

function setupBuffers2() {
    //triangle vertices
  triangleVertexBuffer = gl1.createBuffer();
  gl1.bindBuffer(gl1.ARRAY_BUFFER, triangleVertexBuffer);
  var triangleVertices = [
        0.3,  0.4,  0.0, //v0
        0.7,  0.4,  0.0, //v1
        0.5,  0.8,  0.0, //v2

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
  //hexagon vertices  
  hexagonVertexBuffer = gl1.createBuffer();
  gl1.bindBuffer(gl1.ARRAY_BUFFER, hexagonVertexBuffer);
  var hexagonVertices = [
        -0.3,  0.6,  0.0, //v0
        -0.4,  0.8,  0.0, //v1
        -0.6,  0.8,  0.0, //v2
        -0.7,  0.6,  0.0, //v3
        -0.6,  0.4,  0.0, //v4
        -0.4,  0.4,  0.0, //v5
        -0.3,  0.6,  0.0, //v6
            ];

  gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(hexagonVertices), 
gl1.STATIC_DRAW);
  hexagonVertexBuffer.itemSize = 3;
  hexagonVertexBuffer.numberOfItems = 7;

  
  //Triangle strip vertices.  
  stripVertexBuffer = gl1.createBuffer();
  gl1.bindBuffer(gl1.ARRAY_BUFFER, stripVertexBuffer);
  var stripVertices = [
        -0.5,  0.2,  0.0, //v0
        -0.4,  0.0,  0.0, //v1
        -0.3,  0.2,  0.0, //v2
        -0.2,  0.0,  0.0, //v3
        -0.1,  0.2,  0.0, //v4
         0.0,  0.0,  0.0, //v5
         0.1,  0.2,  0.0, //v6
         0.2,  0.0,  0.0, //v7
         0.3,  0.2,  0.0, //v8
         0.4,  0.0,  0.0, //v9
         0.5,  0.2,  0.0, //v10

         // Second strip
        -0.5, -0.3,  0.0, //v11
        -0.4, -0.5,  0.0, //v12
        -0.3, -0.3,  0.0, //v13
        -0.2, -0.5,  0.0, //v14
        -0.1, -0.3,  0.0, //v15
         0.0, -0.5,  0.0, //v16
         0.1, -0.3,  0.0, //v17
         0.2, -0.5,  0.0, //v18
         0.3, -0.3,  0.0, //v19
         0.4, -0.5,  0.0, //v20
         0.5, -0.3,  0.0  //v21
  ];

  gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(stripVertices), 
gl1.STATIC_DRAW);
  stripVertexBuffer.itemSize = 3;
  stripVertexBuffer.numberOfItems = 22;
  
  // Strip vertex indices
  stripElementBuffer = gl1.createBuffer();
  gl1.bindBuffer(gl1.ELEMENT_ARRAY_BUFFER, stripElementBuffer);
  var indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
           10, 10, 11, // 3 extra indices for the degenerate triangles
           11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  gl1.bufferData(gl1.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), 
gl1.STATIC_DRAW);
  stripElementBuffer.numberOfItems = 25;

}

function draw2() { 
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
    // Draw the hexagon
  // Constant colour is used for all vertices of the hexagon. In such case,
  // we must disable the vertex attribute array, aVertexColor
  gl1.disableVertexAttribArray(shaderProgram.vertexColorAttribute);                     
  
  // A constant colour must be specified when aVertexColor is disabled
  gl1.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1.0, 0.0, 0.0, 1.0);

  // Make vertex buffer "hexagonVertexBuffer" the current buffer
  gl1.bindBuffer(gl1.ARRAY_BUFFER, hexagonVertexBuffer);
  // Link the current buffer to the attribute "aVertexPosition" in
  // the vertex shader
  gl1.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                          hexagonVertexBuffer.itemSize, gl1.FLOAT, 
false, 0, 0);
  //Draw line strip
  gl1.drawArrays(gl1.LINE_STRIP, 0, hexagonVertexBuffer.numberOfItems);

  
     

  // draw triangle-strip   
  // We have disabled the vertex attribute array, vertexColorAttribute
  // so we use a constant color again.
            
  gl1.bindBuffer(gl1.ARRAY_BUFFER, stripVertexBuffer);
  gl1.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
stripVertexBuffer.itemSize, gl1.FLOAT, 
false, 0, 0);
  // Specify the constant colour to fill the triangle strip
  gl1.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1.0, 1.0, 0.0, 1.0);
  // The triangle strip will be drawn from its vertex index. We first 
  // make the index buffer the current buffer by binding it
  gl1.bindBuffer(gl1.ELEMENT_ARRAY_BUFFER, stripElementBuffer);
  gl1.drawElements(gl1.TRIANGLE_STRIP, stripElementBuffer.numberOfItems, 
gl1.UNSIGNED_SHORT, 0);

  // Draw help lines to easier see the triangles that build up the 
  // triangle-strip. We use a different constant colour for the line
  gl1.vertexAttrib4f(shaderProgram.vertexColorAttribute, 0.0, 0.0, 0.0, 1.0);
  // Draw line for the upper strip using index 0-10
  gl1.drawArrays(gl1.LINE_STRIP, 0, 11);
  // Draw line for the lower strip using index 11-21
  gl1.drawArrays(gl1.LINE_STRIP, 11, 11);

}

function startup2() {
  canvas = document.getElementById("myGLCanvas3");
  gl1 = WebGLDebugUtils.makeDebugContext(createGLContext(canvas));
  setupShaders2(); 
  setupBuffers2();
  gl1.clearColor(1.0, 1.0, 1.0, 1.0);
  
  draw2();  
}
