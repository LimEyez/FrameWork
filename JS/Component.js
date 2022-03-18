class Component {
	constructor({
		id,
		parent,
		template = () => '<div>default</div>',
		templateParams = null,
		className,
		callbacks = {}
	}) {
		this.id = id;
		this.parent = parent;
		this.callbacks = callbacks;
		this._render(template(templateParams), className);
		this._addEventListeners();
	};

	show() {
		if (this.id == 'graph2D') {
			document.getElementById(this.id).classList.remove('hide');
			document.getElementById(this.id).classList.add('graphic2D');
		}
		else if (this.id == 'graph3D') {
			document.getElementById(this.id).classList.remove('hide');
			document.getElementById(this.id).classList.add('graphic3D');
		}
		else {
			document.getElementById(this.id).classList.remove('hide');
		}
	}


	hide() {
		if (this.id == 'graph2D') {
			document.getElementById(this.id).classList.remove('graphic2D');
			document.getElementById(this.id).classList.add('hide');
		}
		else if (this.id == 'graph3D') {
			document.getElementById(this.id).classList.remove('graphic3D');
			document.getElementById(this.id).classList.add('hide');
		}
		else {
			document.getElementById(this.id).classList.add('hide');
		}
	}

	_render(template, className) {
		const elem = document.createElement('div');
		elem.setAttribute('id', this.id);
		if (className) {
			elem.classList.add(className);
		}
		elem.innerHTML = template;
		if (this.parent) {
			document.getElementById(this.parent).appendChild(elem);
		} else {
			document.querySelector('body').appendChild(elem);
		}
	}

	_addEventListeners() { }
}