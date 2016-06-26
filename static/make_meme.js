var text_css = {"font-family" : "Helvetica Neue,Helvetica,Arial,sans-serif",
				"font-size" : "26px",
			    "line-height" : "32px",
			    "font-weight" : "300", 
			    "letter-spacing" : ".01em", 
				"word-wrap" : "break-word", 
				"color" : "#292f33", 
				"width" : "inherit"
			};

var image_css = {"border-radius": "5px", 
			    "margin-top": "10px",
			    "position": "relative", 
			    "display" : "block", 
			    "overflow": "hidden", 
			    "vertical-align": "top"
			};

var meme_container_css = {"background-color" : "#fff",
						"width" : "500px", 
						"padding" : "3px", 
					    "border-bottom" : "0", 
					    "border-top-left-radius" : "5px", 
					    "border-top-right-radius" : "5px",
					    "overflow": "hidden", 
					    "display": "inline-block"
					};

function make_meme_html(text, image_url) {
	//define elements
	var div_container = document.createElement("div");
	var text_div = document.createElement("div");
	var image_container = document.createElement("img");

	//build element hierarchy
	$(text_div).append(text);
	$(image_container).attr("src", image_url);
	$(div_container).append(text_div);
	$(div_container).append(image_container);

	//make sure image doesn't go over the height and width limits.
	//also preserves image proportions.
	if (image_container.naturalHeight > image_container.naturalWidth) {
		$(image_container).css({"height" : "450px", "width" : "auto", 
			"margin-left" : "auto", "margin-right" : "auto", "padding-right" : "20px"});
	} else {
		$(image_container).css({"width" : "500px", "height" : "auto"});
	}


	//set elements' css
	$(div_container).css(meme_container_css);
	$(text_div).css(text_css);
	$(image_container).css(image_css);

	return $(div_container)[0];
}

/* Runs when the page finishes loading */
$(document).ready(function() {
	/* Fires when the "Create" button is clicked */
	$('#create_button').click(function(e) {
		var textarea = document.getElementById('meme_text');
		var file_input = document.getElementById('meme_image');

		//checks if both an image and text are present
		if(file_input.files[0] && textarea.value) {
			var meme_image = file_input.files[0];
			var meme_text = textarea.value;

			var reader = new FileReader();
			reader.onload = generateImage;

			reader.readAsDataURL(meme_image);

			function generateImage() {
				var meme_image_url = reader.result;
				var element = make_meme_html(meme_text, meme_image_url);

				//used to get the size of the canvas
				document.body.appendChild(element);
				var bounding_rect = element.getBoundingClientRect();
				//document.body.removeChild(element);

				//the extra 18 is added because of a bug in rasterizeHTML
				var canvas_width = parseInt(bounding_rect.width, 10) + 16;
				var canvas_height = parseInt(bounding_rect.height, 10) + 16;

				var canvas = document.createElement("canvas");
				canvas.width = canvas_width;
				canvas.height = canvas_height;
				var ctx = canvas.getContext('2d');

				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, canvas_width, canvas_height);

				var html = element.outerHTML;
				rasterizeHTML.drawHTML(html, canvas).then(function success(renderResult) {
					var final_src = canvas.toDataURL('image/jpeg', 1.0);

					var final_img = new Image();
					final_img.src = final_src;

					var a = document.createElement('a');
					a.innerHTML = 'Download';
					a.href = final_src;
					a.download = "meme_" + Date.now();

					document.body.appendChild(final_img);
					document.body.appendChild(a);

				}, function error(e) {
					console.log('there was an error');
				});
			};
		}
		//If image or text missing, alert the user
		else {
			alert("Missing text or picture");
		}
	});
});