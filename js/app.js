/*
 *   Virtual Speaker System for Chrome Android
 */						

var src, source, splitter, audio, fc,flen;
var xv, yv, zv, vol, rv, tv,tvv, cv, bv, cf,cn2 ,tfile,gl;
 vol = 0.8; ctlvol = 0.7; cv = 1.0; rv =0.0; cf = 0;   //***
var obj= {};

var AudioContext = window.AudioContext || window.webkitAudioContext; 
var audioCtx = new AudioContext();

var gainL = audioCtx.createGain();
 var gainBL = audioCtx.createGain();
var gainR = audioCtx.createGain();
 var gainBR = audioCtx.createGain();
gainL.gain.value = vol; gainBL.gain.value = rv;
gainR.gain.value = vol; gainBR.gain.value = rv;

splitter = audioCtx.createChannelSplitter(2);

xv = 4; yv = 2; zv = -4; rv = 0.2; tv = 0; bv = 0; gl=0;
zv = localStorage.getItem('numZ');  if (zv===null) {zv=-12}; //+++++++++++++++++++++++
yv = localStorage.getItem('numY');  if (yv===null) {yv=2};
xv = localStorage.getItem('numX');  if (xv===null) {xv=4};

var pannerL = audioCtx.createPanner(); 
 pannerL.panningModel = 'HRTF';
 pannerL.distanceModel = 'linear';
 pannerL.refDistance = 1;
 pannerL.maxDistance = 10000;
 pannerL.rolloffFactor = 1;
 pannerL.coneInnerAngle = 360; //120;
 pannerL.coneOuterAngle = 360; // 180;
 pannerL.coneOuterGain = 0;
 pannerL.setOrientation(0,0,1);
var pannerBL = audioCtx.createPanner();
 pannerBL.panningModel = 'HRTF';
 pannerBL.distanceModel = 'linear';
 pannerBL.refDistance = 1;
 pannerBL.maxDistance = 10000;
 pannerBL.rolloffFactor = 4;
 pannerBL.coneInnerAngle = 360;
 pannerBL.coneOuterAngle = 360;
 pannerBL.coneOuterGain = 0;
 pannerBL.setOrientation(0,0,1);
var pannerSL = pannerBL;               //***
var pannerUL = pannerBL; 
var delaySL = audioCtx.createDelay(); delaySL.delayTime.value=0.01;

var pannerR = audioCtx.createPanner();
 pannerR.panningModel = 'HRTF';
 pannerR.distanceModel = 'linear';
 pannerR.refDistance = 1;
 pannerR.maxDistance = 10000;
 pannerR.rolloffFactor = 1;
 pannerR.coneInnerAngle = 360; // 120;
 pannerR.coneOuterAngle = 360; // 180;
 pannerR.coneOuterGain = 0;
 pannerR.setOrientation(0,0,1); 

var pannerBR = audioCtx.createPanner(); 
 pannerBR.panningModel = 'HRTF';
 pannerBR.distanceModel = 'linear';
 pannerBR.refDistance = 10;
 pannerBR.maxDistance = 1000;
 pannerBR.rolloffFactor = 4;
 pannerBR.coneInnerAngle = 360;
 pannerBR.coneOuterAngle = 360;
 pannerBR.coneOuterGain = 0;
 pannerBR.setOrientation(0,0,1);
//var pannerSR = pannerBR;               //***
//var pannerUR = pannerBR;
//var delaySR = audioCtx.createDelay(); delaySR.delayTime.value=0.01;

var listener = audioCtx.listener; 

var bassL   = audioCtx.createBiquadFilter();
 bassL.type   = 'lowshelf';
 bassL.frequency.value   =  100;
 bassL.gain.value   =  0;
var trebleL   = audioCtx.createBiquadFilter();
 trebleL.type   = 'highshelf';
 trebleL.frequency.value   =  12000;
 trebleL.gain.value   =  20;

var bassR   = audioCtx.createBiquadFilter();
 bassR.type   = 'lowshelf';
 bassR.frequency.value   =  100;
 bassR.gain.value   =  0;
var trebleR   = audioCtx.createBiquadFilter();
 trebleR.type   = 'highshelf';
 trebleR.frequency.value   =  12000;
 trebleR.gain.value   =  20;

var camera, scene, renderer, canvas,ctx,geometry,material;	
var cube, plane, light0,Sphere0;	
	
var wX = 400;
var wY = 400;   
var meshL,meshR,cubeL, cubeR;


