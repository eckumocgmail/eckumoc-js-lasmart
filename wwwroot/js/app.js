var HttpClient = {
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
    getJson: function (url, callback, data) {
        var target = this;
        return new window['Promise'](function (resolve, reject) {
            target.getText(url, function (text) {
                var result = JSON.parse(text);
                callback(result);
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
function addPoint(point) {
}
function deletePoint(id) {
    var req = new XMLHttpRequest();
    req.open('get', '/Points/Delete?Id=' + id, true);
    req.send();
    req.onload = function () {
        console.info('deleted');
    };
}
function loadData(data) {
    var p = document.getElementById('map');
    var container = document.getElementById('container').parentElement;
    document.getElementById('container').parentElement.removeChild(document.getElementById('container'));
    var created = document.createElement('div');
    created.id = 'container';
    container.appendChild(created);
    //todo 
    var stage = new window['Konva'].Stage({
        container: 'container',
        width: window.innerWidth / 12 * 8,
        height: window.innerHeight / 12 * 8,
    });
    var layer = new window['Konva'].Layer();
    var points = [];
    function findPoint(x, y) {
        for (var i = 0; i < points.length; i++) {
            if ((points[i].x + points[i].r) >= x && (points[i].x - points[i].r) <= x) {
                if ((points[i].y + points[i].r) >= y && (points[i].y - points[i].r) <= y) {
                    return points[i];
                }
            }
        }
        return null;
    }
    for (var i = 0; i < data.length; i++) {
        var point = data[i];
        var rect1 = new window['Konva'].Ring({
            x: point.x,
            y: point.y,
            innerRadius: point.r,
            outerRadius: point.r,
            fill: point.color,
            stroke: 'black',
            strokeWidth: 4
        });
        points.push(point);
        point.ring = rect1;
        layer.add(point.rect = new window['Konva'].RegularPolygon({
            x: point.x,
            y: point.y,
            sides: 5,
            radius: point.r,
            fillLinearGradientStartPoint: { x: -50, y: -50 },
            fillLinearGradientEndPoint: { x: 50, y: 50 },
            fillLinearGradientColorStops: [0, 'red', 1, 'yellow'],
            stroke: 'black',
            strokeWidth: 4,
            draggable: false,
        }));
        layer.add(rect1);
    }
    function listPoint(point) {
        console.info(point);
        var comments = document.getElementById('comments');
        comments.innerHTML = '';
        for (var i_1 = 0; i_1 < point.comments.length; i_1++) {
            var comment = point.comments[i_1];
            comments.innerHTML += "<li class=\"list-group-item\">" + comment.message + "</li>";
        }
    }
    stage.on('click', function (e) {
        var point = findPoint(stage.getPointerPosition().x, stage.getPointerPosition().y);
        if (point) {
            listPoint(point);
        }
    });
    stage.on('dblclick', function (e) {
        var point = findPoint(stage.getPointerPosition().x, stage.getPointerPosition().y);
        if (point) {
            deletePoint(point.id);
            console.info(layer);
            point.ring.destroy();
            point.rect.destroy();
            points = points.filter(function (p) { return p.id != point.id; });
        }
    });
    // add the shape to the layer
    // add the layer to the stage
    stage.add(layer);
}
function refresh() {
    var req = new XMLHttpRequest();
    req.open('get', '/Points/GetAll', true);
    req.send();
    req.onload = function () {
        var data = JSON.parse(req.responseText);
        loadData(data);
        var p = document.getElementById('map');
    };
    req.onerror = function () {
        alert('Не удалось выполнить запрос ' + '/Points/GetAll');
    };
}
window.onload = function OnLoad() {
    refresh();
};
//# sourceMappingURL=app.js.map
//# sourceMappingURL=app.js.map
//# sourceMappingURL=app.js.map
//# sourceMappingURL=app.js.map