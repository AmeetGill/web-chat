var lat, lng;
$(document).ready(function () {
    console.log('ready!?')
    if (localStorage.getItem('user_type') == 3) {
        window.location = "/driver.php";
    }

    //setup before functions
    var typingTimer;                //timer identifier
    var doneTypingInterval = 200;  //time in ms, 5 second for example
    var $input = $('#myInput');


    $('section video').click(function () {
        $('#landingPage-AutoCompleteResultsStyle,#insusug').fadeOut();
    });
}); //end ready

$('.signupbtn').click(function () {
    $('#signupbox,#modalbg').fadeIn();
});


$('#modalbg,#signupbox img,#modalorderdetails .closebtn,#symptombox img').click(function () {
    $('.toRemoveFromPopup').remove()   //for symptom condition pop up
    $('.toRemoveFromPopupAtLast').remove()
    $('.toRemoveFromSpecialtyPopup').remove()
    $('#signupbox,#symptombox,#modalbg,#modalupload,#modalorderdetails,#modaladdreview,#modaladdreply').fadeOut();
});


$('#bioSearchBox,#searchTextField').keyup(function () {
    if ($(this).val() != "") {
        $('#searchoption').fadeIn();
    }
    else {
        $('#searchoption').fadeOut();
    }
});

$('#searchoption li.item').click(function () {
    $('#bioSearchBox,#searchTextField').val($(this).html());
    $('#searchoption').fadeOut();
});

$('.geolocation').click(function () {
    if (!$(this).hasClass('active')) {
        var span = $('span', this).html();
        $('span', this).remove();
        $('.location', this).append('<input id="geoloc" type="text" value="' + span + '">');
        $('.location input', this).select();
        $(this).addClass('active');

        var input = document.getElementById('geoloc');
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            var newlong = place.geometry.location.lng();
            var newlat = place.geometry.location.lat();
            var zip = "";

            $('#searchform input[name=lat]').val(newlat);
            $('#searchform input[name=lng]').val(newlong);

            for (var i = 0, len = place.address_components.length; i < len; i++) {
                var ac = place.address_components[i];
                if (ac.types.indexOf('postal_code') >= 0) {
                    zip = ac.long_name;
                }

                if (ac.types.indexOf('administrative_area_level_1') >= 0) {
                    state = ac.short_name;
                }

                if (ac.types.indexOf('locality') >= 0) {
                    city = ac.long_name;
                }
            }
            $("#geoloc").val(place.formatted_address.replace(", USA", ""));

        });
    }
});

$('.orange-toggle').click(function () {
    var par = $(this).parent().parent();

    if ($(this).hasClass('toggle-close')) {
        $(this).removeClass('toggle-close');
        $(this).addClass('toggle-open');
        $(this).attr('src', '/img/icon02.jpg');
        $(par).height($('.answer', par).height() + 63);
    }
    else {
        $(this).removeClass('toggle-open');
        $(this).addClass('toggle-close');
        $(this).attr('src', '/img/icon03.jpg');
        $(par).css('height', '103px');
    }

    // if($(par).hasClass('closeq'))
    // {
    //     $(par).removeClass('closeq');
    //     $(par).addClass('openq');
    // }
    // else
    // {
    //     $(par).removeClass('openq');
    //     $(par).addClass('closeq');
    // }
});

/*-----------------Homepage coordinates------------------------*/
//--MONKEY FIX GEO LOCATION--
var latLong;
if (navigator.geolocation) {
    var geoSuccess = function (position) {
        startPos = position;
        $('#searchform input[name=lat]').val(startPos.coords.latitude);
        $('#searchform input[name=lng]').val(startPos.coords.longitude);
        $.ajax({
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${startPos.coords.latitude},${startPos.coords.longitude}
            &key=AIzaSyAJTeARWO9S1h3j826E-wHkA3pND4fYAJ4`,
            success: function (res) {
                console.log(res)
                var loc = res.results[0].formatted_address;
                $('.geolocation').html('<div class="location">' + '<img src="/img/location.svg" alt="">' + ' Your location:' + '<span>' + loc + '</span>' + '</div>');
            }
        })

    };
    navigator.geolocation.getCurrentPosition(geoSuccess);

}
else {
    alert('your browser dont support geolocation so you have to enter it manually')
}

// $.getJSON("https://ipinfo.io", function(ipinfo){
//     latLong = ipinfo.loc.split(",");
//     var state = "";

//     if(ipinfo.state)
//     {
//         state = ipinfo.state;
//     }
//     else
//     {
//         state = ipinfo.region;
//     }

//     $('#searchform input[name=lat]').val(latLong[0]);
//     $('#searchform input[name=lng]').val(latLong[1]);
//     $('.geolocation').html('<div class="location">'+'<img src="/img/location.svg" alt="">'+' Your location:' + '<span>' + ipinfo.city + ', ' + ipinfo.region + ' ' + ipinfo.postal +'</span>' + '</div>');
// });

/*
var count = 12345;
function tick(){
    count += Math.round(Math.random()*5);
    $('span#counter').text(count);
    setInterval(function(){
      count++;
    }, 1000);
}

tick();
*/

var counter = 18326;
var counterInt = ("" + counter).split("");
$(".deliveries div").html(
    "<span>" + counterInt[0] + "</span>" +
    "<span>" + counterInt[1] + "</span>" +
    "<span>" + counterInt[2] + "</span>" +
    "<span>" + counterInt[3] + "</span>" +
    "<span>" + counterInt[4] + "</span>"
);

setInterval(function () {
    var counterInt = ("" + counter).split("");
    $(".deliveries div").html(
        "<span>" + counterInt[0] + "</span>" +
        "<span>" + counterInt[1] + "</span>" +
        "<span>" + counterInt[2] + "</span>" +
        "<span>" + counterInt[3] + "</span>" +
        "<span>" + counterInt[4] + "</span>"
    );

    counter++;
}, 150000);


// navigator.geolocation.getCurrentPosition(function (pos) {

//     var geocoder = new google.maps.Geocoder();
//     var lat = pos.coords.latitude;
//     var lng = pos.coords.longitude;

//     $('#searchform input[name=lat]').val(lat);
//     $('#searchform input[name=lng]').val(lng);


//     var latlng = new google.maps.LatLng(lat, lng);

//     geocoder.geocode({ 'latLng': latlng }, function (results, status) {
//         var result = results[0];
//         var state = '';
//         var city = '';
//         var zip = '';

//         for (var i = 0, len = result.address_components.length; i < len; i++) {
//             var ac = result.address_components[i];
//             if (ac.types.indexOf('locality') >= 0) {
//                 city = ac.short_name;
//             }
//             if (ac.types.indexOf('administrative_area_level_1') >= 0) {
//                 state = ac.short_name;
//             }
//         }

//         $('.geolocation').html('<div class="location">'+'<img src="/img/location.svg" alt="">'+' Your location:' + '<span>' + city + ', ' + state +'</span>' + '</div>');

//     });
// });
