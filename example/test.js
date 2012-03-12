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

var View1 = View.extend({
    events: {
        'click .test1': '_onClick',
        'mouseover .test3 .test31': '_onMouseover'
    },
    initialize: function () {

        this.model.on('change', this.render, this);
    },
    _onClick: function () {

        alert('clicked');
    },
    _onMouseover: function () {

        console.log('mouseover');
    },
    render: function () {

        this.$('.test1').text(this.model.get('edo'));

        return this;
    }
});

var view = new View1({
    el: $('#hoge'),
    model: model
});

model.set({
    edo: 'word'
});
