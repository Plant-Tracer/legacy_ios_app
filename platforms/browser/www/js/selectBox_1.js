
var video 					= document.getElementById("videoPlayer");
var firstFrame 				= document.getElementById("firstFrame");

// Tracking box size, remember if you change this, also change in the CSS file
var boxWidth 				= 20;
var boxHeight 				= 20;

// Set scale box, also change in CSS file
var scaleboxWidth 			= 10;
var scaleboxHeight 			= 10;

// Initial values
var position 				= [-1,-1];
var position_box1 			= [0, 0];
var position_box2 			= [0, 0];
var position_list 			= [];

// Origin's Coordinate
var original_x 				= 0;
var original_y 				= 0;

// These three list are for graph drawing
var diffx_list 				= [];
var diffy_list 				= [];
var time_list 				= [];
var startTime 				= 0;
var endTime 				= 0;
var count;
var count_box1;
var count_box2;
var range 					= [10,10];
var image1;
var image2;
var templateRange;
var image1Trans 			= [];
var image2Trans 			= [];
var judge 					= 0;
var stepNow 				= 0;
var loaded 					= false;
var frameRate 				= 0;
var myVar;
var pixDistance 			= 0;
var drawingWidth 			= 480;
var drawingHeight 			= 360;
var accum 					= new Array(360);
var initialState;
var saveMove 				= [];
var FPS 					= 20;

var amplitudeDis;
var rateDis;
var original_time 			= [];
var resultStr;
var flagUpdated 			= 0;
var compareCount 			= 0;
var savePositionForback 	= [-1, -1];
var scaleLabel 				= 1;
var testColorSave 			= [];
var testColorStr 			= "";

var frameNum 				= 0;
var frameSave 				= [];
var timeSave 				= 0;
var background 				= [];
var M 						= 10;

// Add listener for marking tracking box
function selectBox(){
	count = 0;
	reloadImg();
	firstFrame.addEventListener("mousedown", getCoordinates, false);
};

// Add listener for marking scalebox
function selectScaleBox(){
	firstFrame.removeEventListener("mousedown", getScaleBox2, false);
	count_box1 = 0;
	reloadImg();
	firstFrame.addEventListener("mousedown", getScaleBox1, false);
}

// Clear scalebox and allow redo
function undoScaleBox(){
	document.getElementById("scalebox1").style.display = "none";
	document.getElementById("scalebox2").style.display = "none";
	reloadImg();
	var position_box1 = [0, 0];
	var position_box2 = [0, 0];
	selectScaleBox();
}


function checkStatus(){
	video.pause();

	reloadImg();
	position 					= [-1,-1];
	image1Trans 				= [];
	image2Trans 				= [];
	templateRange				= null;
	judge 						= 0;
	image1 						= null;
	image2 						= null;

	window.clearInterval(myVar);

	var startButton 			= document.getElementById("startButton");
	var enlargeBoxButton 		= document.getElementById("enlargeBoxButton");
	var reduceBoxButton 		= document.getElementById("reduceBoxButton");
	var playButton 				= document.getElementById("playButton");
	var selectButton 			= document.getElementById("selectButton");
	var cancelButton 			= document.getElementById("cancelButton");

	if (video.style.display != 'none') {
		video.style.display = "none";
	};
	if (firstFrame.style.display != 'block') {
		firstFrame.style.display = 'block';
	};
	if (startButton.style.display == 'none') {
		startButton.style.display = 'block';
	};
	if (enlargeBoxButton.style.display == 'none') {
		enlargeBoxButton.style.display = 'inline-block';
	};
	if (reduceBoxButton.style.display == 'none') {
		reduceBoxButton.style.display = 'inline-block';
	};
	if(cancelButton.style.display == 'none'){
		cancelButton.style.display = 'block';
	}
	playButton.style.display = 'none';
	selectButton.style.display = 'none';
};

function setState(initialStatestr){
	initialState = initialStatestr;
}

// Video is loaded
function setLoaded(){
	loaded = true;
}

// Control prompts
function stateControl(statusNum){
	var state 		= initialState.charAt(statusNum+1);
	var name 		= "hint_";
	var suffix 		= statusNum +1;
	name 			+= suffix;

	if(state == '1'){
		document.getElementById(name).style.display = '';
	}else{
		document.getElementById(name).style.display = 'none';
	}
}


