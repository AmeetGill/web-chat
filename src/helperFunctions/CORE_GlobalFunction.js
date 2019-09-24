if (typeof app_url === "undefined"){
  var server = window.location.hostname;

}
if (localStorage.getItem('user_type') == null) {
    console.log('remove')
    $('.calendar-link').remove();
    $('.od.foruser').remove();
}else {
    $('.invi-search-header-form').addClass('search-header-form');
}

var qval,ins,q,i,lat,lng,type;

var user_lat;
var user_long;
var userprofile;
var cc_info;
var btid; var indexprocedure = 0;
var typingTimer;                //timer identifier
var doneTypingInterval = 200;  //time in ms, 5 second for example

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1] || '';
        }
    }

    return '';
};

function insurance() {
	var val = $('input[name=insurance]').val();
	var par = $('input[name=insurance]').parent();
	var width = $('input[name=insurance]').width()+26;
	$('ul',par).css('width',width+'px');
	$('ul',par).empty();
	if(val.split('').length > 2)
	{
		//insurance
        $.get(app_url+'/v1/search/insurance?q='+val,function(data){
            var x = 0;
            if(data)
            {
                for(var x = 0;x < data.length ; x++){
                    var insurance = data[x].plan;
                    var li_class = (x == 0)?'class="active"':'';
                    $('ul',par).append("<li "+li_class+">"+insurance+"</li>");

                    if(x == 4)
                    {
                        break;
                    }
                }

                $('ul li',par).click(function(){
                	$('input[name=insurance]',par).val('');
		        	var item = '<div class="item-selected"><span class="item-text">'+$(this).html()+'</span> <img src="img/close-pop-up-10-x-10.png"></div>';
                    
                    if($('#selected_insurance_group').length > 0) { 
                        $('#selected_insurance_group').append(item);
                        $('input[name=insurance]').trigger('focus');
                    }else{
                        $('input[name=insurance]').val($(this).text())
                    }
                    
                	$('ul',par).hide();
                });
            }
        });
		$('ul',par).show();
	}
	else
	{
		$('ul',par).hide();
	}
}

function moveSelectionDown(fieldName)
{
	var totalItems = $('.suggestionbox.'+fieldName+' li').length;
	if( totalItems > 0) {
		active_li = $('.suggestionbox.'+fieldName+' li.active');
		activeIndex = $('.suggestionbox.'+fieldName+' li').index(active_li);
		if(activeIndex < (totalItems -1)){
			$('.suggestionbox.'+fieldName+' li.active').removeClass('active');
			activeIndex++;
			next_li = $('.suggestionbox.'+fieldName+' li:eq('+activeIndex+')');
			next_li.addClass('active');
			$('.suggestionbox.'+fieldName).animate({
				scrollTop: (activeIndex * 30)
			}, 200);
		}
	}
}

function moveSelectionUp(fieldName)
{
	var totalItems = $('.suggestionbox.'+fieldName+' li').length;
	if( totalItems > 0) {
		active_li = $('.suggestionbox.'+fieldName+' li.active');
		activeIndex = $('.suggestionbox.'+fieldName+' li').index(active_li);
		if(activeIndex > 0){
			$('.suggestionbox.'+fieldName+' li.active').removeClass('active');
			activeIndex--;
			prev_li = $('.suggestionbox.'+fieldName+' li:eq('+activeIndex+')');
			prev_li.addClass('active');
			$('.suggestionbox.'+fieldName).animate({
					scrollTop: (activeIndex * 30)
			}, 200);
		}
	}
}

function autosuggestionKeyUpEvents(e, fieldName)
{
	switch(e.which){
			case 40://Down key
			moveSelectionDown(fieldName);
			break;

			case 38: //Up key
			moveSelectionUp(fieldName);
			break;

			case 13: //Enter
			makeSelection(fieldName,'selected_'+fieldName+'_group');
			break;

			default:
			clearTimeout(typingTimer);
	                typingTimer = setTimeout(function(){
	        	if(fieldName == 'languages'){
		            languages();
		        } else if(fieldName == 'specialty'){
		            specialty();
		        } else if(fieldName == 'insurance'){
		        	insurance();
		        } else if (fieldName == 'symptom') {
					symptom();
				}
	        }, doneTypingInterval);
	    }
}

    $('body').on('click', 'div.item-selected img', function () {
        var this_parent = $(this).parent();
        this_parent.remove();
    });

	//*** INSURANCE START ***//
	$('input[name=insurance]').click(function(){
		insurance();
	});

	$('input[name=insurance]').keyup(function(e){
		autosuggestionKeyUpEvents(e, 'insurance');
	});
    //*** INSURANCE END ***//

    

	//*** SYMPTOM START ***//    
	$('input[name=symptom]').click(function () {
		symptom();
	});

	$('input[name=symptom]').keydown(function (e) {
		autosuggestionKeyUpEvents(e, 'symptom');
	});
	//*** SYMPTOM END ***//
    
    function setAutoCompleteAddress(){
      var input = document.getElementById('address');
      var autocomplete = new google.maps.places.Autocomplete(input);
      var place,zip,city,state,newlong,newlat;

      google.maps.event.addListener(autocomplete, 'place_changed', function () {
          place = autocomplete.getPlace();
          newlong = place.geometry.location.lng();
          newlat = place.geometry.location.lat();
          $('#address').val(place.formatted_address.replace(", USA",""));

          $('input[name=lat]').val(newlat);
          $('input[name=lng]').val(newlong);

          for (var i = 0, len = place.address_components.length; i < len; i++) {
              var ac = place.address_components[i];
              if (ac.types.indexOf('postal_code') >= 0) {
                  zip = ac.long_name;
                  $('input[name=zip]').val(zip);
              }

              if (ac.types.indexOf('administrative_area_level_1') >= 0) {
                  state = ac.short_name;
                  $('input[name=state]').val(state);
              }

              if (ac.types.indexOf('locality') >= 0) {
                  city = ac.long_name;
                  $('input[name=city]').val(city);
              }
          }

      });

      function auto_grow(element) {
          element.style.height = "5px";
          element.style.height = (element.scrollHeight)+"px";
      }
    }



