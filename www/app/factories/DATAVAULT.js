/*--------------------PLANT TRACER 2.0----------------------
	Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
app.factory('DATAVAULT', ['$http', '$rootScope', function($http, $rootScope){
   // dreamcore       = "https://steinhardtapps.es.its.nyu.edu/create/dreamcore/api/";
    ptdb            = false;
    size            = 5*1024*1024;
    filepath        = "";
    fileFound       = false;
    fileCreated     = false;
    myScope         = this;
    initialStatestr = false;

    var getFSFail = function( evt ){
        console.error(evt.target.error.code);
    }
    var errorCallBack = function( error ){
        console.error( ["ERROR: "+error.code, error ] );
        console.log(error)
    }
    var fileExists = function( fileEntry ){
        console.log( "CSV: CSV File found ... redirecting to main menu");
        $rootScope.$broadcast("csvfileready");
    }
    var fileDoesNotExist = function(){
        console.error( "CSV: CSV File not found")
        trytocreate("plant_tracer_record.txt");
    }        
    var fileListExists = function( fileEntry ){
        console.log( "CSV: File List Found!")
        // do nothing
    }
    var fileListDoesNotExist = function(){
        console.log( "CSV: CSV File List not found...");
        trytocreate("data_file_list.txt");
    }
    var dirExists = function( fileEntry ){
        // do nothing
        console.log( fileEntry )
    }
    var dirNotExists = function( fileSystem ){
        createDataDirectory("DataSaves");
    }
    var trytocreate = function( path ){
        console.log( "CSV: Creating new CSV file")
        window.requestFileSystem( LocalFileSystem.PERSISTENT, size, function( fileSystem ){
            fileSystem.root.getFile( path, { create: true, exclusive:true }, function( fileEntry ){
                initialFile( path );
            }, errorCallBack );            
        }, errorCallBack);
    }
    var initialFile = function( path ){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, size, function(fileSystem){
            fileSystem.root.getFile(path, { create: false }, function(fileEntry){                
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                        console.log( "First time user ... redirecting to Welcome screen");
                        $rootScope.$broadcast("firstTimeUser");
                    };
                    fileWriter.onerror = function(e) {
                        console.error('Write failed: ' + e.toString());
                    };
                    var blob = new Blob(['11111111'], {type: 'text/plain'});
                    fileWriter.write(blob);
                });
            }, errorCallBack);
        }, errorCallBack);
    }
    var createDataDirectory = function( dirPath ){
        console.log("CSV: Creating Data Directory")
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            fileSystem.root.getDirectory( dirPath, {create: true, exclusive:false}, function(dirEntry){}, errorCallBack );
        }, errorCallBack );
    }

    // read file "plant_tracer_record.txt", to know which prompt is set to "Don't show me again"
    // content of the file is read into initialStatestr
    var ReadFile = function(path){
        console.warn("READFILE");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, size, function(fileSystem){
            //alert("hi")
                fileSystem.root.getFile(path, { create: false }, function(fileEntry){
                    
                    fileEntry.file(function(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(e) {
                            $rootScope.initialStatestr = "";
                            $rootScope.initialStatestr = this.result;
                            $rootScope.initialStateLoaded = true;
                            console.log($rootScope.initialStatestr)
                            //setState($rootScope.initialStatestr);
                            $rootScope.$broadcast("fileread");
                            //initial(0);
                           // return initialStatestr;
                        };
                        reader.readAsText(file);
                    }, function(err){errorCallBack(err);console.log("::)")});


            },function(err){errorCallBack(err);});
        }, function(err){errorCallBack(err);});
    }
    
    var writetoDataFile = function(path, resultStr){
        //alert([":D "+path, resultStr])
        window.requestFileSystem(LocalFileSystem.PERSISTENT, size, function(fileSystem){
            fileSystem.root.getFile(path, { create: true }, function(fileEntry){
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                        //alert("Save Success!");
                    };
                    fileWriter.onerror = function(e) {
                        //alert('Write failed: ' + e.toString());
                    };
                    var blob = new Blob([resultStr], {type: 'text/plain'});
                    //alert(blob)
                    fileWriter.write(blob);
                });
            }, function(e){alert("Something went wrong, please try again")});
            
        }, function(e){alert("Something went wrong, please try again")});
    }
    var test = function(){
       // alert("test")
    }

    var uploadVideo = function( d ){
        //alert("uploading video file");

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = d + "_" + $rootScope.videoSrc.substr($rootScope.videoSrc.lastIndexOf('/') + 1);
        options.mimeType = "video/quicktime";


        var params = {};
        params.value1 = d;
        //params.value2 = "param";

        options.params = params;

        var ft = new FileTransfer();
        ft.upload($rootScope.videoSrc, encodeURI("https://www.planttracer.com/api/upload.php"), win, fail, options);

         
        return true;
    }

    var win = function (r) {
        alert("The plant trace data is saved. Thank you!")
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }

    var fail = function (error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    


	return {
        readFile : function(fpath){
            console.warn("PUBLIC readFile")
            //return// ReadFile;
            ReadFile(fpath);
            //alert(initialStatestr)
            return initialStatestr;
        },
        errorCallBack : function( err ){
            console.log(err)
            return errorCallBack;
        },        
        obtainFile : function( fileSystem ){
            console.log("CSV: Obtaining File in Filesystem")
            fileSystem.root.getFile( filepath, { create: false }, fileExists, fileDoesNotExist );
        },
        checkIfFileExists : function( path ){
            console.log( "CSV: Checking if CSV file exists ")
            filepath  = path
            window.requestFileSystem(LocalFileSystem.PERSISTENT, size, this.obtainFile, this.errorCallback);
        },
        checkIfFileListExists : function( path ){
            window.requestFileSystem(LocalFileSystem.PERSISTENT, size, function(fileSystem){
                fileSystem.root.getFile( path, { create: false }, fileListExists, fileListDoesNotExist );
            }, this.errorCallback);
        },
        checkDataDirectory: function( dirPath ){
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                fileSystem.root.getDirectory( dirPath, { create:false }, dirExists, dirNotExists);
            }, this.errorCallback);
        },        
        createDatabase : function(){
        	console.log("Creating Local Database...");
           	ptdb = window.sqlitePlugin.openDatabase({name: 'plantTracer', location: 'default'});
            this.populateDB();
        	return ptdb;
        },
        populateDB(){
        	console.log("Populating Local Database...");
        	console.log( ptdb )
        	ptdb.transaction( 
        		function(tx){ 
        			tx.executeSql('CREATE TABLE IF NOT EXISTS scribelog (userID TEXT NOT NULL, gameCode TEXT NOT NULL, d01 TEXT NOT NULL, d02 TEXT NOT NULL, d03 TEXT NOT NULL, d04 TEXT NOT NULL)')
        		}, this.errorDB, this.successDB );
        },
        insertData : function( data ){
            console.log("Inserting "+data+" into Local Database...");
        	ptdb.transaction( 
        		function(tx){
        			tx.executeSql("INSERT INTO scribelog(userID, gameCode, d01, d02, d03, d04 ) VALUES (?,?,?,?,?,?)",[data,data,data,data,data,data])
        		}, this.errorDB, this.successDB );
        },
        selectData : function( data ){
        	console.log("Selecting into Local Database...");
        	var res = false;
        	ptdb.transaction( 
        		function(tx){ 
        			         tx.executeSql("select * from scribelog",
                                    [],
                                    function(tx,result) { 
                                        $rootScope.q = result;
                                    } );
        		              }, this.errorDB, this.successDB );
            return true;
        },
        clearDatabase : function(){
        	console.log("Truncating records...");
        	ptdb.transaction( 
        		function(tx){
        			tx.executeSql("DELETE FROM scribelog");
        		}
        	)
        },
        errorDB : function(err){
        	console.warn(err);
        },
        successDB : function(){
        	console.warn("DB transaction: success");
        },
        getLocalDB : function(){
            return ptdb;
        },
        getCurrentData : function(){
            return $rootScope.q;
        },
        takeScreenShot : function(){
            //alert("Taking Screenshot");
            console.log( navigator.screenshot)
            navigator.screenshot.save(function(error,res){
                if(error){
                    //alert(error)
                    console.error(error);
                }else{
                    //alert("done snapping")
                    console.log('ok',res.filePath);
                    window.cordova.plugins.imagesaver.saveImageToGallery(
                        res.filePath, 
                        this.shotSaveSuccess, 
                        this.shotSaveFail);
                }
            });
        },
        shotSaveSuccess : function(){
            //alert("Screen Shot successfully saved!");
            console.log(message);
        },
        shotSaveFail : function(){
           // alert("Something went Wrong!");
            console.log(message);
        },
        saveVideo : function(){
            //alert("uploading video file");
            uploadVideo();
        },
        uploadDatatoDatabase: function(user, ra, xname, aA, geneName, geneID, movement, rate, amplitude, angle, videoName, dataTime, dataX, dataY){
            //alert("uploading data")
            var dataToSend = {
                user: user,
                researcher: ra,
                experiment: xname,
                arabiposisAccession: aA,
                gene: geneName,
                geneID: geneID,
                movement: movement,
                rate: rate,
                amplitude: amplitude,
                angle: angle,
                video: videoName,
                graphTime: dataTime.join(),
                graphX: dataX.join(),
                graphY: dataY.join()
            }

            
          var postTo = 'https://www.planttracer.com/api/index.php';

             $.ajax({
                  url: 'https://www.planttracer.com/api/index.php',
                  type: 'post',
                  dataType: 'json',
                  data:  { src: "saveData", data: dataToSend },//{'action': 'follow', 'userid': '11239528343'},
                  success: function(data, status) {
                   
                    if( status == "success"){
                        //alert(data)
                        uploadVideo( data.d );
                         //alert("The plant trace data is saved. Thank you!")
                    }

                  },
                  error: function(xhr, desc, err) {
                    //alert("fail")
                    console.log(xhr);
                    alert("Sorry, something went wrong. Please check your internet connection and try again!");
                    //alert("FAIL: Details: " + desc + "\nError:" + err);
                  }
                }); // end ajax call
        },
        saveTrackingData : function( filename ){
            var testColorSave = [];
           // alert( filename )
            var dataFileName    = filename;//document.getElementById("saveDataName").value;
            resultStr           = "Circumnutation\r\nMax Amplitude(mm),"+$rootScope.amplitudeDis+"\r\nRate(mm/s),"+$rootScope.rateDis+"\r\n";
            resultStr           = resultStr+"Time(min),X-distance(mm),Y-distance(mm)\r\n";
            var i;

            for(i = 0;i < $rootScope.original_time.length;i++){
                if(i != $rootScope.original_time.length - 1){
                    resultStr = resultStr+$rootScope.original_time[i]+','+$rootScope.diffx_list[i]+','+$rootScope.diffy_list[i]+'\r\n';
                }
                else{
                    resultStr = resultStr+$rootScope.original_time[i]+','+$rootScope.diffx_list[i]+','+$rootScope.diffy_list[i];
                }
            }

            // for(var i = 0; i < 15; i++){
            //     //alert(testColorSave.length);
            //     for(var j = 0; j < testColorSave[i].length; j++){
            //         testColorStr += testColorSave[i][j]+",";
            //     }
            //     testColorStr += "\n"
            // }
            
            // console.log([ filename, resultStr, dataFilename, testColorStr])
            // 
            console.log( [filename, dataFileName, resultStr, $rootScope.amplitudeDis, $rootScope.rateDis ])

            this.createDataFile(dataFileName+".csv", resultStr);
        },
        createDataFile : function( path, resultStr ){
            //alert( ":) " + path)
            var r = resultStr;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, size, function(fileSystem){
                var realPath = "DataSaves/"+path;
                //var realPath =  path;
                fileSystem.root.getFile(realPath, { create: true, exclusive:true }, function(fileEntry){
                   // alert([r])
                    writetoDataFile(realPath, r);
                }, this.dataFileError);
                
            }, this.dataFileError);
        },
        dataFileError: function(error){
            if(error.code == 12){
                //alert("File Already Exists");
            }
            else{
                alert("ERROR: "+error.code);
            }
        },
		test: function(){
			return $http.post( dreamcore, { src:'test', data:{ userToken: ":)"} }) ;
		}
	}
}]);
