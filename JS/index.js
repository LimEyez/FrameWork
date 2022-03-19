window.requestAnimFrame = (() => {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (/* function */ callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

const template = new Template;/*- конструктор, значит с БОЛЬШОЙ буквы*/
window.onload = function () {
	new AppComponent({ id: 'app', template: template.appTemplate });
}