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
        reader.onload = createMemeAfterImageIsURI(memeText, reader);
        reader.readAsDataURL(memeImage);
    }
    else {
        //TODO add style to warning sign
         missingWarning.style.display = "block";
    }
}

function setMemeHTML(memeText, memeImageDataURI) {
    var imageContainer = document.getElementById('meme-image');

    document.getElementById('meme-text').innerHTML = memeText;
    imageContainer.src = memeImageDataURI;

    //make sure image doesn't go over the height and width limits.
    //also preserves image proportions.
    if (imageContainer.naturalHeight > imageContainer.naturalWidth) {
        $(imageContainer).css({"height" : "450px", "width" : "auto"});
    } else {
        $(imageContainer).css({"width" : "480px", "height" : "auto"});
    }
}

function createStyleSheetLink(link) {
    var ss = document.createElement("link");
    ss.type = "text/css";
    ss.rel = "stylesheet";
    ss.href = "meme_style.css";
}

function createMemeAfterImageIsURI(memeText, reader) {
    return function () {
        var memeImageDataURI = reader.result;
        var memeContainer = document.getElementById('meme-container');

        setMemeHTML(memeText, memeImageDataURI);

        //get the size of the canvas
        var canvasWidth = $(memeContainer).outerWidth();
        var canvasHeight = $(memeContainer).outerHeight();

        //make canvas element
        var canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        var ctx = canvas.getContext('2d');

        //paint background white to prevent png transparency
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        //call rasterizeHTML with html we created
        var canvasDocument = document.implementation.createHTMLDocument();
        canvasDocument.body.appendChild(memeContainer.cloneNode(true));

        //fixes the extra margin added by default
        var marginFixStyle = document.createElement('style');
        marginFixStyle.innerHTML = "body {margin: 0; padding: 0;}";
        canvasDocument.head.appendChild(marginFixStyle);

        canvasDocument.getElementById('meme-container').style.display = "block";

        rasterizeHTML.drawDocument(canvasDocument, canvas).then(function success(renderResult) {
            //convert canvas to a png image and attach it to the page
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
        }, function error(e) {
                console.log('there was an error');
        });
    };
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