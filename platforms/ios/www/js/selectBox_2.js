
var video = document.getElementById("video1");
var firstFrame = document.getElementById("firstFrame");
var firstFrame;
// framePlay.crossOrigin = 'Anonymous';
var boxWidth = 20;
var boxHeight = 20;
var scaleboxWidth = 10;
var scaleboxHeight = 10;
var position = [-1,-1];
var position_box1 = [0, 0];
var position_box2 = [0, 0];
var position_list = [];
var original_x = 0;
var original_y = 0;
var diffx_list = [];
var diffy_list = [];
var time_list = [];
var startTime = 0;
var endTime = 0;
var count;
var count_box1;
var count_box2;
var range = [10,10];
var image1;
var image2;
var templateRange;
var image1Trans = [];
var image2Trans = [];
var judge = 0;
var stepNow = 0;
var loaded = false;
var frameRate = 0;
var myVar;
var pixDistance = 0;
var drawingWidth = 480;
var drawingHeight = 360;
var accum = new Array(360);
var initialState;
var inflectionPos = [-1,-1];
var inflectionCount = 0;
var saveMove = [];
var FPS = 20;

var amplitudeDis;
var rateDis;
var original_time = [];
var resultStr;
var lock = 1;
var compareCount = 0;
var angle;
var replayVar;
var savePositionForback = [-1, -1];

function selectBox(){
	count = 0;
	reloadImg();
	firstFrame.addEventListener("mousedown", getCoordinates, false);
	
};

function selectScaleBox(label){
	firstFrame.removeEventListener("mousedown", getScaleBox2, false);
	count_box1 = 0;
	reloadImg();
	firstFrame.addEventListener("mousedown", getScaleBox1, false)
}

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
	position = [-1,-1];
	image1Trans = [];
	image2Trans = [];
	templateRange = null;
	judge = 0;
	image1 = null;
	image2 = null;
	window.clearInterval(myVar);
	var startButton = document.getElementById("startButton");
	var enlargeBoxButton = document.getElementById("enlargeBoxButton");
	var reduceBoxButton = document.getElementById("reduceBoxButton");
	var playButton = document.getElementById("playButton");
	var selectButton = document.getElementById("selectButton");
	var cancelButton = document.getElementById("cancelButton");
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
	//setButtonAnimationForGravi();
}

function setLoaded(){
	loaded = true;
}

function stateControl(statusNum){
	var state = initialState.charAt(statusNum+1);
	var name = "hint_";
	var suffix = statusNum +1;
	name += suffix;
	if(state == '1'){
		document.getElementById(name).style.display = '';
	}else{
		document.getElementById(name).style.display = 'none';
	}
}

