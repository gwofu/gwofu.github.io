(function ( $ ) {
	var target;

	$.fn.swap = function(b){ 
		b = $(b)[0]; 
		var a = this[0]; 
		var t = a.parentNode.insertBefore(document.createTextNode(''), a); 
		b.parentNode.insertBefore(a, b); 
		t.parentNode.insertBefore(b, t); 
		t.parentNode.removeChild(t); 
		return this; 
	};


	$.fn.redraw = function(){
		return $(this).each(function(){
			var redraw = this.offsetHeight;
		});
	};

	$.fn.dragon = function( options ) {

		// This is the easiest way to have default options.
		var settings = $.extend({
			col: 3,
			row: 3,
			margin: 0,
			nop: 0,
			restrict: ''
		}, options );

		settings.parent = $(this).parent();
		var marginSize = settings.margin * 2;

		return this.each(function() {

			var colSize, rolSize;

			colSize = Math.floor((settings.parent.innerWidth() - settings.col * marginSize) / settings.col);
			rowSize = Math.floor((settings.parent.innerHeight() - settings.row * marginSize) / settings.row);

			$(this).addClass('dragon');
			$(this).width(colSize + 'px');
			$(this).height(rowSize + 'px');
			$(this).css('margin', settings.margin + 'px');

			var that = $(this);

			$.data(that, 'colSize', colSize);
			$.data(that, 'rowSize', rowSize);
			$.data(that, 'active', false);
			$.data(that, 'active', false);

			settings.firstChildOffset = $(this).parent().find(':first').offset();

			// Mouse down
			$(this).mousedown(function(e) {
				e.stopPropagation();

				var offset = that.offset();
				var originalOffset = { top: offset.top, left: offset.left };

				var x = e.pageX - offset.left;
				var y = e.pageY - offset.top;

				$.data(that, 'x', x);
				$.data(that, 'y', y);
				$.data(that, 'active', true);
				$.data(that, 'offset', offset);
				$.data(that, 'originalOffset', originalOffset);
			});

			var release = function(that) {
				$.data(that, 'active', false);
				var offset = $.data(that, 'offset');

				if (!offset) {
					return;
				}

				that.addClass('transition animated');
				var originalOffset = $.data(that, 'originalOffset');
				var targetChildIndex = getIndex(offset, settings.firstChildOffset, $.data(that, 'colSize'), $.data(that, 'rowSize'));
				var originalChildIndex = $(this).index();

				if (targetChildIndex == originalChildIndex || targetChildIndex >= that.parent().children().length) {
					that.offset(originalOffset);
					target = null;
				}
				else {
					targetChildIndex++;
					target = settings.parent.find('.dragon:nth-child(' + targetChildIndex + ')');
					target.offset(target.offset());
					target.addClass('transition animated');
					that.offset(target.offset());
					target.offset(originalOffset);
				}
				
				$.data(that, 'offset', null);
			};


			// Move element to proper position when mouseup
			$(this).mouseup(function(e) {
				e.stopPropagation();
				release(that);
			});

			// Mouse move to update position
			$(this).mousemove(function(e) {
				e.stopPropagation();
				if ($.data(that, 'active')) {
					var offset = $.data(that, 'offset');
					var x = $.data(that, 'x');
					var y = $.data(that, 'y');
		
					if (!offset) {
						return;
					}
					if (settings.restrict != 'x') {
						offset.left = e.pageX - x;
					}
					if (settings.restrict != 'y') {
						offset.top = e.pageY - y;
					}
					$(this).offset(offset);
					$.data(that, 'offset', offset);
				}
			});

			$(this).mouseleave(function(e) {
				e.stopPropagation();
				if ($.data(that, 'active')) {
					$.data(window, 'dragon.lastElement', that);
					release(that);
				}
			});

			// Transition end and clear css position
			$(this).on(
				"transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd",
				function(e) {
					if ( e.originalEvent.propertyName == 'top' || (e.originalEvent.propertyName == 'left' && settings.restrict == 'y') ) {
						$(this).removeClass("transition animated");
						this.style.top = "";
						this.style.left = "";
						this.style.position = "";

						if (target) {
							$(this).swap(target);
							target.removeClass("transition animated");
							target[0].style.top = "";
							target[0].style.left = "";
							target[0].style.position = "";
						}
					}
				}
			);

			// Get dragon item index
			function getIndex(offset, firstChildOffset, colSize, rowSize) {
				var ix = Math.floor((offset.left - firstChildOffset.left) / colSize);
				var iy = Math.floor((offset.top - firstChildOffset.top) / rowSize);
				ix = ix <= 0 ? 0 : ix;
				iy = iy <= 0 ? 0 : iy;
				return ix + settings.col * iy;
			}

		});

	};

}( jQuery ));
