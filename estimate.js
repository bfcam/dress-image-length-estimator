(function($) {
    // Range of shoulder to waist length normally found - size M
    var STOW_RANGE = [14.5, 16];

    function getFileContents($file, callback) {
        var file = $file[0].files[0];

        if (file) {
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function (evt) {
                callback(evt.target.result);
            };

            reader.onerror = function() {
                callback(null);
            };
        }
    }

    function getImageElement($image, callback) {
        getFileContents($image, function(buffer) {
            if (!buffer) {
                callback(null);
                return;
            }

            var bin = '';
            var bytes = new Uint8Array( buffer );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                bin += String.fromCharCode( bytes[ i ] );
            }

            var $img = $('<img/>');
            $img.attr('src', 'data:image/jpeg;base64,' + btoa(bin));

            callback($img);
        });
    }

    var $form = $('form');
    var $field = $form.find('input[type="file"]');
    var $image = $('.image');
    var $imageContent = $image.find('.content');

    $image.on('click', function(e) {
        var state = $image.data('state');

        if (!state) {
            state = [];
            $imageContent.find('.line').remove();
        }

        var offset = $imageContent.find('img').offset();

        $image.removeClass('state0 state1 state2 state3').addClass('state' + (state.length + 1));

        var y = e.pageY - offset.top;
        state.push(y);
        $image.data('state', state);

        var $line = $('<div/>').addClass('line').css('top', y + 'px');
        $imageContent.append($line);

        if (state.length == 3) {
            var stow = state[1] - state[0];
            var wtoh = state[2] - state[1];

            var skirtPercent = wtoh / stow;
            var lengths = [];

            for (var i = 0; i < 2; i++) {
                var len = (skirtPercent * STOW_RANGE[i]) + STOW_RANGE[i];
                len = Math.round(len * 10) / 10;
                lengths.push(len);
            }

            $image.find('.result .range').html(lengths[0] + '" - ' + lengths[1] + '"');
            $image.removeData('state');
        }

        return false;
    });

    $form.on('submit', function() {
        $image.removeData('state');
        $image.removeClass('state1 state2 state3').addClass('state0');

        getImageElement($field, function($elem) {
            if ($elem) {
                $imageContent.html($elem);
                $image.show();
            }
        });

        return false;
    });
})(jQuery);