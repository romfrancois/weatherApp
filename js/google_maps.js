google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
    var MonitorMap = require('./monitorMap');
    var markers = [];

    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631)
    );
    map.fitBounds(defaultBounds);

    // Create the search box and link it to the UI element.
    var input = document.getElementById('city-input');
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox(input);

    var addLocationBtn = document.getElementById('add-location');
    var monitorMap = new MonitorMap();

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        monitorMap.setPotentialCity(places[0]);

        addLocationBtn.disabled = false;

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });

        // For each place, get the icon, place name, and location.
        markers = [];

        var bounds = new google.maps.LatLngBounds();

        places.forEach(function(place) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            markers.push(marker);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        map.fitBounds(bounds);
    });

    // [END region_getplaces]

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    map.addListener('bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });
}