if(localStorage.getItem('user_type')==3)
{
    var settings_user = {
         "async": true,
         "crossDomain": true,
         "url": app_url+"/v1/driver",
         "method": "GET",
         "headers": {
            "content-type": "application/json",
            "authorization": localStorage.getItem('user_token')
         }
    }
    $.ajax(settings_user).done(function (response) {
        userprofile = response;
        $('#modalsettings input[name=id]').val(userprofile.ID);
        $('#modalsettings input[name=email]').val(userprofile.email);
        $('header .account label').html(response.firstName+" "+response.lastName);
        $.getJSON("https://ipinfo.io", function(ipinfo){
            latLong = ipinfo.loc.split(",");
            user_lat = latLong[0];
            user_long = latLong[1];

            // GET USER DELIVERIES
            var settings_user = {
                 "async": true,
                 "crossDomain": true,
                 "url": app_url+"/v1/deliveries",
                 "method": "GET",
                 "headers": {
                    "content-type": "application/json",
                    "authorization": localStorage.getItem('user_token')
                 }
            }
            $.ajax(settings_user).done(function (response) {
                addcard(response);
                $('.patients-list .box-footer .col4').click(function(){
                      var id = $(this).html();
                      // GET ORDER DETAIL
                      var settings_user = {
                           "async": true,
                           "crossDomain": true,
                           "url": app_url+"/v1/order/"+$(this).html().replace("#FN-",""),
                           "method": "GET",
                           "headers": {
                              "content-type": "application/json",
                              "authorization": localStorage.getItem('user_token')
                           }
                      }

                      $.ajax(settings_user).done(function (response) {
                          var dropoffvalname="",pickupvalname="";
                          var tmp1 = response.order.dropoffPackageSmallName.split(',');
                          var tmp2 = response.order.dropoffPackageLargeName.split(',');
                          var tmp3 = response.order.pickupPackageSmallName.split(',');
                          var tmp4 = response.order.pickupPackageLargeName.split(',');
                          if(tmp1.length > 1)
                          {
                              dropoffvalname = response.order.dropoffPackageSmallName;
                          }
                          else
                          {
                              if(tmp1[0]!="")
                              {
                                  dropoffvalname = tmp1[0];
                              }
                          }
                          if(tmp2.length > 1)
                          {
                              dropoffvalname += ", "+response.order.dropoffPackageLargeName;
                          }
                          else
                          {
                              if(tmp2[0]!="")
                              {
                                  dropoffvalname += ", "+tmp2[0];
                              }
                          }
                          if(tmp3.length > 1)
                          {
                              pickupvalname = response.order.pickupPackageSmallName;
                          }
                          else
                          {
                              if(tmp3[0]!="")
                              {
                                  pickupvalname = tmp3[0];
                              }
                          }
                          if(tmp4.length > 1)
                          {
                              pickupvalname += ", "+response.order.pickupPackageLargeName;
                          }
                          else
                          {
                              if(tmp4[0]!="")
                              {
                                  pickupvalname += ", "+tmp4[0];
                              }
                          }

                          var tmpdate = response.order.deliveryDate.split('T');
                          var tmpdate2 = tmpdate[0].split('-');
                          var deliverydate = tmpdate2[1]+"/"+tmpdate2[2]+"/"+tmpdate2[0];

                          if(response.order.deliverySchedule == "Rush")
                          {
                              var tmptime = response.order.deliveryTime.split(":");
                              if(parseInt(tmptime[0])<12)
                              {
                                 var ampm = " PM";
                              }
                              else
                              {
                                  var ampm = " AM";
                              }

                              var deliverytime = response.order.deliveryTime+ampm;
                          }
                          else
                          {
                              var deliverytime = response.order.deliverySchedule;
                          }

                          var dropoffval = parseInt(response.order.dropoffPackageLarge) + parseInt(response.order.dropoffPackageSmall);
                          var pickupval = parseInt(response.order.pickupPackageLarge) + parseInt(response.order.pickupPackageSmall);
                          $('#modalorderdetails .name').html(response.order.pickupName);
                          $('#modalorderdetails .clinic').html(response.order.pickupLocationName);
                          $('#modalorderdetails .address').html('<img class="icons address-icon" src="img/location-icon.png" alt=""> '+response.order.pickupAddress+"<br>"+response.order.pickupCity+", "+response.order.pickupState+" "+response.order.pickupZip);
                          $('#modalorderdetails .col4').html(deliverytime); // id
                          $('#modalorderdetails .col6').html("$"+response.order.price);
                          $('#modalorderdetails .col5').html(deliverydate);
                          $('#modalorderdetails .dropoffvalsmall').html(response.order.dropoffPackageSmall);
                          $('#modalorderdetails .dropoffvallarge').html(response.order.dropoffPackageLarge);
                          $('#modalorderdetails .pickupvalsmall').html(response.order.pickupPackageSmall);
                          $('#modalorderdetails .pickupvallarge').html(response.order.pickupPackageLarge);
                          $('#modalorderdetails .dropoffvalname').html(dropoffvalname);
                          $('#modalorderdetails .pickupvalname').html(pickupvalname);
                          $('#modalorderdetails,#modalbg').fadeIn();
                      });
                  });
                initializedeliveries();
            });
        });
    });
}
else if(localStorage.getItem('user_type')==2)
{
  var settings_user = {
         "async": true,
         "crossDomain": true,
         "url": app_url+"/v1/lab",
         "method": "GET",
         "headers": {
            "content-type": "application/json",
            "authorization": localStorage.getItem('user_token')
         }
    }
    $.ajax(settings_user).done(function (response) {
          btid = response.braintree_id;
          userprofile = response;

          if(userprofile.mainSpecialtyID.indexOf(",") > -1)
          {
              var tmpspecialty = userprofile.mainSpecialtyID.split(',');
              var specialty = tmpspecialty[0];
          }
          else
          {
              var specialty = userprofile.mainSpecialtyID;
          }

          $('#modalsettings input[name=email]').val(userprofile.email);
          $('#modalsettings input[name=id]').val(userprofile.ID);
          $('header .account label').html(response.firstName+" "+response.lastName);
          if(response.picture!="")
          {
              $('header .account .img-holder img').attr('src',response.picture.replace("http://","//"));
          }
          else
          {
              if(specialty.toLowerCase() == "dental lab" || specialty.toLowerCase() == "dentist")
              {
                  $('header .account .img-holder img').attr('src','/img/dentist-img.png');
              }
              else
              {
                var profileImage = response.gender == 'Male' ? '/coreIMAGES/doctor_male.svg' : '/coreIMAGES/doctor_female.svg';
                  
                $('header .account .img-holder img').attr('src', profileImage);
              }
          }

          user_lat = parseFloat(response.latitude);
          user_long = parseFloat(response.longitude);

          if($('.orderlink').hasClass('active'))
            {
                // GET USER ORDERS
                var settings_user = {
                     "async": true,
                     "crossDomain": true,
                     "url": app_url+"/v1/orders",
                     "method": "GET",
                     "headers": {
                        "content-type": "application/json",
                        "authorization": localStorage.getItem('user_token')
                     }
                }
                $.ajax(settings_user).done(function (response) {
                    addcard(response);

                    $('.order-list .box-footer .col4').click(function(){
                        var id = $(this).html();
                        // GET USER ORDERS
                        var settings_user = {
                             "async": true,
                             "crossDomain": true,
                             "url": app_url+"/v1/order/"+$(this).html().replace("#FN-",""),
                             "method": "GET",
                             "headers": {
                                "content-type": "application/json",
                                "authorization": localStorage.getItem('user_token')
                             }
                        }

                        $.ajax(settings_user).done(function (response) {
                            var dropoffvalname="",pickupvalname="";
                            var tmp1 = response.order.dropoffPackageSmallName.split(',');
                            var tmp2 = response.order.dropoffPackageLargeName.split(',');
                            var tmp3 = response.order.pickupPackageSmallName.split(',');
                            var tmp4 = response.order.pickupPackageLargeName.split(',');
                            if(tmp1.length > 1)
                            {
                                dropoffvalname = response.order.dropoffPackageSmallName;
                            }
                            else
                            {
                                if(tmp1[0]!="")
                                {
                                    dropoffvalname = tmp1[0];
                                }
                            }
                            if(tmp2.length > 1)
                            {
                                dropoffvalname += ", "+response.order.dropoffPackageLargeName;
                            }
                            else
                            {
                                if(tmp2[0]!="")
                                {
                                    dropoffvalname += ", "+tmp2[0];
                                }
                            }
                            if(tmp3.length > 1)
                            {
                                pickupvalname = response.order.pickupPackageSmallName;
                            }
                            else
                            {
                                if(tmp3[0]!="")
                                {
                                    pickupvalname = tmp3[0];
                                }
                            }
                            if(tmp4.length > 1)
                            {
                                pickupvalname += ", "+response.order.pickupPackageLargeName;
                            }
                            else
                            {
                                if(tmp4[0]!="")
                                {
                                    pickupvalname += ", "+tmp4[0];
                                }
                            }

                            var tmpdate = response.order.deliveryDate.split('T');
                            var tmpdate2 = tmpdate[0].split('-');
                            var deliverydate = tmpdate2[1]+"/"+tmpdate2[2]+"/"+tmpdate2[0];

                            if(response.order.deliverySchedule == "Rush")
                            {
                                var tmptime = response.order.deliveryTime.split(":");
                                if(parseInt(tmptime[0])<12)
                                {
                                   var ampm = " PM";
                                }
                                else
                                {
                                    var ampm = " AM";
                                }

                                var deliverytime = response.order.deliveryTime+ampm;
                            }
                            else
                            {
                                var deliverytime = response.order.deliverySchedule;
                            }

                            var dropoffval = parseInt(response.order.dropoffPackageLarge) + parseInt(response.order.dropoffPackageSmall);
                            var pickupval = parseInt(response.order.pickupPackageLarge) + parseInt(response.order.pickupPackageSmall);
			    if(userprofile.ID == response.order.pickup_id){
                              $('#modalorderdetails .name').html(response.order.dropoffName);
                              $('#modalorderdetails .clinic').html(response.order.dropoffLocationName);
                              $('#modalorderdetails .address').html('<img class="icons address-icon" src="img/location-icon.png" alt=""> '+response.order.dropoffAddress+"<br>"+response.order.dropoffCity+", "+response.order.dropoffState+" "+response.order.dropoffZip);
                              $('#modalorderdetails .col4').html(deliverytime); // id
                              $('#modalorderdetails .col6').html("");
                              $('#modalorderdetails .col5').html(deliverydate);
                              $('#modalorderdetails .dropoffvalsmall').html(response.order.dropoffPackageSmall);
                              $('#modalorderdetails .dropoffvallarge').html(response.order.dropoffPackageLarge);
                              $('#modalorderdetails .pickupvalsmall').html(response.order.pickupPackageSmall);
                              $('#modalorderdetails .pickupvallarge').html(response.order.pickupPackageLarge);
                              $('#modalorderdetails .dropoffvalname').html(dropoffvalname);
                              $('#modalorderdetails .pickupvalname').html(pickupvalname);
			    }else{
                              $('#modalorderdetails .name').html(response.order.pickupName);
                              $('#modalorderdetails .clinic').html(response.order.pickupLocationName);
                              $('#modalorderdetails .address').html('<img class="icons address-icon" src="img/location-icon.png" alt=""> '+response.order.pickupAddress+"<br>"+response.order.pickupCity+", "+response.order.pickupState+" "+response.order.pickupZip);
                              $('#modalorderdetails .col4').html(deliverytime); // id
                              $('#modalorderdetails .col6').html("$"+response.order.price);
                              $('#modalorderdetails .col5').html(deliverydate);
                              $('#modalorderdetails .dropoffvalsmall').html(response.order.dropoffPackageSmall);
                              $('#modalorderdetails .dropoffvallarge').html(response.order.dropoffPackageLarge);
                              $('#modalorderdetails .pickupvalsmall').html(response.order.pickupPackageSmall);
                              $('#modalorderdetails .pickupvallarge').html(response.order.pickupPackageLarge);
                              $('#modalorderdetails .dropoffvalname').html(dropoffvalname);
                              $('#modalorderdetails .pickupvalname').html(pickupvalname);
			    }
                            $('#modalorderdetails,#modalbg').fadeIn();
                        });
                    });
                    $('select[name=showlist]').change();
                });

              //GET RX
                var settings_rx = {
                     "async": true,
                     "crossDomain": true,
                     "url": app_url+"/v1/rx",
                     "method": "GET",
                     "headers": {
                        "content-type": "application/json",
                        "authorization": localStorage.getItem('user_token')
                     }
                }
                $.ajax(settings_rx).done(function (responserx) {
		    if(responserx.status != 'completed' || responserx.status != 'reject'){
                      $('#totalrxcount').html(responserx.length);
		    }
                    addcardrx(responserx);
		    /*
                    if(responserx.length == 0){
                    	$('.rx-list').append('<span class="text-center rx-status">You have no pending rx.</span>');
                    }
		    */
                });

                var settings_rx = {
                     "async": true,
                     "crossDomain": true,
                     "url": app_url+"/v1/rx_by_lab_id/"+ userprofile.ID,
                     "method": "GET",
                     "headers": {
                        "content-type": "application/json",
                        "authorization": localStorage.getItem('user_token')
                     }
                }
                $.ajax(settings_rx).done(function (responserx) {
		    var activeRXCount = 0;
		    for(i=0; i < responserx.length; i++){
		      var rx = responserx[i];
		      if(rx.status != 'completed'&& rx.status != 'reject'){
			activeRXCount++;
		      }
		    }
		    $('#totalrxcount').html(activeRXCount);
                    if(activeRXCount == 0){
                    	//$('.rx-list').append('<span class="text-center rx-status">You have no pending rx.</span>');
                    }
                    addcardrx(responserx);
                });
          }
    });
}
else if(localStorage.getItem('user_type')==1)
{
    var settings_user = {
         "async": true,
         "crossDomain": true,
         "url": app_url+"/v1/doctor",
         "method": "GET",
         "headers": {
            "content-type": "application/json",
            "authorization": localStorage.getItem('user_token')
         }
    }
    $.ajax(settings_user).fail(function(error){
        console.log("error console",error)
        if(error.responseJSON.error === "Token expired"){
            $('#token-expired-popup,#modalbg2').fadeIn();
        }
      }).done(function (response) {
        btid = response.braintree_id;
        userprofile = response;
        $('#modalsettings input[name=id]').val(userprofile.ID);
        $('#modalsettings input[name=email]').val(userprofile.email);
        $('header .account label').html(response.firstName+" "+response.lastName);


        if(userprofile.mainSpecialtyID.indexOf(",") > -1)
        {
            var tmpspecialty = userprofile.mainSpecialtyID.split(',');
            var specialty = tmpspecialty[0];
        }
        else
        {
            var specialty = userprofile.mainSpecialtyID;
        }

        if(response.picture!="")
        {
            $('header .account .img-holder img').attr('src',response.picture.replace("http://","//"));
        }
        else
        {
            if(specialty.toLowerCase() == "dental lab" || specialty.toLowerCase() == "dentist")
            {
                $('header .account .img-holder img').attr('src','/img/dentist-img.png');
            }
            else
            {
                var profileImage = response.gender == 'Male' ? '/coreIMAGES/doctor_male.svg' : '/coreIMAGES/doctor_female.svg';
                $('header .account .img-holder img').attr('src', profileImage);
            }
        }

        user_lat = parseFloat(response.latitude);
        user_long = parseFloat(response.longitude);

            if($('.orderlink').hasClass('active'))
            {
                // GET USER ORDERS
                var settings_user = {
                     "async": true,
                     "crossDomain": true,
                     "url": app_url+"/v1/orders",
                     "method": "GET",
                     "headers": {
                        "content-type": "application/json",
                        "authorization": localStorage.getItem('user_token')
                     }
                }
                $.ajax(settings_user).done(function (response) {
                    addcard(response);

                    $('.order-list .box-footer .col4').click(function(){
                        var id = $(this).html();
                        // GET USER ORDERS
                        var settings_user = {
                             "async": true,
                             "crossDomain": true,
                             "url": app_url+"/v1/order/"+$(this).html().replace("#FN-",""),
                             "method": "GET",
                             "headers": {
                                "content-type": "application/json",
                                "authorization": localStorage.getItem('user_token')
                             }
                        }

                        $.ajax(settings_user).done(function (response) {
                            var dropoffvalname="",pickupvalname="";
                            var tmp1 = response.order.dropoffPackageSmallName.split(',');
                            var tmp2 = response.order.dropoffPackageLargeName.split(',');
                            var tmp3 = response.order.pickupPackageSmallName.split(',');
                            var tmp4 = response.order.pickupPackageLargeName.split(',');
                            if(tmp1.length > 1)
                            {
                                dropoffvalname = response.order.dropoffPackageSmallName;
                            }
                            else
                            {
                                if(tmp1[0]!="")
                                {
                                    dropoffvalname = tmp1[0];
                                }
                            }
                            if(tmp2.length > 1)
                            {
                                dropoffvalname += ", "+response.order.dropoffPackageLargeName;
                            }
                            else
                            {
                                if(tmp2[0]!="")
                                {
                                    dropoffvalname += ", "+tmp2[0];
                                }
                            }
                            if(tmp3.length > 1)
                            {
                                pickupvalname = response.order.pickupPackageSmallName;
                            }
                            else
                            {
                                if(tmp3[0]!="")
                                {
                                    pickupvalname = tmp3[0];
                                }
                            }
                            if(tmp4.length > 1)
                            {
                                pickupvalname += ", "+response.order.pickupPackageLargeName;
                            }
                            else
                            {
                                if(tmp4[0]!="")
                                {
                                    pickupvalname += ", "+tmp4[0];
                                }
                            }
                            var tmpdate = response.order.deliveryDate.split('T');
                            var tmpdate2 = tmpdate[0].split('-');
                            var deliverydate = tmpdate2[1]+"/"+tmpdate2[2]+"/"+tmpdate2[0];

                            if(response.order.deliverySchedule == "Rush")
                            {
                                var tmptime = response.order.deliveryTime.split(":");
                                if(parseInt(tmptime[0])<12)
                                {
                                   var ampm = " PM";
                                }
                                else
                                {
                                    var ampm = " AM";
                                }

                                var deliverytime = response.order.deliveryTime+ampm;
                            }
                            else
                            {
                                var deliverytime = response.order.deliverySchedule;
                            }

                            var dropoffval = parseInt(response.order.dropoffPackageLarge) + parseInt(response.order.dropoffPackageSmall);
                            var pickupval = parseInt(response.order.pickupPackageLarge) + parseInt(response.order.pickupPackageSmall);
                            $('#modalorderdetails .name').html(response.order.pickupName);
                            $('#modalorderdetails .clinic').html(response.order.pickupLocationName);
                            $('#modalorderdetails .address').html('<img class="icons address-icon" src="img/location-icon.png" alt=""> '+response.order.pickupAddress+"<br>"+response.order.pickupCity+", "+response.order.pickupState+" "+response.order.pickupZip);
                            $('#modalorderdetails .col4').html(deliverytime); // id
                            $('#modalorderdetails .col6').html("$"+response.order.price);
                            $('#modalorderdetails .col5').html(deliverydate);
                            $('#modalorderdetails .dropoffvalsmall').html(response.order.dropoffPackageSmall);
                            $('#modalorderdetails .dropoffvallarge').html(response.order.dropoffPackageLarge);
                            $('#modalorderdetails .pickupvalsmall').html(response.order.pickupPackageSmall);
                            $('#modalorderdetails .pickupvallarge').html(response.order.pickupPackageLarge);
                            $('#modalorderdetails .dropoffvalname').html(dropoffvalname);
                            $('#modalorderdetails .pickupvalname').html(pickupvalname);
                            $('#modalorderdetails,#modalbg').fadeIn();
                        });
                    });
                    $('select[name=showlist]').change();
                });

                //GET RX
                var settings_rx = {
                     "async": true,
                     "crossDomain": true,
                     "url": app_url+"/v1/rx",
                     "method": "GET",
                     "headers": {
                        "content-type": "application/json",
                        "authorization": localStorage.getItem('user_token')
                     }
                }
                $.ajax(settings_rx).done(function (responserx) {
		    if(responserx.status != 'completed' || responserx.status != 'reject'){
                      $('#totalrxcount').html(responserx.length);
		    }
                    addcardrx(responserx);
                });
            }
    });
} else {
  var settings_user = {
         "async": true,
         "crossDomain": true,
         "url": app_url+"/v1/patient",
         "method": "GET",
         "headers": {
            "content-type": "application/json",
            "authorization": localStorage.getItem('user_token')
         }
    }
    $.ajax(settings_user)
        .done(function (response) {
            if(response.image_url!="")
            {
                $('header .account .img-holder img').attr('src',response.image_url.replace("http://","//"));
            }
            else
            {
                var profileImage = response.gender == 'Male' ? '/coreIMAGES/man.svg' : '/coreIMAGES/woman.svg';
                $('header .account .img-holder img').attr('src', profileImage);
            }
        })
        .fail(function(error){
            if(error.responseJSON.error === "Token expired"){
                $('#token-expired-popup,#modalbg2').fadeIn();
            }
        })
}



$('#signout').click(function(){
	localStorage.clear();
  $.removeCookie("user_email");
  $.removeCookie("user_type");
  $.removeCookie("user_token");
	window.location = "/sign-in.php";
});

$('#modalsettings .tabs').click(function(){
    $('#modalsettings .tabs').each(function(){
        $(this).removeClass('active');
    });
    $(this).addClass('active');

    $('#logininfo,#paymentinfo').hide();

    if($(this).hasClass('tab-left'))
    {
        $('#logininfo').fadeIn();
        $('#modalsettings').css("height","700px");
    }
    else
    {
        $('#paymentinfo').fadeIn();
        $('#modalsettings').css("height","341px");
    }
});

$("#modalsettings input").bind('click keydown',function(){
    $("#modalsettings input").removeClass('error');
});

$('#modalbookappointment #files').on('change', function (e) {
    var files = $(this)[0].files;
    var fileToLoad = files[0]
    var fileReader = new FileReader();
    var base64File;
    
    $('#modalbookappointment .book-appointment-btn button').attr('disabled', 'disabled');
    fileReader.onload = function(event) {
        base64File = event.target.result;
        $.ajax({
            url: app_url + "/v1/upload_file?name=" + fileToLoad.name.toLowerCase(),
            type: "POST",
            dataType: "json",
            "headers": {
                "authorization": localStorage.getItem('user_token')			
            },
            data: base64File.split(',')[1],
            success: function (response) {
                $('#modalbookappointment .book-appointment-btn button').removeAttr('disabled');
                $('#modalbookappointment #files').val('');
                
                var fileElement = 
                    '<div class="row file">' +
                        '<input type="hidden" class="file-link" value="' + response.file + '"/>' +
                        '<div class="col-md-10 file-name" style="margin-top: 2px;">' + fileToLoad.name + '</div>' +
                        '<div class="col-md-2 pull-right text-right remove-file">' +
                            '<i onclick="removeFile(this)" class="fa fa-trash" style="font-size: 25px;"></i>' +
                        '</div>'
                    '</div>';

                $('#modalbookappointment .attached-files').append(fileElement);
                
            },
            error: function() {
                $('#modalbookappointment .book-appointment-btn button').removeAttr('disabled');
            }
        });
    };

    // Convert data to base64
    fileReader.readAsDataURL(fileToLoad);
});

$('#modalbookappointment .appointment-slot-list').on("scroll", function() {
    if(!$('.slot', this).length)
        return;

    if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        var modal = $('#modalbookappointment');
        var doctorId = modal.data('doctor-id');
        var type = $(this).data('appointments-type');
        var page = $(this).data('page');
        page = parseInt(page) + 1;
        
        loadAppointmentsPage(doctorId, type, page);
    }
});

