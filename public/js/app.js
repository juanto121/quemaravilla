// Flexslider
$(function() {
	/* FlexSlider */
	$('.flexslider').flexslider({
		animation : "fade",
		directionNav : false
	});

	new WOW().init();
});

// isotope
jQuery(document).ready(function($) {
	if ($('.iso-box-wrapper').length > 0) {
		var $container = $('.iso-box-wrapper'), $imgs = $('.iso-box img');
		$container.imagesLoaded(function() {
			$container.isotope({
				layoutMode : 'fitRows',
				itemSelector : '.iso-box'
			});

			$imgs.load(function() {
				$container.isotope('reLayout');
			})
		});

		// filter items on button click
		$('.filter-wrapper li a').click(function() {
			var $this = $(this), filterValue = $this.attr('data-filter');
			$container.isotope({
				filter : filterValue,
				animationOptions : {
					duration : 750,
					easing : 'linear',
					queue : false,
				}
			});

			// don't proceed if already selected
			if ($this.hasClass('selected')) {
				return false;
			}

			var filter_wrapper = $this.closest('.filter-wrapper');
			filter_wrapper.find('.selected').removeClass('selected');
			$this.addClass('selected');
			return false;
		});
	}
});

// Hide mobile menu after clicking on a link
$('.navbar-collapse a').click(function() {
	$(".navbar-collapse").collapse('hide');
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
	$('.navbar-default a, a').bind('click', function(event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop : $($anchor.attr('href')).offset().top - 68
		}, 1000);
		event.preventDefault();
	});
});