// For every step, we call this function with different status number
// We could know what is current step.
function initial(statusNum){
	console.warn( "----- initial "+statusNum+"---------");
	if(statusNum == 0){

		//video.src 		= "";
		$("#videoPlayer source").attr('src', '');
		startTime 		= 0;
		endTime 		= 0;
		position 		= [-1,-1];
		loaded 			= false;
		stepNow 		= 0;

		controlPanel(1);
		controlIcon(statusNum);
		stateControl(statusNum);

		for(var i = 1; i<=6; i++){
			if(i != 1){
				document.getElementById("titletext_"+i).style.display = 'none';
			}
			else{
				document.getElementById("titletext_1").style.display = '';
			}
		}

	}else if(statusNum === 1){
		video.pause();

		if(!loaded){
			alert("Please select a video.");
			return;
		}

		// after first step, disable the video upload button
		document.getElementById("reupload_button").onclick = function(){ return; };

		controlPanel(2);

		stepNow 										= 1;
		startTime 										= 0;
		endTime 										= video.duration;
		video.style.display 							= "none";
		firstFrame.style.display 						= "";
		
		reloadImg();

		document.getElementById("startTime").min 		= "0";
		document.getElementById("endTime").min 			= "0";
		document.getElementById("startTime").max 		= video.duration;
		document.getElementById("endTime").max 			= video.duration;
		document.getElementById("endTime").value 		= video.duration;
		document.getElementById("startTime").value 		= 0;
		document.getElementById("startTime").step 		= "0.05";
		document.getElementById("endTime").step 		= "0.05";

		stateControl(statusNum);

		for(var i = 1; i<=6; i++){
			if(i != 2){
				document.getElementById("titletext_"+i).style.display = 'none';
			}
			else{
				document.getElementById("titletext_2").style.display = '';
			}
		}
		controlIcon(statusNum);
		closeThisHint(statusNum);

	}else if(statusNum === 2){
		document.getElementById("scalebox1").style.display 	= "none";
		document.getElementById("scalebox2").style.display 	= "none";
		video.currentTime 									= startTime;

		reloadImg();
		if(endTime <= startTime){
			alert("Please select correct time!");
			return;
		}
		reloadImg();
		stepNow = 2;
		controlPanel(3);
		stateControl(statusNum);
		for(var i = 1; i<=6; i++){
			if(i != 3){
				document.getElementById("titletext_"+i).style.display = 'none';
			}
			else{
				document.getElementById("titletext_3").style.display = '';
			}
		}
		reloadImg();

		controlIcon(statusNum);
		closeThisHint(statusNum);

	}else if(statusNum === 3){
		reloadImg();

		var inputRate = document.getElementById("frameRate").value;

		if(!isNaN( inputRate ) && inputRate > 0){
			frameRate = inputRate;

		}else{
			alert("Please input correct Frame Rate!");
			return;
		}

		stepNow 														= 3;

		controlPanel(4);

		document.getElementById("scalebox1").style.display 				= "none";
		document.getElementById("scalebox2").style.display 				= "none";
		document.getElementById("scaleBox1").style.display 				= '';
		document.getElementById("scaleBox2").style.display 				= '';
		document.getElementById("internalNextBox").style.display 		= '';
		document.getElementById("pixDistance").style.display			='none';
		document.getElementById("step_button5").style.display			='none';
		document.getElementById("trackingbox").style.display			='none';

		//when user hits back and lands here, it should unbind
		firstFrame.removeEventListener("mousedown", getCoordinates, false);
		
		stateControl(statusNum);
		for(var i = 1; i<=6; i++){
			if(i != 4){
				document.getElementById("titletext_"+i).style.display = 'none';
			}
			else{
				document.getElementById("titletext_4").style.display = '';
			}
		}

		controlIcon(statusNum);
		closeThisHint(statusNum);

	}else if(statusNum === 4){
		document.getElementById("scalebox1").style.display 				= "none";
		document.getElementById("scalebox2").style.display 				= "none";
		document.getElementById("step_button8").style.display 			= 'none';
		document.getElementById("step_button9").style.display 			= 'none';
		document.getElementById("result_report").style.display 			= "none";

		document.getElementById("step_button6").style.display 			= '';
		document.getElementById("step_button7").style.display 			= '';
		
		time_list = [];
		diffy_list = [];
		diffx_list = [];
		position_list = [];
		position = [-1, -1];

		stepNow = 4;
		var dis = document.getElementById("pixDistance");
		if(dis.value == ""||dis.value == null){
			//alert("no data ");
			pixDistance = 0;
		}else if(!isNaN( dis.value ) && dis.value > 0){
			pixDistance = dis.value/pixDistance.toFixed(2);
		}

		video.currentTime = startTime;
		reloadImg();
		
		controlPanel(5);
		stateControl(statusNum);
		for(var i = 1; i<=6; i++){
			if(i != 5){
				document.getElementById("titletext_"+i).style.display = 'none';
			}
			else{
				document.getElementById("titletext_5").style.display = '';
			}
		}

		controlIcon(statusNum);
		closeThisHint(statusNum);
	}else if(statusNum == 5){
		//selectBox();
		stepNow = 5;
		if(position[0] < 0){
			alert("Please select a box!");
			return;
		}else{

		}
	}
}

function closeThisHint(num){
	var hint = document.getElementById("hint_"+num);
	if(hint.style.display == ''){
		hint.style.display = "none";
	}
}