$("#modalsettings input[name='save_payment_info']").click(function(){
    var error = 0;
    $('#formpaymentinfo .errormsg').html('');
    $('#formpaymentinfo .errormsg').css('color','#f00');

    $('#formpaymentinfo input').each(function(){
        if($(this).val()=="")
        {
            $(this).addClass('error');
            error++;
        }
    });

    if(error == 0)
    {
        if(btid)
        {
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": app_url + "/v1/add_cc",
              "method": "POST",
              "headers": {
              "content-type": "application/json",
              "authorization": localStorage.getItem('user_token'),
              },
              "processData": false,
              "data": JSON.stringify({
                      "credit_card":$('#formpaymentinfo input[name=card_num]').val(),
                      "cvv": $('#formpaymentinfo input[name=card_cvc]').val(),
                      "expiration_month": $('#formpaymentinfo input[name=card_month]').val(),
                      "expiration_year": $('#formpaymentinfo input[name=card_year]').val(),
                      "cardholder_name":$('#formpaymentinfo input[name=card_name]').val(),
                      "billing_address":$('#formpaymentinfo input[name=billing_address]').val()
                  })
            }
            $.ajax(settings).done(function (response) {
                if(response.status == "OK")
                {
                  $('#formpaymentinfo .errormsg').css('color','#4caf50');
                  $('#formpaymentinfo .errormsg').html('Payment info successfully updated');
                  setTimeout(function(){ $('#formpaymentinfo .errormsg').html('');
    $('#formpaymentinfo .errormsg').css('color','#f00'); }, 3000);
                }
            }).fail(function(error){
                $('#formpaymentinfo .errormsg').html('<img src="img/error-icon.png"> '+error.responseJSON.Error);
            });
            // $('#formpaymentinfo .errormsg').html('<img src="img/error-icon.png"> Update Card');
        }
        else
        {
            $('#formpaymentinfo .errormsg').html('<img src="img/error-icon.png"> Save Card');
        }
    }
    else
    {
        $('#formpaymentinfo .errormsg').html('<img src="img/error-icon.png"> Fill up all fields');
    }
});

$('#modalsettings #formpaymentinfo input').click(function(){
    $(this).select();
});

$("#modalsettings input[name='save_login_info']").click(function(){
    var id = $("#modalsettings input[name='id']").val();
    var email = $("#modalsettings input[name='email']").val();
    var new_email = $("#modalsettings input[name='new_email']").val();
    var confirm_email = $("#modalsettings input[name='confirm_email']").val();
    var current_password = $("#modalsettings input[name='current_password']").val();
    var new_password = $("#modalsettings input[name='new_password']").val();
    var confirm_password = $("#modalsettings input[name='confirm_password']").val();

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": app_url + "/v1/reset_password",
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "authorization": localStorage.getItem('user_token')
        },
        "processData": false,
        "data": JSON.stringify({
           "user_id": id,
           "email" : email,
           "new_email" : new_email,
           "confirm_email" : confirm_email,
           "password" : current_password,
           "new_password" : new_password,
           "confirm_password" : confirm_password
        })
    }
    $.ajax(settings).done(function (response) {
          $('#modalsettings .errormsg').css('color','#4caf50');
          $('#modalsettings .errormsg').html('Successfully updated.');
	  $('#logininfo input').each(function(){
		  if($(this).attr("type") != "button" && $(this).attr("type") != "hidden"){
		    $(this).val("");
		  }
	  });
    })
    .fail(function (response) {
	if(JSON.parse(response.responseText).Error == "Invalid JSON feed. Key: 'LoginInput.Password' Error:Field validation for 'Password' failed on the 'required' tag"){
        $('#modalsettings .errormsg').html('<img src="img/error-icon.png"> Please enter your current password' );
	}else{
        $('#modalsettings .errormsg').html('<img src="img/error-icon.png"> ' + JSON.parse(response.responseText).Error);
	}
        $('#modalsettings .errormsg').show();
		  if($(this).attr("type") != "button" && $(this).attr("type") != "hidden"){
		    $(this).val("");
		  }
    });

    /*
    $('#formuserinfo .errormsg').html("");
    $('#formuserinfo .errormsg').css('color','#f00');
    var error=0;

    if(current_password != "" && new_password == "" && confirm_password == "" && email != "")
    {
        var settings2 = {
              "async": true,
              "crossDomain": true,
              "url": app_url+"/v1/change_email",
              "method": "POST",
              "headers": {
              "content-type": "application/json",
              "authorization": localStorage.getItem('user_token')
              },
              "processData": false,
              "data": JSON.stringify({"email":email,
                      "password":current_password,
                      "user_id":id
                    })
          }
          $.ajax(settings2).done(function (response) {
             if(response.ID)
             {
                $('#formuserinfo .errormsg').css('color','#4caf50');
                $('#formuserinfo .errormsg').html($('#formuserinfo .errormsg').html()+' Email successfully updated.');
                $('#formuserinfo input[name=current_password]').val("");
                $('#formuserinfo input[name=new_password]').val("");
                $('#formuserinfo input[name=confirm_password]').val("");
                setTimeout(function(){ $('#formuserinfo .errormsg').html('');
                  $('#formuserinfo .errormsg').css('color','#f00'); }, 3000);
             }
          })
          .fail(function (response) {
              console.log(response);
              $('#formuserinfo .errormsg').html('<img src="img/error-icon.png"> '+response.responseJSON.Error);
              $('#formuserinfo .errormsg').show();
          });
    }
    else
    {
        if($('#formuserinfo input[name=current_password]').val()=="")
        {
           $('#formuserinfo input[name=current_password]').addClass('error');
           $('#formuserinfo .errormsg').html('<img src="img/error-icon.png"> Fill up password to change email');
        }
    }

    if(error > 0) {
      // $('#formuserinfo .errormsg').html('<img src="img/error-icon.png"> Fill up all fields');
    }
    else
    {
        if(new_password != confirm_password)
        {
            $('#formuserinfo .errormsg').html('<img src="img/error-icon.png"> Password does not match');
        }
        else if(new_password != "")
        {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": app_url + "/v1/reset_password",
                "method": "POST",
                "headers": {
                  "content-type": "application/json",
                  "authorization": localStorage.getItem('user_token')
                },
                "processData": false,
                "data": JSON.stringify({
                   "user_id": id,
                   "email" : email,
                   "new_email" : new_email,
                   "confirm_email" : confirm_email,
                   "password" : current_password,
                   "new_password" : new_password
                })
            }
            $.ajax(settings).done(function (response) {
               if(response.ID)
               {
                  $('#formuserinfo .errormsg').css('color','#4caf50');
                  $('#formuserinfo .errormsg').html($('#formuserinfo .errormsg').html()+' Password successfully updated.');
                  $('#formuserinfo input[name=current_password]').val("");
                  $('#formuserinfo input[name=new_password]').val("");
                  $('#formuserinfo input[name=confirm_password]').val("");
                  setTimeout(function(){ $('#formuserinfo .errormsg').html('');
                    $('#formuserinfo .errormsg').css('color','#f00'); }, 3000);
               }
            })
            .fail(function (response) {
                $('#formuserinfo .errormsg').html('<img src="img/error-icon.png"> '+response.responseJSON.Error);
                $('#formuserinfo .errormsg').show();
            });
        }
    }
    */
});

$('.od').click(function(){
    if($(this).hasClass('orderpage'))
    {
        window.location = "/order.php";
    }
    else if($(this).hasClass('deliverypage'))
    {
        window.location = "/delivery.php";
    }
    else if($(this).hasClass('driveractive'))
    {
        window.location = "/driver.php";
    }
    else if($(this).hasClass('drivercompleted'))
    {
        window.location = "/completed.php";
    }
});

$('header .account a.avatar').click(function(e){
    $('header .account ul.dropdown-menu.account').fadeToggle("fast");
    $('header .notification').removeClass('open');
    e.stopPropagation();
});
$('header .notification').click(function(){
    $('#no-notification').show();
    $('#notification').hide();
});
$('header .account ul.dropdown-menu.account li').click(function(){
    $('header .account ul.dropdown-menu.account li').each(function(){
        $(this).removeClass('active');
    });
    $(this).addClass('active');
    $('header .account ul.dropdown-menu.account').fadeOut("fast");

    if($(this).attr('param')=="settings") {
        $('#modalsettings input[name=email]').val(userprofile.email);
        if(btid)
        {
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": app_url + "/v1/get_cc",
              "method": "GET",
              "headers": {
              "content-type": "application/json",
              "authorization": localStorage.getItem('user_token'),
              },
              "processData": false,
            }
            $.ajax(settings).done(function (response) {
                cc_info = response.result['credit-cards']['credit-card'];
                $('#formpaymentinfo input[name=card_num]').val("XXXXXXXXXXXX"+cc_info['last-4']);
                $('#formpaymentinfo input[name=card_month]').val(cc_info['expiration-month']);
                $('#formpaymentinfo input[name=card_year]').val(cc_info['expiration-year']);
                $('#formpaymentinfo input[name=card_cvc]').val(cc_info.cvv);
                $('#formpaymentinfo input[name=card_name]').val(cc_info['cardholder-name']);
                $('#formpaymentinfo input[name=billing_address]').val(cc_info['billing-address']['street-address']);
            });
        }
        $('#modalsettings,#modalbg').fadeIn();
    }
    else if($(this).attr('param')=="profile") {
        $('.review-section a').hide();

        if(localStorage.getItem('user_type')==1)
        {
          $('.fordoctor').removeClass('invi');
          $('#modalprofile .aboutsection ul li').each(function(){
            var _this = $(this);
              if(_this.html() == 'Procedures'){
                _this.hide();
              }
          });
        }
        else if(localStorage.getItem('user_type')==2)
        {
            $('.forlab').removeClass('invi');
	    $('#modalprofile .aboutsection .forProcedures table tbody').empty();
            $('#modalprofile .aboutsection ul li').each(function(){
              var _this = $(this);
                if(_this.html() == 'Procedures'){
                  _this.show();
                }
            });

	    if(userprofile.labProcedure != ""){
 	    var stringProcedures = "{\"procedures\":[" + userprofile.labProcedure + "]}";
            var data = JSON.parse(stringProcedures);
              $('#modalprofile .aboutsection ul li').each(function(){
                var _this = $(this);
                  if(_this.html() == 'Procedures'){
	            for(i=0; i < data.procedures.length; i++){
			var procedure = data.procedures[i];
	              $('#modalprofile .aboutsection .forProcedures table tbody')
	                .append(
	                  '<tr><td width=25%>' + procedure.name + '</td><td width=15%>'+procedure.time+' days</td><td width=15%>$'+procedure.price+'</td><td width=45%>'+procedure.note+'</td></tr>'
	                );
	            }
	          }
	      });
	    }

        }


        if(userprofile.isweb_chatVerified == false)
        {
          $('#modalprofile .certified').addClass('invi');
        }

        $('#modalprofile .edit').removeClass('invi');


	if(userprofile.mainSpecialtyID){
          if(userprofile.mainSpecialtyID.indexOf(",") > -1)
          {
              var tmpspecialty = userprofile.mainSpecialtyID.split(',');
              var specialty = tmpspecialty[0];
          }
          else
          {
              var specialty = userprofile.mainSpecialtyID;
          }
	}
	    console.log(specialty);

        if(userprofile.picture!="")
        {
            $('#modalprofile .avatar').attr('src',userprofile.picture.replace("http://","//"));
        }

        else
        {
	    if(specialty){
            if(specialty.toLowerCase() == "dental lab" || specialty.toLowerCase() == "dentist")
            {
                $('#modalprofile .avatar').attr('src','/img/dentist-img.png');
            }
            else
            {
                var profileImage = userprofile.gender == 'Male' ? '/coreIMAGES/doctor_male.svg' : '/coreIMAGES/doctor_female.svg';
                
                $('#modalprofile .avatar').attr('src',profileImage);
            }
	    }
        }


        if(localStorage.getItem('user_type')!=3)
        {
            var specialty = userprofile.mainSpecialtyID.split(',');
            $('#modalprofile .practice').html(specialty[0]);

            if(userprofile.facebookID!="")
            {
              var link = userprofile.facebookID.replace('https://',"");
              link = userprofile.facebookID.replace('http://',"");
              $('#modalprofile .sm-facebook').removeClass('invi');
              $('#modalprofile .sm-facebook').attr('href',"http://"+link);
            }
            if(userprofile.linkedInID!="")
            {
              var link = userprofile.linkedInID.replace('https://',"");
              link = userprofile.linkedInID.replace('http://',"");
              $('#modalprofile .sm-linkedin').removeClass('invi');
              $('#modalprofile .sm-linkedin').attr('href',"http://"+link);
            }
            if(userprofile.twitterID!="")
            {
              var link = userprofile.twitterID.replace('https://',"");
              link = userprofile.twitterID.replace('http://',"");
              $('#modalprofile .sm-twitter').removeClass('invi');
              $('#modalprofile .sm-twitter').attr('href',"http://"+link);
            }
            if(userprofile.yelpID!="")
            {
              var link = userprofile.yelpID.replace('https://',"");
              link = userprofile.yelpID.replace('http://',"");
              $('#modalprofile .sm-yelp').removeClass('invi');
              $('#modalprofile .sm-yelp').attr('href',"http://"+link);
            }
        }
        else
        {
            $('#modalprofile .practice').html('Driver');
            $('#modalprofile .avatar').attr('src', '/img/default-profile.jpg');
        }

    		$('#modalprofile .name').html(userprofile.firstName+" "+userprofile.lastName);
    		$('#modalprofile .clinic').html(userprofile.practice);
    		$('#modalprofile .address').html(userprofile.addressLine1+"<br><span style='margin-left:20px;'>"+userprofile.city+", "+userprofile.state+" "+userprofile.zip+"</span>");

        $('#modalprofile .miles').html("1 mi");
        $('#modalprofile .profemail').attr('href','mailto:'+userprofile.email);
        $('#modalprofile .profemail').attr('param',userprofile.email);
        $('#modalprofile .profwebsite').attr('href',"http://"+userprofile.website);
        $('#modalprofile .profwebsite').attr('param',userprofile.website);
        $('#modalprofile .phone').html(prettyphone(userprofile.phone));
        $('#modalprofile .forAbout p').html(userprofile.aboutDescription);

		  $('#modalprofile,#modalbg').fadeIn();
    }
});

function toDataUrl(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/jpg;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}


$('#modaleditbox .upload_avatar').click(function(){
	var input = $('#avatar');
	var reader = new FileReader();

	reader.onload = function (e) {
	  var img = e.target.result;
	  $('.user_avatar').attr('src', img);

          toDataUrl(img, function(base64IMG){
            var settings = {
            "async": true,
            "crossDomain": true,
            "url": app_url + "/v1/upload_avatar",
            "method": "POST",
            "headers": {
              "content-type": "application/json",
	      "authorization": localStorage.getItem('user_token')
             },
            "processData": false,
            "data":
	      base64IMG.split(',')[1]
            };
            $.ajax(settings)
            .done(function (response) {
	      $('.user_avatar').attr('src', response.picture.replace("http://","//"));
              $("#modaleditbox .contactinfo input[name='picture']").val(response.picture);
            })
            .fail(function(error){
                console.log("error console",error)
                if(error.responseJSON.error === "Token expired"){
                    $('#token-expired-popup,#modalbg').fadeIn();
                }
            });
          });
	}

	reader.readAsDataURL(input[0].files[0]);
});

$('#modaleditbox textarea[name=about]').keyup(function(){
    var value = 380 - $(this).val().length;

    $('#modaleditbox .aboutcharleft span').html(value);
});

$('#modalsettings .closebtn, #modalbg').click(function(){
    $('#modalsettings,#modalbg').fadeOut();
});

$('#modalbg,#modalbookappointment .closebtn').click(function () {
    $('#modalbg,#modalbookappointment').fadeOut();
    $('#modalbookappointment').data('doctor-id', '');    
});

$('#modalbg,#modalprofile .closebtn').click(function(){
    $('#modalbg,#modalprofile').fadeOut();
});

$('#modaleditbox .inputgroup input').focusin(function(){
    var par = $(this).parent();
    $(this).removeClass('error');
    $('span',par).css('border-color','#c6ccca');
    $('span div',par).addClass('active');
});

$('#modaleditbox .inputgroup input').focusout(function(){
    var par = $(this).parent();
    $('span',par).css('border-color','#dfe6e4');
    $('span div',par).removeClass('active');
});

