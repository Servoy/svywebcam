/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"3641A2AE-A39E-470F-9B59-EF602989E3E5",variableType:8}
 */
var quality = null;

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
	elements.webcam_200.capture();
}

/**
 * @properties={typeid:24,uuid:"6F9D0FA9-1C43-4E6A-9EF3-ABBAA62CE021"}
 */
function callback(data) {
	plugins.dialogs.showInfoDialog('SNAP!', '<img src="' + data + '"></>')
}

/**
 * @param firstShow
 * @param event
 *
 * @properties={typeid:24,uuid:"40BE0E0E-A806-4E07-8715-2115F842D06E"}
 */
function onShow(firstShow, event) {
	//setup some initial options
	var options = {
		mirror: true,
		quality: 1,
		retry_success: false,
		scale: 1,
		shutter: false,
		shutter_ogg_url: '',
		shutter_mp3_url: '',
		swf_url: '',
		timeout: 0
	}
	elements.webcam_200.setOptions(options);
}