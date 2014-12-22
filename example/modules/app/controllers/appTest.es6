angular.module('App')
	//you can use $scope or controllerAs methods, anyway
	.controller('App.controllers.appTest', ['PropertyBinder.services.binder', 'App.factories.users', 
	function(bind, userFactory){
		
		// old method - just create a reference with the factory property
		// this.users = userFactory.users;	

		bind('users'/*could take a list of properties*/).from(userFactory).to(this /*or $scope*/).apply();
		// bind('users','fu', 'bar').from(userFactory).to(this /*or $scope*/).apply();

		// you can also give an alias to your property
		var binding = bind('users').from(userFactory).to(this /*or $scope*/).apply('usersAlias'/*could take a list of aliases*/);
		// var binding = bind('users').from(userFactory).to(this /*or $scope*/).apply('usersAlias','fu', 'bar');

		// if you want to keep secure the factory data you can also seal the reference
		binding.seal();
		binding.unseal();

		this.load = userFactory.load;

		userFactory.load();

	}]);