/* To identify current page type and prevent typo */
const landingPage = "landing-page";
const resumePage = "resume-page";
const programmingList = "programming-list";
const musicList = "music-list";
const programmingItem = "programming-item";
const musicItem = "music-item";
let currentPageType = landingPage;

// Animation timing
const fadeOutTime = 220;
const fadeInTime = 400;

// To set resume expandable detail's height, will change accroding to page width
let resumeDetailExpandHeight = 120;

/* Initialize some items, called on page load */
function init(){
	// Initialize the main slick which holds most of the site's content
	$(".slick").slick({
		infinite: true,
		speed: 0,
		fade: true,
		arrows: false,
		cssEase: 'ease-out',
		swipe: false
	});

	removeHoverEffectIfTouchEnabled();

	// Set text according to screen size
	if($(window).width() < 840){
		document.getElementById("back-button").innerHTML = '<span><b>✕</b></span>';
		document.getElementById("programming-button").innerHTML = 'PROGM';
	}else{
		document.getElementById("back-button").innerHTML = '<span>BACK | <b>✕</b></span>';
		document.getElementById("programming-button").innerHTML = 'PROGRAMMING';
	}

	// Initialize title and buttons
	$('#title').text("");
	$('#back-button').css( "opacity", "0" );
	$('#back-button').css( "display", "none" );
	$('#demo-prev').hide();
	$('#demo-next').hide();

	// Change things according to screen size
	$(window).on('resize', _.debounce(function() {
	    //console.log("Debouncing");
	    $('#volume-slider').val(audio.volume * 100).change();
		$('#seek-slider').rangeslider('update', true);

		if($(window).width() < 840){
			document.getElementById("back-button").innerHTML = '<span><b>✕</b></span>';
			document.getElementById("programming-button").innerHTML = 'PRGMG';
		}else{
			document.getElementById("back-button").innerHTML = '<span>BACK | <b>✕</b></span>';
			document.getElementById("programming-button").innerHTML = 'PROGRAMMING';
		}
	}, 100));


	/*
		======================================================================
			Page Navigation
		======================================================================
	*/
	/* The lightbox image gallery that can be found in PROGRAMMING and DRUM, toggle via clicking the image of the demo page */
	$('.flexslider-toggle').each(function(){
		const self = this;
		$(this).magnificPopup({
			// Delay in milliseconds before popup is removed
			removalDelay: fadeOutTime,

			// Class that is added to popup wrapper and background
			// make it unique to apply your CSS animations just to this exact popup
			mainClass: 'mfp-fade',
			navigateByImgClick: false,
			closeBtnInside: false,

			items: [
			{
				src: $(this).attr('toggle-target'),
				type: 'inline'
			}
			],

			callbacks: {
				beforeOpen: function() {
			    	//console.log("Opening - " + $(self).attr('toggle-target'));
			    	$($(self).attr('toggle-target')).flexslider({
			    		startAt: 0, 
			    		directionNav : false,
			    		slideshow: false,
			    		animation:"fade",
			    		animationSpeed: 500,
			    		controlNav: false
			    	});

			    	$($(self).attr('toggle-target') + '-prev').on('click', function(){
			    		//console.log("SLIDE");
			    		$($(self).attr('toggle-target')).flexslider("previous");
			    	});  
			    	$($(self).attr('toggle-target') + '-next').on('click', function(){
			    		//console.log("SLIDE");
			    		$($(self).attr('toggle-target')).flexslider("next");
			    	});
				},
				open: function() {
					$('.slick').animate({opacity:'0'}, fadeOutTime);
					$('#demo-prev').animate({opacity:'0'}, fadeOutTime);
					$('#demo-next').animate({opacity:'0'}, fadeOutTime);
				},
				close: function(){
					// Unbind navigation button
					$($(self).attr('toggle-target') + '-prev').off('click');
					$($(self).attr('toggle-target') + '-next').off('click');

					// Remove instance
					$($(self).attr('toggle-target')).removeData('flexslider');

		    		$('.slick').animate({opacity:'1'}, fadeOutTime);
		    		$('#demo-prev').animate({opacity:'1'}, fadeOutTime);
		    		$('#demo-next').animate({opacity:'1'}, fadeOutTime);
		    	}
		    }
		})
	});

	// Button: BACK | X
	$('#back-button-container').on("click",function(){
		//console.log("#back-button-container - BACK BUTTON | X");
		if(currentPageType == programmingList || currentPageType == resumePage || currentPageType == musicList){
			switchPage(landingPage);
		}
		else if(currentPageType == programmingItem){
			switchPage(programmingList);
		}
		else if(currentPageType == musicItem){
			switchPage(musicList);
		}
	});

	// Button: Bottom - PROGRAMMING
	$("#programming-button").on("click",function(){
		switchPage(programmingList);
	});

	// Button: Bottom - RESUME
	$("#resume-button").on("click",function(){
		switchPage(resumePage);
	});

	// Button: Bottom - MUSIC
	$("#music-button").on("click",function(){
		switchPage(musicList);
	});

	$(".programming-card").on("click",function(){
		//console.log("index = " + $(this).attr('target-index'));
		switchPage(programmingItem, $(this).attr('target-index'));
	});

	$(".music-card").on("click",function(){
		//console.log("index = " + $(this).attr('target-index'));
		switchPage(musicItem, $(this).attr('target-index'))
	});

	$('#demo-prev').click(function(){
		stopAudio();
		prevNextButton("prev");

	})

	$('#demo-next').click(function(){
		stopAudio();
		prevNextButton("next");
	})

	/*
		======================================================================
			GUITAR DEMO
		======================================================================

	*/
	/* For Music -> Guitar */
	$('.video-popup-toggle').each(function(){
		const self = this;
		$(this).magnificPopup({
			// Delay in milliseconds before popup is removed
			removalDelay: 100,

			// Class that is added to popup wrapper and background
			// make it unique to apply your CSS animations just to this exact popup
			mainClass: 'mfp-fade',
			navigateByImgClick: false,
			closeBtnInside: false,
			items: [{
				src: $('<div class="container d-flex align-items-center justify-content-center"> <iframe src="https://player.vimeo.com/video/' + $(self).attr('toggle-target') + '?autoplay=1&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> </div>'),
				type: 'inline'
			}],
			callbacks: {
				beforeOpen: function() {
			    	//console.log("Opening = " + $(self).attr('toggle-target'));
				},
				open: function() {
					$('.slick').animate({opacity:'0'}, 150);
					$('#demo-prev').animate({opacity:'0'}, 150);
					$('#demo-next').animate({opacity:'0'}, 150);
				},
				close: function(){
		    		$('.slick').animate({opacity:'1'}, 150);
		    		$('#demo-prev').animate({opacity:'1'}, 150);
		    		$('#demo-next').animate({opacity:'1'}, 150);
		    	}
		    }
		})
	});
} // End init()

