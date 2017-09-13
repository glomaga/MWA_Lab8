
      $(document).ready(function () {

        
        $('#us3').locationpicker({
            location: {
              latitude: document.getElementById("us3-lat").value ,//41.0159732,
              longitude: document.getElementById("us3-lon").value//-91.96840879999999
            },
            radius: 300,
            inputBinding: {
              latitudeInput: $('#us3-lat'),
              longitudeInput: $('#us3-lon'),
              radiusInput: $('#us3-radius'),
              locationNameInput: $('#us3-address')
            },
            enableAutocomplete: true,
            onchanged: function (currentLocation, radius, isMarkerDropped) {
              // Uncomment line below to show alert on each Location Changed event
              var mapContext = $(this).locationpicker('map');
                mapContext.map.setZoom(20);
             // alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
            }
          })


      });