angular.module('svywebcamWebcam', ['servoy']).directive('svywebcamWebcam', function($timeout, $sabloConstants) {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				api: "=svyApi",
				handlers: "=svyHandlers",
				svyApi: "=svyServoyapi"
			},
			controller: function($scope, $element, $attrs) { 
				
				var destroyListenerUnreg = $scope.$on("$destroy", function() {
                    $scope.camera.dosomethingHereToDestroyCameraIfExists
                });
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
				
				function stopCamera() {
					if ($scope.camera) {
						$scope.camera.stop();
					}
				}

				//setup the camera with options
				function setupCamera() {
					try {
						stopCamera();
					} catch (e) {
						console.log(e)
					}
					
					try {
						console.log('setting up camera')
						$scope.camera = new JpegCamera($scope.model.svyMarkupId);
					} catch (e) {
						console.log(e)
					}
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
							shutter: true,
							timeout: 0
						}
					} else {
						opt = $scope.model.options;						
					}

					$scope.camera.ready(function() {
						console.log($scope.camera.options)
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
				
				var destroyListenerUnreg = $scope.$on("$destroy", function() {
					clearInterval(init);
					clearTimeout(resize);
					stopCamera();
                });

			},
			templateUrl: 'svywebcam/webcam/webcam.html'
		};
	})