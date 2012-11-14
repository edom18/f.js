/* Class: "../../../js/f.core.js" */
describe('f.utilsの', function() {
    var utils = f.utils;

    function Hoge() {}

    var obj = {};
    var obj2 = {
        hoge: 'hoveVal',
        fuga: 'fugaVal'
    };
    var str   = 'hoge';
    var num   = 15;
    var num0  = 0;
    var numM1 = -1;
    var arr = [];
    var hoge = new Hoge();
    var nullObj = null;
    var undef;
    var trueObj = true;
    var falseObj = false;


    beforeEach(function() {
        // init
    });
    afterEach(function() {
        // clear
    });

    it('[hasProp] はオブジェクト固有のプロパティの場合trueを返す', function () {
        expect(utils.hasProp(obj2, 'hoge')).toBe(true);
        expect(utils.hasProp(obj2, 'toString')).toBe(false);
        expect(utils.hasProp(obj2, 'foo')).toBe(false);
    });

    it('[isFunction] は関数オブジェクトの場合trueを返す', function () {
        expect(utils.isFunction(Hoge)).toBe(true);
        expect(utils.isFunction(obj)).toBe(false);
        expect(utils.isFunction(str)).toBe(false);
        expect(utils.isFunction(num)).toBe(false);
        expect(utils.isFunction(num0)).toBe(false);
        expect(utils.isFunction(numM1)).toBe(false);
        expect(utils.isFunction(arr)).toBe(false);
        expect(utils.isFunction(hoge)).toBe(false);
        expect(utils.isFunction(nullObj)).toBe(false);
        expect(utils.isFunction(undef)).toBe(false);
        expect(utils.isFunction(trueObj)).toBe(false);
        expect(utils.isFunction(falseObj)).toBe(false);
    });

    it('[isString] は文字列の場合にtrueを返す', function () {
        expect(utils.isString(Hoge)).toBe(false);
        expect(utils.isString(obj)).toBe(false);
        expect(utils.isString(str)).toBe(true);
        expect(utils.isString(num)).toBe(false);
        expect(utils.isString(num0)).toBe(false);
        expect(utils.isString(numM1)).toBe(false);
        expect(utils.isString(arr)).toBe(false);
        expect(utils.isString(hoge)).toBe(false);
        expect(utils.isString(nullObj)).toBe(false);
        expect(utils.isString(undef)).toBe(false);
        expect(utils.isString(trueObj)).toBe(false);
        expect(utils.isString(falseObj)).toBe(false);
    });

    it('[isNumber] は数値の場合にtrueを返す', function () {
        expect(utils.isNumber(Hoge)).toBe(false);
        expect(utils.isNumber(obj)).toBe(false);
        expect(utils.isNumber(str)).toBe(false);
        expect(utils.isNumber(num)).toBe(true);
        expect(utils.isNumber(num0)).toBe(true);
        expect(utils.isNumber(numM1)).toBe(true);
        expect(utils.isNumber(arr)).toBe(false);
        expect(utils.isNumber(hoge)).toBe(false);
        expect(utils.isNumber(nullObj)).toBe(false);
        expect(utils.isNumber(undef)).toBe(false);
        expect(utils.isNumber(trueObj)).toBe(false);
        expect(utils.isNumber(falseObj)).toBe(false);
    });

    it('[isNull] はnullの場合にtrueを返す', function () {
        expect(utils.isNull(Hoge)).toBe(false);
        expect(utils.isNull(obj)).toBe(false);
        expect(utils.isNull(str)).toBe(false);
        expect(utils.isNull(num)).toBe(false);
        expect(utils.isFunction(num0)).toBe(false);
        expect(utils.isFunction(numM1)).toBe(false);
        expect(utils.isNull(arr)).toBe(false);
        expect(utils.isNull(hoge)).toBe(false);
        expect(utils.isNull(nullObj)).toBe(true);
        expect(utils.isNull(undef)).toBe(false);
        expect(utils.isNull(trueObj)).toBe(false);
        expect(utils.isNull(falseObj)).toBe(false);
    });

    it('[isUndefined] はundefinedの場合にtrueを返す', function () {
        expect(utils.isUndefined(Hoge)).toBe(false);
        expect(utils.isUndefined(obj)).toBe(false);
        expect(utils.isUndefined(str)).toBe(false);
        expect(utils.isUndefined(num)).toBe(false);
        expect(utils.isUndefined(num0)).toBe(false);
        expect(utils.isUndefined(numM1)).toBe(false);
        expect(utils.isUndefined(arr)).toBe(false);
        expect(utils.isUndefined(hoge)).toBe(false);
        expect(utils.isUndefined(nullObj)).toBe(false);
        expect(utils.isUndefined(undef)).toBe(true);
        expect(utils.isUndefined(trueObj)).toBe(false);
        expect(utils.isUndefined(falseObj)).toBe(false);
    });

    it('[isArray] は配列の場合にtrueを返す', function () {
        expect(utils.isArray(Hoge)).toBe(false);
        expect(utils.isArray(obj)).toBe(false);
        expect(utils.isArray(str)).toBe(false);
        expect(utils.isArray(num)).toBe(false);
        expect(utils.isArray(num0)).toBe(false);
        expect(utils.isArray(numM1)).toBe(false);
        expect(utils.isArray(arr)).toBe(true);
        expect(utils.isArray(hoge)).toBe(false);
        expect(utils.isArray(nullObj)).toBe(false);
        expect(utils.isArray(undef)).toBe(false);
        expect(utils.isArray(trueObj)).toBe(false);
        expect(utils.isArray(falseObj)).toBe(false);
    });

    it('[isEmpty] はBooleanのfalse相当とプロパティが空のオブジェクト、空文字、0の場合にtrueを返す', function () {
        expect(utils.isEmpty(Hoge)).toBe(false);
        expect(utils.isEmpty(obj)).toBe(true);
        expect(utils.isEmpty(obj2)).toBe(false);
        expect(utils.isEmpty(str)).toBe(false);
        expect(utils.isEmpty(num)).toBe(false);
        expect(utils.isEmpty(num0)).toBe(true);
        expect(utils.isEmpty(numM1)).toBe(false);
        expect(utils.isEmpty(arr)).toBe(true);
        expect(utils.isEmpty(hoge)).toBe(true);
        expect(utils.isEmpty(nullObj)).toBe(true);
        expect(utils.isEmpty(undef)).toBe(true);
        expect(utils.isEmpty(trueObj)).toBe(false);
        expect(utils.isEmpty(falseObj)).toBe(true);
    });
});
/*
describe('XXXは', function() {
    it('XXX', function() {
        //spyOn
        //呼び出しに対してargumentsを返却
        spyOn(obj, 'method').andReturn(arguments);
        //呼び出しに対して例外を発生させる
        spyOn(obj, 'method').andThrow(exception);
        //呼び出しに対して代わりの関数を実行させる
        spyOn(obj, 'method').andCallFake(function);
        //呼び出しに対してそのまま本来のメソッドを呼び出す
        spyOn(obj, 'method').andCallThrough(function);

        // spy後
        // 呼び出しが行われたか
        expect(obj, method).toHaveBeenCalled();
        // 呼び出しがargumentsを伴って呼び出されたか
        expect(obj, method).toHaveBeenCalledWith(arguments);

        //呼び出し回数
        obj.method.callCount;
        //直近の読み出し時の引数
        obj.mostRecentCall.args
        // i番目の呼び出し時
        obj.argsForCall[i]

        runs(function() {
            //処理
        });
        // １秒待ち
        waits(1000);
        runs(function() {
            //処理
        });

        //aがbと同じである
        expect(a).toEqual(b);
        //aがbと同じでない
        expect(a).not.toEqual(b);

        //aがbと同じオブジェクトである
        expect(a).toBe(b);
        //aがbと同じオブジェクトでない
        expect(a).not.toBe(b);

        //aがundefinedでない
        expect(a).toBeDefined();
        //aがundefinedである
        expect(a).not.toBeDefined();

        //aがnullである
        expect(a).toBeNull();
        //aがnullでない
        expect(a).not.toBeNull();

        //aがtrueである
        expect(a).toBeTruthy();
        //aがfalseである
        expect(a).toBeFalsy();

        //aにbが含まれている
        expect(a).toBeContain(b);
        //aにbが含まれてない
        expect(a).not.toBeContain(b);

        //aがbより小さい
        expect(a).toBeLessThan(b);
        //aがbより大きい
        expect(a).toBeGreaterThan(b);

        //a（function）が例外をスロー
        expect(a).toThrow(e);
        //a（function）が例外をスローしない
        expect(a).not.toThrow(e);
    });
});
*/
