angular-property-binder
=======================

Tiny library which help you to create reference variables and keep them intact. 
  
Don't use you're controller as a MODEL - [Best Practice](http://toddmotto.com/rethinking-angular-js-controllers/).  
*Controllers should bind references to Models only (and call methods returned from promises)*

### Installation
------------

bower: `bower install angular-property-binder`  
npm: `npm install angular-property-binder`  


Simply add:

````html
<script type="text/javascript" src="dist/js/angular-property-binder.min.js">
</script>
````
to your HTML, load module `['PropertyBinder']` and then inject the binder service to your controller|service|factory|provider 

````javascript

angular.module('MyApp')
    .controller('MyController', [
    'PropertyBinder.services.binder', 
    function(bind) { 
        ... 
    }])

````

### API Reference
------------

Angular Property Binder service provides easy to use and minimalistic chaining methods.  
Here is the full list of accessible methods:

##### **@service** **[PropertyBinder.services.binder]** binder(property)  
**param** ***property*** {**Array**|**String**} property name to bind  

=======================

##### **@method** ***from***(scope, path)  
**@param** ***scope*** {**Object**|**Array**} source object containing the property to bind  
**@param** ***path*** {**String**|**Array**} **[OPTIONAL]** path to the targeted source. Useful when you wan't to create a reference on a nested property  

=======================

##### **@method** ***to***(scope)  
**@param** ***scope*** {**Object**|**Array**} target object  

=======================

##### **@method** ***as***(alias)  
**@param** ***alias*** {**Object**|**Array**|**String**} alias(es) for property  

=======================

##### **@method** ***onchange***(callback)  
adds a onchange event callback to the binding  
**@param** ***callback*** {**Function**} function called each time the property is updated from the created reference  

=======================

##### **@method** ***seal***()  
seals the binding. the assignations will not work after that  

=======================

##### **@method** ***unseal***()  

=======================

##### **@method** ***destroy***()  

=======================

Basic samples:
````javascript

var app = angular.module('app', ['PropertyBinder']);
app.factory('app.factories.user', function() {
	return {
		authenticate: function() {/**/},
		update: function() {/**/},
		register: function() {/**/},
		user: {
			name: 'Jack',
			firstname: 'Bar',
			location: {
				city: 'Fu',
				country: 'FuBar'
			}
		}
	};
});
	
app.controller('app.controllers.sample', [
	'$scope',
	'app.factories.user', 
	'PropertyBinder.services.binder', 
function($scope, userFactory, bind) {

	bind('user').from(userFactory).to($scope).apply();
	console.log($scope.user.firstname); // "Bar"

	var binding = bind('firstname').as('userName').to($scope).from(userFactory, ['user']).apply();
	console.log($scope.userName); // "Bar"
	$scope.userName = 'FuFuBarBar';
	console.log($scope.userName, userFactory.user.firstname, $scope.user.firstname); // "FuFuBarBar", "FuFuBarBar", "FuFuBarBar"

	binding.seal();
	$scope.userName = 'Bar'; //it will not work
	console.log($scope.userName, userFactory.user.firstname, $scope.user.firstname); // "FuFuBarBar", "FuFuBarBar", "FuFuBarBar"
	$scope.user.firstname = 'Bar';
	console.log($scope.userName, userFactory.user.firstname, $scope.user.firstname); // "Bar", "Bar", "Bar"

	binding.unseal();

	bind(['city', 'country']).to($scope).from(userFactory, 'user.location').apply();

	bind('register').from(userFactory).to($scope).apply(); //similar to $scope.register = userFactory.bind(userFactory);

	binding.destroy();

}]);

````
See the full documented example in `example/modules/app/controllers/appTest.es6`.

### Modify and build
--------------------

`npm install`

To build the dev version just type: `grunt es6`
It will create js files from the es6 sources.

To build the dist version just type: `grunt build`
It will generate and minify js files.

