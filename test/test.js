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