// Control icons in the bottom
function controlIcon(num){

	for(var i = 1; i < 6; i++){
		if(i == num){
			document.getElementById("activeiconimg_"+i).style.display = "";
			document.getElementById("staticiconimg_"+i).style.display = "none";
			document.getElementById("completeiconimg_"+i).style.display = "none";
		}
		if(i < num){
			document.getElementById("activeiconimg_"+i).style.display = "none";
			document.getElementById("staticiconimg_"+i).style.display = "none";
			document.getElementById("completeiconimg_"+i).style.display = "";
		}
		if(i > num){
			document.getElementById("activeiconimg_"+i).style.display = "none";
			document.getElementById("staticiconimg_"+i).style.display = "";
			document.getElementById("completeiconimg_"+i).style.display = "none";
		}
	}
}

function controlPanel(num){

	var panelID = "step_panel";
	var panelIDShow = panelID + num;
	var panelShow = document.getElementById(panelIDShow);
	panelShow.style.display = 'inline';
	console.log(num);
	for(var i = 1; i < 6; i++){
		if(i == num) continue;
		var panelIDNow = panelID + i;
		var panel = document.getElementById(panelIDNow);
		panel.style.display = 'none';
	}

}

function getStep(){
	return stepNow;
}

// Handle the back button, generally, just call initail(stepNow - 1)
function handle_back(){
	if(getStep()-1 == 0){
		document.getElementById("reupload_button").onclick = function(){ getPhoto(pictureSource.SAVEDPHOTOALBUM); };
		closeThisHint(2);
		initial(0);
		return;
	}
	closeThisHint(getStep()+1);
	initial(getStep()-1);
}

// In the edit video length step, set the start time and end time.
function selectStart() {
	var time = document.getElementById("startTime").value;
	video.currentTime = time;
	startTime = time;
	reloadImg();
}

function endStart() {
	var time = document.getElementById("endTime").value;
	video.currentTime = time;
	endTime = time;
	reloadImg();
}

// About autoscale. Useless now. But I really want to keep this.
function autoScale(){
	var ctx = firstFrame.getContext('2d');
	var imageData = ctx.getImageData(0,0,480,360);
	var bitImage = Filters.laplace(imageData);

	var numAngleCells = 360;
	var rhoMax = Math.sqrt(drawingWidth * drawingWidth + drawingHeight * drawingHeight);

	var cosTable = new Array(numAngleCells);
	var sinTable = new Array(numAngleCells);
	for (var theta = 0, thetaIndex = 0; thetaIndex < numAngleCells; theta += Math.PI / numAngleCells, thetaIndex++) {
		cosTable[thetaIndex] = Math.cos(theta);
		sinTable[thetaIndex] = Math.sin(theta);
	}


	var imgData = bitImage.data;
	for (var i = 0; i < imgData.length;i += 4) {
    	var y = parseInt((i /4/drawingWidth), 10);
    	var x = (i /4) % drawingWidth;
    	if(imgData[i] == 255)houghAcc(x,y,cosTable,sinTable,rhoMax);
  	}
  	//ctx.putImageData(bitImage,0,0);
  	drawLine(bitImage,rhoMax,cosTable,sinTable);
  	document.getElementById("autoScale").style.display = 'none';
  	document.getElementById("manualScale").style.display = 'none';
  	document.getElementById("pixDistance").style.display = '';
  	document.getElementById("step_button5").style.display = '';

}

// About autoscale. Useless now. But I really want to keep this.
function houghAcc(x, y,cosTable,sinTable,rhoMax) {
  var rho;
  var thetaIndex = 0;
  var numAngleCells = 360;
  x -= drawingWidth / 2;
  y -= drawingHeight / 2;
  for (; thetaIndex < numAngleCells; thetaIndex++) {
    // rho = rhoMax + x * cosTable[thetaIndex] + y * sinTable[thetaIndex];
    rho = rhoMax + x * cosTable[thetaIndex] + y * sinTable[thetaIndex];
    // rho >>= 1;
    rho = Math.round(rho);
    if (accum[thetaIndex] == undefined) accum[thetaIndex] = [];
    if (accum[thetaIndex][rho] == undefined) {
      accum[thetaIndex][rho] = 1;
    } else {
      accum[thetaIndex][rho]++;
    }

  }
}

