// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
window['HttpClient'] = {
    postComment: function (id, message, completed) {
        var target = this;
        return new window['Promise'](function (success, terminated) {
            target.postData(`/Points/AddComment?id=${id}&message=${message}`, function (result) {
                completed(parseInt(result)); 
            }, null);
        });
    },
    getText: function (url, callback, data) {
        return new window['Promise'](function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('get', url, true);
            req.onload = function () {
                callback(req.responseText);
            };
            req.onerror = function (e) {
                reject(e);
            };
            req.send(data);
        });
    },
    postData: function (url, callback, data) {
        return new window['Promise'](function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('post', url, true);
            req.onload = function () {
                callback(req.responseText);
            };
            req.onerror = function (e) {
                reject(e);
            };
            req.send(data);
        });
    },
    getJson: function (url, callback, data) {
        var target = this;
        return new window['Promise'](function (resolve, reject) {
            target.getText(url, function (text) {
                var result = JSON.parse(text);
                callback(result);
            }, data);
        });
    },
    createPoint: function (data, completed) {
        var target = this;
        return new window['Promise'](function (success, terminated) {
             
            target.postData(`/Points/Create?x=${data.x}&y=${data.y}&r=${data.r}&color=${data.color}`, function (result) {
                
                data.id = parseInt(result);

         
                completed(data);
            }, data);
        });
    },
    getAll: function (handleData) {
        var target = this;
        return new window['Promise'](function (success, terminated) {
            target.getJson('/Points/GetAll', function (data) {
                if (handleData)
                    handleData(data);
            }, null);
        });
    },
    deletePoint: function (id) {
        var target = this;
        return new window['Promise'](function (success, terminated) {
            target.getText('/Points/Delete?Id=' + id, success, null).catch(terminated);
        });
    }
};





angular.module('PointsDiagramApp', [], function ($provide) {
    console.info('PointsDiagramApp');
    if (!window['Konva']) {
        throw {
            message: 'Необходимо загрузить зависимость Konva.js'
        };
    }
}).controller('PointsDiagramController', function ($scope, $points, $diagram) {
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
    $scope.createPoint = function (model) {
        console.info(`createPoint(${model})`);
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
    $scope.createPoint();

}).service('$points', function ($http) {
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
        async $delete(id) {
            return await $http.delete('/Points/Create', { id: id }, {})
        },

        $create(model) {
            return new Promise((resolve, reject) => {
                $http.post('/Points/Create', model, {}).then(
                    function ensureStatusCodeCorrect(response) {
                        if (response.status != 204) {
                            resolve(response.data);
                        } else {
                            reject(response.data);
                        }
                    },
                    reject
                ).then(resolve, reject);


            });
        },

        async $addComment(idPoint, commectModel) {
            const result = await $http.post(`/Points/AddComment?id=${id}`, commentModel, {})
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
}).service('$diagram', function ($rootScope, $points) {

    let target = {

        dataset: [],

        $addItem(item) {

            const control = {
                model: item,
                type: 'point',
                click() {
                    alert('clicked');
                },
                get $id() { return dataitem.id; }
            }

            target.dataset.push(control);
            target.ring = target.rect = target.$point(control.model);
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
            target.group.add(point.rect = new window['Konva'].RegularPolygon({
                x: point.x?point.x: 111,
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
                    points = points.filter(function (p) { return p.id != point.id; });
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