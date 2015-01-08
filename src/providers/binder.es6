angular.module('PropertyBinder')
	.provider('PropertyBinder.providers.binder', function() {
		this.$get = function() {

			class Binder {

				constructor(properties = []) {
					this._properties = properties instanceof Array ? properties : [properties];
					this._binded = false;
					this._sealed = false;
					this._aliases = {};
					this._change = () => {};
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
					this._throwErrorIfAlreadyBinded();

					if(aliases instanceof Object)
						this._aliases = aliases;
					else
						if(typeof aliases === 'string') {
							if(this._properties.length === 1) {
								let alias = aliases;
								this._aliases = {};
								this._aliases[this._properties[0]] = alias;
							}
							else
								throw Error('Ambiguous aliases');
						}

					return this;
				}

				onchange(changeEvent = () => {}) {
					this._change = changeEvent;
				}

				seal() {
					this._sealed = true;
					return this;
				}

				unseal() {
					this._sealed = false;
					return this;
				}

				toggleSealing() {
					this._sealed = !this._sealed;
					return this;
				}

				apply() {

					this._throwErrorIfAlreadyBinded();
					if(this.from && this.to && this._properties.length > 0)
						for(var i = 0; i<this._properties.length; i++) 
							this._createProperty(this._properties[i]);

					this._binded = true;
					return this;
				}

				destroy() {

					for(var i = 0; i<this._properties.length; i++) 
						this._deleteProperty(this._properties[i]);

					this._binded = false;
					return this;
				}

				_deleteProperty(property) {
					var alias = this._aliases[property] || property;
					delete this.to[alias];
				}

				_createProperty(property) {
					Object.defineProperty(this.to, (this._aliases[property] || property) , { 
						enumerable: true,
						configurable: true, 
						get: () => this.from[property] instanceof Function ? this.from[property].bind(this.from) : this.from[property],
						set: (value) => { 
							if(!this._sealed) {
								var oldValue = this.from[property];
								this.from[property] = value; 
								if(oldValue !== value)
									this._change(value, oldValue);
							}
							else
								throw Error('Trying to update a sealed property');
						}
					});
				}

				_throwErrorIfAlreadyBinded() {
					if(this._binded)
						throw Error('Property already binded');
				}
			}

			return Binder;
		};
	});