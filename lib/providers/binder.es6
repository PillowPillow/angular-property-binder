angular.module('PropertyBinder')
	.provider('PropertyBinder.providers.binder', function() {
		this.$get = function() {

			class Binder {

				constructor(properties = []) {
					this._properties = properties instanceof Array ? properties : [properties];
					this._binded = false;
					this._sealed = false;
					this._to = undefined;
					this._from = undefined;
					this._path = [];
					this._aliases = {};
					this._change = () => {};
				}

				from(scope, path = []) {
					this._throwErrorIfAlreadyBinded();
					this._path = typeof path === 'string' ? path = path.split('.') : path;
					this._from = scope;
					return this;
				}

				to(scope) {
					this._throwErrorIfAlreadyBinded();

					this._to = scope;
					return this;
				}

				as(aliases = {}) {
					this._throwErrorIfAlreadyBinded();

					if(aliases instanceof Object) {

						if(aliases instanceof Array) {
							for(let i = 0; i<aliases.length; i++)
								if(!!this._properties[i])
									this._aliases[this._properties[i]] = aliases[i];
						}
						else
							this._aliases = aliases;
					}
					else {

						if(typeof aliases === 'string') {
							if(this._properties.length === 1) {
								let alias = aliases;
								this._aliases = {};
								this._aliases[this._properties[0]] = alias;
							}
							else
								throw Error('Ambiguous aliases');
						}
					}

					return this;
				}

				onchange(changeEvent = () => {}) {
					this._change = changeEvent;
					return this;
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
					if(this._from && this._to && this._properties.length > 0)
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
					delete this._to[alias];
				}

				_createProperty(property) {
					Object.defineProperty(this._to, (this._aliases[property] || property) , { 
						enumerable: true,
						configurable: true, 
						get: () => {
							var src = this._getSrc();
							return src[property] instanceof Function ? src[property].bind(src) : src[property];
						},
						set: (value) => { 
							if(!this._sealed) {
								var src = this._getSrc();
								var oldValue = src[property];
								src[property] = value; 
								if(oldValue !== value)
									this._change(value, oldValue);
							}
							else
								throw Error('Trying to update a sealed property');
						}
					});
				}

				_getSrc() {
					var src = this._from;
					if(this._path.length > 0)
						for(var i=0; i<this._path.length; i++) {
							src = src[this._path[i]];
							if(!src)
								throw Error('unable to acces to the given property');
						}
					return src;
				}

				_throwErrorIfAlreadyBinded() {
					if(this._binded)
						throw Error('Property already binded');
				}
			}

			return Binder;
		};
	});