var map;
var infoWindow;

function initMap() {

    // 地图的样式数组
    var styles = [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#cbe6a3"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#94a777"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dadada"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#5f80e2"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#3f6eb0"
                }
            ]
        }
    ];

    // 创建一个 StyledMapType 对象，参数为 styles 数组和在地图上显示的名字
    var styledMapType = new google.maps.StyledMapType(styles, {name: '公园图'});


    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.913769, lng: 116.395769},
        // styles: styles,
        // mapTypeControl: false,
        mapTypeControlOptions: {
            mapTypeIds: ['styled_map', 'roadmap', 'satellite', 'hybrid', 'terrain'
            ]
        },

        zoom: 13
    });
    // 将 styled map 和 MapTypeId 关联起来并显示
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    infoWindow = new google.maps.InfoWindow({maxWidth: 200});

    // 当信息窗口关闭时，清除 marker 属性。
    infoWindow.addListener('closeclick', function () {
        infoWindow.marker = null;
    });


    ko.applyBindings(new ViewModel());
}


// 地点的数组
var locations = [
    {title: '颐和园', location: {lat: 40.00224, lng: 116.276722}},
    {title: '圆明园', location: {lat: 39.999512, lng: 116.309649}},
    {title: '奥林匹克公园', location: {lat: 39.992904, lng: 116.390362}},
    {title: '北京动物园', location: {lat: 39.940541, lng: 116.3344}},
    {title: '北海公园', location: {lat: 39.932269, lng: 116.39011}},
    {title: '故宫博物院', location: {lat: 39.91632, lng: 116.397057}},
    {title: '中国国家博物馆', location: {lat: 39.905095, lng: 116.401563}},
    {title: '天坛', location: {lat: 39.883331, lng: 116.398945}}
];


var Place = function (data) {

    var that = this;
    // 这个函数生成不同颜色的 marker 图标，参数分别为 url size origin anchor scaledSize
    var makeMarkerIcon = function (markerColor) {
        return new google.maps.MarkerImage(
            'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(22, 40),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 40),
            new google.maps.Size(22, 40));
    };

    var defaultedIcon = makeMarkerIcon('FF0000');
    var highlightedIcon = makeMarkerIcon('00FF00');

    this.title = data.title;
    this.location = data.location;

    this.marker = new google.maps.Marker({
        position: data.location,
        icon: defaultedIcon,
        // map: map,
        title: data.title,
        animation: google.maps.Animation.DROP
    });

    // 在地图上隐藏标记
    this.showPlace = function () {
        that.marker.setMap(map);
    };
    //  在地图上显示标记

    this.hidePlace = function () {
        that.marker.setMap(null);
    };

    // 为 marker 添加点击事件，以显示 信息窗口
    this.marker.addListener('click', function () {

        that.populateInfoWindow();

    });
    // 为 marker 添加 mouse 事件，以更改标记颜色

    this.marker.addListener('mouseover', function () {
        this.setIcon(highlightedIcon);
    });

    this.marker.addListener('mouseout', function () {
        this.setIcon(defaultedIcon);
    });

    // 在列表上移动时更改对应的标记颜色
    this.defaultIcon = function () {
        that.marker.setIcon(defaultedIcon);
    };
    this.highlightIcon = function () {

        that.marker.setIcon(highlightedIcon);
    };

    this.populateInfoWindow = function () {

        // 如果当前信息窗口所在的标记 不是 点击的标记，则显示窗口。
        if (infoWindow.marker !== that.marker) {
            //  清除上一个 marker 的信息窗口的内容
            infoWindow.setContent('');

            infoWindow.marker = that.marker;

            var innerHTML = '<strong>' + that.marker.title + '</strong>';
            infoWindow.setContent(innerHTML);

            // wikipedia 请求错误处理
            var wikiRequestTimeout = setTimeout(function () {

                infoWindow.setContent(infoWindow.getContent() + '<br> wiki 简介加载失败');

            }, 5000);

            // 使用 wikipedia API 获取并显示与当前 marker 有关的简介
            $.getJSON('https://zh.wikipedia.org/w/api.php?callback=?', {
                search: that.marker.title,
                format: 'json',
                action: 'opensearch',
                dataType: 'json'

            }, function (data) {

                // 确保简介在一定长度外
                var content;
                for (var i = 0; i < data[2].length; i++) {

                    content = data[2][i];
                    if (content.length > 20) {
                        break;
                    }
                }

                infoWindow.setContent(infoWindow.getContent() + '<p>' + content + '</p>');

                // 请求成功，清除定时
                clearTimeout(wikiRequestTimeout);
            });

            // flicker 请求错误处理
            var flickrRequestTimeout = setTimeout(function () {

                infoWindow.setContent(infoWindow.getContent() + '<br> flickr 简介加载失败');

            }, 5000);

            // 使用 flickr API 获取并显示与当前 marker 有关的图片
            $.getJSON('https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?',
                {
                    tags: that.marker.title,
                    tagmode: 'any',
                    lang: 'zh-cn',
                    format: 'json'

                },
                function (data) {

                    infoWindow.setContent(infoWindow.getContent() + '<br><img src="' + data.items[0].media.m + '">');

                    // 请求成功，清除定时
                    clearTimeout(flickrRequestTimeout);
                });

            infoWindow.open(map, that.marker);

        } else {
            // 信息窗口打开时，点击 marker 关闭信息窗口
            infoWindow.close();
            infoWindow.marker = null;

        }

    };

};


var ViewModel = function () {

    var that = this;
    this.placeList = ko.observableArray([]);
    var bounds = new google.maps.LatLngBounds();


    // 遍历 locations 数组，构造 Place 的数组
    locations.forEach(function (location) {
        var place = new Place(location);
        that.placeList.push(new Place(place));
        // 扩展地图边界
        bounds.extend(place.location);

    });

    this.filterText = ko.observable('');
    this.buttonText = ko.observable('隐藏');
    // 更改按钮的显示文字
    this.changeButtonText = function (text) {

        if (that.buttonText() === '隐藏') {
            that.buttonText('显示');

        } else {
            that.buttonText('隐藏');
        }

    };
    // 用于显示或隐藏搜索框
    this.hideOrShow = ko.computed(function () {
        return that.buttonText() === '隐藏';
    });

    // 搜索文字过滤
    this.searchFilter = ko.computed(function () {


        // 调整地图的边界
        map.fitBounds(bounds);
        // 关闭信息窗口
        infoWindow.close();

        //  未输入的文字时，显示所有的地点
        if (that.filterText().length === 0) {

            that.placeList().forEach(function (place) {
                place.showPlace();
            });
            // 返回所有地点
            return that.placeList();

        } else {
            // 返回符合搜索条件的地点
            return ko.utils.arrayFilter(that.placeList(), function (place) {

                // 地点名称是否包含搜索文本
                var condition = place.title.indexOf(that.filterText()) >= 0;
                // 符合条件则显示
                if (condition) {
                    place.showPlace();

                } else {
                    place.hidePlace();
                }

                return condition;

            });

        }

    });


};


