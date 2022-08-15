let shouldAutoPlayGuitar = false;
const extension = '.mp3'

const isTablet = 'ontouchstart' in document.documentElement
		|| navigator.maxTouchPoints > 0
		|| navigator.msMaxTouchPoints > 0;


/* 
  We will have differnt way of playing/flipping the audio here:

  Tablet:
    - Only one audio will be play at a time. 
    - Flip audio by pausing current playing audio, sync both audio's time and play the other one
  Desktop: 
    - Both audio will be play at the same time.
    - Flip audio by altering both audio's volume (mute one and unmute the other one).

  The Why:
  Ideally I'd want to flip the audio by changing the volume since it produce a much smoother transition than pause/play.
  But due to iOS prevents website from altering audio volume, flipping by volume won't work. Thus the pause/play approach.
*/

// 0 = Guitar / 1 = No-Guitar
let activeAudioTrack = 0;

// Fade in/out timing for switching tracks within the audio player
const playerInfoFadeInTime = 150;
const playerInfoFadeOutTime = 200;


/* Initialize some items, called on page load */
function initGuitar(){
	for(let i = 0; i < playlist.length; i++){
		$('#guitar-tracklist').append(
			`<button track-id="` + i + `" class="col-12 py-2 guitar-track-button text-left d-flex align-items-center">
			<img src="./images/guitar/track-logo-square/` + playlist[i] + `.png">
			<div class="playlist-title">` + trackTitle[i] + `<br/><p>` + trackArtist[i] + `</p></div>
			<span>` + trackDuration[i]  + `</span>
		</button>`
		);
	}

	reInitTrackGuitar(false);

	// Change things according to screen size
	$(window).on('resize', _.debounce(function() {
		//console.log("Debouncing");
		$('#volume-slider').val(audio.volume * 100).change();
		$('#seek-slider').rangeslider('update', true);
	}, 100));


	/*
		======================================================================
			MIDI Player
		======================================================================
	*/
	audio.addEventListener("timeupdate", function(){seekTimeUpdate();});
  	audio.addEventListener("ended", function(){switchTrack("next");})
	
	audio2.addEventListener("timeupdate", function(){seekTimeUpdate();});
	audio2.addEventListener("ended", function(){switchTrack("next");})

	playerButtonInit();
	playerSliderInit();
} // End init()

