var AdmZip = require('adm-zip');

// creating archives
var zip = new AdmZip();

zip.addLocalFolder("./META-INF/", "/META-INF/");
zip.addLocalFolder("./dist/servoy/svywebcam/", "/dist/servoy/svywebcam/");
zip.addLocalFolder("./webcam/", "/webcam/");

zip.writeZip("svywebcam.zip");