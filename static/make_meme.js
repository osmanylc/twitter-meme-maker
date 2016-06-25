function make_meme_html(text, image) {
	//define elements
	var div_container = $("<div>");
	var text_div = $("<div>");
	var image_container = $("<img>")

	//build element hierarchy
	$(text_div).append('hallo');
	$(image_container).attr("src", $SCRIPT_ROOT + "/static/pic.jpg");
	$(div_container).append(text_div);
	$(div_container).append(image_container);

	//set elements to their right size
	$(text_div).css({
		width : "285px",
	});

	return $(div_container)[0];
}


$(document).ready(function() {
	var element = make_meme_html();
	var canvas = document.getElementById("canvas");
	var html = element.outerHTML;

	rasterizeHTML.drawHTML(html, canvas);
})