function playerButtonInit(){
	/* Midi playlist's song button */
	$('.guitar-track-button').click(function(){
		let thisTarget = $(this).attr('track-id');
		currentPlaylistIndex = thisTarget;
		activeAudioTrack = 0;
		reInitTrackGuitar(true);
	});

	$('.guitar-track-button-desktop').click(function(){
		let thisTarget = $(this).attr('track-id');
		currentPlaylistIndex = thisTarget;
		activeAudioTrack = 0;
		reInitTrackGuitar(true);
	});

	
	/* MIDI Button: << PREV */
	$('#guitar-prev-button').click(function(){
		// Simulate behavior of music players such as iTune
		// Restart the track if audio.currentTime is greater than 2, else go to previous track
		// This enables replay of the current track, and go to previous via double tap (if audio.currentTime is greater than 2)
		if( (activeAudioTrack === 0 && audio.currentTime > 2) || (activeAudioTrack === 1 && audio2.currentTime > 2) ){
			audio.currentTime = 0;
			audio2.currentTime = 0;
		}
		else{
			//console.log("PREV TRACK");
			switchTrack("prev");
		}
	})

	/* MIDI Button: >> NEXT */
	$('#guitar-next-button').click(function(){
		//console.log("NEXT TRACK");
		switchTrack("next");
	});

	/* MIDI Button: > Play */
	$('#guitar-play-button').click(function(){
		audio.volume = 1;
		audio2.volume = 1;

		/* if(audio.volume == 0){
			audio.volume = 0.8;
			$('#volume-slider').val(audio.volume * 100).change();
		} */
		if(audio.paused && audio2.paused && audio.readyState === 4 && audio2.readyState === 4){
			/*
				audio.readyState will return a number
				0 - No information is available about the media resource.
				1 - Enough of the media resource has been retrieved that the metadata attributes are initialized. Seeking will no longer raise an exception.
				2 - Data is available for the current playback position, but not enough to actually play more than one frame.
				3 - Data for the current playback position as well as for at least a little bit of time into the future is available (in other words, at least two frames of video, for example).
				4 - Enough data is available—and the download rate is high enough—that the media can be played through to the end without interruption.
			*/
			if(isTablet){
				// Do the audio on and off method
				if(activeAudioTrack === 0){
					// G is playing
					audio.play();
					audio2.pause();
				} else {
					// N is playing
					audio.pause();
					audio2.play();
				}
			}
			else{
				// Do the audio fading method
				if(activeAudioTrack === 0){
					// G is playing
					audio.volume = 1;
					audio2.volume = 0;
					audio.play();
					audio2.play();
				} else{
					// N is playing
					audio.volume = 0;
					audio2.volume = 1;
					audio.play();
					audio2.play();
				}
			}
			$('#guitar-play-button').html('<i class="fa fa-pause" aria-hidden="true"></i>');
		}
		else{
			audio.pause();
			audio2.pause();
			$('#guitar-play-button').html('<i class="fa fa-play" aria-hidden="true"></i>');
		}
	})
	
	$('.audio-flip-button').click(function(){
		if(isTablet){
			// IS TABLET
			if(activeAudioTrack === 0){
				// G is playing
				audio2.currentTime = audio.currentTime;
				audio2.play();
				audio.pause();
				activeAudioTrack = 1;

				// console.log("IS TABLET - IF");
				$('.audio-flip-button').animate({
					color: '#4C4C4C',
					border: '1px solid #4C4C4C'
				}, 500);
				$('.audio-flip-button').html('GUITAR OFF');
				$('.audio-flip-button').css('opacity', '0.5');
			} else {
				// N is playing
				audio.currentTime = audio2.currentTime;
				audio.play();
				audio2.pause();
				activeAudioTrack = 0;

				// console.log("IS TABLET - ELSE");
				$('.audio-flip-button').animate({
					color: '#8fc31f',
					border: '1px solid #8fc31f'
				}, 500);
				$('.audio-flip-button').html('GUITAR ON');
				$('.audio-flip-button').css('opacity', '1');
			}
		} else {
			// NOT A TABLET
			if(activeAudioTrack === 0){
				// G is playing
				audio.volume = 0;
				audio2.volume = 1;
				activeAudioTrack = 1;

				// console.log("NOT TABLET - IF");
				$('.audio-flip-button').addClass('audio-flip-button-triggered');
				$('.audio-flip-button').html('GUITAR OFF');

				//:hover
			} else {
				// N is playing
				audio.volume = 1;
				audio2.volume = 0;
				activeAudioTrack = 0;

				// console.log("NOT TABLET - ELSE");
				$('.audio-flip-button').removeClass('audio-flip-button-triggered');
				$('.audio-flip-button').html('GUITAR ON');
			}
		}
	})
}