function removeHoverEffectIfTouchEnabled(){
	// Removes hover effect if touch is enabled
	const touch = 'ontouchstart' in document.documentElement
            || navigator.maxTouchPoints > 0
            || navigator.msMaxTouchPoints > 0;

	if (touch) { // remove all :hover stylesheets
		try { // prevent exception on browsers not supporting DOM styleSheets properly
			for (let si in document.styleSheets) {
				let styleSheet = document.styleSheets[si];
				if (!styleSheet.rules) continue;

				for (let ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
					if (!styleSheet.rules[ri].selectorText) continue;

					if (styleSheet.rules[ri].selectorText.match(':hover')) {
						styleSheet.deleteRule(ri);
					}
				}
			}
			// Disable volume control slider in midi player since sound volume can't be changed programmatically in mobile device 
			$('#volume-slider').prop("disabled", true);
			$('#midi-vol-down-icon').css('opacity', '0.5');
			$('#midi-vol-up-icon').css('opacity', '0.5');
		} catch (ex) {}
	}

}


$(document).ready(function(){
	// "Loading" text appears if the background image took more than 0.5 sec to load
	$('#loading-text').animate({opacity: 1}, 500);

	$.when(init()).then(function() {
		initMidi();
		initGuitar();

		// If something went wrong and pageLoaded is still false after 8sec, hide #loading-text and #initial-screen regardless
		setTimeout(function(){
			if(!pageLoaded){
				console.log('BG IMAGE LOAD TIMEOUT', { pageLoaded });
				$('#loading-text').hide();
				$('#initial-screen').animate({opacity:'0'}, 1500, 'swing', function(){
					$('#initial-screen').hide();
				});
			}
		}, 8000);
	});

	// Load background video for landing page
	if(!isMobileDevice()){
		let video = document.getElementById('background-video');
		video.onload(bgVideoOnLoadCallback()); // Need this here or there will be an error in the console
		const sourceMp4 = document.createElement('source');
		sourceMp4.setAttribute('src', 'video/grass-3.mp4');
		sourceMp4.setAttribute('type', 'video/mp4');
		sourceMp4.setAttribute('onerror', 'playerError()');

		video.appendChild(sourceMp4);
		//video.play();

		let playPromise = video.play();
		if (playPromise !== undefined) {
			playPromise.then(_ => {
		      // Automatic playback started!
		      // Show playing UI.
		  }).catch(error => {
		    	// Auto-play was prevented
		    	// Run alternative moving background
		    	playerError();
		  });
		}

		// If somehow the video still can't be played
		if(video.paused === true){
			video.src = "";
			video.load();
			video.remove();
			playerError();
		}
	}
	else{
		backgroundAnimation();
	}

	/* ==================== KEEP FOR STUDY PURPOSE ==================== */
	/*	$('.slick').on('beforeChange', function(event, slick, currentSlide, nextSlide){
		console.log($(slick.$slides.get(currentSlide)).attr('page-type'));
		$('#title').text($(slick.$slides.get(nextSlide)).attr('top-title'));

	});*/
}); // End $(document).ready();



