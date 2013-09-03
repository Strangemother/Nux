//https://github.com/malko/l.js
(function(){var e=function(e){(window.execScript||function(e){window.eval.call(window,e)})(e)},t=function(e,t){return e instanceof(t||Array)},n=document,r="getElementsByTagName",i="replace",s="match",o="length",u="readyState",a="onreadystatechange",f=n[r]("script"),l=f[f[o]-1].innerHTML[i](/^\s+|\s+$/g,"");if(typeof ljs!="undefined"){l&&e(l);return}var c=f[f[o]-1].src[s](/checkLoaded/)?!0:!1,h=n[r]("head")[0]||n.documentElement,p=function(e,t,r){var i=n.createElement(e),s;r&&(i[u]?i[a]=function(){if(i[u]==="loaded"||i[u]==="complete")i[a]=null,r()}:i.onload=r);for(s in t)i[s]=t[s];h.appendChild(i)},d=function(e,n){if(this.aliases&&this.aliases[e]){var r=this.aliases[e].slice(0);return t(r)||(r=[r]),n&&r.push(n),this.load.apply(this,r)}if(t(e)){for(var i=e.length;i--;)this.load(e[i]);return n&&e.push(n),this.load.apply(this,e)}return e[s](/\.css\b/)?this.loadcss(e,n):this.loadjs(e,n)},v={},m={aliases:{},loadjs:function(e,t){var n=e[s]("#")?e[i](/^[^#]+#/,""):null;return n&&(e=e[i](/#.*$/,"")),v[e]===!0?(t&&t(),this):v[e]!==undefined?(t&&(v[e]=function(e,t){return function(){e&&e(),t&&t()}}(v[e],t)),this):(v[e]=function(t){return function(){v[e]=!0,t&&t()}}(t),p("script",{type:"text/javascript",src:e,id:n},function(){v[e]()}),this)},loadcss:function(e,t){var n=e[s]("#")?e[i](/^[^#]+#/,""):null;return n&&(e=e[i](/#.*$/,"")),v[e]||p("link",{type:"text/css",rel:"stylesheet",href:e,id:n},function(){v[e]=!0}),v[e]=!0,t&&t(),this},load:function(){var e=arguments,n=e[o];return n===1&&t(e[0],Function)?(e[0](),this):(d.call(this,e[0],n<=1?undefined:function(){m.load.apply(m,[].slice.call(e,1))}),this)},addAliases:function(e){for(var n in e)this.aliases[n]=t(e[n])?e[n].slice(0):e[n];return this}};if(c){var g,y,b;for(g=0,y=f[o];g<y;g++)v[f[g].src]=!0;b=n[r]("link");for(g=0,y=b[o];g<y;g++)(b[g].rel==="stylesheet"||b[g].type==="text/css")&&(v[b[g].href]=!0)}ljs=m,l&&e(l)})();


(function(config){
	var NuxConfig = {
		allowGlobals: true,
		globalName: "Nux",
		globalConfigName: 'NuxConfig',
		name: "Name",
		debug: false,
		prefix: "NX",
		// Extension namespace to build an extension
		// based upon spaces loaded. - It"s at this
		// point we target another application or version 
		// foo.extension.2
		extensionNamespace: "nux.extension",
		// Load folder for extension matching the expression
		// {extennsionNamespace}.{extensionName}.js
		extensionPath: "js/nux/extensions/",
		// Call once, if only once instance of the 
		// Nux can be booted at any given time.
		runOnce: true,
		
		// Extensions allowed to be executed and implemenred
		// This should only exist in
		// core loaders and baked
		// objects
		allowed: [],

		// independant file assets  used for Nux.
		assets: {
			'agile': "js/vendor/com.iskitz.ajile.src.js?mvcoff,mvcshareoff",			
			'zoe': 	"js/vendor/zoe.js",
			'themis': ["js/vendor/themis/getterSetter.js", "js/vendor/themis/tester.js"],
			'nux': ["agile", "zoe", "themis"],
			// assets fundamental to Nux - Will be loaded first
			'required': [
				'zoe',
				'themis', 
				'agile',
				'js/nux/vendor/majaX.js',
				'js/nux/app/tools.js'
			]
		}		
	}

	var Nux = {
		// A funtion for callback defaults
		_F: function(){},

		// Default configuration for Nux.
		defaultConfiguration: NuxConfig,

		core: {
			namespace: function(name){
				/*
				Return a namespace. If the namespace
				does not exist a new emtpy object will
				be returned.
				*/
				if (name) {
					var space = Namespace( Nux.space(name));
					space._meta = {}
				} else {
					return Import(Nux.defaultConfiguration.extensionNamespace);
				}
				return space;	
			},

			space: function(name) {
				/*
				Receive the fully qualified name
				for the application NAMESPACE
				*/
				if(!name) {
					name = ''
				} else {
					name = name
				}

				if( name.indexOf(Nux.defaultConfiguration.extensionNamespace) >= 0) {
					return name
				}

				var str = Nux.defaultConfiguration.extensionNamespace + '.' + name;
				return str;
			},

			makeGlobal: function(name, entity) {
				// create a global scoped (window) object.
				// apply the global object
				if( window.hasOwnProperty(name) ) {
					throw new Error("Nux.makeGlobal: '" + name + "' already exists.");
				} else {
					window[name] = entity;
				}
			},

			globalise: function(){
				if(Nux.defaultConfiguration.allowGlobals) {
					Nux.core.makeGlobal(Nux.defaultConfiguration.globalConfigName, Nux.Config);
					Nux.core.makeGlobal(Nux.defaultConfiguration.globalName, Nux);
				}
			},

			/** @param {...string} s */
			log: function(s) {
				var msgs = [],
					orig = console.log,
			        prefix = (window== top ? '' : '[' + window.name + ']');
			    
			    var i = 0;
			    while(arguments.length){
			    	if(i == 0) { 
			    		prefix = Nux.defaultConfiguration.prefix || Nux.defaultConfiguration.globalName;
			    		prefix += ': ';
			    	} else { 
			    		prefix = '';
			    	}
			        msgs.push([].shift.call(arguments));
			        i++;
			    };
			    var isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
			    var append = ''
			    if(isChrome){
				    var stack = new Error().stack;

				   	// debugger
				    var file = stack.split("\n")[2].split(":")[2].split('/').pop();
				    if(!file)
						file = stack.split("\n")[2].split("/")[4].split("?")[0]
					line = parseInt(stack.split("\n")[2].split(":")[3], 10);
				  
					append = '> ' + file + ':' + line
				}

				// msgs.push(append)

			    orig.apply(console, msgs);
			},

			slog: function(state, string){

				var rPad10 = function rPad10(s) {
				    return s + ( "          " ).substr( s.length );
				}

				var hidden = ['handle'];
				if(!Nux.defaultConfiguration.debug) return 
				/* State log, for writing statement logs 
				unique to Nux loading */
				if(hidden.indexOf(state.toLowerCase()) == -1 ) {
					Nux.log(rPad10(state), string);
				}
			}
		}, 

		Shell: function(){
			// return a ready widget
			return loader.Class.apply(this, arguments)
		},

		settings: {
			load: function(obj, cb) {
				/*
				Load an asset file

					{
						url:'http://cd/data.csv', 
						method:'GET', 
						data:{foo:'bar',lorem:'ipsum'
					}
					{
						'url':'http://cd/data.xml', 
						'method':'GET', 
						'data':{'foo':'bar','lorem':'ipsum'}, 
						'header':{'Content-type':'text/xml'}}
					{
						url:'http://data.csv', 
						method:'GET', 
						data:{ foo:'bar',lorem:'ipsum'} }, 
						function(csv) { JSON.stringify(csv, null, '  ')
						}
					{
						url:'http://plain.txt', 
						method:'GET', 
						data:{foo:'bar',lorem:'ipsum'}
					}
					{
						url:'http://xml.xml?foo=bar&lorem=ipsum', 
						method:'DEBUG', 
						data:{foo:'bar',lorem:'ipsum'}
					}
				*/
			
				if( Themis.of(obj, String) ) {
					obj = {
						url: obj,
						method: 'GET'
					}
				}

				majaX(obj, cb);
			}
			
		},

		config: {

			default: NuxConfig,

			merge: function(){
				/* Merge config passed with default config space */
				rules = Nux.config.rules;
				return zoe.extend(Nux.defaultConfiguration, config, rules);
			},

			rules: {
				'*': 'REPLACE',
				'allowed': 'ARR_APPEND'
			},

			addAllowed: function(paths){
				
				return zoe.extend(Nux.defaultConfiguration.allowed, paths, Nux.config.rules);
			},
		},	

		assets: {
			allow: function(name) {
				/* returns true or false if the passed name is allowed
				access - this is both user defined and blacklist. 
				If an array is provided an object is returned.
				Key is the name of the iterative, value is true/false */
				if(!Themis.of(name, Array)) {
					name = [name]
				}
				if(!Nux.defaultConfiguration.hasOwnProperty('allowed')){
					Nux.log("WHAT?   Missing access allowances for", name);
					return false;
				}

				var inExtensions = false;

				name.forEach(function(_name, i, a){
					Nux.defaultConfiguration.allowed.forEach(function(s,j,b){
						if(s == name || Nux.space(s) == _name) {
							inExtensions = true;
							// Nux.log('ALLOW   ', _name)
						}
					})
				})

				if(inExtensions) {
					// Nux.log("Allow access:", name);
					return true;
				}

				Nux.log("REFUSE ASSET", name);
				return false;
			},

			add: function(obj) {
				/**
				 * assign an object of assets for use
				 * with the framework. Correctly applying 
				 * these will allow for better baking.
				 */
				if(obj) ljs.addAliases(obj);

				return this
			},

			load: function(obj, cb) {
				// clean nux string
				try {
					ljs.load(obj, cb);
				} catch(e) {
					console.log(e)
				}
			}
		},

		fetch: {
			fails: {},
			expected: [],
			listeners :{},
			chain: [],
			imported: [],	

			get: function(name){
				/*
				Perform an import utilizing the 
				namespace
				*/
				var path = arg(arguments, 1, Nux.defaultConfiguration.extensionPath);
				var cb = arg(arguments, 2, Nux._F);
				var fcb = arg(arguments, 3, null);

				if( Nux.signature.allowed(name) ) {
					// Nux.listener.add(name, cb);
					Nux.signature.expected(name, true)
					Nux.fetch._import(name, path, cb);
				} else {
					Nux.signature.addFail(name);
					if(fcb) fcb(name, path, cb);
					return false;
				}
			},
			
			load: function() {
				return Load.apply(this, arguments);
			},
		
			_import: function(name, path){
			
				var cb = arg(arguments, 1, null);
				//this.importCallbacks.append(name, cb);
				Import( name, path || Nux.defaultConfiguration.extensionPath)		
			}
		},

		listener: {
			add: function(name, handler){
				var space = Nux.space(name)
				if(!Nux.fetch.listeners.hasOwnProperty(space)){
					Nux.fetch.listeners[space] = [handler];
					
					Nux.signature.add(space)
					// Nux.core.slog("LISTENER+", "NEW " + space)
				} else {
					
					Nux.fetch.listeners[space].push(handler);
				}

				Nux.signature.add(Nux.space('core'))

				return Ajile.AddImportListener(space, Nux.listener.importHandler);
			},

			call: function(listenerObject) {
				// debugger;
				var space = Nux.space(listenerObject.name || listenerObject)
				var listeners = Nux.fetch.listeners[space];
				if(!listeners) {
					Nux.log("No listener for ", space)
					return
				}

				var defAppConfig = core._meta.applicationConfig || {};

				// Cannnot use preferable loader components loader.Import/loader.Load
				// as they haven't been imported yet.
				zoe.extend(defAppConfig, Nux.defaultConfiguration, {
					'*': zoe.extend.DFILL,
					'extensions': zoe.extend.ARR_APPEND
				})

				// extend the extension namespace and build
				// an extension around the provided namespace
				// objects.
				// defAppConfig.namespace = Namespace(defAppConfig.extensionNamespace)
				// Collect the run method from the _meta data or
				// default to the .run() method
				var runMethodName = 'run';
				var runMethod;

				if(listenerObject.item.hasOwnProperty('_meta') &&
					listenerObject.item._meta.hasOwnProperty('main') ) {
					
					if( listenerObject.item._meta.hasOwnProperty('main') ) {
						var runMethodName = listenerObject.item._meta.main;
					}

					if(typeof(runMethodName) == 'string') {
						if( listenerObject.item.hasOwnProperty(runMethodName) ) {
							// call string defined extension run method
							runMethod = extension.item[v];
						} else {
							var s = extension.name + '._meta.main defines missing method' + runMethodName
							throw new Error(s);
						}
					} else {
						runMethod = extension.item[runMethodName];
					}
					
				}

				var run = (runMethod)? runMethod(defAppConfig): listenerObject.item.run(defAppConfig);
				Nux.signature.run(listenerObject.name, run || true);

				for (var i = 0; i < listeners.length; i++) {
					var listener = listeners[i];
					listener.apply(listenerObject.item, [listenerObject, run])
				};
			},

			remove: function(name, listener){
				var space = Nux.space(name.name || name);
				// delete Nux.fetch.listeners[space]
				var listeners = Nux.fetch.listeners[space];
				// debugger;
				for (var i = 0; i < listeners.length; i++) {
					var _listener = listeners[i];
					if(_listener == listener) {
						Nux.fetch.listeners[space][i] = null;
						Nux.log("Listener removed", space, i);
					}
				};
				return Ajile.RemoveImportListener(name, Nux.listener.importHandler);
			},

			importHandler: function(listener){
				/*
				Object received through the use() method
				*/
				
				// ensure all imports have occured before we
				// call the handler
				var required = listener.item._meta.extensions;
				
				Nux.fetch.imported.push(listener.name);

				io = Nux.fetch.expected.indexOf(listener.name);

				if (io > -1) { 
					Nux.fetch.expected.splice(io, 1) 
					// Nux.signature.expected(listener.name, true)
				}

				// Nux.log('importHandler', listener.name)
				
				var callHandler = function(_listener){

					Nux.signature.receive(_listener.name || _listener);
					// Nux.core.slog("RECEIVE", _listener.name || _listener);
					Nux.listener.call.apply(Nux, [_listener]);
			
					// Ensure the entire service is only booted once.
					Nux.listener.remove(listener.name, _listener);
					
					var next = Nux.fetch.chain.shift();

					if(next) {
						Nux.use.apply(Nux, next)
					}

				}

				callHandler(listener)

				
				if(required && required.length>0) {
					
					if( Nux.assets.allow(required) ) {
						Nux.core.slog('REQUIRE', required + ' for ' + listener.name);
						// debugger;
						forEachAsync(required, function(_next, el, i, arr) {
							Nux.signature.add(el)
							console.time('WANTED ' + el, arr)
							Nux.log('ASYNCGET', el)
							debugger
							Nux.use(el, function(){
								Nux.log("Downloaded next item")
								console.timeEnd('WANTED ' + el)
								
							});

						}).then(function(){
							Nux.log("Pass listener", listener)
							callHandler(handler, listener)
						})

					} else {
						Nux.core.slog('DISALLOW', required);
					}

				}
					// No requirements	
			}
		},

		signature: {
			signatures: {},
			state: function(name){
				// return the state of an entity;
				var _n = Nux.space(name);
				return Nux.signature.signatures[_n];
			},
			add: function(obj){
				/*
				Add a signature to the map to check 
				when the extension is loading.
				 */
				// A config has loaded itself.
				if(!Nux.signature.exists(obj)) {
					Nux.signature.signatures[obj] = {};
					Nux.core.slog("WANTED", obj);
				}

				return Nux.signature.signatures[obj];

			},
			exists: function(obj) {
				// A config has loaded itself.
				return Nux.signature.signatures.hasOwnProperty(obj)
			},
			receive: function(){
				var a = arguments;
				var name = arg(a, 0, null);
				
				if(Nux.signature.expected(name)) {
					Nux.core.slog('RECEIVE', name)
					Nux.signature.signatures[name]['received'] = true;
				} else {

					Nux.signature.allowed(name, function(){
						Nux.core.slog('UNEXPECTED', 'ALLOWED ' + name);
					}, function(){
						Nux.core.slog('UNEXPECTED', 'REFUSE ' + name);
					})
				}
			},
 			run: function(name, runValue) {
 				// the imported object's run procedure has
 				// occured
 				if(Nux.signature.exists(name)) {
 					Nux.signature.signatures[name]['run'] = runValue;
    				Nux.slog("RUN", name)
 				} else {

					Nux.signature.allowed(name, function(){
						Nux.core.slog('BAD RUN', name);
					}, function(){
						Nux.core.slog('NO RUN', 'REFUSE ' + name);
					})	
 				}

 				return Nux.signature.signatures[name];
 			},
			expected: function(){
				/**
				 * return if the package name is expecting to load.
				 * This would occur between an import and receive event
				 * for the importing package.
				 * 
				 * expected() --> returns array of expected imports
				 * expected(name) --> returns bool if name is expected
				 * expected(name, bool) --> set the expecting value
				 */
				var a = arguments;
				var name = arg(a, 0, false);
				var v = null;

				if(name) {

					if (arg(a, 1, false) == true ) {
						Nux.fetch.expected.push(name);
						v = true;						
				
						if( Nux.signature.exists(name) ) {
							Nux.signature.signatures[name]['expected'] = v;
							Nux.core.slog("EXPECTED", name)
						} 

					} else {
						if(Nux.fetch.expected.indexOf(name) > -1){
							v = true
						} else {
							v = false
						}
					}
				} 

				var exp = (v)? v: Nux.fetch.expected;
				
				// Nux.signature.signatures[name]['expected'] = v
				return exp;
			},
			allowed: function(name) {
				var cb = arg(arguments, 1, null)
				var cbf = arg(arguments, 2, null)
				// returns true/false if the passed sig is
				// allowed. Pass a callback method to call 
				// in async request methods; i.e User input 
				if(cb) {
					var r = Nux.assets.allow(name);
					if(r) {
						return cb(name) || r;
					} else {
						return cbf(name) || r;

					};
				} else {
					return Nux.assets.allow(name)
				}
			},

			addFail: function(name){
				// Add a fail account against the signature
				// returns the count of fails occured

				if( Nux.fetch.fails.hasOwnProperty(name) ) {
					Nux.fetch.fails[name] += 1
				} else {
					Nux.fetch.fails[name] = 1;
				}

				if(Nux.signature.exists(name)) {
					Nux.signature.signatures[name]['fails'] = Nux.fetch.fails[name];
					Nux.core.slog("FAILED", name)					
				} else {
					Nux.core.slog("LOST FAIL", name)
				}


				return Nux.fetch.fails[name];
			},

			hasFailed: function(name){
				// Check if the signature passed (plugin name)
				// has failed returns 
				// true for failed 
				// false for a passed signature
				if( Nux.fetch.fails.hasOwnProperty(name) ) {
					return true;
				} else {
					return false;
				}
			}
		},

		use: function(name){
			var handler = arg(arguments, 1, Nux._F);
			var path = arg(arguments, 2, Nux.defaultConfiguration.extensionPath);
			this.listener.add(name, handler)
			
			console.time("IMPORT " +  name)

			this.fetch.get( this.space(name), path, function(){
				console.timeEnd("IMPORT " +  name)
			});

			var chain = this.fetch.chain;
			// Import Chain
			var hook = {
				then: function(_name){
					/*
					Chaining imports can be a nasty business.
					Use promise like then() method hooking to stop
					nesting nightmares.

					use('core').then('loader', function(){
						// core and loader imported.
					})
					*/
					var _n = Nux.space(_name);

					if(Nux.space(name) in Nux.fetch.fails) {
						Nux.core.slog("REFUSE", _n);
					} else {
						var _handler = arg(arguments, 1, Nux._F);
						// debugger
						var pri = chain.push([_n, _handler]);
						// Nux.log("with  ", _n, 'handler:', Boolean(_handler));
					}
				}
			}

			return hook
		},

		events: {

			callbacks: {
				'ready': []
			},

			ready: function(callback){
				/*  add a method to be called when the application is ready.
				If the assets are ready, the function will be called immediately. */
				if(!Nux.booted) {
					Nux.events.callbacks.ready.push(callback)
				} else {
					callback(Nux)
				}
			}
		}
	};

	/** legacy and shortcut additions. **/
	Nux['import']  		= Nux.fetch.get;
	Nux.load 			= Nux.fetch.load;
	Nux.booted 			= false;
	Nux.NS 				= Nux.core.namespace;
	Nux.space 			= Nux.core.space;
	Nux.makeGlobal 		= Nux.core.makeGlobal;
	Nux.slog 			= Nux.core.slog;
	Nux.log 			= Nux.core.log;
	Nux.onReady 		= Nux.events.ready;
	Nux.addAllowed 		= Nux.config.addAllowed;

	var init = function(config) {
		
		Nux.core.globalise();

		Nux.assets.add(Nux.defaultConfiguration.assets)
			.load(['required', 'nux'], function(){
				
				// Init assets is called from nux core js
				// at this point all defined required assets
				// have been loaded.
				Nux.config.merge(config)
			
				// Booted flag for call once.
				var booted = Nux.booted,
					cc = 0;

				if(booted && Nux.defaultConfiguration.runOnce) return booted;
				Nux.booted = true;
				
				for (var i = 0; i < Nux.events.callbacks.ready.length; i++) {
					
					Nux.events.callbacks.ready[i](Nux);
				};

				Nux.core.slog("START","Nux core has booted.");
			});
	};

	init.apply(this, arguments)

	return Nux;
})({
	name: "Foo",
	debug: true,
	// Load folder for extension matching the expression
	// {extennsionNamespace}.{extensionName}.js
	extensionPath: "js/nux/extensions/",
	vendorPath: "js/nux/vendor/",

	// Extensions allowed to be executed and implemenred
	// This should only exist in
	// core loaders and baked
	// objects
	allowed: [
	]
}).onReady(function(Nux){
	
	Nux.addAllowed([
		"nux.extension.core",
		"nux.extension.error",
		"nux.extension.loader",
		"nux.extension.packager",
		"nux.extension.alpha.signals"
	]);

	Nux.use('core', function(extension){
		Nux.core.slog("BOOTED", extension.name + ' (expecting next)');
	}).then('loader', function(extension){
		Nux.core.slog('BOOTED', 'THEN ' + extension.name);
		// stack overload.
		if(cc>10) { cc++; debugger;  };
		Nux.core.slog('FINISH', 'Nux');
	});

});

var cc = 0;