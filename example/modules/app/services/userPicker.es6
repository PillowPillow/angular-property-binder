angular.module('App')
	.service('App.service.userPicker', ['App.values.users', function(userList){

		var prototype = {};

		prototype.pickOne = pickOnefn;
		prototype.getRandomList = getRandomListfn;

		return prototype;

		function pickOnefn() {
			return userList[~~(Math.random() * userList.length)];
		}

		function getRandomListfn(amount = 3) {
			var users = [];

			for(var i = 0; i<amount; i++) 
				users.push(this.pickOne());

			return users;
		}

	}]);