{
	"name": "svywebcam-webcam",
	"displayName": "webcam",
	"categoryName": "Media",
	"version": 1,
	"icon": "svywebcam/webcam/icon.png",
	"definition": "svywebcam/webcam/webcam.js",
	"serverscript": "svywebcam/webcam/webcam_server.js",
	"libraries": 
	[
		{
			"name": "swfObj",
			"version": "2.2.0",
			"url": "svywebcam/webcam/lib/swfobject.js",
			"mimetype": "text/javascript"
		},

		{
			"name": "Canvas-to-blob",
			"version": "3.2.0",
			"url": "svywebcam/webcam/lib/canvas-to-blob.js",
			"mimetype": "text/javascript"
		},

		{
			"name": "Jpeg Camera",
			"version": "1.3.3",
			"url": "svywebcam/webcam/lib/jpeg_camera.js",
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
		},
		"getDevicesId":
		{
		  "returns": "string[]"
		},
		"setDeviceId":
        {
          "parameters":
          [
            {
              "name": "deviceId",
              "type": "string"
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