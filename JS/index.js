const template = new Template;/*- конструктор, значит с БОЛЬШОЙ буквы*/
window.onload = function(){
	new AppComponent({id:'app', template: template.appTemplate});
}