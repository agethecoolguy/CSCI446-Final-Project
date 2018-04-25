$('#cardCreate').submit(function (e) {
	$('.alert.alert-danger').hide();
	if (!$('input#title').val() || !$('input#creator').val()) {
		if ($('.alert.alert-danger').length) {
			$('.alert.alert-danger').show();
		} else {
			$(this).prepend('<div role="alert" class="alert alert-danger">Check required fields and try again.</div>');
		}
		return false;
	}
});

$('#userNew').submit(function (e) {
	$('.alert.alert-danger').hide();
	if (!$('input#password').val()) {
		if ($('.alert.alert-danger').length) {
			$('.alert.alert-danger').show();
		} else {
			$(this).prepend('<div role="alert" class="alert alert-danger">Check required fields and try again.</div>');
		}
		return false;
	}
});