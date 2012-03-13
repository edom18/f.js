module('model test');
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

                QUnit.deepEqual(undefined, this.previous('hoge'), 'previous("hoge")');
            }, this);
        }
    });

    var model = new Model1();

    model.set({
        hoge: 'hoge'
    });
});


module('utilities test');

test('isEmpty test', function () {

    var isEmpty = f.utils.isEmpty;
    var test1 = '',
        test2 = [],
        test3 = {},
        test4 = {hoge: 'hoge'},
        test5 = 'aaa',
        test6 = [1,2,3],
        test7 = true,
        test8 = false,
        test9 = function () {};

    QUnit.deepEqual(true, isEmpty(test1), 'empty string');
    QUnit.deepEqual(true, isEmpty(test2), 'empty array');
    QUnit.deepEqual(true, isEmpty(test3), 'empty object');
    QUnit.deepEqual(false, isEmpty(test4), 'not empty object');
    QUnit.deepEqual(false, isEmpty(test5), 'not empty string');
    QUnit.deepEqual(false, isEmpty(test6), 'not empty array');
    QUnit.deepEqual(true, isEmpty(test7), 'Boolean');
    QUnit.deepEqual(true, isEmpty(test8), 'Boolean');
    QUnit.deepEqual(false, isEmpty(test9), 'as function');
});
