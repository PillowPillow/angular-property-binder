angular.module('PropertyBinder')
	.provider('PropertyBinder.providers.binder', function() {
		this.$get = function() {

			class Binder {

				constructor(...properties) {
					this.properties = properties;
					this.binded = false;
					this.sealed = false;
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

				seal() { this.sealed = true; }

				unseal() { this.sealed = false; }

				toggleSealing() {
					this.sealed = !this.sealed;
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
									if(!this.sealed)
										this.from[this.properties[i]] = value; 
									else
										throw Error('Trying to update a sealed property');
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