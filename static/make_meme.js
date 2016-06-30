var memePadding = 10;

var textCSS = {"font-family" : "Helvetica Neue,Helvetica,Arial,sans-serif",
                "font-size" : "26px",
                "line-height" : "32px",
                "font-weight" : "300", 
                "letter-spacing" : ".01em", 
                "word-wrap" : "break-word", 
                "color" : "#292f33", 
                "width" : "inherit"
            };

var imageCSS = {"border-radius": "5px", 
                "margin-top": "10px",
                "position": "relative", 
                "display" : "block", 
                "overflow": "hidden", 
                "vertical-align": "top"
            };

var memeContainerCSS = {"background-color" : "#fff",
                        "width" : "500px", 
                        "padding" : memePadding + "px", 
                        "border-bottom" : "0", 
                        "border-top-left-radius" : "5px", 
                        "border-top-right-radius" : "5px",
                        "overflow": "hidden", 
                        "display": "block"
                    };

//define elements
var memeContainer = document.createElement("div");
var textContainer = document.createElement("div");
var imageContainer = document.createElement("img");

//removes automatic padding and margin in the body element
var style = document.createElement("style");
style.innerHTML = "body {padding:0; margin:0}";

//build element hierarchy
memeContainer.appendChild(style);
memeContainer.appendChild(textContainer);
memeContainer.appendChild(imageContainer);

$(memeContainer).css(memeContainerCSS);
$(textContainer).css(textCSS);
$(imageContainer).css(imageCSS);

/* Runs when the page finishes loading */
$(document).ready(function() {
    // Fires when the "Create" button is clicked
    $('#create_button').click(onClickCreate);
});

function onClickCreate() {
    var memeTextArea = document.getElementById('meme_text');
    var memeImageInput = document.getElementById('meme_image');

    //checks if both an image and text are present
    if(memeImageInput.files[0] && memeTextArea.value) {
        var memeImage = memeImageInput.files[0];
        var memeText = memeTextArea.value;

        var reader = new FileReader();
        reader.onload = createMemeAfterImageIsURI(memeText, reader);
        reader.readAsDataURL(memeImage);
    }
    //If image or text missing, alert the user
    else {
        alert("Missing text or picture");
    }
}

function setMemeHTML(memeText, memeImageDataURI) {
    textContainer.innerHTML = memeText;
    imageContainer.src = memeImageDataURI;

    //make sure image doesn't go over the height and width limits.
    //also preserves image proportions.
    if (imageContainer.naturalHeight > imageContainer.naturalWidth) {
        $(imageContainer).css({"height" : "450px", "width" : "auto", 
            "margin-left" : "auto", "margin-right" : "auto", "padding-right" : "20px"});
    } else {
        $(imageContainer).css({"width" : "500px", "height" : "auto"});
    }
}

function getImageDownloadContainer(imgSrc) {
    var divisionLine = document.createElement("hr");
    var downloadBtn = document.createElement("a");
    var downloadGlyphicon = document.createElement("span");
    var meme = document.createElement("img");

    $(downloadGlyphicon).addClass("glyphicon glyphicon-download-alt");

    downloadBtn.appendChild(downloadGlyphicon);
    downloadBtn.innerHTML += ' Download';
    downloadBtn.href = imgSrc;
    downloadBtn.download = "meme_" + Date.now();

    meme.src = imgSrc;

    $(downloadBtn).addClass("btn btn-lg btn-block action-button");
    $(meme).addClass("image");
    $(meme).attr("id", "meme");

    return [divisionLine, meme, downloadBtn];
}

function createMemeAfterImageIsURI(memeText, reader) {
    return function () {
        var memeImageDataURI = reader.result;
        setMemeHTML(memeText, memeImageDataURI);

        //used to get the size of the canvas
        memeContainer.style.visibility = "hidden";
        document.body.appendChild(memeContainer);

        var canvasWidth = $(memeContainer).outerWidth() + 2*memePadding;
        var canvasHeight = $(memeContainer).outerHeight();
        
        document.body.removeChild(memeContainer);
        memeContainer.style.visibility = "";

        //make canvas element
        var canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        var ctx = canvas.getContext('2d');

        //paint background white to prevent png transparency
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        //call rasterizeHTML with html we created
        var html = memeContainer.outerHTML;
        rasterizeHTML.drawHTML(html, canvas).then(function success(renderResult) {
            //convert canvas to a png image and attach it to the page
            var memeSrc = canvas.toDataURL();

            if($("#download-container").length == 0) {
                var downloadMemeElts = getImageDownloadContainer(memeSrc);
                $("#main-content").append(downloadMemeElts);
            } else {
                $("#meme").attr("src", finalSrc);
            }
        }, function error(e) {
                console.log('there was an error');
        });
    };
}