// About autoscale. Useless now. But I really want to keep this.
function drawLine(bitImage,rhoMax,cosTable,sinTable){
  // dLctx.clearRect(0,0,drawingWidth,drawingHeight);
  var maxPoint = 0;
  var maxRho ;
  var maxTheta;

  for (var i = 0; i < accum.length; i++) {
      for(var j = 0; j <= Math.ceil(rhoMax); j++){
        if(accum[i][j] == undefined) continue;
        else{
          if(accum[i][j] > maxPoint){
            maxTheta = i ;
            maxRho = j;
            maxPoint = accum[i][j] ;
          }
        }
      }
  }
  var minX = drawingWidth;
  var minY = drawingHeight;
  var maxX = 0;
  var maxY = 0;
  dLctx = firstFrame.getContext('2d');
  // var canvasData = dLctx.getImageData(0,0,drawingWidth,drawingHeight);
  var data = bitImage.data;
  // console.log(canvasData);
  if(maxTheta == 90){
    console.log(maxTheta);
  }else{
      // y = tan0 * x + c
      // maxRho *=2
    for(var x = 1; x < drawingWidth-1; x ++){

      var y = (maxRho - rhoMax - (x - drawingWidth / 2)*cosTable[maxTheta])/sinTable[maxTheta];
      y += drawingHeight / 2;
      if(y < 0) y =0;
      y = Math.round(y);
      var pos = (y * drawingWidth + x) *4 ;
      // var alter = pos - (drawingWidth*4);
      // var alter2 = pos + (drawingWidth *4);
      if(data[pos] == 255 ){
        if(x < minX){
          minX = x;
          minY = y;
        }
        if(x > maxX){
          maxX = x;
          maxY = y;
        }
      
      }

    }

    var x1 = minX;
    var y1 = minY;
    var x2 = maxX;
    var y2 = maxY;
    minX = x1*5/(8).toFixed(2)+x2*3/(8).toFixed(2);
    minY = y1*5/(8).toFixed(2)+y2*3/(8).toFixed(2);
    maxX = x2*5/(8).toFixed(2)+x1*3/(8).toFixed(2);
    maxY = y2*5/(8).toFixed(2)+y1*3/(8).toFixed(2);

    pixDistance = Math.sqrt(((maxX-minX)*(maxX-minX)) + ((maxY - minY)*(maxY-minY)))
    // console.log(minX);
    // console.log(minY);

    // console.log(maxX);
    // console.log(maxY);
    if(minX != drawingWidth && maxX != 0){
      dLctx.beginPath();
      dLctx.moveTo(minX,minY);
      dLctx.lineTo(maxX,maxY);
      dLctx.lineWidth = 3;
      dLctx.strokeStyle = '#d9e021';
      dLctx.stroke();        
    }
      
  }

};


// Get tracking box's coordinates and draw it.
function getCoordinates(event){
	if (firstFrame.getBoundingClientRect) {
	}else{
		alert("Fail!");
	}
	var rect = firstFrame.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
 	if (x < 480 && x > 0 && y > 0 && y < 360 ) {
 		position = [x,y];
 		position[0] = Math.round(position[0]);
 		position[1] = Math.round(position[1]);
 		//alert(position)
 		savePositionForback = [position[0],position[1]];
 		//alert("Get Pos: "+position);
 	};
    if (count === 0) {
    	drawBox();
    }else{
		redrawBox();
    }
	count++;

};

// Draw two scale box to set scale.
function getScaleBox1(event){
	if (firstFrame.getBoundingClientRect) {
	}else{
		alert("Fail!");
	}
	var rect = firstFrame.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
 	if (x < 480 && x > 0 && y > 0 && y < 360 ) {
 		position_box1 = [x,y];
 	};
    if (count_box1 === 0) {
    	var tempy = position_box1[1]-365;
		document.getElementById("scalebox1").style.marginTop=tempy+'px';
		document.getElementById("scalebox1").style.marginLeft=position_box1[0]+'px';
		document.getElementById("scalebox1").style.display='';	
    }else{
    	reloadImg();
		var tempy = position_box1[1]-365;
		document.getElementById("scalebox1").style.marginTop=tempy+'px';
		document.getElementById("scalebox1").style.marginLeft=position_box1[0]+'px';
		document.getElementById("scalebox1").style.display='';
    }
    firstFrame.removeEventListener("mousedown", getScaleBox1, false);
    firstFrame.addEventListener("mousedown", getScaleBox2, false);
	count_box1++;
}

function getScaleBox2(event){
	if (firstFrame.getBoundingClientRect) {
	}else{
		alert("Fail!");
	}
	var rect = firstFrame.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
 	if (x < 480 && x > 0 && y > 0 && y < 360 ) {
 		position_box2 = [x,y];
 	};
    if (count_box2 === 0) {
    	var tempy = position_box2[1]-365;
		document.getElementById("scalebox2").style.marginTop=tempy+'px';
		document.getElementById("scalebox2").style.marginLeft=position_box2[0]+'px';
		document.getElementById("scalebox2").style.display='';	
    }else{
    	reloadImg();
		var tempy = position_box2[1]-365;
		document.getElementById("scalebox2").style.marginTop=tempy+'px';
		document.getElementById("scalebox2").style.marginLeft=position_box2[0]+'px';
		document.getElementById("scalebox2").style.display='';
    }
    drawScaleLine();
	count_box2++;
}

// Important, refresh the video picture
function reloadImg(){
	var image = firstFrame.getContext("2d");
    image.drawImage(video,0,0,480,360);
}

