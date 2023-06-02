angular.module('HttpClientModule', []).service('$points', function ($http) {
    return {


        async $getAll() {
            const response = await $http.get('/Points/GetAll', {});
            if (response.status != 200) {
                throw new {
                    message: response
                };
            } else {
                return response.data;
            }

        },
        $delete(id) {
            return new Promise((success, failed) => {
                $http.delete(`/Points/Delete?id=${id}`, {}, {})
                    .then((response) => {
                        if (response.status != 200) {
                            failed({ message: 'Http статус говорит о том что запрос не выполнен' });
                        } else {
                            success(response.data);
                        }

                    }, (error) => {
                        failed(error);
                    });
            });
        },


        $create(model) {
            return new Promise((resolve, reject) => {
                console.info('create: ', model);
                const color = encodeURI(model.color);
                const uri = `/Points/Create?x=${model.x}&y=${model.y}&r=${model.r}&color=${model.color}`;
                console.info('create: ', uri);

                var post = $http.post(uri, {}, {});
                post.then((response) => {
                    console.info(response);
                    console.info(`${response.config.method} ${response.config.url} ${response.status} => ${response.data}`);
                    if (response.status == 201) {
                        resolve((response.data));
                    } else {
                        reject({ message: `HttpError ${response.method} ${response.url} ${response.status} => ${response.data}` });
                    }
                });
            });


        },

        async $addComment(idPoint, model) {
            console.info(`$addComment(${idPoint} ${model})`);

            const response = await $http.post(`/Points/AddComment?id=${idPoint}`, model, {})
            if (response.status == 200) {
                return response.data;
            } else {
                throw {
                    method: '$addComment',
                    message: 'Статус запроса говорит что успеха так и не добились.'
                }
            }
        },
        $removeComment() { }
    };
});


//// PointsDiagramApp
angular.module('PointsDiagramApp', ['HttpClientModule'], function ($provide) {
    console.info('PointsDiagramApp');
    if (!window['Konva']) {
        throw {
            message: 'Необходимо загрузить зависимость Konva.js'
        };
    }
}).controller('PointsDiagramController',
    function ($scope, $points, $diagram) {
    console.info('PointsDiagramController');
    window['ctrl'] = $scope;
    Object.assign($scope, {
        $points: $points,
        $diagram: $diagram
    });
    Object.assign($scope, $scope.$points = $points);
    Object.assign($scope, $scope.$diagram = $diagram);
    $scope.updateData = function () {
        $points.$getAll().then($diagram.$load);
    }
    $scope.createModel = { x: 1, y: 2, r: 1, color: '#000000', id: -1 };
    $scope.$createPoint = function (model) {
        model = !model ? $scope.createModel : model;
        console.info(`createPoint(${model})`);
        if (!model)
            throw { message: 'Аргумент model не может содержать  значение null' }
        $points.$create(model).then(
            (data) => {


                console.info(`createPoint(${model}) success ${data})`);
                //model['id']=data;

                $scope.createCompleted();
                $scope.isCreateDialog = false;
                $diagram.$addItem(model);
                $scope.updateData();
            },
            (e) => {
                console.info(`createPoint(${model}) failed`);

                alert(e);
            }
        )
    }

    $scope.createModel = { id: 0, x: 50, y: 50, r: 30, color: 'black' };
    $scope.createDialog = function () { $scope.isCreateDialog = true; }
    $scope.createCompleted = function () { $scope.isCreateDialog = false; }
    $scope.isCreateDialog = false;




    $scope.updateData();


}).service('$diagram', function ($rootScope, $points) {

    let target = {

        dataset: [],

        $addItem(item) {

            return target.dataset.push(Object.assign(item, {
                model: item,
                type: 'point',
                click() {
                    alert('clicked');
                }
            }));
            //target.ring = target.rect = target.$point(control.model);
        },

        $load(dataset) {
            console.info(`$diagram.$load(${dataset})`);
            target.$draw();
            while (target.dataset.length > 0) target.dataset.shift();
            for (let i = 0; i < dataset.length; i++) {
                target.$addItem(dataset[i]);
            }
        },

        $point(point) {
            if (!point)
                return;
            if (!target.group)
                throw { message: 'Рабочая область ещё не готова' };
            target.group.add(point.rect = new window['Konva'].RegularPolygon({
                x: point.x ? point.x : 111,
                y: point.y ? point.y : 111,
                sides: 5,
                radius: point.r ? point.r : 111,
                fillLinearGradientStartPoint: { x: -50, y: -50 },
                fillLinearGradientEndPoint: { x: 50, y: 50 },
                fillLinearGradientColorStops: [0, 'red', 1, 'yellow'],
                stroke: 'black',
                strokeWidth: 4,
                draggable: false
            }));
            target.tr.forceUpdate();
        },


        $draw() {

            console.info(`$diagram.$draw()`);

            var stage = new window['Konva'].Stage({
                container: 'container',
                width: window.innerWidth,
                height: window.innerHeight,
            });

            var layer = new window['Konva'].Layer();
            layer.add(target.group = new Konva.Group({ x: 0, y: 0 }));
            layer.add(target.tr = new Konva.Transformer());
            target.tr.nodes([target.group]);

            // add elements

            target.dataset.forEach((item, index) => {
                switch (item.type) {
                    case 'point': { target.$point(item.model); break; }
                    case 'rect': { break; }
                    default: throw {};
                }
            });

            //связывание событий
            /*['click','dblclick','mouseover','mouseenter'].forEach(item =>{
                stage.on(item, function (e) {
                    const eventType = item;
                    target.$find(
                        stage.getPointerPosition().x, 
                        stage.getPointerPosition().y
                    ).forEach((item )=> {
                        if(item[eventType])item[eventType]();
                    });                    
                });
            });*/

            stage.on('click', function (e) {
                console.info(`click ${stage.getPointerPosition().x},  ${stage.getPointerPosition().y}`);
                target.$find(
                    stage.getPointerPosition().x,
                    stage.getPointerPosition().y
                ).forEach(item => item.click ? item.click() : null);
            });


            stage.on('dblclick', function (e) {
                var point = target.$find(
                    stage.getPointerPosition().x, stage.getPointerPosition().y);
                if (point) {
                    //deletePoint(point.id);
                    console.info(layer);
                    if (point.ring) point.ring.destroy();
                    if (point.ring) point.rect.destroy();
                    points = target.dataset.map(item => item.model).filter(function (p) { return p.id != point.id; });
                }
            });

            stage.add(layer);
        },


        $find(x, y) {
            const points = target.dataset;
            for (var i = 0; i < points.length; i++) {
                if ((points[i].x + points[i].r) >= x && (points[i].x - points[i].r) <= x) {
                    if ((points[i].y + points[i].r) >= y && (points[i].y - points[i].r) <= y) {
                        return [points[i]];
                    }
                }
            }
            return [];
        },


        $findAll(x, y) {
            let result = [];
            var points = target.dataset;
            for (var i = 0; i < points.length; i++) {
                if ((points[i].model.x + points[i].model.r) >= x && (points[i].model.x - points[i].r) <= x) {
                    if ((points[i].model.y + points[i].model.r) >= y && (points[i].model.y - points[i].r) <= y) {
                        result.push(target.dataset[i]);
                    }
                }
            }
            console.info(`$find( ${x}, ${y} ) => ${result}`);
            return result;
        }
    };
    return target;
});