function rating5bars(rating) {
  var text="",decimal=0;
  var tmp = rating.toString().split('.');
  rating = tmp[0];
  decimal = tmp[1];

  if(rating == 0)
  {
    return '<img src="img/0-star.png" class="icon"><img src="img/0-star.png" class="icon"><img src="img/0-star.png" class="icon"><img src="img/0-star.png" class="icon"><img src="img/0-star.png" class="icon">';
  }
  else
  {
    var hold = 0;
    for(x=1;x<=5;x++)
    {
        if(x <= rating)
        {
          text += '<img src="img/5-star.png" class="icon">';
          hold = 1;
        }
        else
        {
          if(hold == 1 && decimal!=undefined && decimal!="0")
          {
            text += '<img src="img/5-star-half.png" class="icon">';
          }
          else
          {
            text += '<img src="img/0-star.png" class="icon">';
          }
          hold = 0;
        }
    }
    return text;
  }

}

function loadprofilereviews(id,type) {
    var doc_id="",lab_id="";
    $('#modalprofile .reviews').html("");
    if(type==1)
    {
        doc_id = id;
    }
    else if(type==2)
    {
        lab_id = id;
    }

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": app_url+'/v1/reviews',
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "processData": false,
      "data": JSON.stringify({
          "doctor_id":doc_id,
          "lab_id":lab_id
        })
    }

    $.ajax(settings).done(function (response){
        var totalrating=0;
        $('#modalprofile .reviews .loading').fadeOut();

        if(response.length == 1)
        {
          $('#modalprofile .totalreviews').html(response.length+" Review");
        }
        else
        {
          $('#modalprofile .totalreviews').html(response.length+" Reviews");
        }

        if(response.length > 0)
        {
            for(var x=0; x < response.length; x++)
            {
                var readmore='';
                var val = response[x];
                totalrating += val.rate;
                var tmp = val.CreatedAt.split('T');
                tmp = tmp[0].replace(/-/g,"/").split('/');
                dateadded = tmp[1]+"/"+tmp[2]+"/"+tmp[0];
                var reply = '<div class="response-item">'+
                              '<div class="responder">'+
                                  '<img src="img/reply-icon.png"> William’s response'+
                              '</div>'+
                              '<div class="response">'+
                                  'This is Photoshop&quot;s version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. odio incidunt auctor a ornare odio. Sed nonit.odio incidunt auctor odio incidunt auctor a ornare odio. Sed nonit.odio incidunt auctor .'+
                              '</div>'+
                          '</div>';
                reply = "";

                if(val.comment.length>240)
                {
                  readmore = '… <a class="cupo">Read more</a>';
                }

                $('#modalprofile .reviews').append('<div class="review-item">'+
                      '<div class="rhead">'+
                          rating5bars(val.rate)+
                          '<div class="name">'+
                              val.name+' on <span>'+dateadded+'</span>'+
                          '</div>'+
                          '<div class="reply fr">'+
                              '<img src="img/reply-btn.png"> Reply'+
                          '</div>'+
                      '</div>'+
                      '<div class="clear5"></div>'+
                      '<div class="rbody">'+
                          val.comment.substr(0,240)+readmore+
                      '</div>'+
                      '<div class="rbody2">'+
                          val.comment+
                          reply+
                          '<a class="cupo"><img src="img/review-arrowup-close.png"></a>'+
                      '</div>'+
                      '<div class="clear"></div>'+
                  '</div>')
            }

            var average = rating5bars(totalrating / response.length);
            $('#modalprofile .averagerating').html(average);
        }

        $('#modalprofile .reviews .review-item .rbody a').click(function(){
            var par = $(this).parent().parent();
            $(par).addClass('active');
            $('.rbody',par).hide();
            $('.rbody2',par).show();
        });

        $('#modalprofile .reviews .review-item .rbody2 a').click(function(){
            var par = $(this).parent().parent();
            $(par).removeClass('active');
            $('.rbody2',par).hide();
            $('.rbody',par).show();
        });

    }).fail(function(error){
        console.log(error);
    });
}

function getorderdata(id,card_id,path)
{
  var img='';
  if(id[0]==1)
  {
      $.get(app_url+'/v1/search/doctor/'+id,function(data){
          if(data.mainSpecialtyID == "Dentist")
          {
             img = '/img/dentist-img.png';
          }
          else
          {
              img = data.profile;
          }
          $(path+' #FN-'+card_id+' .phone').html(prettyphone(data.phone));
          $(path+' #FN-'+card_id+' .img-holder img').attr('src',img);
      });
  }
  else if(id[0]==2)
  {
      $.get(app_url+'/v1/search/lab/'+id,function(data){
          if(data.mainSpecialtyID == "Dentist")
          {
             img = '/img/dentist-img.png';
          }
          else
          {
              img = data.profile;
          }
          $('#FN-'+card_id+' .phone').html(prettyphone(data.phone));
          $('#FN-'+card_id+' .img-holder img').attr('src',img);
      });
  }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var latLngA = new google.maps.LatLng(parseFloat(lat1), parseFloat(lon1))
    var latLngB = new google.maps.LatLng(parseFloat(lat2), parseFloat(lon2))

    return Math.round(google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB) * 0.000621);
}

function degToDms (deg) {
    var d = Math.floor (deg);
    var minfloat = (deg-d)*60;
    var m = Math.floor(minfloat);
    var secfloat = (minfloat-m)*60;
    var s = secfloat;
    if (s==60) {
      m++;
      s=0;
    }
    if (m==60) {
      d++;
      m=0;
    }
    return ("" + d + ":" + m + ":" + s);
 }
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function openBookAppointment(doctorId, date, type) {
    $('#modalbookappointment,#modalbg').fadeIn();
    
    var modal = $('#modalbookappointment');
    $('.appointment-slot-list', modal).html('Loading...');

    $.get(app_url+'/v1/doctor/'+doctorId,function(data){
        var addressLine1 = data.addressLine1 ? data.addressLine1.replace(data.city, '').replace(data.state, '').replace(data.zip, '') : '';
        addressLine1 = addressLine1.split(',').join('').trim();
        var addressLine2 = data.city && data.state && data.zip ? data.city + ', ' + data.state + ' ' + data.zip : '';

        $('.profile-info .name', modal).text(data.firstName + ' ' + data.lastName);
        $('.profile-info .specialty', modal).text(data.mainSpecialtyID ? data.mainSpecialtyID.split(',')[0] : '');
        $('.profile-info .address span.first-line', modal).text(addressLine1);
        $('.profile-info .address span.second-line', modal).text(addressLine2);
        
        var profileImage = data.gender == 'Male' ? '/coreIMAGES/doctor_male.svg' : '/coreIMAGES/doctor_female.svg';
        $('.profile-info .avatar-img', modal).attr('src', data.picture || profileImage);
    });

    searchAvailableAppointments(doctorId, date, '');
}

function removeFile(element) {
    $(element).parent().parent().remove();
}

function loadAppointmentsPage(doctorId, date, type, page) {
    var modal = $('#modalbookappointment');
    var availableAppointments = [];
    var today = new Date();
    var year = today.getFullYear();
    var month = parseInt(today.getMonth()) + 1;
    month = (String(month).length === 1 ? '0' + month : month);
    var day = today.getDate();
    day = (String(day).length === 1 ? '0' + day : day);

    var typeParam = type ? '&type=' + type : '';

    $('.appointment-slot-list', modal).data('page', page);    
    
    $.get(app_url+'/v1/appointment/patient/' + doctorId + '/' + page + '/50?from_date=' + date + typeParam, function(response) {
        if(page === 0) {
            $('.appointment-slot-list', modal).html('');
        }

        var appointments = response;

        if(appointments.length === 0) {
            $('.appointment-slot-list', modal).html('<div class="alert alert-danger error-msg" role="alert">No appointments found.</div>');
            return;            
        }

        for(var i=0; i<appointments.length; i++) {
            var appointment = response[i];

            var appointmentDate = new Date(appointment.startTime);

            var currentAppointmentIndex = availableAppointments.findIndex(function(a, idx) { 
                return a.date.getMonth() == appointmentDate.getMonth()
                        && a.date.getDate() == appointmentDate.getDate()
                        && a.date.getFullYear() == appointmentDate.getFullYear()
            });

            var slot = {   
                id: appointment.ID,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                typeID: appointment.typeID
            }  

            if(currentAppointmentIndex >= 0) {
                availableAppointments[currentAppointmentIndex].slots.push(slot)
            }else {
                availableAppointments.push({
                    date: appointmentDate,
                    slots: [slot]
                })
            }
        }

        addAvailableAppointmentList(availableAppointments);
    });

}

function searchAvailableAppointments(doctorId, date, type) {
    var modal = $('#modalbookappointment');    

    $('.error-msg', modal).hide();
    $('.success-msg', modal).hide();
    $('.book-appointment-btn', modal).show();
    $('.cancel-btn a').text('Cancel');
    $('.attached-files', modal).html('');

    modal.data('doctor-id', doctorId);
    $('.appointment-slot-list', modal).data('appointments-type', type);
    $('.appointment-slot-list', modal).data('date', date);
    $('.appointment-slot-list', modal).html('Loading...');

    loadAppointmentsPage(doctorId, date, type, 0);    
}

function addAvailableAppointmentList(appointments) {
    var modal = $('#modalbookappointment');
    for(var i=0; i<appointments.length; i++) {
        var appointment = appointments[i];
        var month = appointment.date.toLocaleString('en-us', { month: "short" }).toUpperCase();

        var classSlotTimes = appointment.slots.length < 5 ? 'less-than-5' : '';
        
        var appointmentElement =
            '<div class="slot s' + i + '">' +
                '<div class="col-md-3 slot-date text-center">' +
                    '<div class="date-text">' +
                        '<label style="display: block;">' + month + '</label>' +
                        '<span style="display: block;">' + appointment.date.getDate() + '</span>' +
                    '</div>' +
                '</div>' +
                    
                '<div class="col-md-9 slot-times ' + classSlotTimes + '">' +
                '</div>' +
            '</div>';

        $('.appointment-slot-list', modal).append(appointmentElement);

        for(var k=0; k<appointment.slots.length; k++) {
            var slot = appointment.slots[k];
            var time = slot.startTime.split('T')[1].split(':');
            var hour = time[0];
            hour = parseInt(hour);
            var ampm = hour >= 12 ? 'PM' : 'AM'
            hour = hour  > 12 ? hour - 12 : hour;
            var appointmentType = slot.typeID === 1 ? 'fa-user' : 'fa-video-camera';

            var slotElement = 
                '<div class="available-slot-time" onclick="selectAppointment(' + slot.id + ', ' + slot.typeID + ', ' + "'" + slot.startTime + "'" + ')">' +
                    '<span><i class="fa ' + appointmentType + ' "></i> ' + hour + ':' + time[1] + ' ' + ampm + '</span>' +
                '</div>';

            $('.appointment-slot-list .slot.s' + i + ' .slot-times', modal).append(slotElement);
        }
    }
    
}

function filterAppointmentByType(type) {
    var modal = $('#modalbookappointment');

    var doctorId = modal.data('doctor-id');
    var date = $('.appointment-slot-list', modal).data('date');
    
    $('.appointment-slot-list', modal).data('appointments-type', type);

    searchAvailableAppointments(doctorId, date, type);
}

function selectAppointment(appointmentId, appointmentType, startTime) {
    var usertype = localStorage.getItem('user_type');

    if(!usertype) {
        alert('You have to login if you want to book an appointment.')
        return;
    }

    var modal = $('#modalbookappointment');
    var date = startTime.split('T')[0]
    date = date.split('-')
    date = date[1] + '-' + date[2] + '-' + date[0];
    var time = startTime.split('T')[1].split(':');
    var hour = time[0];
    hour = parseInt(hour);
    var ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour  > 12 ? hour - 12 : hour;
    
    $('a[data-target="#info"]', modal).tab('show');
    $('#selected_symptom_group', modal).html('');
    $('#notes', modal).val('');
    $('#symptom', modal).val('');

    $('.appointment-info-form', modal).data('appointment-id', appointmentId);
    $('.appointment-info-form .appointment-type', modal).text((appointmentType === 1 ? 'In-Person' : 'Video') + ' Appointment');
    $('.appointment-info-form .calendar-title.date span', modal).text(date);
    $('.appointment-info-form .calendar-title.times span', modal).text(hour + ':' + time[1] + ' ' + ampm);
}

function bookAppointment() {
    var modal = $('#modalbookappointment');
    
    $('.error-msg', modal).hide();
    
    var appointmentId = $('.appointment-info-form', modal).data('appointment-id');
    var symptoms = $('#selected_symptom_group .item-selected .item-text', modal).map(function(idx, s) {
        return $(s).text()
    }).get();
    var notes = $('#notes', modal).val();
    

    var fileLinks = $('.attached-files .file .file-link', modal).map(function(idx, val) {
        return $(val).val()
    }).get()

    var errorMessage = '';
    if(!appointmentId)
        errorMessage = 'You must select an appointment';
    
    if(!symptoms.length && !errorMessage)
        errorMessage = 'You must type your symptoms';

    if(!notes && !errorMessage)
        errorMessage = 'You must type a note';

    if(errorMessage) {
        $('.error-msg', modal).text(errorMessage)
        $('.error-msg', modal).show();   
        return; 
    }

    $.ajax({
        url: app_url + "/v1/booking/appointment",
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        "headers": {
            "content-type": "application/json",
            "authorization": localStorage.getItem('user_token'),				
        },
        data: JSON.stringify({ appointmentID: appointmentId, symptoms: symptoms, note: notes, file_link: fileLinks}),
        success: function(data) {
            $('.success-msg', modal).show();
            $('.book-appointment-btn', modal).hide();
            $('.cancel-btn a').text('Book another appointment');
        }, error: function(data) {
            if (data.responseJSON.Error || data.responseJSON.error) {
                alert(data.responseJSON.Error || data.responseJSON.error);
                return;
            }
        }
    });
}

function showAvailableAppointments() {
    var modal = $('#modalbookappointment');
    $('#modalbookappointment a[data-target="#appointments"]').tab('show');
    
    var date = $('.appointment-slot-list', modal).data('date');
    var type = $('.appointment-slot-list', modal).data('appointments-type');

    searchAvailableAppointments($('#modalbookappointment').data('doctor-id'), date, type);
}


function makeSelection(fieldName, tagContainer) {
	if ($('li.active', '.suggestionbox.' + fieldName).length > 0) {
		$('li.active', '.suggestionbox.' + fieldName).next().remove();
		var selectedText = $('li.active', '.suggestionbox.' + fieldName).html();
		
		if($('input[name=' + fieldName + '].option-selected').length > 0)
			return;

		if($('input[name=' + fieldName + '].one-selection').length > 0) {
			$('input[name=' + fieldName + ']').val(selectedText);
			$('input[name=' + fieldName + ']').addClass('option-selected');
			$('.suggestionbox.' + fieldName).hide();
		}else {
			$('li.active', '.suggestionbox.' + fieldName).click();
		}
	}
}