/*
	======================================================================
		PAGE NAVIGATION
	======================================================================
*/

/* 
	Handle page switching

	Variables:
		currentPageType - current page type before switching

	Arguments: 	
		targetPageType - target page type to switch into
		targetPageIndex - index of the slide to show in that page
*/
function switchPage(targetPageType, targetPageIndex){

	if(currentPageType != targetPageType){
		// Stop current animation (eg. if the user switch pages rapidly and the previous animation is still going on)
		$('#title').stop();
		$('#back-button').stop();
		$('.slick').stop();

		$('#demo-prev').animate({opacity:'0'}, fadeOutTime);
		$('#demo-next').animate({opacity:'0'}, fadeOutTime);
		$('#title').animate({opacity:'0'}, fadeOutTime);
		$('.slick').animate({opacity:'0'}, fadeOutTime, 'swing', function(){

			// Re-filter .slick
			$('.slick').slick('slickUnfilter');
	    	$('.slick').slick('slickFilter', "[page-type= '" + targetPageType +"']");
	    	$('.slick').slick('slickGoTo', targetPageIndex, false);

	    	if(targetPageType === musicItem){
	    		$('#midi-tracklist-container-scroller').nanoScroller();
	    		$('#guitar-tracklist-container-scroller').nanoScroller();
	    		$('#volume-slider').rangeslider('update', true);
	    		$('#volume-slider-midi').rangeslider('update', true);
				$('#seek-slider').rangeslider('update', true);
				$('#seek-slider-midi').rangeslider('update', true);
	    	}

	    	$('.slick').animate({opacity:'1'}, fadeInTime, 'swing');

	    	// Show navigation buttons (PREV & NEXT) only in programmingItem/musicItem pages
	    	if(currentPageType == programmingItem || currentPageType == musicItem){
	    		$('#demo-prev').show();
				$('#demo-next').show();
	    		$('#demo-prev').animate({opacity:'1'}, fadeInTime);
				$('#demo-next').animate({opacity:'1'}, fadeInTime);
	    	}
	    	else{
	    		$('#demo-prev').hide();
				$('#demo-next').hide();
	    	}

	    	// Change top title
	    	const currentIndex = $(".slick").slick("slickCurrentSlide");
			let $slides = $(".slick").slick("getSlick").$slides;
			const topTitle = $slides.eq( currentIndex ).attr('top-title');
			$('#title').text(topTitle);
	    	$('#title').animate({opacity:'1'}, fadeInTime, 'swing');

	    });

		// Destroy nanoscroller plugin
		// Placed outside of animation because currentPageType and targetPageType will already be the same after animation delay
		// if(targetPageType != musicItem){
			//console.log("Destroying nanoscroller");
			// stopAudio();
			// Destroy after 300 miliseconds so that the user won't see it destroying before the slide faded out
			// setTimeout(function(){
			// 	$(".nano").nanoScroller({ destroy: true });
			// }, 300);
		// }

		if((currentPageType != landingPage) && (targetPageType == landingPage)){
    		//Back to landing page
    		changeTextColor(true);
    	}
    	else if((currentPageType == landingPage) && (targetPageType != landingPage)){
    		// From landing page to somewhere else
    		changeTextColor(false);
    	}
	    currentPageType = targetPageType;
	}
}