function playerSliderInit(){
	
	/* MIDI player seeker */
	$('#seek-slider').rangeslider({
		polyfill:false,
		onInit:function(){
			seeking = false;
		},
		onSlide:function(position, value){
			if(isNaN(audio.duration)){
				$('#guitar-current-time').text(secondToString('0'));
			}
			else{
        if(activeAudioTrack === 0){
          // G is playing
          $('#guitar-current-time').text(secondToString(audio.duration * (value/100)));
        } else {
          // N is playing
          $('#guitar-current-time').text(secondToString(audio2.duration * (value/100)));
        }
			}
			//console.log('onSlide SEEK - position: ' + position, 'value: ' + value);
		},
		onSlideEnd:function(position, value){
			//console.log('onSlideEnd SEEK - position: ' + position, 'value: ' + value);
			seeking = false;
      if(isTablet){
        // Is Tablet
        if(activeAudioTrack === 0){
        // G is playing
          audio.currentTime = audio.duration * (value/100);
        } else {
          // N is playing
          audio2.currentTime = audio2.duration * (value/100);
        }
      } else {
        // Desktop
        audio.currentTime = audio.duration * (value/100);
        audio2.currentTime = audio2.duration * (value/100);
      }
		}
	});

	// For other browser
	document.getElementById('seek-slider-container').addEventListener("mousedown", function(){
		seeking = true;
	})

	document.getElementById('seek-slider-container').addEventListener("mouseup", function(){
		if(seeking == true){
			seeking = false;
		}
	})

	// For chrome
	document.getElementById('seek-slider-container').addEventListener("pointerdown", function() {
		seeking = true;
	}, false)

	document.getElementById('seek-slider-container').addEventListener("pointerup", function() {
		if(seeking == true){seeking = false;}
	}, false)

	// Mobile
	document.getElementById('seek-slider-container').addEventListener("touchstart", function() {
		seeking = true;
	})

	document.getElementById('seek-slider-container').addEventListener("touchend", function() {
		if(seeking == true){seeking = false;}
	})
}

/*
	======================================================================
		MIDI PLAYER CONTROL
	======================================================================
*/

/* File name of the tracks */
const playlist = [
	"01towerofgod", "02homura", "03gurenge", 
	"04dejavu", "05rezero", "06stb", 
	"07steinsgate", "08kaguyasama", "09kemono", "10rezeros2",
	"11kakumei-1", "12kakumei-2", "13mahouka",
	"14fma", "15shield",
	"16sdfs", "17thereason"
];

/* Track title */
const trackTitle = [
  "TOP", "炎", "紅蓮華", 
  "Deja Vu", "Paradisus-Paradoxum", "ストライク・ザ・ブラッド", 
  "Fatima", "DADDY ! DADDY ! DO !", "ようこそジャパリパークへ", "Long Shot",
  "Preserved Roses", "革命デュアリズム", "Rising Hope", 
  "Again", "RISE",
  "帅到分手", "The Reason"
];

const trackArtist = [
	"Stray Kids", "LiSA", "LiSA", 
	"Dave Rodgers", "MYTH&ROID", "岸田教団&THE明星ロケッツ", 
	"いとう かなこ", "鈴木雅之 feat. 鈴木愛理", "どうぶつビスケッツ×PPP", "前島麻由",
	"T.M.Revolution×水樹奈々", "T.M.Revolution×水樹奈々", "LiSA", 
	"Yui", "MADKID",
	"周湯豪", "Hoobastank"
];

// I think...this is more efficient than to load each audio track just to look for its duration?
const trackDuration = [
	"0:28", "0:49", "0:30", 
	"0:20", "0:29", "0:43",
	"0:44", "0:22", "0:30", "0:24",
	"0:33", "0:27", "0:26",
	"0:47", "0:17",
	"0:57", "0:53"
];

/* Track compose date */
const trackDate = [
  "May 29, 2020", "Oct 23, 2020", "Feb 14, 2020", 
  "Dec 10, 2021", "Sep 3, 2016", "Jan 19, 2014",
  "Jul 6, 2018", "May 15, 2020", "Mar 30, 2019", "Mar 19, 2021",
  "May 18, 2013", "Dec 20, 2014", "Jun 15, 2014",
  "Jul 27, 2018", "Mar 9, 2019",
  "Feb 15, 2018", "July 1, 2012"
];

