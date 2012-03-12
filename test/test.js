test("model get/set test",function(){
    
    var Model1 = f.Model.extend({
        hoge: 'hoge'
    });

    var model = new Model1({
        defaults: {
            foo: 'foo'
        }
    });

    model.set({
        'edo': 'word'
    });

    QUnit.deepEqual('word', model.get('edo'), "word === get('edo')");
    QUnit.deepEqual('word', model.previous('edo'), "word === previous('edo')");
});

test('model previous test', function () {

    stop();
    var Model1 = f.Model.extend({
        initialize: function () {

            this.on('change', function () {
                start();

                QUnit.deepEqual(null, this.previous('hoge'), 'previous("hoge")');
            }, this);
        }
    });

    var model = new Model1();

    model.set({
        hoge: 'hoge'
    });
});