//window.onload = function() { 
function ini() {
  audio = new Audio(src); audio.controls = true; document.body.appendChild(audio); 
  source = audioCtx.createMediaElementSource(audio);
  //var x = document.createElement("INPUT"); x.setAttribute("type", "checkbox");

    //audio.autoplay = true;
  initgls(); //movsp();

  document.querySelector("#input").addEventListener("change",
        function () { handleFiles(); } );
  document.querySelector("#loop").addEventListener("click",
	function () { chkLoop(); } );

  document.querySelector("#numZ").addEventListener("change",
        function () { changeValueZ(document.querySelector("#numZ").value); });
	document.getElementById("panValueZ").innerHTML="pos_Z = "+zv; //+++++++++++++++++++++++

  document.querySelector("#numY").addEventListener("change",
        function () { changeValueY(document.querySelector("#numY").value); });
	document.getElementById("panValueY").innerHTML="pos_Y = "+yv; //+++++++++++++++++++++++

  document.querySelector("#numX").addEventListener("change",
        function () { changeValueX(document.querySelector("#numX").value); });
	document.getElementById("panValueX").innerHTML="pos_X = "+xv; //+++++++++++++++++++++++

  //document.querySelector("#rSp").addEventListener("change",
        //function () { changeVolRear(document.querySelector("#rSp").value); });
  document.querySelector("#bass").addEventListener("change",
        function () { changeBass(document.querySelector("#bass").value); });
  document.querySelector("#treble").addEventListener("change",
        function () { changeTreble(document.querySelector("#treble").value); });

}

var lp = false;
function chkLoop() {
 if ( document.getElementById('loop').innerHTML === "loop:OFF" ) { 
        document.getElementById('loop').innerHTML = "loop: ON"; lp = true; }
 else { document.getElementById('loop').innerHTML = "loop:OFF"; lp = false; }
}

function initgls() {

renderer = new THREE.WebGLRenderer({ canvas: tCanvas });
renderer.setSize (wX,wY);    
renderer.setClearColor(0x444477, 1);
         
camera = new THREE.PerspectiveCamera (90, 1, 1, 1000);  
camera.position.x=0; camera.position.y=5; camera.position.z=5;   
camera.lookAt( {x:0, y:4.2, z:0 } ); 
      
scene = new THREE.Scene(); scene.add(camera);  
    
var geometry_sph = new THREE.SphereGeometry (0.7, 36, 36);         
var material0 = new THREE.MeshLambertMaterial( { color: 0x0088cc } );    
Sphere0 = new THREE.Mesh (geometry_sph, material0);     
Sphere0.position.x= 0; Sphere0.position.y= 0; Sphere0.position.z= 0; //Sphere0.castShadow = true;     
scene.add( Sphere0 );

var geometry_cube = new THREE.CubeGeometry (2, 3, 1.5);
     //var ambient = new THREE.AmbientLight(0x333333); scene.add(ambient);
        
     var br = new THREE.MeshLambertMaterial({color: 0x886600});
     var gr = new THREE.MeshLambertMaterial({color: 0x333333});
     var materials = [ br, br, br, br, gr, br ];
   
        var material_cube = new THREE.MeshFaceMaterial(materials);
         cubeL = new THREE.Mesh (geometry_cube, material_cube);
         cubeL.position.setX(-xv); cubeL.position.setY(yv); cubeL.position.setZ(zv); 
		cubeL.rotation.order = "ZYX";          
         cubeL.castShadow = true; 
	scene.add( cubeL ); 
         cubeR = new THREE.Mesh (geometry_cube, material_cube);
         cubeR.position.setX(xv); cubeR.position.setY(yv); cubeR.position.setZ(zv);
		cubeR.rotation.order = "ZYX";          
         cubeR.castShadow = true; 
        scene.add( cubeR ); 
         
  light0 = new THREE.SpotLight( 0xffffff );      
  light0.position.x=100; light0.position.y=100; light0.position.z=100;    
  light0.shadowMapWidth = 2048; light0.shadowMapHeight = 2048;
  scene.add( light0 );
 
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 1, 1),
        new THREE.MeshLambertMaterial({
            color: 0xdddddd, transparent: true, opacity: 0.7
        })
    );
    plane.position.y = 0;
    plane.rotation.x = -Math.PI / 2;
    scene.add( plane );

    light0.castShadow = true;
    plane.receiveShadow = true;
    renderer.shadowMapEnabled = true;
   renderer.render( scene, camera ); 
    document.getElementById("fn").innerHTML= "Open multiple files supported. Open file if not shown 3D pannel.";

  //audio = new Audio(src); audio.controls = true; document.body.appendChild(audio); 
    audio.autoplay = true; //audio.volume = 0.5;
  setPos(xv,yv,zv); 
 gl=gl+1;
} // -- end of initgl --


function movsp() { 
  cubeL.position.setX(-xv); cubeL.position.setY(yv); cubeL.position.setZ(zv);
  cubeR.position.setX(xv);  cubeR.position.setY(yv); cubeR.position.setZ(zv); 
    cubeL.rotation.x=Math.atan(-yv/zv)/2; cubeR.rotation.x=Math.atan(-yv/zv)/2;
    cubeL.rotation.y=Math.atan(-xv/zv); cubeR.rotation.y=Math.atan(xv/zv); 
 renderer.render( scene, camera ); 
 chkLoop();  // for chrome 57 bug !! 
}

function startPlay() {  			
	//source = audioCtx.createMediaElementSource(audio); 
        playGain(); setPos( xv, yv, zv ); 
} 
   