/* Track description */
const trackDescription = [
	"Stray Kids / Tower of God",
	"LiSA / 劇場版 鬼滅の刃 無限列車編",
	"LiSA / 鬼滅の刃",
	"Dave Rodgers / 頭文字 D",
	"MYTH&ROID / Re：ゼロから始める異世界生活",
	"岸田教団&THE明星ロケッツ / ストライク・ザ・ブラッド",
	"いとう かなこ / Steins;Gate 0",
	"鈴木雅之 feat. 鈴木愛理 / かぐや様は告らせたい？～天才たちの恋愛頭脳戦～",
	"どうぶつビスケッツ×PPP / けものフレンズ",
	"前島麻由 / Re：ゼロから始める異世界生活\n⚠ Whammy Pedal Effect was used starting from 0:09, it was quite an experiment for me.",
	"T.M.Revolution×水樹奈々 / 革命機ヴァルヴレイヴ",
	"T.M.Revolution×水樹奈々 / 革命機ヴァルヴレイヴ",
	"LiSA / 魔法科高校の劣等生",
	"Yui / 鋼の錬金術師",
	"MADKID / 盾の勇者の成り上がり",
	"周湯豪\nA friend casually asked me to play this song, I casually added a guitar solo, and it ends up become one of my favorites.",
	"Hoobastank"
];

let audio = new Audio();
let audio2 = new Audio();

let currentPlaylistIndex = 0;
let seeking = false; // Determine if user is pressing the player seeking bar

audio.src = 'audio/guitar/' + playlist[currentPlaylistIndex] + extension;
audio.controls = true;
audio.loop = false;
audio.autoplay = false;
audio.preload = "auto";
audio.load();
audio.addEventListener('loadedmetadata', function() {
    $('#player-end-time').text(secondToString(audio.duration));
    $('#seek-slider').val('0').change();
});

audio.addEventListener('canplaythrough', function() {
//   console.log("audio1 loadeddata - " + audio.readyState, { audio });
  audioReadyStateUpdate();
});

audio2.addEventListener('canplaythrough', function() {
//   console.log("audio2 loadeddata - " + audio2.readyState, { audio2 });
  audioReadyStateUpdate();
});

audio2.src = 'audio/guitar/' + playlist[currentPlaylistIndex] + '-n' + extension;
audio2.controls = true;
audio2.loop = false;
audio2.autoplay = false;
audio2.preload = "auto";
audio2.load();

if(isTablet){
  audio.volume = 1;
  audio2.volume = 1;
} else {
  audio.volume = 1;
  audio2.volume = 0;
}

function switchTrack(direction){
	if(direction == "next"){
		if(currentPlaylistIndex == playlist.length - 1){
			currentPlaylistIndex = 0
		}
		else{
			currentPlaylistIndex++;
		}
	}
	else{
		if(currentPlaylistIndex == 0){
			currentPlaylistIndex = playlist.length - 1
		}
		else{
			currentPlaylistIndex--;
		}
	}
	//console.log("SWITCHING TO " + playlist[currentPlaylistIndex]);
	reInitTrackGuitar(true);
}

function seekTimeUpdate(){
    let activeTrack = null;
    if(activeAudioTrack === 0){
        activeTrack = audio;
    } else {
        activeTrack = audio2;
    }

	// Update seek-slider if user isn't pressing seeking bar
	if(seeking === false){
        const time = (activeTrack.currentTime / activeTrack.duration) * 100;
		// time will be NaN when the media is still loading and #seek-slider will not behave properly 
		if(isNaN(time)){
			$('#seek-slider').val('0').change();
		}
		else{
			$('#seek-slider').val(time).change();
			$('#guitar-current-time').text(secondToString(activeTrack.currentTime));
		}
	}
}

function audioReadyStateUpdate(){
	if(audio.readyState === 4 && audio2.readyState === 4 && shouldAutoPlayGuitar && audio.paused && audio2.paused){
		$('#audio-loading-text-guitar').stop();
		$('#audio-loading-text-guitar').animate({opacity:'0'}, 300, 'swing', function(){
			$('#audio-loading-text-guitar').hide();
		});
		if(isTablet){
			audio.play();
		}
		else {
			audio.play();
			audio2.play();
		}
	} else {
		// audioLoading = true;
	}
}

