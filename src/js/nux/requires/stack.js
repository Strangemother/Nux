;(function(){
	NuxComponentHeader.apply(this, arguments)
})('stack', {
	// global options
},function(){

	return {
		_stacks: {},
		setCollections: {},
		SetCollection: function SetCollection(name){
			/*
			combines a list of Sets with a handler.
			The handler will be call automatically
			once all the set.list() are empty.
			 */
			var setCollection = (function Collection(name){
				var sets = [];
				var handled = false;
				this._class = 'Collection';
				this.name = name;
				this.add = function(set){
					// add a set to the collection
					sets.push(set);
					return this;
				}

				this.sets = function(){
					return this.set()
				}

				this.has = function(name, ret){
					/*
					return boolean if the stack exists.
					 */
					for (var i = sets.length - 1; i >= 0; i--) {
						
						if(sets[i].name == name) return (ret)? sets[i]: true;
					};

					return false;
				}

				this.set = function(name) {
					// return a set from the collection;
					return (name)? this.has(name, true): sets;
				}

				this._handler;
				this.handler = function(handler){
					if(handler === undefined) {
						console.log("Collection Handler", this)
						var _h = this._handler.apply(this.scope() || Nux, [this]);
						handled = true;
						return _h;
					} else {
						this._handler = handler;
						return this;
					}
				}

				this._scope;
				this.scope = function(scope){
					if(!scope) {
						return this._scope;
					} else {
						this._scope = scope;
						return this;
					}
				}

				this.each = function(func) {
					for (var i = sets.length - 1; i >= 0; i--) {
						var set = sets[i];
						if(func) {
							func(set)
						};
					};
					return this;
				}


				this.ready = function(){

					var ready = {}
					var count = 0
					this.each(function(set){
						// console.log('checking', set.name, set.list)
						ready[set.name]= (set.ready())? 1: 0;
					})

					for (var set in ready) {
						count += ready[set];	
					}

					// console.log('ready',ready, count, '==', sets.length);

					return Boolean(count == sets.length);
				}
				this.done = function(){
					/*
					ready and handler has been called. 
					This set should become stale until delete.
					 */
					return (this.ready() && handled);
				}
				this.remove = function(arr) {
					// pass an array of elements to be removed
					// from the inner sets. 
					// The concept of a set collection, defines all 
					// set.list()'s elements are globally deleted when
					// an asset arrives; as all extensions (a stack) 
					// share resources.
					this.each(function(set){
						
						if(arr.length > 0) set.remove(arr);
					})
				};

				return this;
			}).apply({}, [name]);
			return setCollection;

		},

		Set: function(name, list, handler){
			/*
			A set defines a name and a list of elements.
			When the elements are removed a handler is called.
			Applied is a reduce method; to provide a 
			boolean value as return. This defines if the 
			element is ready.
			 */
			return (function Set(name, list, handler){
				// set to true when the handler has been called.
				var handled = false;

				this._class = 'Set'
				this.name = name;
				this.list = list.slice(0);
				this.handler = handler;
				this._ready = false;
				this._removeFilter;
				this.add = function(values){
					/*
					Add an element or a list of elements
					to the list.
					 */
					if(Themis.of(values, Array)) {
						this.list.concat(values);
					} else {
						this.list.push(values);
					}

					this.testHandler();
					return this;
				}

				this.ready = function(){
					if(this.list.length == 0) {
						this._ready = true;
					}
					return this._ready;
				};

				this.done = function(){
					return (this.ready && handled)
				}

				this.testHandler = function(){
					// call the handler if the set is ready.
					var _ready = this.ready()
					if(_ready) debugger;
					if(_ready && this.handler && !handled){
						console.log('AUTO HANDLER', this._class, this.name, 'HANDLE')
						this.handler(this);

						this.handled = true;
					}
				}
				
				this.removeFilter = function(fun){
					if(fun) {
						this._removeFilter = fun;
						return this;
					} else {
						return this._removeFilter;
					}

				}



				this.remove = function(values){
					/* remove one or more elements from the list */
					var _strip = function(value){

						if(this.removeFilter) {
							var r = this.removeFilter()(this, value);
						} else {
							var j = this.list.indexOf(value);
							// console.log('finding slice', value, typeof(value), 'in', slice, 'for', id)
							if(j > -1) {
								console.log('slice', value)
								this.list.splice(j, 1);
							}
						}

					};
					if(Themis.of(values, Array)) {
						for (var i = 0; i < this.list.length; i++) {
							var value = this.list[i];
							_strip(value)
						};

					} else {
						value = values;
						_strip(value);
					}

					if(values !== undefined) return this;
					return this.list;
				}

				this.testHandler()
				return this;

			}).call({}, name, list, handler);

		},
		hasSet: function(name){
			return (this._stacks.hasOwnProperty(name));
		},
		createOrReturn: function(name){
			if(!this.hasSet(name)) {
				this._stacks[name] = this.SetCollection(name);
			} 
			return this._stacks[name];
		
		},
		add: function(id, stack, values) {
			/*
			Adds to a stack
			 */
			
			/*
			Create a new boot stack to be given back
			 */
			var collection = this.createOrReturn(id);
			
			// This should be a collection element returned.
			if(!collection.has(stack)) {

				// stack should be an array
				set = this.Set(stack, values, function(){
					/*
					This is the set handler - this will be called when all
					the elements from the 'values' has been stripped from the
					Sets list.
					 */
					console.log('SET HANDLER', this.name, ' handler')
				});

				collection.add(set);
			} else {
				// console.log('add', id, stack)
				set = collection.set(stack)
				set.add(values)
			}

		},
		remove: function(_slice, value){
			var stackSize = 0,
				ready = {};

			//console.log('looking at', _slice)
			for (var id in this._stacks) {
				stackSize++;
				var collection = this._stacks[id]
				// if value in stack[slice] - remove it.
				if(collection.ready() && !collection.done()) {
					console.log('collection ready', collection.name);

					// this should occur after the 
					// required have booted.
					collection.handler();

				}else if(!collection.set(_slice)) {
					console.warn("Missing slice for", id, this._stacks, '=', collection);
				} else {
					/* Remove this element from the stack Set */
					//console.log("Slicing", _slice, value)
					var i = collection.remove(value);
				}

				if(this.finished(id)) {

					this.call(id)
				}
				
			}

			return ready;
		},
		callCollection: function(id, f, s){
			/*
			return the chain handle method assigned to
			this id. This is done automically if finished
			returns true after a remove() call.
			 */
			
			var collection = this.createOrReturn(id);
			if(f) {

				collection.handler(f);
				collection.scope(s || this);
				return this;
			};

			var h = collection.handler();
			if(h) {
				h.apply(collection.scope() || Nux, [collection, this._stacks])
			};
		},
		finished: function(id){
			/*
			If all elements within a stack entity is empty (all
			elements within the slice array have been removed using
			stripFromStack()) then true is returned.
			 */
			var setCollection;
			var ready = 0;
			var setCount = 0;
			for (var ext in this._stacks) {
				setCollection = this._stacks[ext];

				for (var name in setCollection) {
					setCount++;
					var set = setCollection[name];
					this._stacks[ext][set]
					if(set.hasOwnProperty('ready')) {
						if( set.ready() ) {
							ready += 1;
						}
					}

				}
			}
 
			var comp = setCount == ready;
			// debugger;
			return comp;
		},
		has: function(id, stack) {

			for (var prop in this._stacks[id]) {
				if(prop == stack) {
					return true
				}
			}
			return false;
		},
		expected: function(id) {
			/*
			Return an object defining arrays of elements needed.
			if an element in an array is empty, all requested
			items have been removed with stripFromStack
	
			Nux.stack.has(listener.name);
			Nux.stack.has(listener.name, 'required');
			 */
			if(id) {
				return this._stacks[id]
			}
			return this._stacks;
		}
	}
})
