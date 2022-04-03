class Planets  {
        //=================Элементы системы==================
         Sun = (new figure).solarSystem(20, 15, new Point, "#ffff00",
            [
                { // вращение вокруг своей оси
                    method: 'rotateOz',
                    value: -(Math.PI / 180 / 3),
                    check: true
                }
            ]);

         Mercury = (new figure).solarSystem(
            20, 2, new Point(-20, 0, 0), "#faebd7", 
            [
                { 
                    method: 'rotateOz',
                    value: -Math.PI / 180,
                    center: new Point
                },
                {// вращение вокруг своей оси
                    method: 'rotateOz',
                    value: -Math.PI / 180,
                    check: true
                },
            ],
        );
         Venus = (new figure).solarSystem(
            20, 3, new Point(-30, 0, 0), "#ffa07a", 
            [
                {
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 1.3,
                    center: new Point,
                },
                {// вращение вокруг своей оси
                    method: 'rotateOz',
                    value: -Math.PI / 180,
                    check: true
                },
            ]
        );

         Earth = (new figure).solarSystem(
            20, 5, new Point(-45, 0, 0), "#1E90FF", 
            [
                { // вращение вокруг солнца
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 1.6,
                    center: this.Sun.center,
                }, 
                { // вращение вокруг своей оси
                    method: 'rotateOz',
                    value: -Math.PI / 180,
                    check: true
                },
        ]
        );
         Moon = (new figure).solarSystem(20, 1, new Point(-55, 0, 0), "#808080",
            [
                { //вращение вокруг земли
                    method: 'rotateOz',
                    value: -Math.PI / 360 * 3  ,
                    center: this.Earth.center
                },
                { // вращение вокруг своей оси
                    method: 'rotateOz',
                    value: Math.PI / 360,
                    check: true
                },

            ]
        );

         Mars = (new figure).solarSystem(
            20, 4, new Point(-65, 0, 0), "#cd853f", 
            [
                { // вращение вокруг солнца
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 2,
                    center: new Point,
                }, 
                { // вращение вокруг своей оси
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 1.2,
                    check: true
                },
            ]
        );

         Jupiter = (new figure).solarSystem(
            20, 10, new Point(-85, 0, 0), "#ffdab9", 
            [
                { // вращение вокруг солнца
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 2.4,
                    center: new Point,
                    
                }, 
                { // вращение вокруг своей оси
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 1.4,
                    check: true
                },
            ]
        );

         Saturn = (new figure).solarSystem(
            20, 8, new Point(-115, 0, 0), "#eee8aa", 
            [
                { // вращение вокруг солнца
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 2.9,
                    center: new Point,
                }, 
                { // вращение вокруг своей оси
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 1.7,
                    check: true
                },
            ]
        );

         RingsSaturn = (new figure).ringsSaturn(
            20, 16, new Point(-115, 0, 0), "#a39f72", 
            [
                {
                    method: 'rotateOy',
                    value: -Math.PI / 360 / 3,
                    center: this.Saturn.center,
                },
                {
                    method: 'rotateOx',
                    value: Math.PI / 180,
                    center: this.Saturn.center,
                    check: true
                }
        
            ]
        );

         Uranium = (new figure).solarSystem(
            20, 5, new Point(-150, 0, 0), "#9acd32", 
            [
                { // вращение вокруг солнца
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 3.4,
                    center: new Point,
                }, 
                { // вращение вокруг своей оси
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 2.2,
                    check: true
                },
            ]
        );

        RingsUranium = (new figure).ringsSaturn(
            20, 10, new Point(-150, 0, 0), "#9acd32", 
            [
                {
                    method: 'rotateOy',
                    value: -Math.PI / 360 / 2.5,
                    center: this.Uranium.center
                },
                {
                    method: 'rotateOx',
                    value: Math.PI / 180 / 1.5,
                    center: this.Uranium.center,
                    check: true
                }
        
            ]
        );

         Neptune = (new figure).solarSystem(
            20, 5.3, new Point(-170, 0, 0), "#4169e1", 
            [
                { // вращение вокруг солнца
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 4,
                    center: new Point
                }, 
                { // вращение вокруг своей оси
                    method: 'rotateOz',
                    value: -Math.PI / 180 / 2.7,
                    check: true
                },
            ]
        );
        
        solarSystem = 
            [
             this.Sun, 
             this.Mercury, 
             this.Venus, 
             this.Earth, 
             this.Moon, 
             this.Mars, 
             this.Jupiter, 
             this.RingsSaturn, 
             this.Saturn, 
             this.Uranium,
             this.RingsUranium, 
             this.Neptune
            ];


        animationSolarSystem = 
        [
            {
                root: this.Sun,
                nodes:
                    [
                        { root: this.Mercury },
                        { root: this.Venus },
                        { root: this.Earth, nodes: [{ root: this.Moon }] },
                        { root: this.Mars },
                        { root: this.Jupiter },
                        { root: this.Saturn, nodes: [{root: this.RingsSaturn}]},
                        { root: this.Uranium, nodes: [{root: this.RingsUranium}]},
                        { root: this.Neptune }
                    ]
            }

        ]
}