function reInitTrackGuitar(autoPlay){
	if(autoPlay){
		$('#audio-loading-text-guitar').show();
		$('#audio-loading-text-guitar').animate({opacity:'1'}, 200);
	}
	audio.pause();
	audio2.pause();
	audio.src = 'audio/guitar/' + playlist[currentPlaylistIndex] + extension;
	audio2.src = 'audio/guitar/' + playlist[currentPlaylistIndex] + '-n' + extension;

	activeAudioTrack = 0;
    $('.audio-flip-button').removeClass('audio-flip-button-triggered');
    $('.audio-flip-button').html('GUITAR ON');

	if(!isTablet){
		audio.volume = 1;
		audio2.volume = 0;
	} else {
		audio.volume = 1;
		audio2.volume = 1;
	}

	$('#seek-slider').val(0).change();

	if(autoPlay === false){
    	shouldAutoPlayGuitar = false;
		$('#guitar-play-button').html('<i class="fa fa-play" aria-hidden="true"></i>');
	}
	else if(autoPlay === true){
    	shouldAutoPlayGuitar = true;
		$('#guitar-play-button').html('<i class="fa fa-pause" aria-hidden="true"></i>');
  	}
  
	audio.load();
	audio2.load();

	// Fade in/out effect while changing below element's content
	$('#player-title-text').animate({opacity:'0'}, playerInfoFadeInTime, 'swing', function(){
		$('#player-title-text').html(trackTitle[currentPlaylistIndex]);
		$('#player-title-text').animate({opacity:'1'}, playerInfoFadeOutTime, 'swing');
	});
	$('#player-date-text').animate({opacity:'0'}, playerInfoFadeInTime, 'swing', function(){
		$('#player-date-text').text(trackDate[currentPlaylistIndex]);
		$('#player-date-text').animate({opacity:'1'}, playerInfoFadeOutTime, 'swing');
	});
	$('#player-description-text').animate({opacity:'0'}, playerInfoFadeInTime, 'swing', function(){
		$('#player-description-text').text(trackDescription[currentPlaylistIndex]);
		$('#player-description-text').animate({opacity:'1'}, playerInfoFadeOutTime, 'swing');
	});
	$('.player-thumbnail').animate({opacity:'0'}, playerInfoFadeInTime, 'swing', function(){
		$('.player-thumbnail').attr('src', 'images/guitar/track-logo-square/' + playlist[currentPlaylistIndex] + '.png');
		$('.player-thumbnail').animate({opacity:'1'}, playerInfoFadeOutTime, 'swing');
	});

	$('#guitar-current-time').text(secondToString(audio.currentTime));
	refreshTrackList();
}

/* Update playlist item's highlight */
function refreshTrackList(){
	let playlistChildrenMobile = $('#guitar-tracklist').children().toArray();
	let playlistChildrenDesktop = $('#player-tracklist-desktop').children().toArray();

	for(let i = 0; i <= playlist.length - 1; i++){
		if($(playlistChildrenMobile[i]).attr('track-id') == currentPlaylistIndex){
			//$(playlistChildren[i]).addClass('hovered');
			$(playlistChildrenMobile[i]).css("background-color", "rgba(143,195,31, 0.5)");
			$(playlistChildrenMobile[i]).hover(function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
			}, function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
			});

			// Repeat the same process for desktop playlist
			$(playlistChildrenDesktop[i]).css("background-color", "rgba(143,195,31, 0.5)");
			$(playlistChildrenDesktop[i]).hover(function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
			}, function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
			});
		}
		else{
			//$(playlistChildrenMobile[i]).removeClass('hovered');
			$(playlistChildrenMobile[i]).css("background-color", "rgba(143,195,31, 0.1)");
			$(playlistChildrenMobile[i]).hover(function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
				$(this).css("transition", "background-color 0s");
			}, function(){
				$(this).css("background-color", "rgba(143,195,31, 0.1)");
				$(this).css("transition", " background-color 0.15s ease-out");
			});

			// Repeat the same process for desktop playlist
			$(playlistChildrenDesktop[i]).css("background-color", "rgba(143,195,31, 0.1)");
			$(playlistChildrenDesktop[i]).hover(function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
				$(this).css("transition", "background-color 0s");
			}, function(){
				$(this).css("background-color", "rgba(143,195,31, 0.1)");
				$(this).css("transition", " background-color 0.15s ease-out");
			});
		}
	}
}
