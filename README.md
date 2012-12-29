# Introduction

Very often projects have a need to have address related form fields that are not that simple as basic input fields.

This repo enables you to decorate *address related form fields* with auto-completion which is smart enough to populate each of the address form fields appropriately based on data returned by Google Auto-complete service.


## Demo

To see the demo usage open following page: **./demo/index.html**
	
Demo page will loop through all of the demo addresses that are set within the url.settings.addresses configuration on each 5 seconds.

	
# About

The purpose of this component is to help the users fill in the address forms and enable you to enrich your address forms.

Because the purpose of the form is to help user type in his/her address (fill in all address related fields), component deliberately doesn't remove existing data from the address related fields if you type in new address. That way address related details that are returned via google service will fill in the appropriate address form fields, but those form fields that last google service call didn't retrieved will remain the same as before.

Google map on the right is used to display the selected address to the user filling in the form. User will be able to also fill in the form by searching address via the input field below the map.


## TODO

* "Find on map" form - dump geocoder and use Autocomplete component there as well. Reason: Better at setting street numbers - for some reason geocoder is not that shiny when it comes to returning addresses with street nubmers entered (street number fields are not retrieved most of the time).
