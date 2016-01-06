define(['text!estates/tpl/estates.html','properties/propertyCollection',
        'cache'],
    function (estatesPage,PropertyCollection,Cache) {

        var EstateInfoHouseListPage =  $(estatesPage).filter('#tpl-estateInfoHouseList').html();
        var EstateInfoHouseListView = Backbone.View.extend({
            el: '#container',
            events: {

            },
            propertyInfo: null,
            initialize: function () {
            },
            showTemplateByType: function (type) {
                var self = this;
                var elType = {
                    'PropertyInfoHouseListPage': EstateInfoHouseListPage
                }
                self.el = elType[type];
            },
            render: function(propertyInfo) {
                this.getPropertieById(propertyInfo);
                this.propertyInfo = propertyInfo;
                var self = this;
                var template1 = _.template(EstateInfoHouseListPage, {
                    item: propertyInfo
                });
                //self.showTemplateByType(PropertyInfoHouseListPage);
                return template1;
            },
            getPropertieById: function(propertyId) {
                var getPropertiesServiceCallBack = function (resp) {
                    var self = this;
                    var items = [];
                    if (resp.resultCode ===  'successful') {
                        window.Utils.Log.info(resp, "getPropertiesByEstate resp");
                        var data = propertyCollection.getAll();
                        _.each(data, function (item) {
                            var thumbnails = item.thumbnails;
                            var defaultThumbnail = "";
                            if(thumbnails!=null && thumbnails.length > 0 ) {
                                defaultThumbnail = thumbnails.split(",")[0];
                            }
                            item = _.extend({},item,{
                                defaultThumbnail: defaultThumbnail
                            })
                            items.push(item);
                        });

                        Cache.setItem("Properties_" + propertyId, items);
                        window.Utils.Log.info(items.length, "items.length为;");
                        var template = _.template(EstateInfoHouseListPage, {
                            items: items,
                            items2: items,
                            items3: items
                        });


                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(EstateInfoHouseListPage, {
                            items: false
                        });
                    }
                };

                //var url = window.AppConfig.RemoteApiUrl + '/estates/21sijichuandadian';
                //var url = window.AppConfig.RemoteApiUrl + '/data/major_estates.json';
                var url = 'app/data/properties.json';
                var propertyCollection = new PropertyCollection(url);
                window.Utils.Http.get({
                    model: propertyCollection,
                    data: {}
                }, getPropertiesServiceCallBack);
            },
            toggle: function() {
            }
        });
        return EstateInfoHouseListView;
    });