function handleFiles() {
fc = 0; movsp();
//audio = new Audio(src);
var fileInput = document.getElementById("input");
flen = fileInput.files.length;
  if (flen>0) {loadsrc(flen);}
}

function loadnext() {
 fc = fc + 1; 
   if (fc<flen) {loadsrc();}  
   else { fc = 0; 
	if (lp === true) {loadsrc(flen);}
       //  loadsrc();	if (document.getElementById("roop").checked) {loadsrc();}
   } 
}

function loadsrc() {
 var fname;
    src = URL.createObjectURL(document.getElementsByTagName('input')[0].files[fc]);
    fname = document.getElementsByTagName('input')[0].files[fc].name; 
	//tfile=fname;
						
    audio.src=src;	audio.autoplay = true;
    audio.addEventListener('loadeddata', function() {
      document.getElementById("fn").innerHTML= (fc+1) +" of "+flen+" : "+fname;
      if ( fc  < flen ) { 
       audio.onended = function() { loadnext(); }
        //audio.addEventListener('ended', function() { 
        //  fc = fc + 1; loadsrc();                                 
        //},false);
      //startPlay();
      }
    startPlay(); 
   }, false);
}


function playGain() {
  source.connect(splitter); 
    splitter.connect(pannerL, 0).connect(bassL).connect(trebleL).connect(audioCtx.destination);
    splitter.connect(gainBL, 0).connect(pannerBL).connect(audioCtx.destination);
    //splitter.connect(gainBL, 0).connect(pannerSL).connect(delaySL).connect(audioCtx.destination); 
    //splitter.connect(gainBL, 0).connect(pannerUL).connect(delaySL).connect(audioCtx.destination);
	//var pannerUR = pannerBR;    
  
    splitter.connect(pannerR, 1).connect(bassR).connect(trebleR).connect(audioCtx.destination); 
    splitter.connect(gainBR, 1).connect(pannerBR).connect(audioCtx.destination);
    //splitter.connect(gainBR, 1).connect(pannerSR).connect(delaySR).connect(audioCtx.destination);  
    //splitter.connect(gainBR, 1).connect(pannerUR).connect(delaySR).connect(audioCtx.destination);
  //source.start(0);
 audio.play();
}

function setPos(x,y,z) { x=x*10; y=y*10; z=z*10;
 pannerL.setPosition( -x, y*4, z*4); //pannerL.setOrientation(x,-y*2,-z*3);  
  pannerBL.setPosition(-x*2,y*4, z*5); //pannerSL.setPosition(-x*4,y*2, 3*z/2); pannerUL.setPosition(-x/2,y*4,3*z/2);
 pannerR.setPosition( x,y*4, z*4); //pannerR.setOrientation(-x,-y*2,-z*3); 
  pannerBR.setPosition( x*2,y*4, z*5); //pannerSR.setPosition( x*4,y*2, 3*z/2); pannerUR.setPosition( x/2,y*4,3*z/2);
 //listener.setPosition(0,-y*6,-z*8);
 movsp();   
//audio.currentTime=audio.currentTime-0.1; 
}

function changeValueZ(zvalue) {
 zv = zvalue; document.getElementById("panValueZ").innerHTML="pos_Z = "+zv;
 //document.querySelector("#numZ").value = zv;
 localStorage.setItem('numZ', document.querySelector('#numZ').value); //+++++++++++++++++++++++
 setPos( xv, yv, zv );  
}

function changeValueY(yvalue) {  
 yv = yvalue; document.getElementById("panValueY").innerHTML="pos_Y = "+yv; 
 //document.querySelector("#numY").value = yv;
 localStorage.setItem('numY', document.querySelector('#numY').value); //+++++++++++++++++++++++
 setPos( xv, yv, zv );  
 gainBL.gain.value = zv/25; gainBR.gain.value = zv/25;
}

function changeValueX(xvalue) {  
 xv = xvalue; document.getElementById("panValueX").innerHTML="dist_X = "+xv; 
 //document.querySelector("#numX").value = xv;
 localStorage.setItem('numX', document.querySelector('#numX').value); //+++++++++++++++++++++++
 setPos( xv, yv, zv ); 
}
/*
function changeVolRear(rSpVol) {  
 rv = rSpVol; document.getElementById("rspVol").innerHTML="surround_vol = " + rv; 
 document.querySelector("#rSp").value = rv; 
 gainBL.gain.value = -rv; gainBR.gain.value = -rv;
}
*/
function changeBass(bvalue) {
  bassL.gain.value = bvalue; bassR.gain.value = bvalue; 
  bv = bvalue;  //bv = bvalue*3 + 45;
  //bass.frequency.value   =  bv;
    document.getElementById("bassValue").innerHTML="bass = "+ bv;
    document.querySelector("#bass").value = bvalue;
}
function changeTreble(tvalue) {
  trebleL.gain.value = tvalue ; trebleR.gain.value = tvalue ; 
  tv = tvalue; tvv = -tvalue*500 + 12000;
  //treble.frequency.value   = tvv;
    document.getElementById("trebleValue").innerHTML="treble = "+ tv;
    document.querySelector("#treble").value = tvalue;
}
