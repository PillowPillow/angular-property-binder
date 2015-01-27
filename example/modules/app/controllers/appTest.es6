angular.module('App')
	//you can use $scope or controllerAs methods
	.controller('App.controllers.appTest', ['PropertyBinder.services.binder', 'App.factories.users', 
	function(bind, userFactory){
		
		// old method - just create a reference with the factory property
		// this.users = userFactory.users;	

		this.message = '';

		bind('users'/*can take an array of properties*/)
			.from(userFactory)
			.to(this /*or $scope*/)
			.apply();

		bind('eyeColor')
			//avoid reference deteling
			//sample : get the eye color of the first user in the userFactory array
			.from(userFactory, 'users.0'/*path toward the nested property*/)
			.to(this)
			.apply();

		// the service can be used to create a reference on a primitive data type like integer or float
		bind('nbToLoad')
			.from(userFactory)
			.to(this)
			.apply()
			//bind an event triggered when the property is updated from this reference
			.onchange((newVal, oldVal) => {
				console.log('property updated', newVal, oldVal);
				userFactory.load();
			});

		// bind(['users','fu', 'bar']).from(userFactory).to(this /*or $scope*/).apply();

		// you can also give an alias to your property
		// in this case the property will be accessible by this.userAlias
		var binding = bind('users').as('usersAlias').from(userFactory).to(this /*or $scope*/).apply();
		// var binding = bind(['users','fu', 'bar']).as({ 'users':'usersAlias','fu':'fub', 'bar':'bars'}).from(userFactory).to(this /*or $scope*/).apply();
		// or
		// var binding = bind(['users','fu', 'bar']).as(['usersAlias','fub','bars']).from(userFactory).to(this /*or $scope*/).apply();

		// if you want to keep secure the factory data you can also seal the reference
		binding.seal();
		binding.unseal();



		// binding.destroy()

		// you can even bind a function in order to keep the scope
		bind('load').to(this).from(userFactory).apply();
		// this.load = userFactory.load; 


		userFactory.load();
	}]);