function symptom() {
	var val = $('input[name=symptom]').val();
	var par = $('input[name=symptom]').parent();
	var width = $('input[name=symptom]').width() + 26;
	$('ul', par).css('width', width + 'px');
	if (val.length > 2) {
		//symptom
		//
		$.get(app_url + '/v1/search/symptom?q=' + val, function (data) {
			var x = 0;
			if (data) {
            	$('ul', par).empty();
                
				for (var x = 0; x < data.length; x++) {
					var symptom = data[x].name;
					var li_class = (x == 0) ? 'class="active"' : '';

					var isThisSymptomSelected = $('#selected_symptom_group .item-text').filter(function(i, x) {return symptom === $(x).text()}).length; 
 
					if(!isThisSymptomSelected) { 
						$('ul', par).append("<li param='" + data[x].id + "' " + li_class + ">" + symptom + "</li>");
					} 

					if ($('ul li', par).length === 5) {
						break;
					}
				}

				$('ul li', par).click(function () {
					$('input[name=symptom]', par).val('');
					
					if($('#selected_symptom_group').length > 0) { 
						var symptom = $(this).html();
						var symptoms = $('#selected_symptom_group .item-text').map(function(idx, elem) {
            	return $(elem).text()
						});

						symptoms.push(symptom);
						symptoms.sort();
						
						$('#selected_symptom_group').html('');
						
						for(var i=0; i<symptoms.length; i++) {
							var s = symptoms[i];
							var item = '<div class="item-selected"><span class="item-text">' + s + '</span> <img src="img/close-pop-up-10-x-10.png"></div>';
	
							$('#selected_symptom_group').append(item);                    
						}

						$('input[name=symptom]').trigger('focus');
					}else{
						$('input[name=symptom]').val($(this).text())
					}
					
					$('ul', par).hide();
				});
			}
		});
		$('ul', par).show();
	}
	else {
		$('ul', par).hide();
	}
}
 
function openprofile(id,distance) {
    $('#modalprofile .averagerating').html(rating5bars(0));
    $('#modalprofile .edit').addClass('invi');
    $('#modalprofile').attr('param',id);

    loadprofilereviews(id,id[0],distance);
    if(id[0]==1)
    {
      $('#modalprofile .fordoctor').removeClass('invi');
        $.get(app_url+'/v1/search/doctor/'+id,function(data){
            var img;

            var tmpspecialty = data.mainSpecialtyID.split(',');
            var mainspecialty = tmpspecialty[0];

            if(data.mainSpecialtyID.indexOf(",") > -1)
            {
                var tmpspecialty = data.mainSpecialtyID.split(',');
                var mainspecialty = tmpspecialty[0];
            }
            else if(data.mainSpecialtyID.indexOf(" ~ ") > -1)
            {
                var tmpspecialty = data.mainSpecialtyID.split(' ~ ');
                var mainspecialty = tmpspecialty[0];
            }

            for(var y=0;y<tmpspecialty.length;y++)
            {
              if(tmpspecialty[y].indexOf(getUrlParameter('q')) > -1)
              {
                  mainspecialty = tmpspecialty[y];
              }
            }

            if(mainspecialty == "Dentist" || mainspecialty == "Dental Lab")
            {
              img = "/img/dentist-img.png";
            }
            else
            {
                if(data.picture!="")
                {
                    img = data.picture;
                }
                else
                {
                    var img = data.gender == 'Male' ? '/coreIMAGES/doctor_male.svg' : '/coreIMAGES/doctor_female.svg';
                }
            }

            if(data.isweb_chatVerified == true)
            {

            }
            else
            {
              $('#modalprofile .certified').addClass('invi');
            }

            $('#modalprofile .avatar').attr('src',img);
            $('#modalprofile .name').html(data.firstName + ' ' + data.lastName);
            $('#modalprofile .clinic').html(data.practice);
            $('#modalprofile .address').html(data.addressLine1+"<br><span style='margin-left:20px;'>"+data.city+", "+data.state+" "+data.zip+"</span>");
            $('#modalprofile .practice').html(mainspecialty);

            $('#modalprofile .miles').html(distance+" mi");

            if(data.email)
            {
                $('#modalprofile .profemail').attr('href','mailto:'+data.email);
                $('#modalprofile .profemail').attr('param',data.email);
                $('#modalprofile .contact .profemail,#modalprofile .contact .email').removeClass('invi');
            }

            if(data.website)
            {
                $('#modalprofile .profwebsite').attr('param',data.website);
                $('#modalprofile .profwebsite').attr('href','http://'+data.website);
                $('#modalprofile .contact .profwebsite, #modalprofile .contact .website').removeClass('invi');
            }
            $('#modalprofile .phone').html(prettyphone(data.phone));
            $('#modalprofile .forAbout p').html(data.aboutDescription);
            $('#modalprofile,#modalbg').fadeIn();

            $('#modalprofile .aboutsection ul li').each(function(){
              var _this = $(this);
                if(_this.html() == 'Procedures'){
                  _this.hide();
                }
            });
        }).fail(function(data){
            if(data.responseJSON.status == "Error")
            {
                // $('#modalprofile,#modalbg').fadeIn();
            }
        });
    }
    else if(id[0]==2)
    {
        $('#modalprofile .forlab').removeClass('invi');
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": app_url + "/v1/lab_procedure/" +id ,
              "method": "GET",
              "headers": {
                "content-type": "application/json"
              }
            }

            $.ajax(settings).done(function (response) {
	      if(response.labProcedure != ""){
	      $('#modalprofile .aboutsection .forProcedures table tbody').empty();
 	      var stringProcedures = "{\"procedures\":[" + response.labProcedure + "]}";
              var data = JSON.parse(stringProcedures);
                $('#modalprofile .aboutsection ul li').each(function(){
                  var _this = $(this);
                    if(_this.html() == 'Procedures'){
	              for(i=0; i < data.procedures.length; i++){
			var procedure = data.procedures[i];
	                $('#modalprofile .aboutsection .forProcedures table tbody')
	                  .append(
	                    '<tr><td width=25%>' + procedure.name + '</td><td width=15%>'+procedure.time+' days</td><td width=15%>$'+procedure.price+'</td><td width=45%>'+procedure.note+'</td></tr>'
	                  );
		      }
	            }
	        });
	      }else{
	      $('#modalprofile .aboutsection .forProcedures table tbody').empty();
	      }
            });

          $.get(app_url+'/v1/search/lab/'+id,function(data){
	    var specialties = data.mainSpecialtyID.split(",");
	    var mainSpecialty = specialties[0];
	    var tmpspecialty;

            if(data.mainSpecialtyID.indexOf(",") > -1)
            {
                var tmpspecialty = data.mainSpecialtyID.split(',');
                var mainspecialty = tmpspecialty[0];
            }
            else if(data.mainSpecialtyID.indexOf(" ~ ") > -1)
            {
                var tmpspecialty = data.mainSpecialtyID.split(' ~ ');
                var mainspecialty = tmpspecialty[0];
            }else{
                var tmpspecialty = "";
                var mainspecialty = "";
	    }

	    if(tmpspecialty != ""){
              for(var y=0;y<tmpspecialty.length;y++)
              {
                if(tmpspecialty[y].indexOf(getUrlParameter('q')) > -1)
                {
                    mainspecialty = tmpspecialty[y];
                }
              }
	    }

	    if(data.picture == ""){
	      if(mainSpecialty == "Dental Lab" || mainSpecialty == "Dentist"){
                $('#modalprofile .avatar').attr('src','/img/dentist-img.png');
	      }else{
                var profileImage = data.gender == 'Male' ? '/coreIMAGES/doctor_male.svg' : '/coreIMAGES/doctor_female.svg';
              
                $('#modalprofile .avatar').attr('src',profileImage);
	      }
	    }else{
                $('#modalprofile .avatar').attr('src',data.picture);
	    }
            $('#modalprofile .name').html(data.firstName + ' ' + data.lastName);
            $('#modalprofile .clinic').html(data.practice);
            $('#modalprofile .address').html(data.addressLine1+"<br><span style='margin-left:20px;'>"+data.city+", "+data.state+" "+data.zip+"</span>");
            $('#modalprofile .practice').html(mainSpecialty);
            $('#modalprofile .miles').html(distance+" mi");
            $('#modalprofile .profemail').attr('href','mailto:'+data.email);
            $('#modalprofile .profemail').attr('param',data.email);
            $('#modalprofile .profwebsite').attr('href','http://'+data.website);
            $('#modalprofile .profwebsite').attr('param',data.website);
            $('#modalprofile .phone').html(prettyphone(data.phone));
            $('#modalprofile .forAbout p').html(data.aboutDescription);
            $('#modalprofile,#modalbg').fadeIn();
            $('#modalprofile .aboutsection ul li').each(function(){
              var _this = $(this);
                if(_this.html() == 'Procedures'){
                  _this.show();
                }
            });
        }).fail(function(data){
            if(data.responseJSON.status == "Error")
            {
                // $('#modalprofile,#modalbg').fadeIn();
            }
        });
    }
}

function checksession() {
    if(localStorage.getItem('user_type')==null)
    {
        window.location="/sign-in.php";
    }
}

function prettyphone(phone) {
    if(phone!="" && phone!=undefined)
    {
        var newphone = "("+phone.charAt(0)+phone.charAt(1)+phone.charAt(2)+") "+phone.charAt(3)+phone.charAt(4)+phone.charAt(5)+" "+phone.charAt(6)+phone.charAt(7)+phone.charAt(8)+phone.charAt(9);
        return newphone;
    }
    else
    {
        return "";
    }
}

//----start PROFILE POP-UP
    $('.doctor-list .name').click(function(){
        $('#modalprofile,#modalbg').fadeIn();
    });

    $('#modalbg,#modalprofile .closebtn').click(function(){
        $('#modalprofile,#modalbg').fadeOut();
    });
    $('#modalprofile .aboutsection li').click(function(){
        if(!$(this).hasClass('disabled'))
        {
            $('#modalprofile .aboutsection li').each(function(){
              $(this).removeClass('active');
            });
            $('#modalprofile .aboutsection .divs').each(function(){
                $(this).hide();
            });
            $('#modalprofile .aboutsection .for'+$(this).html()).show();
            $(this).addClass('active');
        }
    });

    $('#modaleditbox .aboutsection li').click(function(){
        if($(this).hasClass('fr'))
        {

        }
        else
        {
            if($(this).html()=="Photos")
            {
                $('#modaleditbox .aboutsection li.fr').html('<img src="/img/upload-icon.png"> Upload');
                $('#modaleditbox .aboutsection li.fr').removeClass('invi');
            }
            else if($(this).html()=="Insurance")
            {
                $('#modaleditbox .aboutsection li.fr').html('<img src="/img/add-icon.png"> Add');
                $('#modaleditbox .aboutsection li.fr').removeClass('invi');
            }
            else if($(this).html()=="Change Password")
            {
                $('#modaleditbox .aboutsection li.fr').removeClass('invi');
            }
            else
            {
                $('#modaleditbox .aboutsection li.fr').addClass('invi');
            }

            $('#modaleditbox .aboutsection li').each(function(){
                $(this).removeClass('active');
            });
            $('#modaleditbox .aboutsection .divs').each(function(){
                $(this).hide();
            });
            $('#modaleditbox .aboutsection .for'+$(this).html()).show();
            $(this).addClass('active');
        }
    });

    $('#modalprofile .reviews .review-item').hover(function(){
        $('.rhead .reply',this).fadeIn('fast');
    },function(){
        $('.rhead .reply',this).fadeOut('fast');
    });


    $('#modalprofile .review-section a').click(function(){
        $('#modalprofile,#modalbgw').hide();

        $('#modaladdreview input[name=name]').val("");
        $('#modaladdreview textarea').val("");
        $('#modaladdreview input[name=ratings]').val(0)
        $('#modaladdreview input[name=agree]').removeAttr('checked');
        $('#modaladdreview .staro,#modaladdreview .checkboximg').removeClass('active');
        $('#modaladdreview .ratings div').html('0.00');

        if (userprofile) {
          $('#modaladdreview input[name=name]').val(userprofile.firstName+" "+userprofile.lastName);
          $('#modaladdreview input[name=name]').attr('readonly','readonly');
        }

        $('#modaladdreview,#modalbg').fadeIn();
    });

    $('#modaladdreview .ratings span').hover(function(){
        var x = 0;var y = 0;
        if($(this).attr('param')=="Poor")
        {
            y = 1;
        }
        else if($(this).attr('param')=="Adequate")
        {
            y = 2;
        }
        else if($(this).attr('param')=="Average")
        {
            y = 3;
        }
        else if($(this).attr('param')=="Good")
        {
            y = 4;
        }
        else if($(this).attr('param')=="Excellent")
        {
            y = 5;
        }

        $('#modaladdreview .ratings span').each(function(){
            if(x++ < y)
            // if (true)
            {
                $(this).css('background-image','url(img/5-star-orange.png)');
            }
        });
    },function(){
        $('#modaladdreview .ratings span').each(function(){
            $(this).css('background-image','');
        });
    });

    $('#modaladdreview .ratings span').click(function(){

        $('#modaladdreview .ratings span').each(function(){
            $(this).removeClass('active');
        });
        var x = 0;var y = 0;
        if($(this).attr('param')=="Poor")
        {
            y = 1;
        }
        else if($(this).attr('param')=="Adequate")
        {
            y = 2;
        }
        else if($(this).attr('param')=="Average")
        {
            y = 3;
        }
        else if($(this).attr('param')=="Good")
        {
            y = 4;
        }
        else if($(this).attr('param')=="Excellent")
        {
            y = 5;
        }

        $('#modaladdreview .ratings span').each(function(){
            //if(x++ < y)
            if (true)
            {
                $(this).addClass('active');
            }
        });
        $('#modaladdreview input[name=ratings]').val(y);
        $('#modaladdreview .ratings div').html(y+".00");
    });
    $('#modaladdreview .checkboximg, #modaladdreply .checkboximg').click(function(){
        $('#modaladdreview .errormsg').remove();
        var par = $(this).parent();
        if($(this).hasClass('active'))
        {
            $(this).removeClass('active');
            $('input[type=checkbox]',par).removeAttr('checked');
        }
        else
        {
            $(this).addClass('active');
            $('input[type=checkbox]',par).attr('checked','checked');
        }
    });
    $('#modaladdreview button').click(function(){
        $('#modaladdreview .errormsg').remove();
        if($('input[name=agree]').is(':checked'))
        {
            var id = $('#modalprofile').attr('param');
            var doc_id="",lab_id="";

            if(id[0]==1)
            {
               doc_id=id;
            }
            else
            {
              lab_id=id;
            }

            var name = $('#modaladdreview input[name=name]').val();
            var rating = $('#modaladdreview input[name=ratings]').val();
            var message = $('#modaladdreview textarea[name=message]').val();

            var settings = {
            "async": true,
            "crossDomain": true,
            "url": app_url + "/v1/review",
            "method": "POST",
            "headers": {
            "content-type": "application/json"
            },
            "processData": false,
            "data": JSON.stringify({"name":name,
                "doctor_id":doc_id,
                "lab_id":lab_id,
                "comment":message,
                "user_id":userprofile.ID.toString(),
                "rate":parseInt(rating)
              })
            }
            $.ajax(settings).done(function (response) {
                var name = $('#modaladdreview input[name=name]').val("");
                var rating = $('#modaladdreview input[name=ratings]').val("");
                var message = $('#modaladdreview textarea[name=message]').val("");
                $('#modaladdreview').fadeOut();
                loadprofilereviews(id,id[0]);
                $('#modalprofile').fadeIn();
            }).fail(function(){
                $('#modaladdreview .terms').prepend('<p class="errormsg" style="color:#f00;margin-top:-5px;"><img src="img/error-icon.png"> Try Again</p>');
            });
        }
        else
        {
            $('#modaladdreview .terms').prepend('<p class="errormsg" style="color:#f00;margin-top:-5px;"><img src="img/error-icon.png"> Must agree on terms</p>');
        }
    });


    $('#modaladdreply button,#modaladdreview .closebtn, #modaladdreply .closebtn').click(function(){
        $('#modaladdreview, #modaladdreply').fadeOut();
        $('#modalprofile').fadeIn();
    });
    $('#modalprofile .reviews .review-item .rhead .reply').click(function(){
        $('#modalprofile, #modalbgw').fadeOut();
        $('#modalbg,#modaladdreply').fadeIn();
    });


    $("#modalprofile .edit").click(function(){
        window.location = "/edit-profile.php";
    });
    $('#modalbgw,#modaledithead .cancel').click(function(){
        $("#modalbgw,#modaledithead,#modaleditbox").fadeOut();
    });

    $('#modalbgw,#modaledithead .save').click(function(){
        var id = $("#modaleditbox .contactinfo input[name='id']").val();
        var first_name = $("#modaleditbox .contactinfo input[name='first_name']").val();
        var last_name = $("#modaleditbox .contactinfo input[name='last_name']").val();
        var practice = $("#modaleditbox .contactinfo input[name='practice']").val();
        var addressLine1 = $("#modaleditbox .contactinfo input[name='addressLine1']").val();
        var phone = $("#modaleditbox .contactinfo input[name='phone']").val();
        var gender = $("#modaleditbox .contactinfo input[name='gender']").val();
        var picture = $("#modaleditbox .contactinfo input[name='picture']").val();

        var language = $("#modaleditbox .midsection input[name='language']").val();
        var license = $("#modaleditbox .midsection input[name='license']").val();
        var insurance = $("#modaleditbox .midsection input[name='insurance']").val();

        var abmsCert = $("#modaleditbox .midsection select[name='abmscert']").val();
        var mainSpecialtyID = $("#modaleditbox .midsection input[name='specialty']").val();
        var website = $("#modaleditbox .midsection input[name='website']").val();
        var yelpID = $("#modaleditbox .midsection input[name='yelpID']").val();
        var facebookID = $("#modaleditbox .midsection input[name='facebookID']").val();
        var linkedInID = $("#modaleditbox .midsection input[name='linkedInID']").val();

        var aboutDescription = $("#modaleditbox .aboutsection textarea").val();

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": app_url + "/v1/doctor/" + id,
		"method": "PUT",
		"headers": {
			"content-type": "application/json",
			"authorization": localStorage.getItem('user_token')
		},
		"data" : JSON.stringify({
			"firstName" : first_name,
			"lastName" : last_name,
		  "phone" : phone,
			"addressLine1" : addressLine1,
			"insurance": insurance,
			"gender": gender,
			"picture": picture,
			"aboutDescription": aboutDescription,
			"license": license,
			"abmsCert": abmsCert,
			"spokenLanguage": language,
			"website": website,
			"facebookID" :facebookID,
			"linkedInID": linkedInID,
			"yelpID": yelpID

			//"city": city,
		        //"state": state,
			//"zip":zip,
			//"mainSpecialtyID": mainSpecialtyID,
			//"subSpecialtyID": subSpecialtyID,
			//"latitude" : lat,
			//"longitude" : lng,
		})
	}

	$.ajax(settings)
	.done(function (response) {
                $("#modalbgw,#modaledithead,#modaleditbox").fadeOut();
	})
	.fail(function(error){
        console.log("error console",error)
        if(error.responseJSON.error === "Token expired"){
            $('#token-expired-popup,#modalbg').fadeIn();
        }
    });

    });

    $('#modaleditbox .replace').click(function(){
        if($('p',this).html() == "Replace")
        {
            $('img',this).attr("src","img/upload-icon.png");
            $('p',this).html("Upload");
        }
        else
        {
            $('img',this).attr("src","img/replace-icon.png");
            $('p',this).html("Replace");
        }
    });

    $('#modaleditbox .webmedia .inputgroup input').hover(function(){
        var par = $(this).parent();
        $(this).css('border-color','#c6ccca');
        $('span',this).css('border-color','#c6ccca');
    },function(){
        $(this).css('border-color','#dfe6e4');
        $('span',this).css('border-color','#dfe6e4');
    });
    //----END PROFILE POP-UP

