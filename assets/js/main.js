/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

			});

		}

		// Intro dim on scroll: update CSS vars on #intro
		(function() {
			var $i = $('#intro');
			if (!$i.length) return;
			function update() {
				var h = $i.outerHeight();
				var s = $(window).scrollTop();
				var r = Math.min(1, Math.max(0, s / h));
				// overlay opacity from 0.5 -> 1.0
				$i.css('--intro-overlay', (0.5 + 0.5 * r).toFixed(3));
				// brightness from 0.8 -> 0.5
				$i.css('--intro-brightness', (0.8 - 0.3 * r).toFixed(3));
			}
			$(window).on('scroll.introDim resize.introDim load.introDim', update);
			update();
		})();

		// Section Navigation
	// DISABLED: Single-page navigation - removed for multi-page setup
	// Navigation clicks are now handled by default browser behavior
	/*
		(function() {
			var $sections = $('#main > section');
			var $links = $('#nav .links a');
			
			// DISABLED: Show first section by default - not needed for multi-page navigation
			// $sections.hide();
			// $('#about').show();
			
			// Handle navigation clicks
			// DISABLED: Now using multi-page navigation instead of single-page
			$links.on('click', function(e) {
				e.preventDefault();
				var target = $(this).attr('href');
				
				// Update active state
				$links.parent().removeClass('active');
				$(this).parent().addClass('active');
				
				// Show target section, hide others
				$sections.hide();
				$(target).fadeIn(300);
				
				// Scroll to main smoothly
				$('html, body').animate({
					scrollTop: $('#main').offset().top - 100
				}, 500);
			});
		})();
	*/
	
	// Plans intro reveal on scroll
	(function() {
		var $intro = $('.plans-intro');
		var $icons = $('.plans-icon');
		if ($intro.length === 0) return;

		function checkAndRevealIntro() {
			if ($intro.hasClass('revealed')) return;

			var introOffset = $intro.offset();
			var windowBottom = $(window).scrollTop() + $(window).height();
			if (windowBottom > introOffset.top + 60) {
				$intro.addClass('revealed');
				$icons.addClass('revealed');
			}
		}

		$(window).on('scroll', checkAndRevealIntro);
		setTimeout(function() {
			checkAndRevealIntro();
		}, 200);
	})();
	// Pillar deployment animation on scroll
	(function() {
		var $pillars = $('.pillar');
		var $valuePillars = $('#value-pillars');

		if ($pillars.length === 0) return;

		function checkAndRevealPillars() {
			$pillars.each(function(index) {
				if ($(this).hasClass('revealed')) return;

				var $pillar = $(this);
				var pilllarOffset = $pillar.offset();
				var windowBottom = $(window).scrollTop() + $(window).height();
				
				// Cada pilar se revela cuando está cerca del viewport
				if (windowBottom > pilllarOffset.top + 80) {
					$pillar.addClass('revealed');
				}
			});
		}

		$(window).on('scroll', checkAndRevealPillars);
		
		// Check on load
		setTimeout(function() {
			checkAndRevealPillars();
		}, 200);
	})();

	// Plans intro phrases animation on scroll
	(function() {
		var $phrases = $('.plans-intro-animated');

		if ($phrases.length === 0) return;

		function checkAndRevealPhrases() {
			$phrases.each(function(index) {
				if ($(this).hasClass('revealed')) return;

				var $phrase = $(this);
				var phraseOffset = $phrase.offset();
				var windowBottom = $(window).scrollTop() + $(window).height();
				
				// Cada frase se revela cuando está cerca del viewport
				if (windowBottom > phraseOffset.top + 80) {
					$phrase.addClass('revealed');
				}
			});
		}

		$(window).on('scroll', checkAndRevealPhrases);
		
		// Check on load
		setTimeout(function() {
			checkAndRevealPhrases();
		}, 200);
	})();

	// Mobile Menu Toggle
	(function() {
		var $hamburgerBtn = $('#hamburger-btn');
		var $mobileMenu = $('#mobile-menu');
		var $body = $('body');

		// Toggle mobile menu
		$hamburgerBtn.on('click', function(e) {
			e.preventDefault();
			$mobileMenu.toggleClass('active');
			$(this).toggleClass('active');
		});

		// Close menu when clicking a link
		$('.mobile-menu-links a').on('click', function() {
			$mobileMenu.removeClass('active');
			$hamburgerBtn.removeClass('active');
		});

		// Close menu when clicking outside
		$(document).on('click', function(e) {
			if (!$(e.target).closest('#hamburger-btn, .mobile-menu').length) {
				$mobileMenu.removeClass('active');
				$hamburgerBtn.removeClass('active');
			}
		});
	})();

	// Services Accordion
	(function() {
		var $serviceItems = $('.service-item');
		if ($serviceItems.length === 0) return;

		$serviceItems.each(function() {
			var $item = $(this);
			var $toggle = $item.find('.service-toggle');

			$toggle.on('click', function() {
				var wasOpen = $item.hasClass('is-open');
				$serviceItems.removeClass('is-open');
				$serviceItems.find('.service-toggle')
					.attr('aria-expanded', 'false')
					.attr('aria-label', 'Expand plan details');

				if (!wasOpen) {
					$item.addClass('is-open');
					$(this)
						.attr('aria-expanded', 'true')
						.attr('aria-label', 'Collapse plan details');
				}

				$('body').toggleClass('services-modal-open', $('.service-item.is-open').length > 0);
			});
		});

		$(document).on('click', function(e) {
			if (!$('body').hasClass('services-modal-open')) return;
			if ($(e.target).closest('.service-item.is-open, .service-toggle').length) return;
			$serviceItems.removeClass('is-open');
			$serviceItems.find('.service-toggle')
				.attr('aria-expanded', 'false')
				.attr('aria-label', 'Expand plan details');
			$('body').removeClass('services-modal-open');
		});
	})();

	// Testimonials Carousel with Horizontal Scroll
	(function() {
		document.addEventListener('DOMContentLoaded', function() {
			const wrapper = document.querySelector('.testimonials-wrapper');
			const track = document.querySelector('.testimonials-track');
			
			if (!wrapper || !track) {
				console.log('Testimonials carousel not found');
				return;
			}

			let isDown = false;
			let startX;
			let currentTranslate = 0;

			// Mouse down - start drag
			wrapper.addEventListener('mousedown', function(e) {
				isDown = true;
				wrapper.style.cursor = 'grabbing';
				startX = e.clientX;
				track.style.animation = 'none';
			});

			// Mouse move - drag
			document.addEventListener('mousemove', function(e) {
				if (!isDown) return;
				
				const x = e.clientX;
				const walk = (x - startX) * 1.5; // Speed of drag
				const newTranslate = currentTranslate + walk;
				
				track.style.transform = 'translateX(' + newTranslate + 'px)';
			});

			// Mouse up - stop drag
			document.addEventListener('mouseup', function() {
				if (!isDown) return;
				isDown = false;
				wrapper.style.cursor = 'grab';
				
				// Get final translate value
				const transform = track.style.transform;
				const match = transform.match(/translateX\((.+)px\)/);
				if (match) {
					currentTranslate = parseFloat(match[1]);
				}
				
				// Resume animation after a brief moment
				setTimeout(() => {
					track.style.animation = 'scroll-testimonials 25s linear infinite';
				}, 100);
			});

			// Wheel scroll - only horizontal
			wrapper.addEventListener('wheel', function(e) {
				// Only respond to horizontal scroll (trackpad)
				// On Mac, horizontal scroll comes through deltaX
				// If there's vertical scroll, ignore it
				
				if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
					// Vertical scroll is more pronounced, so it's a vertical scroll - ignore
					return;
				}
				
				e.preventDefault();
				
				// Use deltaX for horizontal scroll, or deltaY if it's being used horizontally
				const scrollAmount = e.deltaX || e.deltaY * 0.5;
				const newTranslate = currentTranslate - scrollAmount;
				
				track.style.animation = 'none';
				track.style.transform = 'translateX(' + newTranslate + 'px)';
				
				// Update current translate
				currentTranslate = newTranslate;
				
				// Resume animation after scroll stops
				clearTimeout(window.wheelTimeout);
				window.wheelTimeout = setTimeout(() => {
					track.style.animation = 'scroll-testimonials 25s linear infinite';
				}, 1500);
			}, { passive: false });

			// Pause animation on hover
			wrapper.addEventListener('mouseenter', function() {
				if (!isDown) {
					track.style.animationPlayState = 'paused';
				}
			});

			// Resume animation on mouse leave
			wrapper.addEventListener('mouseleave', function() {
				if (!isDown) {
					track.style.animationPlayState = 'running';
				}
			});
		});
	})();

})(jQuery);