angular.module('TableViewApp', ['HttpClientModule'], function () {
    console.info('TableViewApp');
}).controller('TableViewController',
    function ($scope, $points) {
        console.info('TableViewController');
        window['ctrl'] = Object.assign($scope, {
            $points: $points
        });
       
        $scope.selected = false;
        $scope.editorIsVisible = false;
        $scope.point = { x: 10, y: 10, r: 10, color: '#000000', comments: [], color: '#000430' };
        $scope.points = [];
        $points.$getAll(dataset => {
            $scope.points = dataset;
            $scope.editorIsVisible = false;
            $scope.$apply();
        });
        $scope.createPoint = function (data) {
            console.info(`createPoint: `, data);
            $points.$create(data).then(id => {
                console.info(`created: ${id}`);
                
            }).then(result => {
                $points.$getAll().then(dataset => {
                    $scope.points = dataset;
                    $scope.editorIsVisible = false;
                    $scope.$apply();
                    console.info(`$scope: `, $scope.points);
                    console.info(`$view: `, editorIsVisible ? 'form' : 'table');
                });
            });

        }       
        $scope.deletePoint = function (id) {
            $points.$delete(id).then(id => {
                $points.$getAll().then(dataset => {
                    $scope.points = dataset;
                    $scope.$apply();
                });                
            });
            
        }
        $scope.addComment = function (point, message) {
            return $points.$addComment(point, message);
        }
        $scope.selectPoint = function (point) {
            if ($scope.selected == point) {
                $scope.selected = false;
            } else {
                $scope.selected = point;
            }
        }

        $scope.hideEditor = function () {
            $scope.editorIsVisible = true;
        }
        $scope.showEditor = function () {
            $scope.editorIsVisible = true;
        };
        $scope.editorIsVisible = false; 
        $points.$getAll().then((data) => {

            data.forEach((item, index) => {
                $scope.points.push(item);
                $scope.$apply();
            });
            console.log($scope.points);
        });
    });
