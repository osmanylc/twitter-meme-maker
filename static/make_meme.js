/* Runs when the page finishes loading */
$(function() {
    //set css for the meme itself
    $('#meme-container').css(memeContainerCSS);
    $('#meme-text').css(memeTextCSS);
    $('#meme-image').css(memeImageCSS);

    $('#create_button').click(onClickCreate);
});


function onClickCreate() {
    var memeTextArea = document.getElementById('meme-text-input');
    var memeImageInput = document.getElementById('meme-image-input');
    var missingWarning = document.getElementById('missing-warning');

    //checks if both an image and text are present
    if(memeImageInput.files[0] && memeTextArea.value) {
        var memeImage = memeImageInput.files[0];
        var memeText = memeTextArea.value;
        missingWarning.style.display = "none";

        var reader = new FileReader();
        reader.onload = function () {
            createMemeAfterImageIsURI(memeText, reader);  
        };
        reader.readAsDataURL(memeImage);
    }
    else {
         missingWarning.style.display = "block";
    }
}


function setMemeHTML(memeText, memeImageDataURI) {
    return new Promise(function (resolve, reject) {
        var placeholderImg = new Image();

        document.getElementById('meme-text').innerHTML = memeText;
        placeholderImg.onload = function () {
            resolve(placeholderImg);
        };
        placeholderImg.src = memeImageDataURI;

    }).then(function(placeholderImg) {
        var imageContainer = document.getElementById('meme-image');
        var imageContainerSrc = placeholderImg.src;

        var imgHeight = placeholderImg.naturalHeight;
        var imgWidth = placeholderImg.naturalWidth;
        var maxRatio = 1.33;

        //make sure image doesn't go over the height and width limits.
        if (imgHeight > imgWidth * maxRatio) {
            imageContainerSrc = cropIfNarrow(placeholderImg, maxRatio);
        }

        $(imageContainer).css({"width" : "480px", "height": "auto"});
        imageContainer.src = imageContainerSrc;
    });
}


function cropIfNarrow(img, maxRatio) {
    var imgHeight = img.naturalHeight;
    var imgWidth = img.naturalWidth;

    var newHeight = Math.floor(imgWidth * (maxRatio - 0.075));
    var gutterValue = (imgHeight - newHeight) / 2;

    var canvas = document.createElement('canvas');
    canvas.width = imgWidth;
    canvas.height = newHeight;
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, gutterValue, imgWidth, newHeight, 0, 0, imgWidth, newHeight);
    return canvas.toDataURL();
}


function createMemeAfterImageIsURI(memeText, reader) {
    var memeImageDataURI = reader.result;
    var memeContainer = document.getElementById('meme-container');

    setMemeHTML(memeText, memeImageDataURI).then(function() {
        //get the size of the canvas
        var canvasWidth = Math.floor($(memeContainer).outerWidth());
        var canvasHeight = Math.floor($(memeContainer).outerHeight());

        //make canvas element
        var canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        var ctx = canvas.getContext('2d');

        //paint background white to prevent png transparency
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        /* Call dom2canvas with html we created */
        var htmlElement = memeContainer.cloneNode(true);
        htmlElement.style.display = "block";

        return {'htmlElement' : htmlElement, 'canvas' : canvas};
    }).then(function (result) {
        dom2canvas(result.htmlElement, result.canvas).then(function(canvas) {
            var memeSrc = canvas.toDataURL();

            var downloadContent = document.getElementById('download-content');
            var downloadButton = document.getElementById('download-meme-button');
            var downloadMemeImage = document.getElementById('meme');

            downloadButton.href = memeSrc;
            downloadButton.download = 'meme_' + Date.now();
            downloadMemeImage.src = memeSrc;

            if(downloadContent.style.display == "none") {
                downloadContent.style.display = "block";
            }
        });
    }).catch(function (error) {
        console.log(error);
    });
}


var memeTextCSS = {"font-family" : "Helvetica Neue,Helvetica,Arial,sans-serif",
                "margin": "5px 10px 0px 10px",
                "font-size" : "26px",
                "line-height" : "32px",
                "font-weight" : "300", 
                "letter-spacing" : ".01em", 
                "word-wrap" : "break-word", 
                "color" : "#292f33", 
                "width" : "inherit"
            };

var memeImageCSS = {"border-radius": "5px", 
                "margin": "10px auto",
                "position": "relative", 
                "display" : "block", 
                "overflow": "hidden", 
                "vertical-align": "top"
            };

var memeContainerCSS = {"background-color" : "#fff",
                        "width" : "500px",
                        "overflow": "hidden"
                    };