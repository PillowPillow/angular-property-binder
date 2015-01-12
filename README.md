angular-property-binder
=======================

Tiny library which help you to create reference variables and keep them intact.

### Installation
------------

Install: `bower install angular-property-binder`

Simply add:

````
<script type="text/javascript" src="dist/js/angular-property-binder.min.js">
</script>
````
to your HTML, load module `['PropertyBinder']` and then inject the binder service to your controller|service|factory|provider 

````
angular.module('MyApp')
    .controller('MyController', [
    'PropertyBinder.services.binder', 
    function(binder) { 
        ... 
    }])
````

### Usage 
---------

see the documented example in `example/modules/app/controllers/appTest.es6`

### Modify and build
--------------------

`npm install`

To build the dev version just type: `grunt es6`
It will create js files from the es6 sources.

To build the dist version just type: `grunt build`
It will generate and minify js files.

