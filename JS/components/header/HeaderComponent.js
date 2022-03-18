class HeaderComponent extends Component {
    _addEventListeners() {
        const buttons = document.querySelectorAll('.showPage');
        //console.log(buttons);
        buttons.forEach(button => {
            button.addEventListener(
                'click', 
                () => this.showPage(button.dataset.component));
        });
    }

    showPage(name) {
        // console.log(1212121, name);
        this.callbacks.showPage(name);
    }
}