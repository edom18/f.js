(function (f) {

    var utils = f.utils;

    var Test = function () {};

    Test.prototype = {
        foo: 'foo'
    };

    utils.copyClone(Test.prototype, f.events.EventDispatcher.prototype);

    Test.extend = utils.extend;

    var Test2 = Test.extend({
        hoge: 'hoge'
    });

    var test2 = new Test2();

    test2.on('test', function () {

        console.log(this);
    }, window);

    test2.trigger('test');
}(f));
