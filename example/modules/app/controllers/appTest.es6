angular.module('App')
	//you can use $scope or controllerAs methods, anyway
	.controller('App.controllers.appTest', ['PropertyBinder.services.binder', 'App.factories.users', 
	function(bind, userFactory){
		
		// old method - just create a reference with the factory property
		// this.users = userFactory.users;	

		bind('users' /*could take an array of properties*/).from(userFactory).to(this /*or $scope*/).apply();

		// you can also give an alias to your property
		bind('users').from(userFactory).to(this /*or $scope*/).apply('usersAlias'/*could take an array of aliases*/);

		// if you want to keep secure the factory data you can also seal the reference

		this.load = userFactory.load;

		userFactory.load();

	}]);