function drawScaleLine(){
	var startx = position_box1[0]+scaleboxWidth/2;
	var starty = position_box1[1]+scaleboxHeight/2;
	var endx = position_box2[0]+scaleboxWidth/2;
	var endy = position_box2[1]+scaleboxHeight/2;
	pixDistance = Math.sqrt(((endx-startx)*(endx-startx)) + ((endy-starty)*(endy-starty)))
	var c=document.getElementById("firstFrame");
	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(startx, starty);
	ctx.lineTo(endx,endy);
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#d9e021";
	ctx.stroke();

	firstFrame.removeEventListener("mousedown", getScaleBox1, false);
	firstFrame.removeEventListener("mousedown", getScaleBox2, false);
}

function drawBox(){
	var tempy = position[1]-365;
	document.getElementById("trackingbox").style.marginTop=tempy+'px';
	document.getElementById("trackingbox").style.marginLeft=position[0]+'px';
	document.getElementById("trackingbox").style.display='';
};

function redrawBox(){
	reloadImg();
	// readData();
    drawBox();	
}

// These two are useless for now, but probably in the future version
function enlargeBox(){
	if(position[0] == -1){
		return;
	}
	if (count != 0 && (boxHeight+position[1])< 359 && (boxWidth + position[0])<479) {
		boxHeight++;
		boxWidth++;
		redrawBox();
	};
	
}

function reduceBox(){
	if(position[0] == -1){
		return;
	}
	if (count != 0 && boxHeight>2 && boxWidth > 2) {
		boxHeight--;
		boxWidth--;
		redrawBox()
	};
	
}

// startTrack() -> tracking() -> compareImg()(loop)
function startTrack(){

	document.getElementById("step_button8").style.display = '';
	document.getElementById("step_button9").style.display = 'none';
	document.getElementById("step_button6").style.display = 'none';
	document.getElementById("step_button7").style.display = 'none';
	stepNow = 5;
	position = [savePositionForback[0],savePositionForback[1]];
	saveMove = [];
	frameSave = [];
	frameNum = 0;

	if(position[0] == -1){
		return;
	}
	firstFrame.removeEventListener("mousedown", getCoordinates, false);
	var save = [position[0],position[1],startTime];
	original_x = position[0]+boxWidth/2;
	original_y = position[1]+boxHeight/2;
	saveMove.push(save);
	compareCount = 0;

	initialBackground();
	readData();
	tracking();

}

function selectTemplate(){

	var startPointX1 = Math.max(1,(position[0] - range[0]));
	var startPointY1 = Math.max(1,(position[1] -range[1]));
	var endPointX2 = Math.min((480 - (range[0]+boxWidth)),(position[0] + boxWidth + range[0]));
	var endPointY2 = Math.min((360 - (range[1]+boxHeight)),(position[1]+ boxHeight + range[1]));
	// var endPointX2 = Math.min((480 - (range[0]+boxWidth)),(position[0] + range[0]));
	// var endPointY2 = Math.min((360 - (range[1]+boxHeight)),(position[1] + range[1]));
	var rangeWidth = endPointX2 - startPointX1;
	var rangeHeight = endPointY2 - startPointY1;

	templateRange = [startPointX1,startPointY1, rangeWidth, rangeHeight];

}

function roundPosition(){
	position[1] = Math.round(position[1]);
}

function readData(){

	var ctx = firstFrame.getContext("2d");
	image1 = ctx.getImageData(position[0],position[1],boxWidth,boxHeight);
	var pix = 1;
	var oridata = 0;
	position[1] = Math.round(position[1]);
	for (var i = 0; i < boxWidth; i++) {
		image1Trans[i]=[];
		for (var j = 0; j < boxHeight; j++) {
			image1Trans[i][j] =0;
		};
	};

	for (var j = 0; j < boxHeight; j++) {
		for (var i = 0; i < boxWidth; i++) {
			//image1Trans[i][j] = image1.data[pix];
			oridata = image1.data[pix];
			image1Trans[i][j] = oridata - background[480*(position[1]+j)+i];
			if(image1Trans[i][j] < 20){
				image1Trans[i][j] = 0;
			}
			pix += 4;
		};
	};
}

function initialBackground(){
	var ctx = firstFrame.getContext("2d");
	for(var i = 0; i < M; i++){
		video.currentTime = (Math.round((0.05*i+startTime)*1000))/1000;
		frameSave.push(ctx.getImageData(0, 0, 480, 360).data);
	}
	for(var i = 1; i < frameSave[0].length; i += 4){
		var temp = 0;
		for(var j = 0; j < M; j++){
			temp += frameSave[j][i];
			temp /= M;
		}
		background.push(temp);
	}
	video.currentTime = startTime;
}

