var url = window.url || {
	settings: {
		addresses: [
			"Mohrenstr 61 Berlin", 
			"Pennsylvania Plaza, 23, Petoskey, Michigan, United States", 
			"Bulevar Nemanjića, 61, Niš, Nišava District, Serbia"
		]
	},
	address: {},
	helpers: {},
	google: { 
		geocoder: null, 
		map: null 
	}
};;

$(document).ready(function(){
  
	// INITIALIZATION:

	url.helpers.googleMixin = new UrlGoogleMixin();
	url.helpers.addressFormMixin = new UrlAddressFormMixin();
	
	// Initialize the map
	initialize();
	
	// Initialize address form fields refences
	url.address.fields = {
		'country': document.getElementById('id_country'),
		'region': document.getElementById('id_region'),
		'city': document.getElementById('id_city'), 
		'zip_code': document.getElementById('id_zip_code'),
		'street': document.getElementById('id_street'),
		'street_number': document.getElementById('id_street_number')
	};


	// AUTOCOMPLETE COMPONENTS INITIALIZTION

	// Initialize Google Autocomplete fields
	var autocomplete_config = { 
			componentRestrictions: {}
		, types:["geocode"] 
	};
	url.address.autocompetes = {
		'country': new google.maps.places.Autocomplete(url.address.fields.country, autocomplete_config),
		'region': new google.maps.places.Autocomplete(url.address.fields.region, autocomplete_config),
		'city': new google.maps.places.Autocomplete(url.address.fields.city, autocomplete_config),
		'zip_code': new google.maps.places.Autocomplete(url.address.fields.zip_code, autocomplete_config),
		'street': new google.maps.places.Autocomplete(url.address.fields.street, autocomplete_config),
		'street_number': new google.maps.places.Autocomplete(url.address.fields.street_number, autocomplete_config)
	}; 	
	// Autocomplete components - registering handlers to each autocomplete compoenent
	for(var autocomplete_key in url.address.autocompetes) {
		google.maps.event.addListener(url.address.autocompetes[autocomplete_key], 'place_changed',autocomplete__place_changed__handler);
	}


	// LOOP THROUGH DEMO ADDRESSES
	
	// Loop through all default addresses - set in "url.settings.addresses" configuration!
	var i = url.settings.addresses.length;	
	var refreshId = setInterval(function() {
	  if (!(i-1)) { clearInterval(refreshId); }
		// Set the 'Find on map' form's input to the default value from iteration (and decrement iteration)
		document.getElementById('address').value = url.settings.addresses[(i--)-1];
		// Position the map and set Address Form Inputs
		codeAddress();
	}, 5000);
		
});


function _updateAddressFormFieldsToAddress(address_components) {
	// Get serialized address
	var address = url.helpers.googleMixin.serializeAddress(address_components);
	console.log('address: ', address);
	// Set Address Form Fields values to new "address" values
	url.helpers.addressFormMixin.setAddressFormFieldsToAddress(address, url.address.fields);
}

function autocomplete__place_changed__handler() {
	var address, place = this.getPlace();
	
	if(!place) throw new Error('No address was found!');
console.log('place:', place);
	// Update Address Form Fields to new address value
	_updateAddressFormFieldsToAddress(place.address_components);	

	// Get full address out of Address Form Fields
	document.getElementById('address').value = url.helpers.addressFormMixin.generateFullAddress();
	// Position the map to full address that was constructed
	document.getElementById('find-on-map-btn').click();
}

// Initialize Google Map
function initialize() {
  url.google.geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  url.google.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

// Geocode Address from 'address' field and show it on the map.
function codeAddress() {
  var address = document.getElementById("address").value;

  url.google.geocoder.geocode( { 'address': address}, function(results, status) {

    if (status == google.maps.GeocoderStatus.OK) {
      url.google.map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: url.google.map, 
          position: results[0].geometry.location
      });
			
			// Update Address Form Fields to new address value
			_updateAddressFormFieldsToAddress(results[0].address_components);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
    return false;
  });
}