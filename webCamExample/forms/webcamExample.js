/**
 * @type {JSMedia}
 *
 * @properties={typeid:35,uuid:"E2380A9D-6047-4ABD-BDFA-B102806D8D55",variableType:-4}
 */
var image = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"87E1992C-50BA-4952-BE7A-F1A388DE46B8",variableType:4}
 */
var mirror = 1;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"587068C3-D322-4BD4-B9D3-4B68FD5641D6",variableType:8}
 */
var quality = 1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A8B45FB7-6645-4909-A003-79850FF2D8FD",variableType:8}
 */
var scale = 1;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0BB5248D-712C-4B4D-9BC8-7B83A7864AF6"}
 */
function onAction(event) {
	//setup some initial options
	var options = {
		mirror: mirror,
		quality: quality,
		retry_success: false,
		scale: scale,
		shutter: true,
		timeout: 0
	}
	elements.webcam_200.setOptions(options);
	elements.webcam_200.capture();
}

/**
 * @properties={typeid:24,uuid:"6F9D0FA9-1C43-4E6A-9EF3-ABBAA62CE021"}
 */
function callback(data) {
	image = data;

}


/**
 *
 * @return {RuntimeForm<AbstractMicroSample>}
 *
 * @properties={typeid:24,uuid:"83AE9F04-A21C-489B-A11A-DD61029A5B73"}
 */
function getParent() {
	return forms.specializedSamples;
}

/**
*
* @return {String}
*
* @properties={typeid:24,uuid:"E704D751-ACA0-4DC2-8C42-4BAF1BF13659"}
*/
function getName() {
	return 'Web Cam';
}

/**
*
* @return {String}
*
* @properties={typeid:24,uuid:"648E8E94-A627-41A3-8742-7749C475D7F2"}
*/
function getIconStyleClass() {
	return 'fa-video-camera';
}

/**
*
* @return {String}
*
* @properties={typeid:24,uuid:"6F72D42A-E955-4EF6-BB21-F86864164F9B"}
*/
function getDescription() {
	return 'Web Camera integration. Say cheese!';
}
