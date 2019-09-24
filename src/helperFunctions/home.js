
if (localStorage.getItem('user_type') == null) {
    $('.calendar-link').remove();
}
$('.g-icon').on('click', function (e) {
    var $in = $(this);
    $('.g-icon').not($in).removeClass('on')
    $in.toggleClass('on');
    // get the gender
    if ($in.hasClass('on')) {
        var gender = $in.attr('g');
        $('#gender-hidden').val(gender);
    } else {
        $('#gender-hidden').val('');
    }
    console.log($('#gender-hidden').val())
})