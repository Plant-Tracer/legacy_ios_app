
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