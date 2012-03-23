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
        test9 = function () {},
        test10 = null,
        test11 = undefined,
        test12 = 0,
        test13 = 1;

    QUnit.deepEqual(true, isEmpty(test1), 'empty string');
    QUnit.deepEqual(true, isEmpty(test2), 'empty array');
    QUnit.deepEqual(true, isEmpty(test3), 'empty object');
    QUnit.deepEqual(false, isEmpty(test4), 'not empty object');
    QUnit.deepEqual(false, isEmpty(test5), 'not empty string');
    QUnit.deepEqual(false, isEmpty(test6), 'not empty array');
    QUnit.deepEqual(true, isEmpty(test7), 'Boolean');
    QUnit.deepEqual(true, isEmpty(test8), 'Boolean');
    QUnit.deepEqual(false, isEmpty(test9), 'as function');
    QUnit.deepEqual(true, isEmpty(test10), 'as null');
    QUnit.deepEqual(true, isEmpty(test11), 'as undefiend');
    QUnit.deepEqual(false, isEmpty(test12), 'Number of 0');
    QUnit.deepEqual(false, isEmpty(test13), 'Number of 1');
});

test('hasProp test', function () {

    var hasProp = f.utils.hasProp;
    var test1 = {
        hoge: 'hoge',
        foo: 'foo'
    };

    QUnit.deepEqual(true, hasProp(test1, 'hoge'), 'has "hoge" property');
    QUnit.deepEqual(true, hasProp(test1, 'foo'), 'has "foo" property');
    QUnit.deepEqual(false, hasProp(test1, 'fuga'), 'not has "fuga" property');
});
