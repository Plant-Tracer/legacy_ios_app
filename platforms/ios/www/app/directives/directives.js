/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
app.directive('appheader', function() {
  return {
    restrict 		  : 'E',
    templateUrl 	:'dir/ui/header.html',
    controller    : "Header"
  };
});

app.directive('appfooter', function() {
  return {
    restrict      : 'E',
    templateUrl   :'dir/ui/footer.html',
    controller    : 'Footer'
  };
});

app.directive('navigation', function() {
  return {
    restrict 		  : 'E',
    templateUrl 	:'dir/ui/nav.html',
    controller 		:"Navigation"
  };
});

app.directive('messenger', function() {
  return {
    restrict      : 'E',
    templateUrl   :'dir/ui/messenger.html',
    controller    :"Messenger"
  };
});

app.directive('videoselection', function() {
  return {
    restrict      : 'E',
    templateUrl   :'dir/ui/selectVideo.html',
    controller    :"SelectVideo"
  };
});

app.directive('videouploader', function() {
  return {
    restrict      : 'E',
    templateUrl   :'dir/ui/videouploader.html',
    controller    :"VideoUploader"
  };
});

app.directive('videoplayer', function() {
  return {
    restrict      : 'E',
    templateUrl   :'dir/ui/videoplayer.html',
    controller    :"VideoPlayer"
  };
});

app.directive('actionpanel', function() {
  return {
    restrict      : 'E',
    templateUrl   :'dir/ui/actionpanel.html',
    controller    :"ActionPanel"
  };
});

app.directive('planttracer', function() {
  return {
    restrict      : 'E',
    templateUrl   : 'dir/ui/planttracer.html',
    controller    : 'PlantTracer'
  };
});

app.directive('graph', function() {
  return {
    restrict      : 'E',
    templateUrl   : 'dir/ui/graph.html',
    controller    : 'Graph'
  };
});

app.directive('notebook', function() {
  return {
    restrict      : 'E',
    templateUrl   : 'dir/ui/notebook.html',
    controller    : 'Notebook'
  };
});