function updateBackground(){
	position[1] = Math.round(position[1]);
	var localsave = video.currentTime;
	video.currentTime = (Math.round((video.currentTime - 0.05)*1000))/1000;
	var ctx = firstFrame.getContext("2d");

	frameSave.shift();
	frameSave.push(ctx.getImageData(0, 0, 480, 360).data);

	background = [];

	for(var i = 1; i < frameSave[0].length; i += 4){
		var temp = 0;
		for(var j = 0; j < M; j++){
			temp += frameSave[j][i];
			temp /= M;
		}
		background.push(temp);
	}
	video.currentTime = localsave;
}

function tracking(){
	myVar = setTimeout(function(){ compareImg() }, 50);
}

function compareImg(){
	selectTemplate();
	video.currentTime = (Math.round((0.05+video.currentTime)*1000))/1000;
	frameNum += 1;
	timeSave = video.currentTime;
	// alert(video.currentTime);
	// video.currentTime = Math.round(1/30+video.currentTime);
	reloadImg();
	if(video.currentTime >= endTime){
		window.clearInterval(myVar);
		drawAllDots();
		return;
	}

	if (position[0] == -1) {
		return;
	};

	//Get Background
	if(frameNum <= M+1){
		//do nothing
	}else{
		updateBackground();
	}
	position[1] = Math.round(position[1]);
	
	var	maxerror = boxWidth*boxHeight*1000;
	var error = 0;
	var ctx = firstFrame.getContext("2d");

	var imageData = ctx.getImageData(templateRange[0],templateRange[1],templateRange[2],templateRange[3]);
	var pix = 1;

	for (var i = 0; i < templateRange[2]; i++) {
		image2Trans[i] = [];
		for (var j = 0; j < templateRange[3]; j++) {
			image2Trans[i][j] = 0;
		};
	};

	var oridata = 0;
	for (var j = 0; j < templateRange[3]; j++) {

		for (var i = 0; i < templateRange[2]; i++) {
			//image2Trans[i][j] = imageData.data[pix];
			oridata = imageData.data[pix];
			image2Trans[i][j] = oridata - background[480*(position[1]+j)+i];
			if(image2Trans[i][j] < 20){
				image2Trans[i][j] = 0;
			}
			pix += 4;
		};
	};
	var moveX;
	var moveY;
	// for (var i = 0; i <= (templateRange[2]-boxWidth); i++) {
	// 	for (var j = 0; j <= (templateRange[3] - boxHeight) ;j++){
	for (var i = 0; i <= (templateRange[2]-boxWidth); i++) {
		for (var j = 0; j <= (templateRange[3]-boxHeight) ;j++){
			error1 = calculate(i,j);

			var previous_x = saveMove[saveMove.length-1][0];
			var previous_y = saveMove[saveMove.length-1][1];
			var current_x = templateRange[0] + i;
			var current_y = templateRange[1] + j;
			var error2 = Math.sqrt((previous_x-current_x)*(previous_x-current_x)+(previous_y-current_y)*(previous_y-current_y));

			var error3;
			if(compareCount < 3){
				error3 = 0;
			}
			else{
				var a1 = saveMove[saveMove.length-2][0];
				var a2 = saveMove[saveMove.length-2][1];
				var b1 = saveMove[saveMove.length-1][0];
				var b2 = saveMove[saveMove.length-1][1];
				var c1 = templateRange[0] + i;
				var c2 = templateRange[1] + j;
				var component1 = ((a1-b1)-(b1-c1))*((a1-b1)-(b1-c1));
				var component2 = ((a2-b2)-(b2-c2))*((a2-b2)-(b2-c2));
				error3 = Math.sqrt(component1+component2);
			}

			error = (0.2*error1 + 75*error2 + 35*error3)/100;
			if (error< maxerror) {
				position[0] = templateRange[0] + i;
				position[1] = templateRange[1] + j;
				moveX = i;
				moveY = j;
				maxerror = error;
			};
		};
	};
	var save = [position[0],position[1],video.currentTime];
	saveMove.push(save);
	var only_position = [position[0]+boxWidth/2, position[1]+boxHeight/2];
	position_list.push(only_position);

	var temp = [];
	for (var i = 0; i < boxWidth; i++) {
		temp[i] = [];
		for (var j = 0; j < boxHeight; j++) {
			temp[i][j] = image2Trans[i+moveX][j+moveY];
		};
	};
	//testColorSave.push(ctx.getImageData(0, 0, 480, 360).data);
	image1Trans = temp;
	drawBox();
	drawAllDots();
	growList(only_position);
	setTimeout(arguments.callee, 50);
	compareCount += 1;
}


function drawAllDots(){
	var ctx = firstFrame.getContext("2d");
	ctx.beginPath();
	ctx.strokeStyle = "#28abe3";
	var i;
	for(i = 0; i < position_list.length-1; i++){
		// ctx.fillRect(position_list[i][0], position_list[i][1], 2, 2);
		ctx.moveTo(position_list[i][0], position_list[i][1]);
		ctx.lineTo(position_list[i+1][0], position_list[i+1][1]);
		ctx.lineWidth = 2;
	}
	ctx.stroke();
}