/* Change buttons font color to black when user navigate from landing page to other page */
function changeTextColor(isLandingPage){
	$('#navigation-bottom button').toggleClass('black');
	$("#navigation-bottom .row .bottom-vertical-divider").toggleClass('black');

	if(isLandingPage){
		$('#background-video-container').animate({opacity:'1'}, fadeInTime, 'swing');
		$('#back-button').animate({opacity:'0'}, fadeInTime);
		$('#back-button').hide(fadeInTime);
	}
	else{
		$('#background-video-container').animate({opacity:'0'}, fadeInTime, 'swing');
		$('#back-button').show();
		$('#back-button').animate({opacity:'1'}, fadeInTime);
	}
}

/* PREV/NEXT button in programming-item and music-item page */
function prevNextButton(direction){
	$('#title').stop();
	$('.slick').stop();
	$('#title').animate({opacity:'0'}, fadeOutTime);
	$('.slick').animate({opacity:'0'}, fadeOutTime, 'swing', function(){

		if(direction == "prev"){
    		$('.slick').slick('prev');
    	}
    	else if (direction == "next"){
    		$('.slick').slick('next');
    	}
    	$('.slick').animate({opacity:'1'}, fadeInTime, 'swing');

    	// Change top title
    	const currentIndex = $(".slick").slick("slickCurrentSlide");
		let $slides = $(".slick").slick("getSlick").$slides;
		const topTitle = $slides.eq( currentIndex ).attr('top-title');
		$('#title').text(topTitle);
    	$('#title').animate({opacity:'1'}, fadeInTime, 'swing');
    });
}


/*
	======================================================================
		RESUME DETAIL
	======================================================================
*/
let previousExpandedDetailID = "";

function toggleDetail(id) {
	if(previousExpandedDetailID != id && previousExpandedDetailID != ""){
		//console.log("PREVIOUS DETAIL");
		document.getElementById(previousExpandedDetailID+"-toggle").innerHTML = '<i class="fa fa-angle-right" aria-hidden="true"></i>' + " " + document.getElementById(previousExpandedDetailID+"-toggle").getAttribute("value");
		document.getElementById(previousExpandedDetailID).style.maxHeight = '0px';
		document.getElementById(previousExpandedDetailID).style.marginBottom = '0px';
		previousExpandedDetailID = id;
	}

	if (document.getElementById(id).style.maxHeight == '0px') {
    	document.getElementById(id+"-toggle").innerHTML = '<i class="fa fa-angle-down" aria-hidden="true"></i>' + " " + document.getElementById(id+"-toggle").getAttribute("value");
    	// document.getElementById(id).style.height = resumeDetailExpandHeight + 'px';
    	document.getElementById(id).style.maxHeight = resumeDetailExpandHeight + 'px';
    	document.getElementById(id).style.marginBottom = '20px';
    	previousExpandedDetailID = id;
    }
    else {
        document.getElementById(id+"-toggle").innerHTML = '<i class="fa fa-angle-right" aria-hidden="true"></i>' + " " + document.getElementById(id+"-toggle").getAttribute("value");
        document.getElementById(id).style.maxHeight = '0px';
		document.getElementById(id).style.marginBottom = '0px';
        previousExpandedDetailID = id;
    }
}

// /* Stop the audio and reset the current play time */
function stopAudio(){
	shouldAutoPlayGuitar = false;
	shouldAutoPlayMidi = false;
	reInitTrackGuitar(false);
	reInitTrackMidi(false);
}

/* Convert second into MM:SS format */
function secondToString(input){
	const min = Math.floor(input / 60);
	let sec = Math.floor(input - min * 60);
	if(sec < 10){sec = "0" + sec;}

	return (min + " : " + sec);
}

/*
	======================================================================
		BACKGROUND VIDEO /IMAGE
	======================================================================
*/

// Detect if the website is running on a mobile device
function isMobileDevice() {
	return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

// If somehow the video still can't be played
function playerError(){
	backgroundAnimation();
}

function backgroundAnimation(){
	// Substitute by moving the background around 
	$('#background-video-container').css("animation", "background-animationX 12s infinite, background-animationY 8s infinite");
	$('#background-video-container').css("animation-timing-function", "ease-in-out");
	//$('#background-video-container').css("animation-iteration-count", "infinite");
}
