(function($) {
	$('.navbar').addClass('animated bounce');
	$('#myCarousel').addClass('animated rubberBand');
	//$('img').addClass('animated rubberBand');


	/**
	 * Copyright 2012, Digital Fusion
	 * Licensed under the MIT license.
	 * http://teamdf.com/jquery-plugins/license/
	 *
	 * @author Sam Sehnert
	 * @desc A small plugin that checks whether elements are within
	 *     the user visible viewport of a web browser.
	 *     only accounts for vertical position, not horizontal.
	 */

	$.fn.visible = function(partial) {
		
		var $t            = $(this),
				$w            = $(window),
				viewTop       = $w.scrollTop(),
				viewBottom    = viewTop + $w.height(),
				_top          = $t.offset().top,
				_bottom       = _top + $t.height(),
				compareTop    = partial === true ? _bottom : _top,
				compareBottom = partial === true ? _top : _bottom;
		return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

	};

	var win = $(window);
	var allMods = $("img");

	// Already visible modules
	allMods.each(function(i, el) {
	  var el = $(el);
	  if (el.visible(true)) {
	    el.addClass("already-visible"); 
	  } 
	});

	win.scroll(function(event) {
		
		allMods.each(function(i, el) {
			var el = $(el);
			if (el.visible(true)) {
				el.addClass("animated bounceInUp");
			}
		});
		
	});

	$('.navbar-brand').hover(function() {
		$(this).addClass('animated swing');
	}, function() {
		$(this).removeClass('animated swing');
	});


})(jQuery);