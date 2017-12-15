angular.module('svywebcamWebcam', ['servoy'])
.directive('svywebcamWebcam', function($timeout, $sabloConstants) {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				api: "=svyApi",
				handlers: "=svyHandlers",
				svyApi: "=svyServoyapi"
			},
			controller: function($scope, $element, $attrs) {
				var className;

				var element = $element.children().first();

				Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, {
						configurable: true,
						value: function(property, value) {
							switch (property) {
							case "styleClass":	
								if (className)
									element.removeClass(className);
								className = value;
								if (className)
									element.addClass(className);
								break;
							}
						}
					});

				var destroyListenerUnreg = $scope.$on("$destroy", function() {
						destroyListenerUnreg();
						delete $scope.model[$sabloConstants.modelChangeNotifier];
					});

				// data can already be here, if so call the modelChange function so
				// that it is initialized correctly.
				var modelChangFunction = $scope.model[$sabloConstants.modelChangeNotifier];
				for (key in $scope.model) {
					modelChangFunction(key, $scope.model[key]);
				}

			},
			link: function($scope, $element, $attrs) {

				//intialize camera
				var init = setInterval(function() {
						if (!$scope.camera) {
							setupCamera();
						} else {
							clearInterval(init);
						}
					}, 250);

				//if we resize the page, reinit camera
				var resize;
				$(window).resize(function() {
					clearTimeout(resize);
					resize = setTimeout(doneResizing, 250);
				});

				function doneResizing() {
					setupCamera()
				}

				//setup the camera with options
				function setupCamera() {
					$scope.camera = new JpegCamera($scope.model.svyMarkupId);
				}				

				//capture an image
				$scope.api.capture = function() {
					//some basic options taken from property model
					var opt;
					//set up options for webcam
					if (!$scope.model.options) {
						opt = {
							mirror: false,
							quality: 1,
							retry_success: false,
							scale: 1,
							shutter: false,
							shutter_ogg_url: '',
							shutter_mp3_url: '',
							swf_url: '',
							timeout: 0
						}
					} else {
						opt = $scope.model.options;
					}

					$scope.camera.ready(function() {
						var snapshot = $scope.camera.capture(opt).show();
						//get blob data
						snapshot.get_blob(function() {
							var reader = new window.FileReader();
							reader.readAsDataURL(this._blob);
							reader.onloadend = function() {
								base64data = reader.result;
								//convert to base64 and return data to handler
								$scope.handlers.getBase64Data(base64data)
								//discard snapshot
								snapshot.discard();
							}

						})

					})
				}

			},
			templateUrl: 'svywebcam/webcam/webcam.html'
		};
	})