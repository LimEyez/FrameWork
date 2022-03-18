class Graph2DComponent extends Component {
  constructor(options) {
    super(options);
    this.WIN = {
      LEFT: -10,
      BOTTOM: -10,
      WIDTH: 20,
      HEIGHT: 20
    };

    this.canvas = new Canvas({
      callbacks: {
        wheel: event => this.wheel(event),
        mouseup: () => this.mouseup(),
        mousedown: () => this.mousedown(),
        mousemove: event => this.mousemove(event),
        mouseleave: () => this.mouseleave(),
      },
      WIN: this.WIN,
      id: 'canvas',
      width: 750, //например 600
      height: 750 //например 600
    });

    this.ui = new UIComponent({
      id: "ui",
      parent: this.id,
      template: template.uiTemplate,
      callbacks: {
        addFunction: (f, num, cmd, SCheck, one, two, id, inputX) => this.addFunction(f, num, cmd, SCheck || false, one || null, two || null, id, inputX || null),
        delFunction: num => this.delFunction(num),
      }
    });

    //========================\\
    this.funcs = [];
    this.check = [];
    this.ZOOM_STEP = 0.5;
    this.canMove = false;
    this.colors = document.getElementById('Color');
    this.brushSlider = document.getElementById("brushSlider");
    this.input0 = document.getElementById('input0');
    this.input1 = document.getElementById('input1');
    this.inputexp = document.getElementById('inputexp');
    this.resaultff = document.getElementById("resaultf");
    this.resaultff2 = document.getElementById("resaultf2");
    this.boba = false;
    this.render();

    //Функция вызова первого нуля
    this.resaultff.addEventListener('click', () => {
      if (this.boba == true) {
        this.boba = false
      }
      else {
        this.boba = true;
      }
      this.render();

    });

    //Функция вызова пересечения 2-х последних графиков
    this.resaultff2.addEventListener('click', () => {
      let i = this.funcs.length - 1;
      let j = this.funcs.length - 2;
      this.getPoint(this.funcs[i].f, this.funcs[j].f, this.input0.value - 0, this.input1.value - 0, this.inputexp.value - 0);
    });
  }

  //=========================\\

  addFunction(f, num, cmd, SCheck, one, two, id, inputX) {
    this.funcs[num] = {
      f: f,
      cmd: cmd,
      id: id,
      color: this.colors.value,
      width: this.brushSlider.value,
      S: SCheck,
      one: one,
      two: two,
      inputX: inputX
    };
    this.render();
  }
  delFunction(num) {
    this.funcs[num] = null;
    this.render();
  }

  wheel(event) {
    event.preventDefault();
    let delta = (event.wheelDelta > 0) ? this.ZOOM_STEP * (-1) : this.ZOOM_STEP;
    if (this.WIN.BOTTOM + this.ZOOM_STEP <= 3) {
      this.WIN.WIDTH += delta;
      this.WIN.HEIGHT += delta;
      this.WIN.LEFT -= delta / 2;
      this.WIN.BOTTOM -= delta / 2;
      this.render();
    }
    else {
      this.WIN.WIDTH -= delta;
      this.WIN.HEIGHT -= delta;
      this.WIN.LEFT += delta / 2;
      this.WIN.BOTTOM += delta / 2;
      this.render()
    }
  }

  mousedown() {
    this.canMove = true;
  }
  mouseup() {
    this.canMove = false;
  }
  mouseleave() {
    this.canMove = false;
  }
  mousemove() {
    if (this.canMove) {
      this.WIN.BOTTOM += this.canvas.sy(event.movementY);
      this.WIN.LEFT -= this.canvas.sx(event.movementX);
    }
    this.derivativeX = this.WIN.LEFT + this.canvas.sx(event.offsetX);
    this.render();
  }


  getPoints(f, inputx = 0) {
      let y = f(inputx);
      return this.canvas.printpoint(inputx, y)
  }



  //===================\\

  getDerivative(f, x0) {
    const dx = 0.0001;
    return (f(x0 + dx) - f(x0)) / dx;
  }

  getZero(f, a, b, eps) {
    if (Math.abs(f(a) - f(b)) <= eps) {
      return this.canvas.printzero((a + b) / 2);
    }
    let half = (a + b) / 2; //Середина отрезка
    if (f(a) * f(half) <= 0) {
      return this.getZero(f, a, half, eps);
    }
    if (f(half) * f(b) <= 0) {
      return this.getZero(f, half, b, eps);
    }
    if (f(a) * f(b) > 0) {
      return null;
    }

  }

  //=====================\\
  getPoint(f, j, a, b, eps) {
    let fha = f(a);
    let fja = j(a);
    let fhb = f(b);
    let fjb = j(b)
    let half = (a + b) / 2;


    if ((fha >= fja && fhb <= fjb) ||
      (fha <= fja && fhb >= fjb)) {
      if (fha == fja) {
        return alert(a);
      }
      if (Math.abs((((fha + fja) / 2) - ((fhb + fjb)) / 2)) < eps) {
        return alert(((a + b) / 2).toFixed(3))
      }
      if ((f(half) >= j(half) && fhb <= fjb) ||
        (f(half) <= j(half) && fhb >= fjb)) {
        return this.getPoint(f, j, half, b, eps);
      }
      else if ((fha >= fja && f(half) <= j(half)) ||
        ((fha <= fja) && f(half) >= j(half))) {
        return this.getPoint(f, j, a, half, eps);
      }
      if (f(b) == j(b)) {
        return alert(b);
      }
    }
    else {
      return alert('null');
    }

  }

  //=====================\\
  printOXY() {
    this.canvas.XY();

    //Вертикальные полосы правее оси OY
    for (let i = 0; i < this.WIN.WIDTH; i++) {
      this.canvas.line(i, this.WIN.BOTTOM, i, this.WIN.BOTTOM + this.WIN.HEIGHT, "#989898", 2);
      //Пунктиры
      this.canvas.line(i, -0.1, i, 0.1, "black");
    };

    //Вертикальные полосы левее оси OY
    for (let i = 0; i > this.WIN.LEFT; i--) {
      this.canvas.line(i, this.WIN.BOTTOM, i, this.WIN.BOTTOM + this.WIN.HEIGHT, "#989898", 2);
      //Пунктиры
      this.canvas.line(i, -0.1, i, 0.1, "black");

    };

    //Гоизонтальные полосы ниже оси OX
    for (let i = 0; i < this.WIN.BOTTOM + this.WIN.HEIGHT; i++) {
      this.canvas.line(this.WIN.LEFT, i, this.WIN.LEFT + this.WIN.WIDTH, i, "#989898", 2);
      //Пунктиры
      this.canvas.line(-0.1, i, 0.1, i, "black");
    };


    //Горизонтальные полосы выше оси OX
    for (let i = 0; i > this.WIN.BOTTOM; i--) {
      this.canvas.line(this.WIN.LEFT, i, this.WIN.LEFT + this.WIN.WIDTH, i, "#989898", 2);
      //Пунктиры
      this.canvas.line(-0.1, i, 0.1, i, "black");
    }
    // Оси координат
    this.canvas.line(this.WIN.LEFT, 0, this.WIN.WIDTH + this.WIN.LEFT, 0, "black");
    this.canvas.line(0, this.WIN.BOTTOM, 0, this.WIN.BOTTOM + this.WIN.HEIGHT, "black");

    //Стрелки
    this.canvas.line(this.WIN.LEFT + this.WIN.WIDTH, 0, this.WIN.LEFT + this.WIN.WIDTH - 0.5, -0.1, 'black', 1);
    this.canvas.line(0, this.WIN.BOTTOM + this.WIN.HEIGHT, 0.1, this.WIN.BOTTOM + this.WIN.HEIGHT - 0.5, 'black', 1);
    this.canvas.line(0, this.WIN.BOTTOM + this.WIN.HEIGHT, -0.1, this.WIN.BOTTOM + this.WIN.HEIGHT - 0.5, 'black', 1);
    this.canvas.line(this.WIN.LEFT + this.WIN.WIDTH, 0, this.WIN.LEFT + this.WIN.WIDTH - 0.5, 0.1, 'black', 1);

    //Нумерация
    for (let i = this.WIN.LEFT.toFixed(0); i < this.WIN.WIDTH; i++) {
      if (i != 0) {
        this.canvas.locatenum(i, i, 0.25);
      }
    }
    for (let i = this.WIN.HEIGHT.toFixed(0); i > this.WIN.BOTTOM; i--) {
      if (i == 0) {
        this.canvas.locatenum(i, 0.2, i + 0.05);
      }
      else {
        this.canvas.locatenum(i, 0.2, i - 0.05);
      }
    }
  };

  //Вырисовка функций
  printf(f, color, width) {
    let x = this.WIN.LEFT;
    const dx = this.WIN.WIDTH / 1000;
    while (x < this.WIN.LEFT + this.WIN.WIDTH) {
      if (Math.abs(f(x) - f(x + dx)) < 100) {
        this.canvas.line(x, f(x), x + dx, f(x + dx), color, width);
        x += dx;
      }
      else {
        x += dx;
      };
    }
  };

  //y = k*x + b
  printDerivative(f, x0, cmd = false) {
    if (cmd == true) {
      const k = this.getDerivative(f, x0);
      const b = f(x0) - k * x0;
      const x1 = this.WIN.LEFT;
      const x2 = this.WIN.LEFT + this.WIN.WIDTH;
      this.canvas.line(x1, k * x1 + b, x2, k * x2 + b, 'blue', 1, true);
    }
    else {
      return null;
    }
  }

  printIntegral(f, a, b, n = 100) {
    if ((a === 0 && b === 0) || a == b) {
      return console.log('printIntegral = null');
    }
    else {
      const dx = (b - a) / n;
      let x = a;
      const points = [];
      while (x < b) {
        points.push({ x, y: f(x) });
        x += dx;
      };
      points.push({ x: b, y: 0 });
      this.canvas.polygon(points);
    }
  }

  getIntegral(f, a, b, n = 100) {
    if ((a === 0 && b === 0) || a == b) {
      return ('null');
    }
    else {
      const dx = (b - a) / n;
      let x = a;
      let S = 0;
      while (x <= b) {
        S += (f(x) + f(x + dx)) / 2 * dx;
        x += dx;
      }
      return S;
    }
  }

  //Функция Render
  render() {
    this.canvas.clear();
    this.printOXY();
    this.funcs.forEach(func => {
      if (func) {
        this.printf(func.f, func.color, func.width);
        // console.log(func.inputX);
        this.getPoints(func.f, func.inputX);
        //console.log(func.one);
        if (this.boba) {
          this.getZero(func.f, this.input0.value - 0, this.input1.value - 0, this.inputexp.value - 0);
        };
        //console.log (func.id);
        if (func.S) {
          if (func.one === null && func.two === null) {
            document.getElementById(func.id).value = "null";
          }
          else {
            const s = this.getIntegral(func.f, func.one, func.two);
            document.getElementById(func.id).value = s;
            //console.log(s);
            this.printIntegral(func.f, func.one, func.two);
          }

        }
        this.printDerivative(func.f, this.derivativeX, func.cmd);
      }
    });
  }

}
