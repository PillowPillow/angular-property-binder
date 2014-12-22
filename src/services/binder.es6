angular.module('PropertyBinder')
	.service('PropertyBinder.services.binder', ['Binder.providers.binder', 
		(Binder) => function(...parameters) { return new Binder(...parameters); }	
	]);