function initial(statusNum){
	// alert("start")
	if(statusNum == 0){

		video.src = "";
		startTime = 0;

		position = [-1,-1];
		loaded = false;
		
		stepNow = 0;
		controlPanel(1);
		//alert("initial "+initialState);
		controlIcon(statusNum);
		stateControl(statusNum);
		for(var i = 1; i<=8; i++){
			if(i != 1){
				document.getElementById("titletext_"+i).style.display = 'none';
			}
			else{
				document.getElementById("titletext_1").style.display = '';
			}
		}

		//document.write("<script language='javascript' src='filters.js'></script>");

	}else if(statusNum === 1){
		video.pause();

		console.log(video.src);

		if(!loaded){
			alert("Please select a video.");
			return;
		}
		document.getElementById("reupload_button").onclick = function(){ return; };
		controlPanel(2);

		//alert(1);
		stepNow = 1;
		startTime = 0;
		endTime = video.duration;
		video.style.display = "none";
		firstFrame.style.display = "";
		reloadImg();
		document.getElementById("startTime").min = "0";
		document.getElementById("endTime").min = "0";
		document.getElementById("startTime").max = video.duration;
		document.getElementById("endTime").max = video.duration;
		document.getElementById("endTime").value = video.duration;
		document.getElementById("startTime").value = 0;
		document.getElementById("startTime").step = "0.05";
		document.getElementById("endTime").step = "0.05";

		stateControl(statusNum);
		// document.getElementById("titletext").innerHTML = "EDIT VIDEO LENGTH";
		for(var i = 1; i<=8; i++){
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
		//alert(statusNum);
		document.getElementById("scalebox1").style.display = "none";
		document.getElementById("scalebox2").style.display = "none";
		video.currentTime = startTime;
		reloadImg();
		if(endTime <= startTime){
			alert("Please select correct time!");
			return;
		}
		stepNow = 2;
		controlPanel(3);
		stateControl(statusNum);
		// document.getElementById("titletext").innerHTML = "FRAME RATE";
		for(var i = 1; i<=8; i++){
			if(i != 3){
				document.getElementById("titletext_"+i).style.display = 'none';
			}
			else{
				document.getElementById("titletext_3").style.display = '';
			}
		}
		// if(endTime <= startTime){
		// 	alert("Please select correct time!");
		// }
		video.currentTime = startTime;
		reloadImg();

		controlIcon(statusNum);
		closeThisHint(statusNum);


	}else if(statusNum === 3){
		var inputRate = document.getElementById("frameRate").value;

		if(!isNaN( inputRate ) && inputRate > 0){
			frameRate = inputRate;
			// alert(frameRate);
		}else{
			alert("Please input correct number!");
			return;
		}

		stepNow = 3;
		controlPanel(4);
		document.getElementById("scalebox1").style.display = "none";
		document.getElementById("scalebox2").style.display = "none";
		document.getElementById("scaleBox1").style.display = '';
		document.getElementById("scaleBox2").style.display = '';
		document.getElementById("internalNextBox").style.display = '';
		document.getElementById("pixDistance").style.display='none';
		document.getElementById("step_button5").style.display='none';

		document.getElementById("trackingbox").style.display='none';
		document.getElementById("inflectionbox").style.display='none';

		firstFrame.removeEventListener("mousedown", getCoordinates, false);
		stateControl(statusNum);
		// document.getElementById("titletext").innerHTML = "SETTING THE SCALE";
		for(var i = 1; i<=8; i++){
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
		document.getElementById("scalebox1").style.display = "none";
		document.getElementById("scalebox2").style.display = "none";
		stepNow = 4;
		var dis = document.getElementById("pixDistance");
		if(dis.value == ""||dis.value == null){
			//alert("no data ");
			pixDistance = 0;
		}else if(!isNaN( dis.value ) && dis.value > 0){
			pixDistance = dis.value/pixDistance.toFixed(2);
			//alert("correct");
		}
		reloadImg();

		controlPanel(5);
		stateControl(statusNum);
		// document.getElementById("titletext").innerHTML = "APEX BOX";
		for(var i = 1; i<=8; i++){
			if(i != 5){
				document.getElementById("titletext_"+i).style.display = 'none';
			}
			else{
				document.getElementById("titletext_5").style.display = '';
			}
		}
		firstFrame.removeEventListener("mousedown", getInflectCoordinates, false);
		controlIcon(statusNum);
		closeThisHint(statusNum);

	}else if(statusNum == 5){
		//selectBox();
		
		if(position[0] < 0){
			alert("Please select a box!");
			return;
		}
		stepNow = 5;
		firstFrame.removeEventListener("mousedown", getCoordinates, false);
		controlPanel(6);
		stateControl(statusNum);
		// document.getElementById("titletext").innerHTML = "CREATING INFLCETION POINTS";
		for(var i = 1; i<=8; i++){
			if(i != 6){
				document.getElementById("titletext_"+i).style.display = 'none';
			}
			else{
				document.getElementById("titletext_6").style.display = '';
			}
		}
		document.getElementById("inflectionbox").style.display = 'none';
		controlIcon(statusNum);
		closeThisHint(statusNum);

	}else if(statusNum == 6){
		video.currentTime = startTime;
		reloadImg();
		if(inflectionPos[0] < 0){
			alert("Please select inflection box!");
			return;
		}
		document.getElementById("step_button10").style.display = '';
		document.getElementById("step_button11").style.display = '';
		document.getElementById("step_button12").style.display = "none";
		document.getElementById("step_button13").style.display = "none";
		document.getElementById("result_report").style.display = "none";
		position = [savePositionForback[0],savePositionForback[1]];
		drawBox();

		stepNow = 6;

		firstFrame.removeEventListener("mousedown", getInflectCoordinates, false);
		controlPanel(7);
		stateControl(statusNum);
		// document.getElementById("titletext").innerHTML = "TRACE AXIS";
		for(var i = 1; i<=8; i++){
			if(i != 7){
				document.getElementById("titletext_"+i).style.display = 'none';
			}
			else{
				document.getElementById("titletext_7").style.display = '';
			}
		}

		controlIcon(statusNum);
		closeThisHint(statusNum);
	}

}

function closeThisHint(num){
	if(num > 7){
		return;
	}
	var hint = document.getElementById("hint_"+num);
	if(hint.style.display == ''){
		hint.style.display = "none";
	}
}

function controlIcon(num){
	for(var i = 1; i <= 6; i++){
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
	// alert(panelIDShow);
	var panelShow = document.getElementById(panelIDShow);
	panelShow.style.display = 'inline';
	console.log(num);
	for(var i = 1; i < 8; i++){
		if(i == num) continue;
		// alert(num);
		var panelIDNow = panelID + i;
		// alert(panelIDNow);
		var panel = document.getElementById(panelIDNow);
		panel.style.display = 'none';

	}
}

function getStep(){
	return stepNow;
}

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

function selectStart() {
	var time = document.getElementById("startTime").value;
	// alert(time);
	video.currentTime = time;
	startTime = time;
	reloadImg();
}

function endStart() {
	var time = document.getElementById("endTime").value;
	// alert(time);
	video.currentTime = time;
	endTime = time;
	reloadImg();
}

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

function controlManualPanel(){
	document.getElementById("manualScale").style.display = "none";
	document.getElementById("autoScale").style.display = "none";
	document.getElementById("pixDistance").style.display = "none";
	document.getElementById("step_button5").style.display = "none";
	document.getElementById("scaleBox1").style.display = "";
	document.getElementById("scaleBox2").style.display = "";
	document.getElementById("internalNextBox").style.display = "";
}

function controlInternalNext(){
	document.getElementById("scaleBox1").style.display = "none";
	document.getElementById("scaleBox2").style.display = "none";
	document.getElementById("internalNextBox").style.display = "none";
	document.getElementById("pixDistance").style.display = '';
	document.getElementById("step_button5").style.display = '';
}

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
  // console.log(maxTheta);
  // console.log(maxRho);
  // console.log(maxPoint);
  // alert(maxRho);
  // alert(maxTheta);
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
      // var temp = x * Math.cos(maxTheta * Math.PI /numAngleCells);
          // rho = rhoMax + x * cosTable[thetaIndex] + y * sinTable[thetaIndex];

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

function inflectionBox(){
	inflectionCount = 0;
	firstFrame.addEventListener("mousedown", getInflectCoordinates, false);
	inflectionCount++;

}

function getInflectCoordinates(event){
	var rect = firstFrame.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
 	
 	if (x < 480 && x > 0 && y > 0 && y < 360 ) {
 		inflectionPos = [x,y];
 	};

 	if(inflectionCount == 0){
 		drawInflectionBox();
 	}else{
 		redrawBox();
 		drawInflectionBox();
 	}

}

function replayVideo(){
	window.clearInterval(replayVar);
	video.currentTime = startTime;
	reloadImg();
	replayVar = setInterval(function(){
		video.currentTime = (video.currentTime+0.05).toFixed(2);
		reloadImg();
		if(video.currentTime >= endTime){
			window.clearInterval(replayVar);
			video.currentTime = startTime;
			reloadImg();
			return;
		}
	}, 50);
}

function drawInflectionBox(){
	var tempy = inflectionPos[1]-365;
	document.getElementById("inflectionbox").style.marginTop=tempy+'px';
	document.getElementById("inflectionbox").style.marginLeft=inflectionPos[0]+'px';
	document.getElementById("inflectionbox").style.display='';

}

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
 		savePositionForback = [position[0], position[1]];
 	};

    if (count === 0) {
    	drawBox();
    }else{
		redrawBox();
    }

	count++;
    
};

function drawBoxLine(){
	var ctx = firstFrame.getContext("2d");
	ctx.beginPath();
    ctx.moveTo(position[0]+(boxWidth/2),position[1]+(boxHeight/2));
    ctx.lineTo(inflectionPos[0]+(boxWidth/2),inflectionPos[1]+(boxHeight/2));
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d9e021';
    ctx.stroke();

}

function reloadImg(){
	var image = firstFrame.getContext("2d");
	// image.crossOrigin = 'anonymous';
    image.drawImage(video,0,0,480,360);
}


function drawBox(){
	if(judge ==0){readData();}
	
	// var ctx = firstFrame.getContext("2d");
	// ctx.beginPath();
	// ctx.lineWidth="1";
	// ctx.strokeStyle="red";
	// ctx.rect(position[0],position[1],boxWidth,boxHeight);
	// ctx.stroke();
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

function startTrack(){

	document.getElementById("step_button13").style.display = 'none';
	document.getElementById("step_button12").style.display = '';
	document.getElementById("step_button10").style.display = 'none';
	document.getElementById("step_button11").style.display = 'none';
	stepNow = 7;
	controlIcon(7);
	time_list = [];
	diffy_list = [];
	diffx_list = [];
	position_list = [];
	position = [savePositionForback[0],savePositionForback[1]];

	if(position[0] == -1){
		return;
	}
	var save = [position[0],position[1],startTime];
	original_x = position[0]+boxWidth/2;
	original_y = position[1]+boxHeight/2;
	saveMove.push(save);
	//firstFrame.removeEventListener("mousedown", getCoordinates, false);
	// initial();
	judge = 1;
	compareCount = 0;
	tracking();

}

function selectTemplate(){

	var startPointX1 = Math.max(1,(position[0] - range[0]));
	var startPointY1 = Math.max(1,(position[1] -range[1]));
	var endPointX2 = Math.min((480 - (range[0]+boxWidth)),(position[0] + boxWidth + range[0]));
	var endPointY2 = Math.min((360 - (range[1]+boxHeight)),(position[1]+ boxHeight + range[1]));
	var rangeWidth = endPointX2 - startPointX1;
	var rangeHeight = endPointY2 - startPointY1;

	templateRange = [startPointX1,startPointY1,rangeWidth,rangeHeight];

}

function readData(){

	var ctx = firstFrame.getContext("2d");
	image1 = ctx.getImageData(position[0],position[1],boxWidth,boxHeight);
	var pix = 1;

	for (var i = 0; i < boxWidth; i++) {
		image1Trans[i]=[];
		for (var j = 0; j < boxHeight; j++) {
			image1Trans[i][j] =0;
		};
	};

	for (var j = 0; j < boxHeight; j++) {
		for (var i = 0; i < boxWidth; i++) {
			image1Trans[i][j] =image1.data[pix];
			pix += 4;
		};
	};

}

function tracking(){

	// myVar = setInterval(function(){ compareImg() }, 50);
	// // video.addEventListener('play',function() {interval=window.setInterval(compareImg,25);},false);
	// video.addEventListener('pause',function() {window.clearInterval(myVar);},false);
	// video.addEventListener('ended',function() {window.clearInterval(myVar);},false);
	myVar = setInterval(function(){ compareImg() }, 50);



}

function compareImg(){
	selectTemplate();

	video.currentTime = (Math.round((0.05+video.currentTime)*1000))/1000;
	reloadImg();
	if(video.currentTime >= endTime){
		window.clearInterval(myVar);
		drawAllDots();
		drawBoxLine();
		return;
	}

	if (position[0] == -1) {
		return;
	};
	
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


	for (var j = 0; j < templateRange[3]; j++) {

		for (var i = 0; i < templateRange[2]; i++) {
			image2Trans[i][j] = imageData.data[pix];
			pix +=4;
		};
	};
	var moveX;
	var moveY;
	for (var i = 0; i <= (templateRange[2]-boxWidth); i++) {
		for (var j = 0; j <= (templateRange[3] - boxHeight) ;j++){
			// var imageData = ctx.getImageData((templateRange[0] + i),(templateRange[1] + j),boxWidth,boxHeight);

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
			if (error< maxerror && error !=0) {
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
	
	image1Trans = temp;
	// selectTemplate();
	drawBox();
	drawInflectionBox();
	drawBoxLine();
	drawAllDots();
	growList(only_position);
	// video.pause();
	compareCount += 1;
}

function drawAllDots(){
	var ctx = firstFrame.getContext("2d");
	ctx.beginPath();
	ctx.strokeStyle = "#28abe3";
	var i;
	for(i = 0; i < position_list.length-1; i++){
		ctx.moveTo(position_list[i][0], position_list[i][1]);
		ctx.lineTo(position_list[i+1][0], position_list[i+1][1]);
		ctx.lineWidth = 2;
	}
	ctx.stroke();
}

function growList(currentPosition){
	diffx_list.push((currentPosition[0]-original_x)*pixDistance);
	diffy_list.push((original_y-currentPosition[1])*pixDistance);
	time_list.push(video.currentTime*FPS / frameRate);
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
	var minValue = 100000;
	var maxValue = 0;
	var minXValue = 0;
	var maxXValue = 0;
	var minTime = 0;
	var maxTime = 0;

	for(var i = 1; i<=8; i++){
		if(i != 8){
			document.getElementById("titletext_"+i).style.display = 'none';
		}
		else{
			document.getElementById("titletext_8").style.display = '';
		}
	}

	for (var i = 0; i < saveMove.length; i++) {
		if(saveMove[i][1] < minValue){
			minValue = saveMove[i][1];
			minXValue = saveMove[i][0];
			minTime = saveMove[i][2];

		}
		if(saveMove[i][1] > maxValue){
			maxValue = saveMove[i][1];
			maxXValue = saveMove[i][0];
			maxTime = saveMove[i][2];
		}
	}

	var maxAmplitude = maxValue - minValue;
	var timeRate = Math.abs(maxTime - minTime);
	//20 is defined
	var actualTime = timeRate * FPS /frameRate;

	var b = Math.sqrt((minXValue - inflectionPos[0])*(minXValue - inflectionPos[0])+ (minValue - inflectionPos[1])*(minValue - inflectionPos[1]));
	var c = Math.sqrt((maxXValue - inflectionPos[0])*(maxXValue - inflectionPos[0])+ (maxValue - inflectionPos[1])*(maxValue - inflectionPos[1]));
	var a = Math.sqrt((maxXValue - minXValue)*(maxXValue - minXValue)+  (maxValue - minValue)* (maxValue - minValue));

	var cosAngle = (b*b + c*c - a*a)/2/b/c;
	//alert(cosAngle);
	angle = (Math.acos(cosAngle) * 180 / Math.PI).toFixed(4);
	var angleStr = "Angle: " + angle + " degree";
	firstFrame.style.display = "";
	
	document.getElementById("result_report").style.display = "";
	document.getElementById("result_angle").innerHTML = angleStr;
	if(pixDistance == 0){
		
		var ratePixel = (maxAmplitude/ actualTime.toFixed(2)).toFixed(4);
		var amplitudePix = "Max Amplitude: " + maxAmplitude + " pixel";

		var ratePixel = "Rate: " + ratePixel + " pixel/min";
		
		document.getElementById("result_amplitude").innerHTML = amplitudePix;
		document.getElementById("result_rate").innerHTML = ratePixel;

		
		// alert(angleStr);
		//alert();
		//alert(ratePixel);


	}else{
		amplitudeDis = (maxAmplitude * pixDistance).toFixed(4);
		var amplitudeDisStr = "Max Amplitude: " + amplitudeDis + " mm";
		rateDis = (amplitudeDis/ actualTime.toFixed(2)).toFixed(4);
		var rateDisStr = "Rate: " + rateDis + " mm/min";
		document.getElementById("result_amplitude").innerHTML = amplitudeDisStr;
		document.getElementById("result_rate").innerHTML = rateDisStr;

		// alert(rateDisStr);
		// alert(amplitudeDisStr);
		// alert(angleStr);

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
	// var dataFrame = [];
	// dataFrame.push(['Time', 'X-value'])
	// var i;
	// for(i = 0; i < time_list.length; i++){
	// 	dataFrame.push([time_list[i], diffx_list[i]]);
	// }
	// var data = google.visualization.arrayToDataTable(dataFrame);
	// var options = {
 	//      title: 'Distance on X axis',
 	//      curveType: 'function',
 	//      legend: { position: 'bottom' }
 	//    };
 	//var chart = new google.visualization.LineChart(document.getElementById('chart_1'));

 	//chart.draw(data, options);
 	var screenwidth = screen.width;
 	var data = {
  		labels: time_list,
  		series: [
    		diffx_list
  		]
	};
	var options ={
		chartPadding: {
			left:10
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
			left:10
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
}

function saveTrackingData(){
	var dataFileName = document.getElementById("saveDataName").value;
	resultStr = "Gravitropism\r\nMax Amplitude(mm),"+amplitudeDis+"\r\nRate(mm/s),"+rateDis+"\r\nAngle,"+angle+"\r\n";
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
	createDataFile(dataFileName+".csv");
}
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