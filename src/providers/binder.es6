angular.module('PropertyBinder')
	.provider('PropertyBinder.providers.binder', function() {
		this.$get = function() {

			class Binder {

				constructor(properties = []) {
					this.properties = properties instanceof Array ? properties : [properties];
					this.binded = false;
					this.sealed = false;
					this.aliases = {};
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

				as(aliases = {}) {
					if(aliases instanceof Object)
						this.aliases = aliases;
					else
						if(typeof aliases === 'string') {
							if(this.properties.length === 1) {
								let alias = aliases;
								this.aliases = {};
								this.aliases[this.properties[0]] = alias;
							}
							else
								throw Error('Ambiguous aliases');
						}

					return this;
				}

				seal() {
					this.sealed = true;
					return this;
				}

				unseal() {
					this.sealed = false;
					return this;
				}

				toggleSealing() {
					this.sealed = !this.sealed;
					return this;
				}

				apply() {

					this._throwErrorIfAlreadyBinded();
					if(this.from && this.to && this.properties.length > 0)
						for(var property of this.properties)
							this._createProperty(property);

					this.binded = true;
					return this;
				}

				_createProperty(property) {
					Object.defineProperty(this.to, (this.aliases[property] || property) , { 
						enumerable: true,
						configurable: true, 
						get: () => this.from[property] instanceof Function ? this.from[property].bind(this.from) : this.from[property],
						set: (value) => { 
							if(!this.sealed)
								this.from[property] = value; 
							else
								throw Error('Trying to update a sealed property');
						}
					});
				}

				_throwErrorIfAlreadyBinded() {
					if(this.binded)
						throw Error('Property already binded');
				}
			}

			return Binder;
		};
	});