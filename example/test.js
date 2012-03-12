(function (f) {

    var utils = f.utils,
        Model = f.Model,
        View  = f.View;

    var Model1 = Model.extend({
        defaults: {
            hoge: 'hoge'
        },
        initialize: function () {

            this.on('change', function (e, data) {
            
                console.log(e, data);
            }, this);
        }
    });

    var model = new Model1();

    model.set({
        'edo': 'word'
    });
    model.set({
        'edo': 'word2'
    });
}(f));
