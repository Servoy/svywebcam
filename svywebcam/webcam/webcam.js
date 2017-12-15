angular.module('svywebcamWebcam', ['servoy']).directive('svywebcamWebcam', [function() {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				api: "=svyApi",
				handlers: "=svyHandlers",
				svyApi: "=svyServoyapi"
			},
			controller: function($scope, $element, $attrs) { },
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
					//options for video
					var opt = $scope.model.options;
				}
				
				//capture an image
				$scope.api.capture = function() {
					//some basic options taken from property model
					var opt = {
						quality: $scope.camera.options.quality,
						mirror: $scope.camera.options.mirror,
						scale: $scope.camera.options.scale,
						shutter: $scope.camera.options.shutter
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
	}])