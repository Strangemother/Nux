var _example = Nux.NS('example.d');

_example.myFoo = function(){
	console.log("Hey! I'm a nux extension")
	return true;
}

/* Nux extension stuff below */

_example._meta.main = function(config) {
	/*
	should boot last
	 */
	console.log("3. BOOT: example D")
}

_example._meta.required = [
	'example.e'
]