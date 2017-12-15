{
	"name": "svywebcam-webcam",
	"displayName": "webcam",
	"version": 1,
	"definition": "svywebcam/webcam/webcam.js",
	"libraries": 
	[
		{
			"name": "Jpeg Camera",
			"version": "1.3.3",
			"url": "svywebcam/webcam/lib/jpeg_camera_with_dependencies.min.js",
			"mimetype": "text/javascript"
		}
	],

	"model": 
	{
	"options": 
		{
			"type": "object",
			"tags": 
			{
				"scope": "public"
			}
		},			
		"styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" }}	
	},

	"api": {"capture": {}},
	
	"handlers": {
	"getBase64Data" : {
	"parameters" : [{ "name" : "data", "type" : "object" }]
	}}
}