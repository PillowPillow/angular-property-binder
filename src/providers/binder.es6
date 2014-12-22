angular.module('PropertyBinder')
	.provider('PropertyBinder.providers.binder', function() {
		this.$get = function() {

			class Binder {

				constructor(...properties) {
					this.properties = properties;
					this.binded = false;
				}

				from(scope) {

					this._throwErrorIfAlreadyBinded();
					this.from = scope;
					return this;
				}

				to(scope) {

					this._throwErrorIfAlreadyBinded();
					this.to = scope;
					return this;
				}

				apply(aliases = this.properties) {

					this._throwErrorIfAlreadyBinded();

					if(typeof aliases === 'string')
						aliases = [aliases];

					if(this.from && this.to && this.properties.length > 0) {
						for(let i = 0; i<this.properties.length; i++)
							Object.defineProperty(this.to, aliases[i], { 
								get: () => this.from[this.properties[i]],
								set: (value) => { 
									this.from[this.properties[i]] = value; 
								}
							});
					}

					this.binded = true;
					return this;
				}

				_throwErrorIfAlreadyBinded() {
					if(this.binded)
						throw Error('Property already binded');
				}
			}

			return Binder;
		}
	})