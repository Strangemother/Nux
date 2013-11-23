$(document).ready(function(){
	
	$('button.import').click(function(){
		var self = $(this);
		Nux.use(self.text(), function(){
			self.addClass('imported');
		})
	})

	$('.switch').click(function(){
		localStorage.theme = $('.switch input')[0].checked
		$('body').toggleClass('dark', $('.switch input')[0].checked);
		
	})

	if(localStorage.theme == 'true') {
		$('body').addClass('dark');
		$('.switch input')[0].checked = true
	}


})

;Nux
// First the boot, applying a set of rules to
// boot your nux object.
.boot({
	// Boot a full Nux system complete with batteries.
	// refer to nux.extension.kernel
	kernel: false,
	// console logs and test are implemented if required.
	debug: false,
	// Asset path loads the files required for the extension
	// from this location. This should map to your
	// JS folder relative to the location of this
	// boot config
	assetPath: '../src/js/nux/assets',
	// Load folder for extension matching the expression
	extensionPath: "../src/js/nux/extensions/",
	vendorPath: "../src/js/vendor",
	required: false,
}).onReady(function(){
	console.log("Nux ready")
})
