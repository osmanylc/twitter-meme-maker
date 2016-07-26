/* This code borrows from from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas
Using window.createObjectURL(Blob) for the img.src taints the canvas. Fixed with solution from 
https://bugs.chromium.org/p/chromium/issues/detail?id=294129 */

function dom2canvas(htmlElement, canvas) {
	return new Promise(function (resolve, reject) {
		var data = buildDataString(htmlElement, canvas.width, canvas.height);
		var ctx = canvas.getContext('2d');

		var img = new Image();
		var url = 'data:image/svg+xml,' + data;

		img.onload = function () {
			ctx.drawImage(img, 0, 0);
			resolve(canvas);
		};
		img.src = url;
	});
}


function serializeHTML(htmlElement) {
	htmlElement.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

	return (new XMLSerializer()).serializeToString(htmlElement);
}



function buildDataString(htmlElement, width, height) {
	var htmlString = serializeHTML(htmlElement);

	var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + 
	width + '" height="' + height + '">' + 
	'<foreignObject width="100%" height="100%">' + 
	htmlString + 
	'</foreignObject>' +
    '</svg>';

    return data;
}
