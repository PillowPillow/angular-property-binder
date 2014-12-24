angular.module('App')
	//you can use $scope or controllerAs methods, anyway
	.controller('App.controllers.appTest', ['PropertyBinder.services.binder', 'App.factories.users', 
	function(bind, userFactory){
		
		// old method - just create a reference with the factory property
		// this.users = userFactory.users;	

		bind('users'/*could take an array of properties*/).from(userFactory).to(this /*or $scope*/).apply();
		// bind(['users','fu', 'bar']).from(userFactory).to(this /*or $scope*/).apply();

		// you can also give an alias to your property
		var binding = bind('users').as('usersAlias').from(userFactory).to(this /*or $scope*/).apply();
		// var binding = bind(['users','fu', 'bar']).as({ 'users':'usersAlias','fu':'fub', 'bar':'bars'}).from(userFactory).to(this /*or $scope*/).apply();

		// if you want to keep secure the factory data you can also seal the reference
		binding.seal();
		binding.unseal();

		// binding.destroy()

		// you can even bind a function in order to keep the scope
		bind('load').to(this).from(userFactory).apply();
		// this.load = userFactory.load; 


		userFactory.load();

	}]);