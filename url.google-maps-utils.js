// Google Mixins made by Uros Lates.
//  This are helpers that can be used with Google Maps services.
var UrlGoogleMixin = function() {}
UrlGoogleMixin.prototype = {
	
	// Gets google address_components property (retured from google components) as argument and returns serialized address
	// Serialized address contains json representation of an address.
	// Usefull if you have address form with feilds Country/Region/City... and all are autocompleteable.
	//	Then if user starts typning street into box and selects one that google Autocomplete retuns, we can prepopulate remaining fields with the rest of the data.
	//  Or we can then if user has filled in country first append each of the remaining address inputs with "country.short_name". That way we reduce search results to that specific country only.
	//  Demo usage can be found within "demo" directory -> "index.html" page.
	serializeAddress: function (addressComponents) {
		// Address JSON object defaults
		var result = {
			country: null,
			region: null,
			city: null,
			zip_code: null,
			street: null,
			street_number: null
		};

		// TODO: Ensure that administrative_area_level_N is ordered witn N ad ASC!!
		// quicksort looping administrative_area_level_N to order it in ASC...

		// Important: Expects that administrative_area_level_N is ordered witn N ad ASC!!
		for (var i = 0, component; i < addressComponents.length; i++) {
			var component = addressComponents[i];
			if(component.hasOwnProperty('types') && component.types.length) {
				for (var j = component.types.length - 1, type; j >= 0; j--) {
					type = component.types[j];
					switch (type){
						case 'country':
							result.country = component;
							break;
						case 'locality':
							result.city = component;
							break;
						case 'administrative_area_level_1':
							result.region = component;
							break;
						case 'administrative_area_level_2':
							result.region = component;
							break;
						case 'route':
							result.street = component;
							break;
						case 'street_number':
							result.street_number = component;
							break;
					}
				}
			}
		};

		return result;
	}
 
}



// Mixin that is used to update Address Forms (complex set of fields representing addresses).
// Accepts JSON config object that represents a map of html input fields that represent address
// 
// 	addressFieldsConfig - is expected to have following structure:
//		var addressFieldsConfig = {
//			'country': document.getElementById('id_country'),
//			'region': document.getElementById('id_region'),
//			'city': document.getElementById('id_city'), 
//			'zip': document.getElementById('id_zip_code'),
//			'street': document.getElementById('id_street')
//		}	
// NOTE: Its very important that above JSON has exactly the same keys as specified above.
// 	Reason: Those keys have to correspond to keys consumed by UrlGoogleMixin mixin.
UrlAddressFormMixin = function(addressFieldsConfig) {
	// Register of Form Fields that need to be handled
	this.addressFieldsConifg = {};
	this.setAddressFormFields(addressFieldsConfig || {
						'country': null,
						'region': null,
						'zip_code': null,
						'city': null,
						'street': null,
						'street_number': null
					});
}
UrlAddressFormMixin.prototype = {
  
	// Setter method that is used to modify "addressFieldsConfig"  values.
	// IMPORTANT: It is expected that value is an HTML element (get it via document.getElementById('..'))
	set: function(key, value) {
		if (!this.addressFieldsConifg.hasOwnProperty(key)) 
			new Error('You are trying to set a property <addressFieldsConfig>.'+key+' which isn\'t supported!');

		// TODO: Check if value is of type HTMLNode			
		this.addressFieldsConifg[key] = value;
		// For chaining
		return this;
	},

	// Setter method - settings Address Form Fields configuration object to manipulate on.
	setAddressFormFields: function(addressFormFieldsConfig) {
		for(var aCmp in addressFormFieldsConfig) {
			this.set(aCmp, addressFormFieldsConfig[aCmp]);
		}
	},
	
	// Populates "Address Form Fields" with the "address" provided.
	// If addressFormFieldsConfig is not provided it uses default one.
	setAddressFormFieldsToAddress: function (address, addressFormFieldsConfig) {
		// addressFields - maps inputs to keys that serializeAddress resulting JSON reckognizes!
		// Set this.addressFieldsConifg to second argument if provided (important if CMP gets instaniated without form fields configuration provided)
		var addressFields = this.addressFieldsConifg = arguments.length > 1 ? addressFormFieldsConfig : this.addressFieldsConifg;

		for(field in addressFields) {
			// Validate if addressFields is set correctly initially
			if (!addressFields[field]) {
				throw new Error('setAddressFormFieldsToAddress(...): <addressFields> are not set correctly! This should contain reference to all the form fields!');
			}
			
			if(address[field]) {
				addressFields[field].value = address[field].long_name;
			}
		}
	},
	
	// Helper method to generate full address based on current Address Form fields values.
	generateFullAddress: function () {
		var full_addr_arr = new Array(),
				afc = this.addressFieldsConifg,
				country = afc.country.value.replace(/^\s+|\s+$/g, ''),
				region = afc.region.value.replace(/^\s+|\s+$/g, ''),
				city = afc.city.value.replace(/^\s+|\s+$/g, ''),
				zip_code = afc.zip_code.value.replace(/^\s+|\s+$/g, ''),
				street = afc.street.value.replace(/^\s+|\s+$/g, ''),
				street_number = afc.street_number.value.replace(/^\s+|\s+$/g, '');

		if(street.length)						full_addr_arr.push(street);
		if(street_number.length)		full_addr_arr.push(street_number);
		if(city.length)							full_addr_arr.push(city);
		if(region.length)						full_addr_arr.push(region);
		if(country.length) 					full_addr_arr.push(country);
		if(zip_code.length) 				full_addr_arr.push(zip_code);

		return full_addr_arr.join(', ');
	}
}
