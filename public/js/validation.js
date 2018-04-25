$('#cardCreate').submit(function (e) {
	$('.alert.alert-danger').hide();
	if (!$('input#title').val() || !$('input#creator').val()) {
		if ($('.alert.alert-danger').length) {
			$('.alert.alert-danger').show();
		} else {
			$(this).prepend('<div role="alert" class="alert alert-danger">All fields are required. Try again.</div>');
		}
		return false;
	}
});

$('#userNew').submit(function (e) {
	$('.alert.alert-danger').hide();
	if (!$('input#pass').val()) {
		if ($('.alert.alert-danger').length) {
			$('.alert.alert-danger').show();
		} else {
			$(this).prepend('<div role="alert" class="alert alert-danger">All fields are required. Try again.</div>');
		}
		return false;
	}
});