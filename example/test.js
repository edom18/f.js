var utils = f.utils,
    Model = f.Model,
    View  = f.View;

var Model1 = Model.extend({
    defaults: {
        hoge: 'hogehoge'
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
    model: model
});

console.log(model);

var template = utils.template($('#test').html());
console.log(template);
console.log(template({
    hoge: 'hogehoge',
    hoge2: 'hoge2hoge2'
}));