function growList(currentPosition){
	diffx_list.push((currentPosition[0]-original_x)*pixDistance);
	diffy_list.push((original_y-currentPosition[1])*pixDistance);
	time_list.push(video.currentTime * FPS / frameRate);
}

function calculate(i,j){
	var error = 0;
	for (var x = 0;x< boxWidth;x++) {
		for (var y = 0; y < boxHeight; y++) {
			error += Math.abs(image1Trans[x][y] - image2Trans[x+i][y+j]);
		};
	};
	return error;
}

function showResult(){
	controlIcon(6);
	var minValue = 100000;
	var maxValue = 0;
	var minTime = 0;
	var maxTime = 0;

	for(var i = 1; i<=6; i++){
		if(i != 6){
			document.getElementById("titletext_"+i).style.display = 'none';
		}
		else{
			document.getElementById("titletext_6").style.display = '';
		}
	}

	for (var i = 0; i < saveMove.length; i++) {
		if(saveMove[i][0] < minValue){
			minValue = saveMove[i][0];
			minTime = saveMove[i][2];
		}
		if(saveMove[i][0] > maxValue){
			maxValue = saveMove[i][0];
			maxTime = saveMove[i][2];
		}
	}
	var maxAmplitude = maxValue - minValue;
	var timeRate = Math.abs(maxTime - minTime);
	//20 is defined
	var actualTime = timeRate * FPS /frameRate;
	firstFrame.style.display = "";
	
	document.getElementById("result_report").style.display = "";

	if(pixDistance == 0){
		
		var ratePixel = (maxAmplitude/ actualTime.toFixed(2)).toFixed(4);
		var amplitudePix = "Max Amplitude: " + maxAmplitude + " pixel";

		var ratePixel = "Rate: " + ratePixel + " pixel/min";
		document.getElementById("result_amplitude").innerHTML = amplitudePix;
		document.getElementById("result_rate").innerHTML = ratePixel;
		//alert();
		// alert(ratePixel);
	}else{
		amplitudeDis = (maxAmplitude * pixDistance).toFixed(4);
		var amplitudeDisStr = "Max Amplitude: " + amplitudeDis + " mm";
		rateDis = (amplitudeDis/ actualTime.toFixed(2)).toFixed(4);
		var rateDisStr = "Rate: " + rateDis + " mm/min";
		document.getElementById("result_amplitude").innerHTML = amplitudeDisStr;
		document.getElementById("result_rate").innerHTML = rateDisStr;
		// alert(rateDisStr);
		// alert(amplitudeDisStr);
	}

	drawCharts();

}

function closeResultPage(){
	document.getElementById("result_report").style.display = "none";
}

function takeScreenShot(){
	navigator.screenshot.save(function(error,res){
		if(error){
			console.error(error);
		}else{
			console.log('ok',res.filePath);
			window.cordova.plugins.imagesaver.saveImageToGallery(res.filePath, shotSaveSuccess, shotSaveFail);
		}
	});
}

function shotSaveSuccess(message){
	alert("Screen Shot successfully saved!");
	console.log(message);
}
function shotSaveFail(message){
	alert("Something Wrong!");
	console.log(message);
}

function drawCharts(){
	// google.charts.load('current', {'packages':['corechart']});
 	// google.charts.setOnLoadCallback(drawXChart);
 	var i;
 	for(i = 0; i < time_list.length; i++){
 		original_time[i] = time_list[i];
 	}
 	var stepSize = parseInt(time_list.length / 10);
 	for(i = 0; i < time_list.length; i++){
 		if(i % stepSize != 0){
 			time_list[i] = '';
 		}
 		else{
 			time_list[i] = time_list[i].toFixed(0);
 		}
 	}
 	drawXChart();
 	drawYChart();
}

function drawXChart(){

 	var screenwidth = screen.width;
 	var data = {
  		labels: time_list,
  		series: [
    		diffx_list
  		]
	};
	var options ={
		chartPadding: {
			left:15
		},
		width: screenwidth*0.92,
		height: screenwidth*0.5625,
		showPoint: false,
		plugins: [
                    Chartist.plugins.ctAxisTitle({
                        axisX: {
                            axisTitle: 'Time (mins)',
                            axisClass: 'ct-axis-title',
                            offset: {
                                x: 0,
                                y: 30
                            },
                            textAnchor: 'middle'
                        },
                        axisY: {
                            axisTitle: 'Distance(mm)',
                            axisClass: 'ct-axis-title',
                            offset: {
                                x: 0,
                                y: -2
                            },
                            flipTitle: false,
                            textAnchor: 'middle'
                        }
                    })
                ]
	}
	new Chartist.Line('.ct-chart_x', data, options);
}
function drawYChart(){
	var screenwidth = screen.width;
 	var data = {
  		labels: time_list,
  		series: [
    		diffy_list
  		]
	};
	var options ={
		chartPadding: {
			left:15
		},
		width: screenwidth*0.92,
		height: screenwidth*0.5625,
		showPoint: false,
		plugins: [
                    Chartist.plugins.ctAxisTitle({
                        axisX: {
                            axisTitle: 'Time (mins)',
                            axisClass: 'ct-axis-title',
                            offset: {
                                x: 0,
                                y: 30
                            },
                            textAnchor: 'middle'
                        },
                        axisY: {
                            axisTitle: 'Distance(mm)',
                            axisClass: 'ct-axis-title',
                            offset: {
                                x: 0,
                                y: -2
                            },
                            flipTitle: false,
                            textAnchor: 'middle'
                        }
                    })
                ]
	}
	new Chartist.Line('.ct-chart_y', data, options);
	// alert("FINISH");
}

