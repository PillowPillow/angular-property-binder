angular.module('PropertyBinder')
	.service('PropertyBinder.services.binder', ['PropertyBinder.providers.binder', 
		(Binder) => function(...parameters) { return new Binder(...parameters); }	
	]);