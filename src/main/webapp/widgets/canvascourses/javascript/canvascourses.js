var calcentral = calcentral || {};
calcentral.Widgets = calcentral.Widgets || {};
calcentral.Widgets.canvascourses = function(tuid) {

	/////////////////////////////
	// Configuration variables //
	/////////////////////////////

	var $rootel = $('#' + tuid);
	var $canvascoursesList = $('.cc-widget-canvascourses-list', $rootel);
	var dummy = false;
	var accountID = 90242;

	////////////////////
	// Event Handlers //
	////////////////////

	///////////////
	// Rendering //
	///////////////

	var renderCourses = function(data) {
		calcentral.Api.Util.renderTemplate({
			'container': $canvascoursesList,
			'data': {
				'courses': data
			},
			'template': $('#cc-widget-canvascourses-list-template', $rootel)
		});
	};

	///////////////////
	// Ajax Requests //
	///////////////////

	var getCanvasData = function(url) {
		return $.ajax({
			'url': url
		});
	}


	var loadCourses = function(data) {
		if (dummy) {
			return $.ajax({
				'cache': false,
				'url': '/widgets/canvascourses/dummy/canvascourses.json'
			});
		} else {
			var $loadCoursesDeferred = $.Deferred();
			$.when(getCanvasData(data.enrollment_url), getCanvasData(data.courses_url)).done(function(user_enrollment, allCourses){
			var renderData = [];
				var courseIds = [];
				$.each(user_enrollment[0], function(index, value) {
					courseIds.push(value.course_id);
				});

				$.grep(allCourses[0], function(course, index) {
					if ($.inArray(course.id, courseIds) > -1) {
						renderData.push({
							'name' : course.course_code + ": " + course.name,
							'id': course.id
						});
					}
				});
				$loadCoursesDeferred.resolve(renderData);
			});
			return $loadCoursesDeferred.promise();
		}
	};

	var getCurrentUserData = function() {
		var $currentUserDeferred = $.Deferred();
		calcentral.Api.User.getCurrentUser('', function(success, data) {
			$currentUserDeferred.resolve({
				'uid': data.uid,
				'enrollment_url': '/api/canvas/users/sis_user_id:' + data.uid + '/enrollments',
				'courses_url': '/api/canvas/accounts/' + accountID + '/courses'
			});
		});
		return $currentUserDeferred.promise();
	}

	////////////////////
	// Initialisation //
	////////////////////

	/**
	 * Initialise the canvas classes widget
	 */
	var doInit = function(){
		$.when(getCurrentUserData()).pipe(loadCourses).done(renderCourses);
	};

	// Start the request
	doInit();
};