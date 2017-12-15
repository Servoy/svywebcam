{
	"name": "svywebcam-webcam",
	"displayName": "webcam",
	"version": 1.0.0,
	"definition": "svywebcam/webcam/webcam.js",
	"serverscript": "svywebcam/webcam/webcam_server.js",
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
		"styleClass": 
		{
			"type": "styleclass",
			"tags": 
			{
				"scope": "design"
			}
		},

		"options": 
		{
			"type": "object",
			"tags": 
			{
				"scope": "private"
			}
		}
	},

	"api": 
	{
		"capture": 
		{
			
		},

		"setOptions": 
		{
			"parameters": 
			[
				{
					"name": "options",
					"type": "object"
				}
			]
		}
	},

	"handlers": 
	{
		"getBase64Data": 
		{
			"parameters": 
			[
				{
					"name": "data",
					"type": "object"
				}
			]
		}
	}
}