// TwitchEmoteSaver
// Description: Exports the current image in the sizes required by Twitch for emotes
// Requirements: Adobe Photoshop CS2, or higher
// Version: 1.0 12th Feb 2019
// Author: KeithyDee
// Website: https://github.com/KeithyDee
// ================================================================================
// Installation:
// 1. Place script in your PhotoShop Scripts directory. 
//    This is usually 'C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\'
// 2. Restart Photoshop
// 3. With the desired image open, click File -> Scripts -> TwitchEmoteSaver
// ================================================================================

// ==================== //
//   Document set-up    //
// ==================== //

#target photoshop
app.bringToFront();

// ==================== //
//      Main code       //
// ==================== //

if (isCorrectVersion() && isOpenDocs() && hasLayers()) {
    try {
        currentImage = app.activeDocument;
        image_sizes = [112, 52, 28];

        for (var i = 0; i < image_sizes.length; i++) {
            saveImage(currentImage, image_sizes[i], image_sizes[i]);
        }
    }
    catch(e) {
        // don't report error on user cancel
        if (e.number != 8007) {
            showError(e);
        }
    }
}

/* 
Copies the current file into a new file, resizes the image
to the width and height provided, then saves 
*/
function saveImage(currentImage, width, height) {
    var currentFilename = currentImage.name.replace(/\..+$/, '');
    var filename = currentFilename + "_" + width + "x" + height + ".png"; // Edit this to change output file format
    var filepath = currentImage.path + "/" + filename;
    var newFile = File(filepath);  

    var pngOpts = new ExportOptionsSaveForWeb; 
    pngOpts.format = SaveDocumentType.PNG;
    pngOpts.PNG8 = false; 
    pngOpts.transparency = true; 
    pngOpts.interlaced = true; 
    pngOpts.quality = 100;

    currentImage.exportDocument(newFile, ExportType.SAVEFORWEB, pngOpts);
    var newImage = app.open(newFile);
    newImage.resizeImage(width + 'px', height + 'px', undefined, ResampleMethod.BICUBICSHARPER);
    newImage.exportDocument(newFile, ExportType.SAVEFORWEB, pngOpts);
    newImage.close(SaveOptions.DONOTSAVECHANGES);
}

// ==================== //
//   Photoshop Checks   //
// ==================== //

/*
Check for Adobe Photoshop CS2 (v9) or higher.
*/
function isCorrectVersion() {
    if (parseInt(version, 10) >= 9) {
        return true;
    }
    else {
        alert('This script requires Adobe Photoshop CS2 or higher.', 'Wrong Version', false);
        return false;
    }
}

/*
Ensure at least one document is open.
*/
function isOpenDocs() {
    if (documents.length) {
        return true;
    }
    else {
        alert('There are no documents open.', 'No Documents Open', false);
        return false;
    }
}

/*
Ensure that the active document contains at least one layer.
*/
function hasLayers() {
    var doc = activeDocument;
    if (doc.layers.length == 1 && doc.activeLayer.isBackgroundLayer) {
        alert('The active document has no layers.', 'No Layers', false);
        return false;
    }
    else {
        return true;
    }
}

/*
Display the JavaScript error message if we encouter one.
*/
function showError(err) {
    if (confirm('An unknown error has occurred.\n' +
        'Would you like to see more information?', true, 'Unknown Error')) {
            alert(err + ': on line ' + err.line, 'Script Error', true);
    }
}