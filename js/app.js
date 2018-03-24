 var lat = 0;
 var lon=0;
function init() {
    
    gapi.client.setApiKey('AIzaSyAHL2ENTrWeqM4SFtGw4UmQgMSP3R7KvXw');
    gapi.client.load('youtube', 'v3', function() {
        // yt api is ready
    });
}

  function verPlayer(e){  
  $("#results").html('');
        bus=10;
        if($('#num').val()<=10&&$('#num').val()>=1){
          bus=$('#num').val();
        }
   //alert("ver player");
       var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            q: encodeURIComponent($('#search').val()).replace(/%20/g, '+'),
            maxResults: bus,
            order: 'viewCount',
            publishedAfter: '2015-01-01T00:00:00Z'
       }); 
        request.execute(function(response) {
        var results = response.result;
          
          $.each(results.items, function(index, item) {
            var requestOptions = {
              id: item.id.videoId,
              part: 'recordingDetails, statistics'
             };
            if(bus<=5){
            ancho=(1320/bus)*.90;
            alto=550*.9;
          }else{
            if(bus%2==1){bus++}
            ancho=(1320/(bus/2))*.85;
            alto=550/2*.65;
          }
            var request1 = gapi.client.youtube.videos.list(requestOptions);
            request1.execute(function(response1) {    
            var datos = response1.result;
            sub=''+item.snippet.publishedAt.substr(8, 2)+item.snippet.publishedAt.substr(4, 3)+'-'+item.snippet.publishedAt.substr(0,4);
            if(datos.items[0].recordingDetails&&datos.items[0].recordingDetails.location){
              lat = datos.items[0].recordingDetails.location.latitude;
              lon = datos.items[0].recordingDetails.location.longitude;
              salida='<div id="video"><iframe width='+ancho+' height='+alto+' src=\"//www.youtube.com/embed/'+item.id.videoId+
              '\" allowfullscreen></iframe></br>CANAL: '+item.snippet.channelTitle+'<br />SUBIDO EL: '+sub+
              '<br /> Ubicación: </br>lat:'+lat+'</br>lon:'+lon;
              $("#results").append(salida); 
            }
             else{
              salida='<div id="video"><iframe width='+ancho+' height='+alto+' src=\"//www.youtube.com/embed/'+item.id.videoId+
              '\" allowfullscreen></iframe></br>CANAL: '+item.snippet.channelTitle+'<br />SUBIDO EL: '+sub+
              '<br /> Ubicación :</br>lat: No disp.</br>long: No disp.';
              $("#results").append(salida);
            }
             
             });
            
          });
         
       });
  }

//////MAPA*************************
  var map;
    function initMap() {
         map = new google.maps.Map(document.getElementById('results'), {
            center: {lat:26.6398058, lng: -160.9806811},
            zoom: 2
            });
      }
  function verMapa(){
    initMap();
    var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            q: encodeURIComponent($('#search').val()).replace(/%20/g, '+'),
            maxResults: $('#num').val(),
            order: 'viewCount',
            publishedAfter: '2015-01-01T00:00:00Z'
       }); 
        request.execute(function(response) {
        var results = response.result;
          
          $.each(results.items, function(index, item) {
            var requestOptions = {
              id: item.id.videoId,
              part: 'recordingDetails'
             };
            var request1 = gapi.client.youtube.videos.list(requestOptions);
            request1.execute(function(response1) {    
            var datos = response1.result;
            if(datos.items[0].recordingDetails&&datos.items[0].recordingDetails.location){
              lat = datos.items[0].recordingDetails.location.latitude;
              lon = datos.items[0].recordingDetails.location.longitude;
              var pos= {lat: lat, lng: lon};
              var marker = new google.maps.Marker({
              position: pos,
              map: map
              });
              var contentString='<div><iframe width=400 height=200 src=\"//www.youtube.com/embed/'+item.id.videoId+'\" allowfullscreen></iframe></div>';
              var infowindow = new google.maps.InfoWindow({
               content: contentString
              });
              marker.addListener('click', function() {
              infowindow.open(map, marker);
              });
              }
            
            
             
             });
            
          });
         
       });
  }