function saveTrackingData(){
	var dataFileName = document.getElementById("saveDataName").value;
	resultStr = "Circumnutation\r\nMax Amplitude(mm),"+amplitudeDis+"\r\nRate(mm/s),"+rateDis+"\r\n";
	resultStr = resultStr+"Time(min),X-distance(mm),Y-distance(mm)\r\n";
	var i;
	for(i = 0;i < original_time.length;i++){
		if(i != original_time.length - 1){
			resultStr = resultStr+original_time[i]+','+diffx_list[i]+','+diffy_list[i]+'\r\n';
		}
		else{
			resultStr = resultStr+original_time[i]+','+diffx_list[i]+','+diffy_list[i];
		}
	}

	for(var i = 0; i < 15; i++){
		//alert(testColorSave.length);
		for(var j = 0; j < testColorSave[i].length; j++){
			testColorStr += testColorSave[i][j]+",";
		}
		testColorStr += "\n"
	}
	createDataFile(dataFileName+".csv");
	//createTestDataFile(dataFileName+"_color.txt")
}

// These two test function is just for test.
function createTestDataFile(path){
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                    	var realPath = "DataSaves/"+path;
                        fileSystem.root.getFile(realPath, { create: true, exclusive:true }, function(fileEntry){
                        	//fileEntry.remove(function() {alert('File removed.');}, dataFileError);
                            //alert("Create Success!");
                            writetoTestDataFile(realPath);
                        }, dataFileError);
                        
                    }, dataFileError);
            }
function writetoTestDataFile(path){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                        fileSystem.root.getFile(path, { create: false }, function(fileEntry){
                            fileEntry.createWriter(function(fileWriter) {
                                fileWriter.onwriteend = function(e) {
                                    alert("Test Save Success!");
                                };

                                fileWriter.onerror = function(e) {
                                    alert('Test Write failed: ' + e.toString());
                                };
                                var blob = new Blob([testColorStr], {type: 'text/plain'});
                                fileWriter.write(blob);
                            });
                        }, dataFileError);
                        
                    }, dataFileError);
}

// Save data to cellphone
function createDataFile(path){
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, size, function(fileSystem){
                    	var realPath = "DataSaves/"+path;
                        fileSystem.root.getFile(realPath, { create: true, exclusive:true }, function(fileEntry){
                        	//fileEntry.remove(function() {alert('File removed.');}, dataFileError);
                            //alert("Create Success!");
                            writetoDataFile(realPath);
                        }, dataFileError);
                        
                    }, dataFileError);
            }
function writetoDataFile(path){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, size, function(fileSystem){
                        fileSystem.root.getFile(path, { create: false }, function(fileEntry){
                            fileEntry.createWriter(function(fileWriter) {
                                fileWriter.onwriteend = function(e) {
                                    alert("Save Success!");
                                };

                                fileWriter.onerror = function(e) {
                                    alert('Write failed: ' + e.toString());
                                };
                                var blob = new Blob([resultStr], {type: 'text/plain'});
                                fileWriter.write(blob);
                            });
                        }, dataFileError);
                        
                    }, dataFileError);
}
function dataFileError(error){
	if(error.code == 12){
		alert("File Already Exists");
	}
	else{
		alert("ERROR: "+error.code);
	}
}

function uploadDatatoDatabase(){

	var dataToSend = {
		user: "Jiazhen",
		researcher: "Al",
		arabiposisAccession: "AABB",
		gene: "SomeGene",
		geneID: "123456",
		movement: "Tropism",
		rate: 1.5,
		amplitude: 5.5,
		angle: 12.6,
		video: "Video01",
		graph: "some graph",
		trace: "trace"
	}

	var test = $.ajax({
		type: 'POST',
		url: "http://www.planttracer.com/api/index.php",
		dataType: 'json',
		data: {src: "saveData", data: dataToSend},
		success: function(replyData){alert(replyData);}
	});
	test.error(function(xhr, status, error) {
		//alert(xhr.responseText);
		alert(error);
		alert(status);
		var err = JSON.parse(xhr.responseText);
	});
}

