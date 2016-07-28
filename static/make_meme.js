/* Runs when the page finishes loading */
$(function() {
    //set css for the meme itself
    $('#meme-container').css(memeContainerCSS);
    $('#meme-text').css(memeTextCSS);
    $('#meme-image').css(memeImageCSS);

    var imageURIPromise;
    $('#meme-text-input').focusout(onTextInputDone);
    $('#meme-image-input').change(function(event) {
        imageURIPromise = new Promise(function(resolve, reject) {
            onImageUploaded(resolve, reject, event);
        });
    });
    $('#create_button').click(function (event) {
        onClickCreate(imageURIPromise);
    });
});


function onTextInputDone(event) {
    document.getElementById('meme-text').innerHTML = event.target.value;
}

function onImageUploaded(resolve, reject, event) {
    var imageContainer = document.getElementById('meme-image');
    var reader = new FileReader();
    reader.onload = function () {
        imageContainer.onload = function() {
            resolve();
        };
        imageContainer.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}


function onClickCreate(imagePromise) {
    var memeTextArea = document.getElementById('meme-text-input');
    var memeImageInput = document.getElementById('meme-image-input');
    var missingWarning = document.getElementById('missing-warning');

    //checks if both an image and text are present
    if(memeImageInput.files[0] && memeTextArea.value) {
        missingWarning.style.display = "none";
        imagePromise.then(createMeme);
    }
    else {
         missingWarning.style.display = "block";
    }
}

function createMeme() {
    var memeContainer = document.getElementById('meme-container');

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

    dom2canvas(htmlElement, canvas).then(function(canvas) {
        var memeSrc = canvas.toDataURL("image/jpeg");

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
}


var memeTextCSS = {"font-family" : "Helvetica Neue,Helvetica,Arial,sans-serif",
                "margin": "5px 10px 0px 10px",
                "font-size" : "28px",
                "line-height" : "30px",
                "font-weight" : "300", 
                "letter-spacing" : ".01em", 
                "color" : "#292f33", 
                "width" : "480px"
            };

var memeImageCSS = {"border-radius": "5px", 
                "margin": "10px auto",
                "position": "relative", 
                "display" : "block", 
                "overflow": "hidden", 
                "vertical-align": "top", 
                "width" : "480px", 
                "height": "auto"
            };

var memeContainerCSS = {"background-color" : "#fff",
                        "width" : "500px",
                        "overflow": "hidden"
                    };