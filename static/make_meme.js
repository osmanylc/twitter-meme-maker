function make_meme_html(text, image_url) {
	//define elements
	var div_container = $("<div>");
	var text_div = $("<div>");
	var image_container = $("<img>")

	//build element hierarchy
	$(text_div).append(text);
	$(image_container).attr("src", image_url);
	$(div_container).append(text_div);
	$(div_container).append(image_container);

	//set elements to their right size
	$(text_div).css({
		width : "285px",
	});

	return $(div_container)[0];
}


$(document).ready(function() {
	var text;
	var image_url;
	$('#create_button').click(function(e) {
		var textarea = $('#meme_text');
		var file_input = $('#meme_image');

		if(file_input.prop('files')[0] && textarea.prop('value')) {
			image = file_input.prop('files')[0];
			text = textarea.prop('value');

			var reader = new FileReader();
			reader.onload = function() {
				image_url = reader.result;				
				var element = make_meme_html(text, image_url);

				var canvas = document.createElement("canvas");
				canvas.width = "300";
				canvas.height = "300";
				var ctx = canvas.getContext('2d');
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, 300, 300);

				var html = element.outerHTML;

				rasterizeHTML.drawHTML(html, canvas).then(function success(renderResult) {
					var final_src = canvas.toDataURL('image/jpeg', 1.0);
					var final_img = new Image();
					final_img.src = final_src;

					document.body.appendChild(final_img);
				}, function error(e) {
					console.log('there was an error');
				});
			};

			reader.readAsDataURL(image);


			
		} else {
			alert("Missing text or picture");
		}
	});
});