$(document).ready(function(){

    if(!localStorage.getItem('user_token'))
    {
      if($.cookie('user_token')!=undefined)
      {
          localStorage.setItem('user_email', $.cookie('user_email'));
          localStorage.setItem('user_token', $.cookie('user_token'));
          localStorage.setItem('user_type', $.cookie('user_type'));
      }
    }

    if(localStorage.getItem('user_type') == null)
    {
        $('.fornonuser').removeClass('invi');
    }
    else
    {
        if(localStorage.getItem('user_type')==3)
        {
          $('.fordriver').removeClass('invi');
        }
        else
        {
          $('.foruser').removeClass('invi');
        }
    }
    
    if(localStorage.getItem('user_picture')) { 
        $('.img-holder img').attr('src', localStorage.getItem('user_picture')); 
        $('.profile-info .avatar').attr('src', localStorage.getItem('user_picture')); 
    } 
    
    qval = getUrlParameter('qval')===undefined ? "" : getUrlParameter('qval');
    ins = getUrlParameter('ins')===undefined ? "" : getUrlParameter('ins');
    insuranceplan = getUrlParameter('insurance')===undefined ? "" : getUrlParameter('insurance');
    q = getUrlParameter('q')===undefined ? "" : getUrlParameter('q');
    lat = getUrlParameter('lat')===undefined ? "" : getUrlParameter('lat');
    lng = getUrlParameter('lng')===undefined ? "" : getUrlParameter('lng');
    type = getUrlParameter('type')===undefined ? "" : getUrlParameter('type');

    if(lat=="" || lng == "")
    {
        //--MONKEY FIX GEO LOCATION--
        var latLong;
        $.getJSON("https://ipinfo.io", function(ipinfo){
            latLong = ipinfo.loc.split(",");
            $('#searchform input[name=lat]').val(latLong[0]);
            $('#searchform input[name=lng]').val(latLong[1]);
            var state = "";
            if(ipinfo.state)
            {
                state = ipinfo.state;
            }
            else
            {
                state = ipinfo.region;
            }
            $('#geoloc').val(ipinfo.city + ', ' + state);
        });
    }

    $('.search-box li').click(function(){
        $('.search-box ul li').each(function(){
            $(this).removeClass('active');
        });
        $(this).addClass('active');

        if($(this).hasClass('orders'))
        {
            $('#searchform').attr('action','/order.php');
            $('#locationicon').hide();
            $('#newBioSearchBox').css({'border-bottom-left-radius':'5px','border-top-left-radius':'5px'})
        }
        else
        {
            $('#searchform').attr('action','/search.php');
            $('#locationicon').show();
            $('#newBioSearchBox').css({'border-bottom-left-radius':'0','border-top-left-radius':'0'})
        }
        $('#newBioSearchBox').attr('placeholder','Search '+$(this).html().trim().toLowerCase());
    });

    $('body').click(function(e){

        if($(e.target).attr("id") != "geoloc")
        {
            $('.loc-tooltip').fadeOut('fast');
            $('#locationicon').removeClass('active');
        }
        else
        {
            $('#geoloc').select();
        }

        if(!$(e.target).is("header .account ul.dropdown-menu.account li a") && !$(e.target).is("header .account ul.dropdown-menu.account li label") && !$(e.target).is("header .account ul.dropdown-menu.account li img"))
        {
            $('header .account ul.dropdown-menu.account').fadeOut("fast");
            $('header .account ul.dropdown-menu.account li').each(function(){
                $(this).removeClass('active');
            });
        }
        if($(e.target).attr('id') != "newBioSearchBox" && $(e.target).attr('id') != "insuranceplan")
        {
          $('#landingPage-AutoCompleteResultsStyle,#insusug').hide();
        }

        if($(e.target).attr('id') != "languages" && $(e.target).attr('id') != "specialty" && $(e.target).attr('id') != "insurance" && $(e.target).attr('id') != "DirectorderDropoffName")
        {
          $('.suggestionbox').fadeOut();
        }
    });

    $('#locationicon').click(function(e){
        $('.loc-tooltip').fadeToggle("fast");
        $('.loc-tooltip input').select();
        if($(this).hasClass('active'))
        {
            $(this).removeClass('active');
        }
        else
        {
            $('.search-box').removeClass('open');
            $(this).addClass('active');
        }
        e.stopPropagation();
    });

    $('#geoloc').on('input',function(){
        if($(this).val().length >= 20)
        {
            $(this).attr('size', $(this).val().length);
        }
    });


    // $('#newBioSearchBox').click(function(){
    //     if($('.search-box li.active').hasClass('orders'))
    //     {
    //         $('input[name=q]').val($('#newBioSearchBox').val());
    //     }
    //     else
    //     {
    //             clearTimeout(typingTimer);
    //             typingTimer = setTimeout(function(){

    //                 searchbox();

    //             }, doneTypingInterval);
    //     }
    // });

    $('#searchform button').click(function(){
        $('#searchform').submit();
    });


    var inputDefaultValue;
    var inputDefaultValueInc;



    $('#newBioSearchBox').devbridgeAutocomplete({
        minChars:3,
        autoSelectFirst: true,
        onSearchStart:function(param){
          console.log("starting search");
        },
        lookup: $.debounce(function(req, res){

            if($('#searchform').attr('action') === '/order.php') {
                return [];
            }

            var val = req;
            var suggestions = [];
            
        
            $.ajax({
                url: app_url+'/v1/search/specialty?q='+val,
                success: function(data){
                    if (data){
                        console.log("entered in doctor ajax");
                        $('#searchform input[name=q]').val(data[0].mainSpecialtyID);
                        $('#searchform input[name=type]').val('specialty');

                        console.log("value of q " + $('#searchform input[name=q]').val())

                        $.map(data, function(dataItem) {

                            suggestions.push({
                                value:dataItem.specialty,
                                data:{
                                    category: "Specialty near you",
                                    desc:dataItem.description
                                },
                                param:dataItem.specialty,
                                type: 'specialty'
                            });
                            return dataItem;
                        });
                    }
                    $.ajax({
                        url: app_url+'/v1/search/doctor?lat='+$('#searchform input[name=lat]').val()+'&lng='+$('#searchform input[name=lng]').val()+'&q='+val+'&d=6000mi&type=name',
                        success: function(docData){

                            if (docData && docData.length > 0){

                                console.log("length of data "+docData.length)
                                if (!suggestions.length){
                                    console.log("entered")
                                    var toDebug =  docData[0].firstName + ' ' + docData[0].lastName;
                                    $('#searchform input[name=q]').val(toDebug);
                                    $('#searchform input[name=type]').val('name');
                                }

                                $.map(docData, function(dataItem) {
                                    suggestions.push({
                                        value:dataItem.firstName + ' ' + dataItem.lastName,
                                        data:{
                                            category: "Doctors near you",
                                            desc:dataItem.city,
                                            picture:dataItem.picture,
                                            city:dataItem.city,
                                            state:dataItem.state,
                                            specialty:dataItem.mainSpecialtyID
                                        },
                                        type: 'name',
                                        param:dataItem.firstName + ' ' + dataItem.lastName
                                    });
                                });
                                console.log('sug', suggestions)
                                //res({
                                //    suggestions: suggestions
                                //});
                            }
                            $.ajax({
                                url: app_url+'/v1/search/symptom?&q='+val,
                                success: function(symptomData){
                                    console.log('stage3')

                                    if (symptomData && symptomData.length > 0){
                                        console.log("entered in symptomData ajax");
                                        if (!suggestions.length){
                                            $('#searchform input[name=q]').val(symptomData[0].name);
                                            $('#searchform input[name=type]').val('name');
                                        }

                                        $.map(symptomData, function(dataItem) {

                                            suggestions.push({
                                                value:dataItem.name,
                                                data:{
                                                    category: "Symptoms You May Have",
                                                    id: dataItem.symptom_id
                                                },
                                                type: 'symptom',
                                                param:dataItem.name
                                            });
                                            return dataItem;
                                        });
                                    }
                                    $.ajax({
                                        url: app_url+'/v1/search/condition?&q='+val,
                                        success: function(conditionData){
                                            console.log('stage3')

                                            if (conditionData && conditionData.length > 0){
                                                console.log("entered in symptomData ajax");
                                                if (!suggestions.length){
                                                    $('#searchform input[name=q]').val(conditionData[0].name);
                                                    $('#searchform input[name=type]').val('name');
                                                }

                                                $.map(conditionData, function(dataItem) {

                                                    suggestions.push({
                                                        value:dataItem.name,
                                                        data:{
                                                            category: "Medical Conditions",
                                                            desc:dataItem.description,
                                                            id:dataItem.id
                                                        },
                                                        type: 'condition',
                                                        param:dataItem.name
                                                    });
                                                    return dataItem;
                                                });
                                            }
                                            else{
                                                console.log("didn't find anything")
                                                //console.log("val of q =  "+$('searchform input[name=q]').val())
                                            }
                                            console.log(suggestions)
                                        res({
                                            suggestions: suggestions
                                        });
                                    }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            
        }, 300),
        onSelect: function (suggestion) {
            $('#searchform input[name=q]').val(suggestion.param);
            $('#searchform input[name=type]').val(suggestion.type);
            if(suggestion.type === 'symptom'){
              var idStr = "";
              var symp = '<div class="item-selected toRemoveFromPopupAtLast" id = "symp' + suggestion.data.id + '" ><span class="item-text">' + suggestion.param + '</span> <img src="img/close-pop-up-10-x-10.png"></div>';
              $('#selected_symptoms_group').append(symp);
              updateConditonPopUp(idStr+suggestion.data.id);
              $('#symptombox,#modalbg').fadeIn();
            }
            if(suggestion.type === 'condition'){
              console.log(suggestion.data.id);
              var symp = '<div class="item-selected toRemoveFromPopup" id = "cond' + suggestion.data.id + '" ><span class="item-text">' + suggestion.param + '</span> <img src="img/close-pop-up-10-x-10.png"></div>';
              $('#selected_conditions_group').append(symp);
              updateSpecialtyPopUp(""+suggestion.data.id);
              $('#symptombox,#modalbg').fadeIn();
            }
        },
        groupBy: 'category',
        formatResult: function(suggestion, currentValue) {
            inputDefaultValue = currentValue;
            currentValue = currentValue.toLowerCase();
            console.log('working!!');
            switch(suggestion.type) {
                case 'specialty':
                    return '<p class="title">' + suggestion.value.toLowerCase().replace(currentValue,'<strong style="color:#579ea2;">'+currentValue+"</strong>") + '</p>'
                        + '<p class="desc">' + suggestion.data.desc.toLowerCase().replace(currentValue,'<strong style="color:#579ea2;">'+currentValue+"</strong>") + '</p>'

                case 'name':

                    var specialty="";
                    var mainspecialty = suggestion.data.specialty;
                    var city = suggestion.data.city;
                    var state = suggestion.data.state;

                    if(suggestion.data.specialty.indexOf(",") > -1)
                    {
                        specialty = suggestion.value.split(',');
                        mainspecialty=specialty[0];
                        for(var y=0; y<specialty.length ;y++)
                        {
                            if(specialty[y].toLowerCase().indexOf(currentValue)>-1)
                            {
                                mainspecialty = specialty[y];
                            }
                        }
                    }
                    else if(suggestion.data.specialty.indexOf(" ~ ") > -1)
                    {
                        specialty = suggestion.value.split(' ~ ');
                        mainspecialty=specialty[0];
                        for(var y=0; y<specialty.length ;y++)
                        {
                          if(specialty[y].toLowerCase().indexOf(currentValue)>-1)
                          {
                              mainspecialty = specialty[y];
                          }
                        }
                    }


                    if(suggestion.data.picture)
                    {
                        var image = suggestion.data.picture;
                    }else if(mainspecialty == "Dentist" || mainspecialty == "Dental Lab"){
                        var image = '/img/dentist-img.png';
                    }else{
                        var image = suggestion.data.gender == 'Male' ? '/coreIMAGES/doctor_male.svg' : '/coreIMAGES/doctor_female.svg';
                    }

                    return '<p class="title">'
                            + '<img src="' + image + '">'
                            + suggestion.value.toLowerCase().replace(currentValue,'<strong style="color:#579ea2;">'+currentValue+"</strong>")
                            + '</p>'
                        + '<p class="desc">'  +mainspecialty + ' | ' +city+ ', ' + state + '</p>'

                case 'symptom':
                  return '<p class="title">' + suggestion.value.toLowerCase().replace(currentValue,'<strong style="color:#579ea2;">'+currentValue+"</strong>") + '</p>'

                case 'condition':
                  return '<p class="title">' + suggestion.value.toLowerCase().replace(currentValue,'<strong style="color:#579ea2;">'+currentValue+"</strong>") + '</p>'


                case 'lab':

                    var specialty="";
                    var mainspecialty = suggestion.data.specialty;
                    var city = suggestion.data.city;
                    var state = suggestion.data.state;

                    if(suggestion.data.specialty.indexOf(",") > -1)
                    {
                        specialty = suggestion.value.split(',');
                        mainspecialty=specialty[0];
                        for(var y=0; y<specialty.length ;y++)
                        {
                            if(specialty[y].toLowerCase().indexOf(currentValue)>-1)
                            {
                                mainspecialty = specialty[y];
                            }
                        }
                    }
                    else if(suggestion.data.specialty.indexOf(" ~ ") > -1)
                    {
                        specialty = suggestion.value.split(' ~ ');
                        mainspecialty=specialty[0];
                        for(var y=0; y<specialty.length ;y++)
                        {
                          if(specialty[y].toLowerCase().indexOf(currentValue)>-1)
                          {
                              mainspecialty = specialty[y];
                          }
                        }
                    }

                    if(suggestion.data.picture)
                    {
                        var image = suggestion.data.picture;

                    }else if(mainspecialty == "Dentist" || mainspecialty == "Dental Lab"){
                        var image = '/img/dentist-img.png';
                    }else{
                        var image = suggestion.data.gender == 'Male' ? '/coreIMAGES/doctor_male.svg' : '/coreIMAGES/doctor_female.svg';
                    }


                    return '<p class="title">'
                            + '<img src="' + image + '">'
                            + suggestion.value.toLowerCase().replace(currentValue,'<strong style="color:#579ea2;">'+currentValue+"</strong>") + '</p>'
                        + '<p class="desc">' + mainspecialty + ' | ' +city+ ', ' + state + '</p>'

            }
        }
    });

    $('#newBioSearchBox').click(function(){
      $('#searchform h3').addClass("invi");
    })

    $('#searchform').submit(function(e){
		//<h3 class="errormsg invi">No result found <br> Please try again </h3>

        console.log("during submission value of q = " + $('#searchform input[name=q]').val())
        if( $('#newBioSearchBox').val().length === 0 ){  
            $('#newBioSearchBox').val('primary care physician');
            $('#searchform input[name=q]').val('primary care physician')
        }else  if( $('#newBioSearchBox').val().length < 3 ){
            $('#searchform .m1').removeClass("invi");
            e.preventDefault()
            return;
        }

        if( !($('#searchform input[name=q]').val()) ){
            $('#searchform .m2').removeClass("invi");
            e.preventDefault()
        }
            /*
            if (inputDefaultValue != $('#newBioSearchBox').val()){
                $('#searchform input[name=q]').val($('#newBioSearchBox').val());
            }
            if (inputDefaultValueInc != $('#insuranceplan').val()){
                $('#searchform input[name=inca]').val($('#insuranceplan').val());
            }
            */
    });

    $('#languages,#search-languages').devbridgeAutocomplete({
        minChars:3,
        autoSelectFirst: true,
        lookup: function(req, res){
            var val = req;
            var suggestions = [];
            $.ajax({
                url: app_url+'/v1/lookup/types/language',
                success: function(data){
                    if (data){
                        $('input[name=lang]').val("English")
                        $.map(data, function(dataItem) {
                          if(dataItem.displayValue.toLowerCase().indexOf(req.toLowerCase()) >= 0){
                            suggestions.push({
                                value:dataItem.displayValue,
                                data:{
                                    id:dataItem.id
                                }
                            });
                          }
                        });
                    }

                    res({
                        suggestions: suggestions
                    });
                }
            });
        },
        onSelect: function (suggestion) {
            $('input[name=lang]').val(suggestion.value);
        },
        formatResult: function(suggestion, currentValue){
            console.log('from2')
            inputDefaultValueInc = currentValue;
            return suggestion.value.toLowerCase().replace(currentValue,'<strong style="color:#579ea2;">'+currentValue+"</strong>");
        }
    });

    $('#symptominput').devbridgeAutocomplete({
        minChars:3,
        autoSelectFirst: true,
        lookup: function(req, res){
            var val = req;
            var suggestions = [];
            $.ajax({
              url: app_url+'/v1/search/symptom?q='+val,
              success: function(symptomData){
                  if (symptomData){
                      $.map(symptomData, function(dataItem) {

                          suggestions.push({
                              value:dataItem.name,
                              data:{
                                  category: "Symptoms You May Have",
                                  id: dataItem.symptom_id
                              },
                              type: 'symptom',
                              param:dataItem.name
                          });
                          return dataItem;
                      });
                  }

                    res({
                        suggestions: suggestions
                    });
                }
            });
        },
        onSelect: function (suggestion) {
            var val = suggestion.value.toLowerCase();
          	var par = $('input[name=symptomPop]').parent();
        			$('input[name=symptomPop]', par).val('');
              var symArray = $('#selected_symptoms_group div')
              var idStr = "";
              var flag = 0;
              $.each(symArray,function(){
                idStr += this.id.substring(4) + ","
                if("symp"+suggestion.data.id === this.id){
                  flag = 1
                  return false;
                }
              })
              if(flag === 0){
          			var symp = '<div class="item-selected toRemoveFromPopupAtLast" id = "symp' + suggestion.data.id + '" ><span class="item-text">' + val + '</span> <img src="img/close-pop-up-10-x-10.png"></div>';
          			$('#selected_symptoms_group').append(symp);
                $('.toRemoveFromSpecialtyPopup').remove()
                updateConditonPopUp(idStr+suggestion.data.id);
              }

        },
        formatResult: function(suggestion, currentValue){
            inputDefaultValueInc = currentValue;
            return suggestion.value.toLowerCase().replace(currentValue,'<strong style="color:#579ea2;">'+currentValue+"</strong>");
        }
    });

    $('#conditioninput').devbridgeAutocomplete({
        minChars:0,
        autoSelectFirst: true,
        groupBy:'category',
        lookup: function(req, res){
            var val = req;
            var suggestions = [];

            conditionSuggestions.forEach(function(dataItem){
              suggestions.push({
                  value:dataItem.name,
                  data:{
                      category: dataItem.category,
                      id: dataItem.id
                  },
                  type: 'suggestion',
                  param:dataItem.name
              });
            })

            if(val.length >= 3)
            $.ajax({
              url: app_url+'/v1/search/condition?q='+val,
              success: function(symptomData){
                  if (symptomData){
                      $.map(symptomData, function(dataItem) {

                          suggestions.push({
                              value:dataItem.name,
                              data:{
                                  category: "Medical Conditions",
                                  id: dataItem.id
                              },
                              type: 'condition',
                              param:dataItem.name
                          });
                          return dataItem;
                      });
                  }
                  res({
                      suggestions: suggestions
                  });

                }
            });
            if(val.length<3)
            res({
                suggestions: suggestions
            });
        },
        onSelect: function (suggestion) {
            var val = suggestion.value.toLowerCase();
            var par = $('input[name=conditionPop]').parent();
              $('input[name=conditionPop]', par).val('');
              var condArray = $('#selected_conditions_group div')
              var idStr = "";
              var flag = 0;
              $.each(condArray,function(){
                idStr += this.id.substring(4) + ","
                if("cond"+suggestion.data.id === this.id){
                  flag = 1
                  return false;
                }
              })
              if(flag === 0){
                if(suggestion.type === "suggestion"){
                var symp = '<div class="item-selected removedAfterSymptom toRemoveFromPopup" id = "cond' + suggestion.data.id + '" ><span class="item-text">' + val + '</span> <img src="img/close-pop-up-10-x-10.png"></div>';
                $('#selected_conditions_group').append(symp);
              }
              else {
                var symp = '<div class="item-selected toRemoveFromPopup" id = "cond' + suggestion.data.id + '" ><span class="item-text">' + val + '</span> <img float = "right" src="img/close-pop-up-10-x-10.png"></div>';
                $('#selected_conditions_group').append(symp);
              }
                updateSpecialtyPopUp();
              }

        },
        formatResult: function(suggestion, currentValue){
            inputDefaultValueInc = currentValue;
            return suggestion.value.toLowerCase().replace(currentValue,'<strong style="color:#579ea2;">'+currentValue+"</strong>");
        }
    });

    $('#selected_symptoms_group').on('click','img',function(event){
      var par = $(event.target).parent()
      par.remove()
      var idStr = ""
      $.each($('#selected_symptoms_group div'),function(){
        idStr += this.id.substring(4) + ","
      })
      updateConditonPopUp(idStr.substring(0,idStr.length-1));
    });

    $('#selected_conditions_group').on('click','img',function(event){
      var par = $(event.target).parent()
      par.remove()
      updateSpecialtyPopUp();
    });

    $('#condtionSelectPop').change(function(event){
      var id = $('option:selected', this).attr('id')
    //  $.(event.target).remove()
    var val = $('option:selected', this).val()
      var symArray = $('#selected_conditions_group div')
      var idStr = "";
      var flag = 0;
      $.each(symArray,function(){
        idStr += this.id.substring(4) + ","
        if("cond"+id === this.id){
          flag = 1
          return false;
        }
      })
      if(flag === 0){
        var symp = '<div class="item-selected toRemoveFromPopup" id = "cond' + id + '" ><span class="item-text">' + val + '</span> <img class = "forRemoving" src="img/close-pop-up-10-x-10.png"></div>';
        $('#selected_conditions_group').append(symp);
        updateSpecialtyPopUp(idStr+id);
      }
    });

    $('#specialtyPopUpList').click(function(event){
      var val = $(event.target).text();
      console.log(val + "after click")
      $('#searchform input[name=q]').val(val);
      $('#searchform input[name=qval]').val(val);
      $('#searchform input[name=type]').val('specialty');
      $('#newBioSearchBox').val(val);
      $('.toRemoveFromPopup').remove()
      $('.toRemoveFromPopupAtLast').remove()
      $('.toRemoveFromSpecialtyPopup').remove()
      $('#symptombox,#modalbg').fadeOut();
      $('#insuranceplan').focus()
    })

    var conditionSuggestions = []

    function updateConditonPopUp(arr){

      $('.removedAfterSymptom').remove()
      conditionSuggestions = []
      $.get(app_url+'/v1/search/triage?symptoms='+arr,function(data){
          data.forEach(function(val){
            conditionSuggestions.push({id : val.condition_id , category:"Suggestions based on your Symptoms" ,name:val.name})
          });
      });
      updateSpecialtyPopUp()

    }

    function updateSpecialtyPopUp(){

      var idStr = ""
      $.each($('#selected_conditions_group div'),function(){
        idStr += this.id.substring(4) + ","
      })

      $('.toRemoveFromSpecialtyPopup').remove()
      $.get(app_url+'/v1/search/triage_specialty?conditions='+idStr.substring(0,idStr.length-1),function(data){
          data.forEach(function(val){
            $('#specialtyPopUpList').append('<a href="#" class = "list-group-item toRemoveFromSpecialtyPopup" > ' + val.name + '</a>')
          });
      });

    }

    $('#insuranceplan').change(function() {
        if($('input[name=ins]').val()) {
            $('input[name=inca]').val('')
            $('input[name=ins]').val('')
        }
    })

    $('#insuranceplan').devbridgeAutocomplete({
        minChars:3,
        autoSelectFirst: true,
        lookup: function(req, res){
            var val = req;
            var suggestions = [];
            $.ajax({
                url: app_url+'/v1/search/insurance?q='+val,
                success: function(data){
                    if (data){

                        // $('input[name=inca]').val(data[0].plan);
                        // $('input[name=ins]').val(data[0].id);
                        $.map(data, function(dataItem) {
                            suggestions.push({
                                value:dataItem.plan,
                                data:{
                                    id:dataItem.id
                                }
                            });
                        });
                    }

                    res({
                        suggestions: suggestions
                    });
                }
            });
        },
        onSelect: function (suggestion) {
            $('input[name=inca]').val(suggestion.value);
            $('input[name=ins]').val(suggestion.data.id);
        },
        formatResult: function(suggestion, currentValue){
            console.log('from2')
            inputDefaultValueInc = currentValue;
            return suggestion.value.toLowerCase().replace(currentValue,'<strong style="color:#579ea2;">'+currentValue+"</strong>");
        }
    });

    function searchbox() {
        $('#insusug').hide();
        $('#landingPage-AutoCompleteResultsStyle ul').empty();
        var val = $('#newBioSearchBox').val().replace(/%20/g, " ");

        if(val.length > 2)
        {
        $('#landingPage-AutoCompleteResultsStyle ul').empty();
	    $('#landingPage-AutoCompleteResultsStyle ul.specialty-section').empty();
	    $('#landingPage-AutoCompleteResultsStyle ul.doctor-section').empty();
	    $('#landingPage-AutoCompleteResultsStyle ul.lab-section').empty();

            //Specialty
            $.get(app_url+'/v1/search/specialty?q='+val,function(data){
                var x = 0;
                if(data)
                {
                    for(var x = 0;x < data.length ; x++){
                        var vall = val.toLowerCase();
                        var specialty = data[x].mainSpecialtyID;
                        var desc = data[x].description;
                        if(x == 0)
                        {
                            $('#landingPage-AutoCompleteResultsStyle ul.specialty-section').append('<li class="header">Specialty near you</li>');
                            $('#landingPage-AutoCompleteResultsStyle ul.specialty-section').append('<li class="item item-specialty" param="'+specialty+'"><p class="title">'+specialty.toLowerCase().replace(vall,'<strong style="color:#579ea2;">'+vall+"</strong>")+'</p><p class="desc">'+desc.toLowerCase().replace(vall,'<strong style="color:#579ea2;">'+vall+"</strong>")+'</p></li>');
                        }
                        else
                        {
                            $('#landingPage-AutoCompleteResultsStyle ul.specialty-section').append('<li class="item item-specialty" param="'+specialty+'"><p class="title">'+specialty.toLowerCase().replace(vall,'<strong style="color:#579ea2;">'+vall+"</strong>")+'</p><p class="desc">'+desc.toLowerCase().replace(vall,'<strong style="color:#579ea2;">'+vall+"</strong>")+'</p></li>');
                        }

                        if(x == 4)
                        {
                            break;
                        }
                    }

                    $('#landingPage-AutoCompleteResultsStyle li.item-specialty').click(function(){
                        $('#newBioSearchBox').val($('.title',this).text());
                        $('#searchform input[name=q]').val($(this).attr('param'));
                        $('#searchform input[name=type]').val('specialty');
                        $('#landingPage-AutoCompleteResultsStyle').hide();
			$('#landingPage-AutoCompleteResultsStyle ul.specialty-section').empty();
			$('#searchform').submit();
                    });
                }
            });

            //Doctor
            $.get(app_url+'/v1/search/doctor?lat='+$('#searchform input[name=lat]').val()+'&lng='+$('#searchform input[name=lng]').val()+'&q='+val+'&d=6000mi&type=name',function(data){
                if(data)
                {
                    for(var x = 0;x < data.length; x++){
                        var vall = val.toLowerCase();
                        var fullname = data[x].firstName + ' ' + data[x].lastName;
                        var name = fullname.toLowerCase().replace(vall,'<strong style="color:#579ea2;">'+vall+"</strong>");
                        var practice = data[x].practice;
                        var specialty="";
                        var mainspecialty = data[x].mainSpecialtyID;

                        if(data[x].mainSpecialtyID.indexOf(",") > -1)
                        {
                            specialty = data[x].mainSpecialtyID.split(',');
                            mainspecialty=specialty[0];
                            for(var y=0; y<specialty.length ;y++)
                            {
                              if(specialty[y].toLowerCase().indexOf(val)>-1)
                              {
                                  mainspecialty = specialty[y];
                              }
                            }
                        }
                        else if(data[x].mainSpecialtyID.indexOf(" ~ ") > -1)
                        {
                            specialty = data[x].mainSpecialtyID.split(' ~ ');
                            mainspecialty=specialty[0];
                            for(var y=0; y<specialty.length ;y++)
                            {
                              if(specialty[y].toLowerCase().indexOf(val)>-1)
                              {
                                  mainspecialty = specialty[y];
                              }
                            }
                        }

                        var city = data[x].city;
                        var state = data[x].state;

                        if(data[x].picture)
                        {
                          var image = data[x].picture;
                        }
                        else
                        {
                            var image = data[x].gender == 'Male' ? '/coreIMAGES/doctor_male.svg' : '/coreIMAGES/doctor_female.svg';
                        }

                        if(mainspecialty == "Dentist" || mainspecialty == "Dental Lab")
                        {
                          image = '/img/dentist-img.png';
                        }

                        if(x == 0)
                        {
                            $('#landingPage-AutoCompleteResultsStyle ul.doctor-section').append('<li class="header">Doctors near you</li>');
                            $('#landingPage-AutoCompleteResultsStyle ul.doctor-section').append('<li class="item item-name" param="'+fullname+'"><p class="title"><img src="'+image+'"> '+name+' </p><p class="desc"> '+mainspecialty+' | '+city+', '+state+'</p></li>');
                        }
                        else
                        {
                            $('#landingPage-AutoCompleteResultsStyle ul.doctor-section').append('<li class="item item-name" param="'+fullname+'"><p class="title"><img src="'+image+'"> '+name+' </p><p class="desc"> '+mainspecialty+' | '+city+', '+state+'</p></li>');
                        }

                        if(x == 4)
                        {
                            break;
                        }
                    }

                    $('#landingPage-AutoCompleteResultsStyle li.item-name').click(function(){
                        $('#newBioSearchBox').val($('.title',this).text().trim() + ' | '+$('.desc',this).text().trim());
                        $('#searchform input[name=q]').val($(this).attr('param'));
                        $('#searchform input[name=type]').val('name');
                        $('#landingPage-AutoCompleteResultsStyle').hide();
	                       $('#landingPage-AutoCompleteResultsStyle ul.doctor-section').empty();
			                      $('#searchform').submit();
                    });
                }
            });

            //Lab
            $.get(app_url+'/v1/search/lab?lat='+$('#searchform input[name=lat]').val()+'&lng='+$('#searchform input[name=lng]').val()+'&q='+val+'&d=6000mi&type=name',function(data){
                if(data)
                {
                    for(var x = 0;x < data.length; x++){
                        var vall = val.toLowerCase();
                        var fullname = data[x].firstName + ' ' + data[x].lastName;
                        var name = fullname.toLowerCase().replace(vall,'<strong style="color:#579ea2;">'+vall+"</strong>");
                        var practice = data[x].practice;
                        var specialty="";
                        var mainspecialty = data[x].mainSpecialtyID;

                        if(data[x].mainSpecialtyID.indexOf(",") > -1)
                        {
                            specialty = data[x].mainSpecialtyID.split(',');
                            mainspecialty=specialty[0];
                            for(var y=0; y<specialty.length ;y++)
                            {
                              if(specialty[y].toLowerCase().indexOf(val)>-1)
                              {
                                  mainspecialty = specialty[y];
                              }
                            }
                        }
                        else if(data[x].mainSpecialtyID.indexOf(" ~ ") > -1)
                        {
                            specialty = data[x].mainSpecialtyID.split(' ~ ');
                            mainspecialty=specialty[0];
                            for(var y=0; y<specialty.length ;y++)
                            {
                              if(specialty[y].toLowerCase().indexOf(val)>-1)
                              {
                                  mainspecialty = specialty[y];
                              }
                            }
                        }

                        var city = data[x].city;
                        var state = data[x].state;

                        if(data[x].picture)
                        {
                          var image = data[x].picture;
                        }
                        else
                        {
                          var image = data[x].gender == 'Male' ? '/coreIMAGES/doctor_male.svg' : '/coreIMAGES/doctor_female.svg';
                        }

                        if(mainspecialty == "Dentist" || mainspecialty == "Dental Lab")
                        {
                          image = '/img/dentist-img.png';
                        }

                        if(x == 0)
                        {
                            $('#landingPage-AutoCompleteResultsStyle ul.lab-section').append('<li class="header">Labs near you</li>');
                            $('#landingPage-AutoCompleteResultsStyle ul.lab-section').append('<li class="item item-lab" param="'+fullname+'"><p class="title"><img src="'+image+'"> '+name+' </p><p class="desc"> '+mainspecialty+' | '+city+', '+state+'</p></li>');
                        }
                        else
                        {
                            $('#landingPage-AutoCompleteResultsStyle ul.lab-section').append('<li class="item item-lab" param="'+fullname+'"><p class="title"><img src="'+image+'"> '+name+' </p><p class="desc"> '+mainspecialty+' | '+city+', '+state+'</p></li>');
                        }

                        if(x == 4)
                        {
                            break;
                        }
                    }

                    $('#landingPage-AutoCompleteResultsStyle li.item-lab').click(function(){
                        $('#newBioSearchBox').val($('.title',this).text().trim() + ' | '+$('.desc',this).text().trim());
                        $('#searchform input[name=q]').val($(this).attr('param'));
                        $('#searchform input[name=type]').val('lab');
                        $('#landingPage-AutoCompleteResultsStyle').hide();
			$('#landingPage-AutoCompleteResultsStyle ul.lab-section').empty();
			$('#searchform').submit();
                    });
                }
            });

            $('#landingPage-AutoCompleteResultsStyle').show();
        }
        else
        {
            $('#landingPage-AutoCompleteResultsStyle').hide();
        }
    }

    var date = new Date();

    $('.date-picker').datepicker({
        format: "mm-dd-yyyy",
        startDate: date
    }).on('change', function(){
      $('.datepicker-dropdown').hide();
    });
});

footerHighlight();
inputChange();

function footerHighlight(){
  $('footer a').each(function(){
	if(window.location.pathname == $(this).attr('href')){
	  $(this).addClass('active');
	}
  });
}

function inputChange(){
  $('input').click(function(){
	  $(this).css('color', '#000');
  });
  $('textarea').click(function(){
	  $(this).css('color', '#000');
  });
}

refreshPage();
allowOnlyNumbers();
removeAutoComplete();
if(window.location.pathname == "/payment.php"){
  getCC();
  computeFee();
  checkSelection();

  $('#process_other_payment').on('click', function(){
    submitPayment();
  });

  $('input').keypress(function(e){
    if(e.which == 13){
      submitPayment();
      return false;
    }
  });
}

function refreshPage(){
  var $input = $('#refresh');

  $input.val() == 'yes' ? location.reload(true) : $input.val('yes');
}

function allowOnlyNumbers(){
  $('.allowOnlyNumbers').each(function(){
    var _this = $(this);
    var val = _this.val();

    _this.on('keypress', function(key){
      return isNumber(key, _this);
    });
  });
}


$('#ccform').hide();
$('#getCC').hide();
$('.alert').hide();
$('.hascard').each(function(){
  $(this).hide();
});
var ccToken, note, price, selectedType;
function getCC(){
  var cc_user = {
       "async": true,
       "crossDomain": true,
       "url": app_url+"/v1/get_cc",
       "method": "GET",
       "headers": {
          "content-type": "application/json",
          "authorization": localStorage.getItem('user_token')
       },

  }

  $.ajax(cc_user)
    .done(function (response) {
	ccInfo = response.result["credit-cards"]["credit-card"];
	ccToken = response.result["credit-cards"]["credit-card"]["token"];
	if(ccToken != null){
          $('#ccform').hide();
          $('#getCC').show();
          $('.cc').attr('src', response.result["credit-cards"]["credit-card"]["image-url"]);
	  $('.ccNumber').html(" xxxx-xxxx-xxxx-"+response.result["credit-cards"]["credit-card"]["last-4"]);
          $('.hascard').each(function(){
            $(this).show();
          });
        }
    })
    .fail(function(err){
          $('#ccform').show();
          $('#getCC').hide();
          $('.hascard').each(function(){
            $(this).hide();
          });
          $('input').each(function(){
            $(this).removeAttr('disabled');
          });
          $('textarea').removeAttr('disabled');
          selectedType="new_cc"
    });
}

function addCC(){
  $('#addCCInfo').on('click', function(){
    var card_num = $('#otherpayment input[name=card_num]').val();
    var card_year = $('#otherpayment input[name=card_year]').val();
    var card_month = $('#otherpayment input[name=card_month]').val();
    var card_cvc = $('#otherpayment input[name=card_cvc]').val();
    var card_name = $('#otherpayment input[name=card_name]').val();
    var billing_address = $('#otherpayment input[name=billing_address]').val();

    var settings = {
    "async": true,
    "crossDomain": true,
    "url": app_url+"/v1/add_cc",
    "method": "POST",
    "headers": {
    "content-type": "application/json",
    "authorization": localStorage.getItem('user_token'),
    },
    "processData": false,
    "data": JSON.stringify({
            "credit_card": card_num,
            "cvv": card_cvc,
            "expiration_month":card_month,
            "expiration_year": card_year,
            "cardholder_name":card_name,
            "billing_address":billing_address
        })
    }

    $.ajax(settings)
      .done(function (response) {
              getCC();
      })
      .fail(function (res){
         var err = JSON.parse(res.responseText);
         $('.alert').addClass('alert-danger');
         $('.alert').html(err.Error);
      });
  });
}

function submitPayment(){
  price = $('input[name=price]').val();
  note = $('textarea[name=note]').val();
  if(selectedType == "current_cc"){
    processCurrentCC(price, note);
  }else{
    var cc_num = $('#otherpayment input[name="card_num"]').val();
    var cc_month = $('#otherpayment input[name="card_month"]').val();
    var cc_year = $('#otherpayment input[name="card_year"]').val();
    var cc_cvc = $('#otherpayment input[name="card_cvc"]').val();
    var cc_name = $('#otherpayment input[name="card_name"]').val();
    var cc_billing_address = $('#otherpayment input[name="billing_address"]').val();
    processNewCC(price, note, cc_num, cc_month, cc_year, cc_cvc, cc_name, cc_billing_address);
  }

}

function processCurrentCC(price, note){
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": app_url+"/v1/process_other_payment",
      "method": "POST",
      "headers": {
          "content-type": "application/json",
          "authorization": localStorage.getItem('user_token')
      },
      "processData": false,
      "data": JSON.stringify({
              "price":parseFloat(price),
              "token":ccToken,
              "note":note,
              "name": userprofile.firstName + " " + userprofile.lastName
          })
  }
  $.ajax(settings)
  .done(function (response) {
    resetForm();
    $('.alert').show();
    $('.alert').addClass('alert-success');
    $('.alert').html("Sucessfully submitted payment.");
  })
  .fail(function(res){
    var err = JSON.parse(res.responseText);
    $('.alert').show();
    $('.alert').addClass('alert-danger');
    $('.alert').html(err.Error);
  });
}

function processNewCC(price, note, cc_num, cc_month, cc_year, cc_cvc, cc_name, cc_billing_address){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": app_url + "/v1/process_other_payment_cc",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "authorization": localStorage.getItem('user_token')
    },
    "processData": false,
    "data": JSON.stringify({
	"price": parseFloat(price),
	"note": note,
	"number": cc_num,
	"cvv": cc_cvc,
	"expiration_month": cc_month,
	"expiration_year": cc_year,
	"name": cc_name,
	"billing_address": cc_billing_address
    })
  }

  $.ajax(settings)
  .done(function (response) {
    resetForm();
    $('.alert').show();
    $('.alert').addClass('alert-success');
    $('.alert').html("Sucessfully submitted payment.");
  })
  .fail(function(res){
    resetForm();
    var err = JSON.parse(res.responseText);
    $('.alert').show();
    $('.alert').addClass('alert-danger');
    $('.alert').html(err.Error);
  });
}

$('span.tax_and_fee').html("");
$('span.total').html("");
function computeFee(){
  $('input[name=inputprice]').on('keyup', function(){
    var price = parseFloat($(this).val());
    if(price > 0){
      var tax = roundOff(price * 0.029);
      var fee = 0.30;
      var tax_and_fee = roundOff(tax + fee);
      var total = roundOff(price + tax + fee);

      $('input[name=tax_and_fee]').val(tax_and_fee);
      $('input[name=total]').val(total);
      $('input[name=price]').val(total);

      $('span.tax_and_fee').html(parseFloat(tax_and_fee).toFixed(2));
      $('span.total').html(parseFloat(total).toFixed(2));
    }else{
      $('input[name=tax_and_fee]').val("");
      $('input[name=total]').val("");
      $('input[name=price]').val("");

      $('span.tax_and_fee').html("");
      $('span.total').html("");
    }
  });
}

function roundOff(value){
	return Math.round(value * 100)/100
}

function disableCCInput(value){
  selectedType = value;
  if(value == 'new_cc'){
    $('#new_cc_input input').each(function(){
      $(this).removeAttr('disabled');
    });
  }else{
    $('#new_cc_input input').each(function(){
      $(this).attr('disabled', 'disabled');
    });
  }
}

function checkSelection(){
  disableCCInput($('input[name=select_type]').val());
  selectedType = $('input[name=select_type]').val();
  $('input[name=select_type]').change(function(){
    disableCCInput($(this).val());
    selectedType = $(this).val();
  });
}

function resetForm(){
   $('input[type=text]').each(function(){
     $(this).val("");
   });
   $('input[name=tax_and_fee]').val("");
   $('input[name=total]').val("");
   $('input[name=price]').val(0);
   $('textarea[name=note]').val("");
   $('span.tax_and_fee').html("0");
   $('span.total').html("0");
}

function removeAutoComplete(){
  $('input[type="text"], input[type="number"], input[type="email"]').each(function(){
    $(this).attr('autocomplete', 'off');
  });
}

function isNumber(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode

    if (
        (charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-�? CHECK MINUS, AND ONLY ONE.
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.�? CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}
