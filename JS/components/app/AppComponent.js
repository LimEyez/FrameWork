//appcomponent.js
class AppComponent extends Component{
	constructor(options) {
		super(options);

		this.header = new HeaderComponent({
			id: 'header',
			parent: this.id,
			template: template.headerTemplate,
			callbacks: {
				showPage: (name) => this.showPage(name)
			}
		});

		this.calculator = new CalculatorComponent({
			id: 'calculator',
			parent: this.id,
			template: template.calculatorTemplate,
			className: 'hide'
		});

		this.graph2D = new Graph2DComponent({
			id: 'graph2D',
			parent: this.id,
			template: template.graph2DTemplate,
			className: 'hide'
		});

		this.billiards = new BilliardsComponent({
			id: 'billiards',
			parent: this.id,
			template: template.billiardsTemplate,
			className: 'show'
		});
		
		this.graph3D = new Graph3DComponent({
			id: 'graph3D',
			parent: this.id,
			template: template.graph3DTemplate,
			className: 'hide',
		});
		
	}
	showPage(name) {
		console.log(name)
		this.calculator.hide();
		this.graph2D.hide();
		this.graph3D.hide();
		this.billiards.hide();
		this[name].show();
	}
}