(function (f) {

    var utils = f.utils,
        Model = f.Model,
        View  = f.View;

    var Model1 = Model.extend({
        defaults: {
            hoge: 'hoge'
        },
        initialize: function () {

        }
    });

    var model = new Model1();

    model.set({
        'edo': 'word'
    });
    model.set({
        'edo': 'word2'
    });

    var View1 = View.extend({
        events: {
            'click .test1': '_onClick',
            'mouseover .test3 .test31': '_onMouseover'
        },
        initialize: function () {

            console.log(this);
        },
        _onClick: function () {

            alert('clicked');
        },
        _onMouseover: function () {

            console.log('mouseover');
        }
    });

    var view = new View1({
        el: $('#hoge')
    });
}(f));
