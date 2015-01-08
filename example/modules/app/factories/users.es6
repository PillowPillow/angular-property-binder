angular.module('App')
	.factory('App.factories.users', ['$http', 'App.service.userPicker', function($http, userPicker) {
		
		var prototype = {};

		// data as array of object
		prototype.users = [];
		// data as key value array of object
		/*only for example*/prototype.users2 = {};
		// number of user to load
		prototype.nbToLoad = 3;

		prototype.load = loadfn;

		return prototype;

		function loadfn() {
			// data loading with $resource|$http|restangular...
			/*
			return $http.get('/users')
				.success((users) => {

					// --old way-- //

					var i;
					// if you wouldn't break the reference with the controller you need to splice and fill the array like this
					prototype.users.splice(0);
					for(i = 0; i<users.length; i++)
						prototype.users.push(users[i]);

					// with an object it's a little bit harder
					// you need to delete each rows and fill the object
					for(i in prototype.users2)
						delete prototype.users2[i];
					for(i in users)
						prototype.users[i] = users[i];
				
					// --new way-- //

					//don't care about the reference
					prototype.users = users;

				})
				.error(() => console.error('an error occurred during the data loading'));
			*/
		
			prototype.users = userPicker.getRandomList(this.nbToLoad);
		}
	}]);