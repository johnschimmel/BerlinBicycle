/* Author:

*/

jQuery.noConflict();

function form_labelize(){  
	jQuery(".labelize input:text, .labelize input[type=email]").clearingInput();
	
}   

jQuery(document).ready(function() {
    form_labelize();
    // iOS label click event fix
    // via http://v4.thewatchmakerproject.com/blog/how-to-fix-the-broken-ipad-form-label-click-issue/
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
		
		jQuery('label[for]').on('click',function (e) {
			var el = jQuery(this).attr('for');
			if (jQuery('#' + el + '[type=radio], #' + el + '[type=checkbox]').attr('selected', !jQuery('#' + el).attr('selected'))) {
				return;
			} else {
				jQuery('#' + el)[0].focus();
				
			}
		});
	}
	// end of iOS label fix

	jQuery("form#type_of_cyclist").on('submit', function(e){ 
		var selected = jQuery('.labelize input[type=radio]:checked').val();
		
		if (selected == undefined) {
			var msg = jQuery("#form_please_select_msg").text();
			alert(msg);
			e.preventDefault();
			return false;	
		}
		//else continue with form submission
	});
});



