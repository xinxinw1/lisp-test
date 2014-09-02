/***** Lisp Testing Devel *****/

/* require tools >= 3.0 */
/* require ajax */
/* require prec-math */
/* require lisp-tools */
/* require lisp-parse */
/* require lisp-exec */
/* require lisp-core */

var udf = undefined;

var udfp = $.udfp;

var al = $.al;
var dmp = $.dmp;

var rpl = $.rpl;

var psh = $.psh;

var tfn = $.tfn;
var tfna = $.tfna;

var bot = $.bot;
var atth = $.atth;
var cmb = $.cmb;
var sefn = $.sefn;

var stf = $.stf;

var evl = $.evl;

var res = $("results");
var pg = $("page");

var tests = [];
function test(a, x, f){
  return psh([a, tfn(x, f), x, f], tests);
}

var allpass = true;
var fail = false;
function runtests(){
  allpass = true;
  out("Running tests...");
  out("");
  var a, x, st, f, res;
  for (var i = 0; i < tests.length; i++){
    a = tests[i][0];
    x = tests[i][1];
    st = tests[i][2];
    f = tests[i][3];
    fail = false;
    res = "error";
    try {
      res = evl(a);
      if (!x(res))fail = true;
    } catch (e){
      out(dmp(e));
      fail = true;
    }
    if (fail){
      allpass = false;
      if (udfp(f))out(stf("Failed: $1 -> $2 != $3", a, res, st));
      else out(stf("Failed: $1 -> $2 != $3 using $4", a, res, st, f));
    }
  }
  if (allpass)out("Passed all tests!");
}

function ou(a){
  atth(esc(a), res);
  bot(pg);
}

function out(a){
  atth(esc(a) + "<br>", res);
  bot(pg);
}

function esc(a){
  return rpl(["<", ">", "\n"],
             ["&lt", "&gt", "<br>"], a);
}

////// Tests //////

test('123', 123); // sanity check

//// Type ////

test('L.typ(L.sy("test"))', "sym");
test('L.dat(L.sy("test"))', "test");

test('var a = L.mkdat("test", "hey"); L.sdat(a, "what"); L.typ(a)', "test");
test('var a = L.mkdat("test", "hey"); L.sdat(a, "what"); L.dat(a)', "what");

//// Builders ////

test('var a = L.mk("test", {a: 3, b: 4, type: "hey"}); L.typ(a)', "test");
test('var a = L.mk("test", {a: 3, b: 4, type: "hey"}); L.rep(a, "a")', 3);
test('var a = L.mk("test", {a: 3, b: 4, type: "hey"}); L.tag(a, "type", "hey"); L.typ(a)', "hey");
test('var a = L.mk("test", {a: 3, b: 4, type: "hey"}); L.det(a, "type"); L.typ(a)', udf);
test('var a = L.mk("test", {a: 3, b: 4, type: "hey"}); L.det(a, "type"); L.tagp(a)', false);

test('L.typ(L.car(L.cons(L.sy("test"), L.nu("253"))))', "sym");
test('L.dat(L.car(L.cons(L.sy("test"), L.nu("253"))))', "test");

test('L.typ(L.cdr(L.cons(L.sy("test"), L.nu("253"))))', "num");
test('L.dat(L.cdr(L.cons(L.sy("test"), L.nu("253"))))', "253");

test('L.typ(L.nil())', "sym");
test('L.dat(L.nil())', "nil");
test('L.nilp(L.nil())', true);
test('L.lisp(L.nil())', true);
test('L.symp(L.nil())', true);

test('var a = L.cons(1, 2); L.scar(a, 3); L.car(a)', 3);
test('var a = L.cons(1, 2); L.scar(a, 3); L.cdr(a)', 2);
test('var a = L.cons(1, 2); L.scdr(a, 3); L.car(a)', 1);
test('var a = L.cons(1, 2); L.scdr(a, 3); L.cdr(a)', 3);

test('L.typ(L.lis(L.nu("1"), L.nu("2"), L.nu("3")))', "cons");
test('L.is(L.nu("1"), L.car(L.lis(L.nu("1"), L.nu("2"), L.nu("3"))))',
       true);
test('L.iso(L.cdr(L.lis(L.nu("1"), L.nu("2"), L.nu("3"))), ' +
           'L.lis(L.nu("2"), L.nu("3")))',
       true);
test('L.is(L.lis(), L.nil())', true);

test('L.nilp(L.lisd())', true)
test('L.typ(L.lisd(1, 2))', "cons")
test('L.car(L.lisd(1, 2))', 1)
test('L.cdr(L.lisd(1, 2))', 2)
test('L.iso(L.lisd(1, 2, 3), L.cons(1, L.cons(2, 3)))', true)
test('L.iso(L.lisd(1, 2, 3, L.nil()), L.lis(1, 2, 3))', true)


test('L.typ(L.arr(1, 2, 3))', "arr");
test('L.dat(L.arr(1, 2, 3))', [1, 2, 3], $.iso);

//// Predicates ////

test('L.udfp', tfna($.udfp));

test('L.tagp(L.sy("test"))', true);
test('L.tagp(null)', false);
test('L.tagp(undefined)', false);

test('L.isa("sym", L.sy("test"))', true);
test('L.isa("sym", L.st("test"))', false);

test('L.isany("sym", L.st("test"), L.nu("334"), L.sy("ta"))', true);
test('L.isany("arr", L.st("test"), L.nu("334"), L.sy("ta"))', false);

test('L.typin(L.st("test"), "arr", "cons", "mac")', false);
test('L.typin(L.st("test"), "arr", "cons", "str")', true);

test('L.symp(L.sy("test"))', true);
test('L.symp(L.st("test"))', false);

test('L.nump(L.sy("353"))', false);
test('L.nump(L.st("353"))', false);
test('L.nump(L.nu("353"))', true);

test('L.strp(L.sy("test"))', false);
test('L.strp(L.st("test"))', true);

test('L.consp(L.cons(1, 2))', true);
test('L.consp(L.st("test"))', false);
test('L.consp(L.nil())', false);

test('L.arrp(L.cons(1, 2))', false);
test('L.arrp(L.st("test"))', false);
test('L.arrp(L.nil())', false);
test('L.arrp(L.arr(1, 2))', true);

test('L.objp(L.cons(1, 2))', false);
test('L.objp(L.st("test"))', false);
test('L.objp(L.nil())', false);
test('L.objp(L.arr(1, 2))', false);
test('L.objp(L.ob({a: 3, b: 4}))', true);

test('L.rgxp(L.cons(1, 2))', false);
test('L.rgxp(L.st("test"))', false);
test('L.rgxp(L.nil())', false);
test('L.rgxp(L.arr(1, 2))', false);
test('L.rgxp(L.ob({a: 3, b: 4}))', false);
test('L.rgxp(/test/g)', false);
test('L.rgxp(L.rx(/test/g))', true);

test('L.jnp(L.cons(1, 2))', false);
test('L.jnp(L.st("test"))', false);
test('L.jnp(L.nil())', false);
test('L.jnp(L.arr(1, 2))', false);
test('L.jnp(L.ob({a: 3, b: 4}))', false);
test('L.jnp(/test/g)', false);
test('L.jnp(L.rx(/test/g))', false);
test('L.jnp(function (){})', false);
test('L.jnp(L.jn(function (){}))', true);

// mac and smac

test('L.nilp(L.sy("test"))', false);
test('L.nilp(L.st("nil"))', false);
test('L.nilp(L.sy("nil"))', true);

test('L.lisp(L.sy("nil"))', true);
test('L.lisp(L.cons(L.nu("34"), L.nu("52")))', true);

test('L.atmp(L.sy("nil"))', true);
test('L.atmp(L.cons(L.nu("34"), L.nu("52")))', false);

test('L.synp(L.sy("nil"))', true);
test('L.synp(L.st("test"))', true);
test('L.synp(L.nu("253"))', true);
test('L.synp(L.cons(L.nu("34"), L.nu("52")))', false);

test('L.fnp(L.jn(function (){}))', true);
// fnp of other function types

//// Comparison ////

test('L.is(L.sy("nil"), L.sy("nil"))', true);
test('L.is(L.st("nil"), L.st("nil"))', true);
test('L.is(L.sy("nil"), L.st("nil"))', false);
test('L.is(L.sy("nil"), L.sy("nill"))', false);
test('L.is(L.nil(), L.nil())', true);
test('L.is(L.nu("345"), L.nu("345"))', true);
test('L.is(L.nu("345"), L.nu("346"))', false);
test('L.is(L.rx(/test/g), L.rx(/test/g))', true);
test('L.is(L.cons(L.nu("34"), L.nu("52")), L.cons(L.nu("34"), L.nu("52")))',
       false);
test('var a = L.cons(L.nu("34"), L.nu("52")); L.is(a, a)',
       true);

test('L.isn(L.sy("nil"), L.sy("nil"))', false);
test('L.isn(L.nu("345"), L.nu("346"))', true);
test('L.isn(L.cons(L.nu("34"), L.nu("52")), L.cons(L.nu("34"), L.nu("52")))',
       true);

test('L.iso(L.sy("nil"), L.sy("nil"))', true);
test('L.iso(L.st("nil"), L.st("nil"))', true);
test('L.iso(L.sy("nil"), L.st("nil"))', false);
test('L.iso(L.sy("nil"), L.sy("nill"))', false);
test('L.iso(L.nu("345"), L.nu("345"))', true);
test('L.iso(L.nu("345"), L.nu("346"))', false);
test('L.iso(L.rx(/test/g), L.rx(/test/g))', true);
test('L.iso(L.cons(L.nu("34"), L.nu("52")), L.cons(L.nu("34"), L.nu("52")))',
       true);
test('var a = L.cons(L.nu("34"), L.nu("52")); L.iso(a, a)',
       true);
test('L.iso(L.ob({a: 3, b: 4}), L.ob({a: 3, b: 4}))', true)
test('L.iso(L.ob({a: L.st("3"), b: L.st("4")}), L.ob({a: L.st("3"), b: L.st("4")}))', true)

test('L.inp(L.nu("345"), L.nu("34"), L.sy("test"), L.rx(/test/g), L.st("hey"))',
       false);
test('L.inp(L.nu("345"), L.nu("34"), L.sy("test"), L.rx(/test/g), L.nu("345"))',
       true);

test('var a = L.nil(); L.sta(a, 1, function (){return L.car(a);})', 1);
test('var a = L.nil(); L.sta(a, 1, function (){return L.car(a);}); L.nilp(a)',
       true);
test('var a = L.nil(); ' +
     'L.sta(a, 1, function (){' +
       'return L.sta(a, 2, function (){' +
         'return L.cadr(a);' +
       '});' +
     '})',
       1);

//// Display ////

test('L.dsj(L.nu("2353"))', "2353");
test('L.dsj(L.sy("test"))', "test");
//test('L.dsj(L.sy("te st"))', "|te st|");
test('L.dsj(L.st("test"))', "\"test\"");
test('L.dsj(L.st("tes\\\"t"))', "\"tes\\\"t\"");
test('L.dsj(L.lis(L.nu("1"), L.nu("2"), L.nu("3")))', "(1 2 3)");
test('L.dsj(L.cons(L.nu("1"), L.nu("2")))', "(1 . 2)");
test('L.dsj(L.lisd(L.nu("1"), L.nu("2"), L.nu("3")))', "(1 2 . 3)");
test('L.dsj(L.lis(L.sy("qt"), L.sy("test")))', "'test");
test('L.dsj(L.lis(L.sy("uqs"), L.sy("test")))', ",@test");
test('L.dsj(L.ar([L.nu("1"), L.nu("2"), L.nu("3")]))', "#[1 2 3]");
test('L.dsj(L.ob({a: L.nu("1"), b: L.nu("2")}))', "{a 1 b 2}");
test('L.dsj(L.rx(/test\\//g))', "/test\\//");
test('L.dsj(L.rx(/test"\\//g))', "/test\"\\//");
test('L.dsj(L.jn(L.nilp))', "<jn nilp(a)>");
test('L.dsj(L.mkdat("test", L.nu("2")))', "<test {data 2}>");
test('L.dsj("test")', "<js \"test\">");

// test dsj fn types

test('L.typ(L.dsp(L.lis(L.nu("1"), L.nu("2"), L.nu("3"))))', "str");
test('L.dat(L.dsp(L.lis(L.nu("1"), L.nu("2"), L.nu("3"))))', "(1 2 3)");

//// Output ////

test('var d = 0; L.ofn(function (a){d = a;}); L.ou("test"); d',
       "test");
test('var d = 0; L.ofn(function (a){d = a;}); L.out(L.st("test")); L.typ(d)',
       "str");
test('var d = 0; L.ofn(function (a){d = a;}); L.out(L.st("test")); L.dat(d)',
       "test\n");
test('var d = 0; L.ofn(function (a){d = a;}); ' +
     'L.pr(L.st("test $1 $2 $3"), L.nu("23"), L.st("43"), L.nil()); L.typ(d)',
       "str");
test('var d = 0; L.ofn(function (a){d = a;}); ' +
     'L.pr(L.st("test $1 $2 $3"), L.nu("23"), L.st("43"), L.nil()); L.dat(d)',
       "test 23 \"43\" nil");

//// Converters ////

test('L.typ(L.sym(L.sy("test")))', "sym");
test('L.dat(L.sym(L.sy("test")))', "test");
test('L.typ(L.sym(L.sy("nil")))', "sym");
test('L.dat(L.sym(L.sy("nil")))', "nil");
test('L.typ(L.sym(L.nu("235")))', "sym");
test('L.dat(L.sym(L.nu("235")))', "235");
test('L.typ(L.sym(L.st("235")))', "sym");
test('L.dat(L.sym(L.st("235")))', "235");
test('L.typ(L.sym(L.lis(L.nu("1"), L.nu("2"))))', "sym");
test('L.dat(L.sym(L.lis(L.nu("1"), L.nu("2"))))', "(1 2)");

test('L.typ(L.str1(L.sy("test")))', "str");
test('L.dat(L.str1(L.sy("test")))', "test");
test('L.typ(L.str1(L.sy("nil")))', "str");
test('L.dat(L.str1(L.sy("nil")))', "");
test('L.typ(L.str1(L.nu("235")))', "str");
test('L.dat(L.str1(L.nu("235")))', "235");
test('L.typ(L.str1(L.st("235")))', "str");
test('L.dat(L.str1(L.st("235")))', "235");
test('L.typ(L.str1(L.st("nil")))', "str");
test('L.dat(L.str1(L.st("nil")))', "nil");
test('L.typ(L.str1(L.lis(L.nu("1"), L.nu("2"))))', "str");
test('L.dat(L.str1(L.lis(L.nu("1"), L.nu("2"))))', "(1 2)");

test('L.typ(L.str(L.sy("test"), L.sy("nil"), L.nu("34")))', "str");
test('L.dat(L.str(L.sy("test"), L.sy("nil"), L.nu("34")))', "test34");

test('L.typ(L.num(L.sy("test")))', "num");
test('L.dat(L.num(L.sy("test")))', "0");
test('L.typ(L.num(L.sy("nil")))', "num");
test('L.dat(L.num(L.sy("nil")))', "0");
test('L.typ(L.num(L.nu("235")))', "num");
test('L.dat(L.num(L.nu("235")))', "235");
test('L.typ(L.num(L.st("235")))', "num");
test('L.dat(L.num(L.st("235")))', "235");
test('L.typ(L.num(L.st("2test")))', "num");
test('L.dat(L.num(L.st("2test")))', "2");
test('L.typ(L.num(L.st("hey")))', "num");
test('L.dat(L.num(L.st("hey")))', "0");
test('L.typ(L.num(L.st("-2test")))', "num");
test('L.dat(L.num(L.st("-2test")))', "-2");
test('L.typ(L.num(L.st("-1")))', "num");
test('L.dat(L.num(L.st("-1")))', "-1");
test('L.typ(L.num(L.lis(L.nu("1"), L.nu("2"))))', "num");
test('L.dat(L.num(L.lis(L.nu("1"), L.nu("2"))))', "0");

//test('L.tfn()');

test('L.typ(L.tarr(L.lis(1, 2, 3)))', "arr");
test('L.dat(L.tarr(L.lis(1, 2, 3)))', [1, 2, 3], $.iso);
test('var a = L.arr(1, 2, 3); L.tarr(a) === a', true);
test('var a = L.arr(L.st("t"), L.st("e"), L.st("s"), L.st("t")); ' +
     'L.iso(a, L.tarr(L.st("test")))',
     true);
test('var a = L.arr(L.sy("t"), L.sy("e"), L.sy("s"), L.sy("t")); ' +
     'L.iso(a, L.tarr(L.sy("test")))',
     true);
test('var a = L.arr(L.nu("5"), L.nu("3"), L.nu("7"), L.nu("3")); ' +
     'L.iso(a, L.tarr(L.nu("5373")))',
     true);
// test for tarr(obj)

test('L.iso(L.tlis(L.arr(1, 2, 3)), L.lis(1, 2, 3))', true);
test('var a = L.lis(1, 2, 3); L.tlis(a) === a', true);
test('var a = L.lis(L.st("t"), L.st("e"), L.st("s"), L.st("t")); ' +
     'L.iso(a, L.tlis(L.st("test")))',
     true);
test('var a = L.lis(L.sy("t"), L.sy("e"), L.sy("s"), L.sy("t")); ' +
     'L.iso(a, L.tlis(L.sy("test")))',
     true);
test('var a = L.lis(L.nu("5"), L.nu("3"), L.nu("7"), L.nu("3")); ' +
     'L.iso(a, L.tlis(L.nu("5373")))',
     true);
// test for tlis(obj)

// test tobj(lis) and tobj(arr)
test('var a = L.ob({a: 3, b: 4}); L.tobj(a) === a', true);
test('var a = L.ob({0: L.st("t"), 1: L.st("e"), 2: L.st("s"), 3: L.st("t")});' +
     'L.iso(a, L.tobj(L.st("test")))',
     true);
test('var a = L.ob({0: L.sy("t"), 1: L.sy("e"), 2: L.sy("s"), 3: L.sy("t")});' +
     'L.iso(a, L.tobj(L.sy("test")))',
     true);
test('var a = L.ob({0: L.nu("5"), 1: L.nu("3"), 2: L.nu("7"), 3: L.nu("3")});' +
     'L.iso(a, L.tobj(L.nu("5373")))',
     true);

test('L.jarr(L.lis(1, 2, 3))', [1, 2, 3], $.iso);
test('L.jarr(L.arr(1, 2, 3))', [1, 2, 3], $.iso);

test('L.jnum(L.nu("34"))', 34);
test('L.jnum(L.st("34"))', 34);
test('L.jnum(L.lis(L.nu("34")))', 0);

test('L.is(L.lnum(34), L.nu("34"))', true);
test('L.is(L.lnum("34"), L.nu("34"))', true);
test('L.is(L.lnum([34]), L.nu("0"))', true);

test('L.jmat(L.sy("test"))', "test");
test('L.jmat(L.sy("nil"))', "");
test('L.jmat(L.nu("253"))', "253");
test('var a = L.rx(/test/g); L.jmat(a) === L.dat(a)', true);

test('L.typ(L.lbn(L.nilp))', "jn");
test('L.typ(L.dat(L.lbn(L.nilp))(L.nil()))', "sym");
test('L.dat(L.dat(L.lbn(L.nilp))(L.nil()))', "t");
test('L.typ(L.dat(L.lbn(L.nilp))(L.sy("hey")))', "sym");
test('L.dat(L.dat(L.lbn(L.nilp))(L.sy("hey")))', "nil");
test('L.typ(L.dat(L.lbn(L.nilp))(L.nu("0")))', "sym");
test('L.dat(L.dat(L.lbn(L.nilp))(L.nu("0")))', "nil");

test('var a = function (a){return a;}; L.tjn(L.jn(a)) === a', true);
// test tjn of other fn types

// if given a js fn instead of a lisp fn,
//   checks whether arg is equal to the js fn
test('L.jbn(L.nilp)(L.nil())', false);
test('L.jbn(L.nilp)(L.st("nil"))', false);
test('L.jbn(L.nilp)(L.nilp)', true);

// everything is true if return of input function outputs
//   a js bool instead of the required lisp bool
test('L.jbn(L.jn(L.nilp))(L.nil())', true);
test('L.jbn(L.jn(L.nilp))(L.st("hey"))', true);
test('L.jbn(L.jn(L.nilp))(L.sy("hey"))', true);
test('L.jbn(L.jn(L.nilp))(L.lis(1, 2, 3))', true);

test('L.jbn(L.lbn(L.nilp))(L.nil())', true);
test('L.jbn(L.lbn(L.nilp))(L.st("hey"))', false);
test('L.jbn(L.lbn(L.nilp))(L.sy("hey"))', false);
test('L.jbn(L.lbn(L.nilp))(L.lis(1, 2, 3))', false);
test('L.jbn(L.lbn(L.nilp))(L.st("nil"))', false);
test('L.jbn(L.lbn(function (a){return a < 5;}))(3)', true);
test('L.jbn(L.lbn(function (a){return a < 5;}))(5)', false);
test('L.jbn(L.lbn(function (a){return a < 5;}))(10)', false);

//// Sequence ////

//// Items ////

test('L.ref1(L.arr(1, 2, 3), L.nu("0"))', 1);
test('L.ref1(L.lis(1, 2, 3), L.nu("0"))', 1);
test('L.typ(L.ref1(L.st("123"), L.nu("0")))', "str");
test('L.dat(L.ref1(L.st("123"), L.nu("0")))', "1");
test('L.ref1(L.arr(1, 2, 3), L.nu("2"))', 3);
test('L.ref1(L.lis(1, 2, 3), L.nu("2"))', 3);
test('L.typ(L.ref1(L.sy("123"), L.nu("2")))', "sym");
test('L.dat(L.ref1(L.sy("123"), L.nu("2")))', "3");
test('L.ref1(L.ob({a: 3, b: 4}), L.sy("a"))', 3);
test('L.ref1(L.ob({a: 3, b: 4}), L.st("b"))', 4);
test('L.ref1(L.ob({a: 3, b: 4, 4: 1}), L.nu("4"))', 1);
test('L.typ(L.ref1(L.sy("nil"), L.nu("2")))', "sym");
test('L.dat(L.ref1(L.sy("nil"), L.nu("2")))', "nil");
test('L.ref1(L.ob({a: 3, b: 4}), L.st("b"))', 4);
test('L.ref1(L.ob({a: 3, b: 4, 4: 1}), L.nu("4"))', 1);

test('L.ref(L.arr(L.arr(1, 2), L.arr(3, 4)), L.nu("0"), L.nu("1"))', 2);
test('L.typ(L.ref(L.arr(L.st("test"), L.arr(3, 4)), L.nu("0"), L.nu("1")))',
       "str");
test('L.dat(L.ref(L.arr(L.st("test"), L.arr(3, 4)), L.nu("0"), L.nu("1")))',
       "e");

test('var a = L.lis(1, 2, 3); L.set(a, L.nu("2"), 10); L.ref(a, L.nu("2"))',
       10);
test('var a = L.arr(1, 2, 3); L.set(a, L.nu("2"), 10); L.ref(a, L.nu("2"))',
       10);
test('var a = L.ob({a: 1, b: 2, c: 3});' +
     'L.set(a, L.sy("a"), 10); L.ref(a, L.st("a"))',
       10);

test('L.fst(L.lis(1, 2, 3))', 1);
test('L.las(L.lis(1, 2, 3))', 3);
test('L.typ(L.fst(L.st("testing")))', "str");
test('L.dat(L.fst(L.st("testing")))', "t");
test('L.typ(L.las(L.st("testing")))', "str");
test('L.dat(L.las(L.st("testing")))', "g");

//// Apply ////

// need tests for objects

test('L.iso(L.apl(L.jn(L.lis), L.arr(1, 2, 3)), L.lis(1, 2, 3))', true);
test('L.iso(L.apl(L.jn(L.arr), L.lis(1, 2, 3)), L.arr(1, 2, 3))', true);

test('L.iso(L.map(L.jn(function (a){return a+3;}), L.lis(1, 2, 3)),' + 
           'L.lis(4, 5, 6))',
       true);
test('L.dat(L.map(L.jn(function (a){return a+3;}), L.arr(1, 2, 3)))',
       [4, 5, 6], $.iso);
test('L.dat(L.map(L.jn(function (a){return a+3;}), L.ob({a: 1, b: 2})))',
       {a: 4, b: 5}, $.iso);


test('L.typ(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("5"))))', "num");
test('L.dat(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("5"))))', "-1");
test('L.typ(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("1"))))', "num");
test('L.dat(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("1"))))', "2");
test('L.typ(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("3")), ' +
                 'L.nu("1")))',
       "num");
test('L.dat(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("3")), ' +
                 'L.nu("1")))',
       "-1");
test('L.typ(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("1")), ' +
                 'L.nu("1")))',
       "num");
test('L.dat(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("1")), ' +
                 'L.nu("1")))',
       "2");

test('L.typ(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("5"))))', "num");
test('L.dat(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("5"))))', "-1");
test('L.typ(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("1"))))', "num");
test('L.dat(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("1"))))', "2");
test('L.typ(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("3")), ' +
                 'L.nu("1")))',
       "num");
test('L.dat(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("3")), ' +
                 'L.nu("1")))',
       "-1");
test('L.typ(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("1")), ' +
                 'L.nu("1")))',
       "num");
test('L.dat(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("1")), ' +
                 'L.nu("1")))',
       "2");

test('L.typ(L.pos(L.nu("1"), L.st("325")))', "num");
test('L.dat(L.pos(L.nu("1"), L.st("325")))', "-1");
test('L.typ(L.pos(L.nu("1"), L.st("321")))', "num");
test('L.dat(L.pos(L.nu("1"), L.st("321")))', "2");
test('L.typ(L.pos(L.nu("1"), L.st("123"), L.nu("1")))', "num");
test('L.dat(L.pos(L.nu("1"), L.st("123"), L.nu("1")))', "-1");
test('L.typ(L.pos(L.nu("1"), L.st("121"), L.nu("1")))', "num");
test('L.dat(L.pos(L.nu("1"), L.st("121"), L.nu("1")))', "2");

test('L.has(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("5")))', false);
test('L.has(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("1")))', true);
test('L.has(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("3")))', true);
test('L.has(L.nu("1"), L.lis(L.st("1"), L.nu("2"), L.sy("t")))', false);
test('L.has(L.nu("1"), L.lis(L.nu("1"), L.nu("1"), L.sy("t")))', true);

test('L.has(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("5")))', false);
test('L.has(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("1")))', true);
test('L.has(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("3")))', true);
test('L.has(L.nu("1"), L.arr(L.st("1"), L.nu("2"), L.sy("t")))', false);
test('L.has(L.nu("1"), L.arr(L.nu("1"), L.nu("1"), L.sy("t")))', true);

test('L.has(L.nu("1"), L.st("325"))', false);
test('L.has(L.nu("1"), L.st("321"))', true);
test('L.has(L.nu("1"), L.st("123"))', true);
test('L.has(L.nu("1"), L.st("12t"))', true);
test('L.has(L.nu("1"), L.st("11t"))', true);

test('L.has(L.nu("1"), L.nil())', false);
test('L.has(L.nil(), L.nil())', false);


test('L.iso(L.rpl(1, 10, L.lis(1, 2, 3, 1, 4, 5)), L.lis(10, 2, 3, 10, 4, 5))',
       true);
test('L.iso(L.rpl(1, 10, L.arr(1, 2, 3, 1, 4, 5)), L.arr(10, 2, 3, 10, 4, 5))',
       true);
test('L.typ(L.rpl(L.st("t"), L.nu("3"), L.st("test a b c e s t")))',
       "str");
test('L.dat(L.rpl(L.st("t"), L.nu("3"), L.st("test a b c e s t")))',
       "3es3 a b c e s 3");
test('L.typ(L.rpl(L.nu("4"), L.st("10"), L.sy("test 3 4 5 e 4 t")))',
       "sym");
test('L.typ(L.rpl(L.nu("4"), L.st("10"), L.sy("nil")))', "sym");
test('L.dat(L.rpl(L.sy("n"), L.st("10"), L.sy("nil")))', "nil");
test('L.iso(L.rpl(L.nu("4"), L.st("10"), ' +
                 'L.ob({a: L.nu("4"), ' +
                       'b: L.st("4"), ' +
                       'c: L.arr(L.nu("4"))})), ' +
           'L.ob({a: L.st("10"), ' +
                 'b: L.st("4"), ' +
                 'c: L.arr(L.nu("4"))}))', 
       true);
test('L.iso(L.rpl(L.lbn(function (a){return a < 5;}), 10, ' +
                 'L.lis(1, 2, 9, 3, 6, 1, 4, 5)), ' +
           'L.lis(10, 10, 9, 10, 6, 10, 10, 5))',
       true);


//// Whole ////

test('L.typ(L.len(L.lis(1, 2, 3)))', "num");
test('L.dat(L.len(L.lis(1, 2, 3)))', "3");
test('L.typ(L.len(L.arr(1, 2, 3)))', "num");
test('L.dat(L.len(L.arr(1, 2, 3)))', "3");
test('L.typ(L.len(L.st("12345")))', "num");
test('L.dat(L.len(L.st("12345")))', "5");
test('L.typ(L.len(L.ob({a: 3, b: 4})))', "num");
test('L.dat(L.len(L.ob({a: 3, b: 4})))', "2");
test('L.typ(L.len(L.nil()))', "num");
test('L.dat(L.len(L.nil()))', "0");

test('L.iso(L.cpy(L.lis(1, 2, 3)), L.lis(1, 2, 3))', true);
test('L.iso(L.cpy(L.arr(1, 2, 3)), L.arr(1, 2, 3))', true);
test('L.iso(L.cpy(L.ob({a: 3, b: 4})), L.ob({a: 3, b: 4}))', true);
test('var a = L.lis(1, 2, 3); L.cpy(a) === a', false);
test('var a = L.arr(1, 2, 3); L.cpy(a) === a', false);
test('var a = L.ob({a: 3, b: 4}); L.cpy(a) === a', false);
test('var a = L.cons(1, 2); var b = L.cpy(a);' +
     'L.scar(b, 3); L.car(a)',
     1);
test('var a = L.arr(1, 2); var b = L.cpy(a);' +
     'L.set(b, L.nu("1"), 10); L.ref(a, L.nu("1"))',
     2);
test('var a = L.mkdat("test", "hey"); var b = L.cpy(a);' +
     'L.sdat(b, "what"); L.dat(a)',
     "hey");
test('var a = L.mkdat("test", "hey"); var b = L.cpy(a);' +
     'L.tag(b, "type", "obj"); L.typ(a)',
     "test");

test('L.iso(L.rev(L.lis(1, 2, 3)), L.lis(3, 2, 1))', true);
test('var a = L.lis(1, 2, 3); L.rev(a); L.iso(a, L.lis(1, 2, 3))', true);
test('L.typ(L.rev(L.arr(1, 2, 3)))', "arr");
test('L.dat(L.rev(L.arr(1, 2, 3)))', [3, 2, 1], $.iso);
test('L.typ(L.rev(L.arr()))', "arr");
test('L.dat(L.rev(L.arr()))', [], $.iso);
test('L.typ(L.rev(L.st("123")))', "str");
test('L.dat(L.rev(L.st("123")))', "321");
test('L.typ(L.rev(L.nu("123")))', "num");
test('L.dat(L.rev(L.nu("123")))', "321");
test('L.typ(L.rev(L.sy("hey")))', "sym");
test('L.dat(L.rev(L.sy("hey")))', "yeh");
test('L.typ(L.rev(L.sy("nil")))', "sym");
test('L.dat(L.rev(L.sy("nil")))', "nil");
test('L.typ(L.rev(L.st("")))', "str");
test('L.dat(L.rev(L.st("")))', "");
test('L.typ(L.rev(L.nu("")))', "num");
test('L.dat(L.rev(L.nu("")))', "");
test('L.typ(L.rev(L.sy("")))', "sym");
test('L.dat(L.rev(L.sy("")))', "");

test('L.iso(L.revlis(L.lis(1, 2, 3), L.lis(4, 5, 6)), L.lis(3, 2, 1, 4, 5, 6))',
       true);
test('L.iso(L.revlis(L.lis(1, 2, 3)), L.lis(3, 2, 1))', true);
test('L.iso(L.revlis(L.lis(1, 2, 3), L.st("hey")),' +
           'L.lisd(3, 2, 1, L.st("hey")))',
       true);

//// Group ////

test('L.dsj(L.spl(L.st("testegest"), L.sy("t")))', "(\"\" \"es\" \"eges\" \"\")");
test('L.iso(L.spl(L.lis(1, 2, 3, 4, 1, 2, 5), ' +
                 'L.lbn(function (a){return a === 1;})), ' +
           'L.lis(L.nil(), L.lis(2, 3, 4), L.lis(2, 5)))',
        true);
test('L.iso(L.spl(L.arr(1, 2, 3, 4, 1, 2, 5), ' +
                 'L.lbn(function (a){return a === 1;})), ' +
           'L.arr(L.arr(), L.arr(2, 3, 4), L.arr(2, 5)))',
        true);
test('L.dsj(L.spl(L.sy("testegest"), L.st("t")))', "( es eges )");
test('L.dsj(L.spl(L.nu("1523634"), L.st("3")))', "(152 6 4)");
test('L.dsj(L.spl(L.nu("1523634")))', "(1 5 2 3 6 3 4)");
// test spl x = udf for cons and arr

//// Join ////

test('L.typ(L.joi(L.lis(L.nu("1"), L.st("3"), L.sy("t"), L.sy("nil"))))',
       "str");
test('L.dat(L.joi(L.lis(L.nu("1"), L.st("3"), L.sy("t"), L.sy("nil"))))',
       "13t");
test('L.typ(L.joi(L.lis(L.nu("1"), L.st("3"), L.sy("t"), L.sy("nil")), ' +
                 'L.sy("hey")))',
       "str");
test('L.dat(L.joi(L.arr(L.nu("1"), L.st("3"), L.sy("t"), L.sy("nil")), ' +
                 'L.sy("hey")))',
       "1hey3heythey");
test('L.typ(L.joi(L.arr(L.nu("1"), L.st("3"), L.sy("t"), L.sy("nil"))))',
       "str");
test('L.dat(L.joi(L.arr(L.nu("1"), L.st("3"), L.sy("t"), L.sy("nil"))))',
       "13t");
test('L.typ(L.joi(L.arr(L.nu("1"), L.st("3"), L.sy("t"), L.sy("nil")), ' +
                 'L.sy("hey")))',
       "str");
test('L.dat(L.joi(L.arr(L.nu("1"), L.st("3"), L.sy("t"), L.sy("nil")), ' +
                 'L.sy("hey")))',
       "1hey3heythey");

test('L.nilp(L.app())', true);
test('L.iso(L.app2(L.lis(1, 2, 3, 4), L.lis(1, 2, 3, 4)), ' +
           'L.lis(1, 2, 3, 4, 1, 2, 3, 4))',
       true);
test('L.iso(L.app2(L.lis(1, 2, 3, 4), L.arr(1, 2, 3, 4)), ' +
           'L.lis(1, 2, 3, 4, 1, 2, 3, 4))',
       true);
test('L.iso(L.app2(L.arr(1, 2, 3, 4), L.lis(1, 2, 3, 4)), ' +
           'L.arr(1, 2, 3, 4, 1, 2, 3, 4))',
       true);
test('L.iso(L.app2(L.arr(1, 2, 3, 4), L.arr(1, 2, 3, 4)), ' +
           'L.arr(1, 2, 3, 4, 1, 2, 3, 4))',
       true);
test('L.typ(L.app(L.st("test"), L.sy("hey"), L.nu("0")))', "str");
test('L.dat(L.app(L.st("test"), L.sy("hey"), L.nu("0")))', "testhey0");
test('L.typ(L.app(L.sy("test"), L.st("hey"), L.nu("0")))', "sym");
test('L.dat(L.app(L.sy("test"), L.sy("hey"), L.nu("0")))', "testhey0");
test('L.typ(L.app(L.nu("53"), L.st("hey"), L.sy("0")))', "num");
test('L.dat(L.app(L.nu("53"), L.st("hey"), L.sy("0")))', "5300");
test('L.typ(L.app(L.ob({a: 3, b: 4}), L.ob({b: 5, c: 6})))', "obj");
test('L.dat(L.app(L.ob({a: 3, b: 4}), L.ob({b: 5, c: 6})))',
       {a: 3, b: 5, c: 6}, $.iso);

//// Reduce ////

test('L.iso(L.fold(L.jn(L.cons), L.lis(1, 2, 3, 4)), ' +
           'L.cons(L.cons(L.cons(1, 2), 3), 4))',
       true);
test('L.iso(L.fold(L.jn(L.cons), L.nil(), L.lis(1, 2, 3, 4)), ' +
           'L.cons(L.cons(L.cons(L.cons(L.nil(), 1), 2), 3), 4))',
       true);
test('L.iso(L.fold(L.jn(function (l, a){return L.cons(a, l);}), ' +
                  'L.lis(1, 2, 3, 4)), ' +
           'L.cons(4, L.cons(3, L.cons(2, 1))))', 
       true);
test('L.iso(L.fold(L.jn(function (l, a){return L.cons(a, l);}), ' +
                  'L.nil(), L.lis(1, 2, 3, 4)), ' +
           'L.lis(4, 3, 2, 1))',
       true);
test('L.fold(L.jn(function (l, a){return l + a;}), ' +
            '0, L.arr(1, 2, 3, 4))',
       10);
test('L.fold(L.jn(function (l, a){return Math.pow(l, a);}), ' +
            '2, L.arr(1, 2, 3, 4))',
       16777216);

test('L.iso(L.foldi(L.jn(function (l, a, i){' +
                          'return L.cons(L.lis(i, a), l);' +
                        '}), ' +
                   'L.nil(), L.lis(1, 2, 3, 4)), ' +
           'L.lis(L.lis(L.nu("3"), 4), L.lis(L.nu("2"), 3), ' +
                 'L.lis(L.nu("1"), 2), L.lis(L.nu("0"), 1)))',
       true);
test('L.iso(L.foldi(L.jn(function (l, a, i){' +
                          'return L.cons(L.lis(i, a), l);' +
                        '}), ' +
                   'L.nil(), L.arr(1, 2, 3, 4)), ' +
           'L.lis(L.lis(L.nu("3"), 4), L.lis(L.nu("2"), 3), ' +
                 'L.lis(L.nu("1"), 2), L.lis(L.nu("0"), 1)))',
       true);
test('L.iso(L.foldr(L.jn(L.cons), L.nil(), L.lis(1, 2, 3, 4)), ' +
           'L.lis(1, 2, 3, 4))',
       true);
test('L.foldr(L.jn(Math.pow), 1, L.arr(4, 2, 3))',
       65536);
test('L.iso(L.foldri(L.jn(function (a, l, i){' +
                          'return L.cons(L.lis(i, a), l);' +
                        '}), ' +
                    'L.nil(), L.lis(1, 2, 3, 4)), ' +
           'L.lis(L.lis(L.nu("0"), 1), L.lis(L.nu("1"), 2), ' +
                 'L.lis(L.nu("2"), 3), L.lis(L.nu("3"), 4)))',
       true);
test('L.iso(L.foldri(L.jn(function (a, l, i){' +
                          'return L.cons(L.lis(i, a), l);' +
                        '}), ' +
                    'L.nil(), L.arr(1, 2, 3, 4)), ' +
           'L.lis(L.lis(L.nu("0"), 1), L.lis(L.nu("1"), 2), ' +
                 'L.lis(L.nu("2"), 3), L.lis(L.nu("3"), 4)))',
       true);

//// Array ////

test('var a = L.nil(); L.psh(4, a) === a', true);
test('var a = L.nil(); L.psh(4, a); L.iso(a, L.lis(4))', true);
test('var a = L.lis(1, 2, 3); L.psh(4, a) === a', true);
test('var a = L.lis(1, 2, 3); L.psh(4, a); L.iso(a, L.lis(4, 1, 2, 3))', true);
test('var a = L.arr(1, 2, 3); L.psh(4, a) === a', true);
test('var a = L.arr(1, 2, 3); L.psh(4, a); L.iso(a, L.arr(1, 2, 3, 4))', true);

test('var a = L.lis(1, 2, 3); L.pop(a)', 1);
test('var a = L.lis(1, 2, 3); L.pop(a); L.iso(a, L.lis(2, 3))', true);
test('var a = L.arr(1, 2, 3); L.pop(a)', 3);
test('var a = L.arr(1, 2, 3); L.pop(a); L.iso(a, L.arr(1, 2))', true);

//// List ////

test('L.nth(L.nu("0"), L.lis(1, 2, 3))', 1);
test('L.nth(L.nu("2"), L.lis(1, 2, 3))', 3);
test('L.nilp(L.nth(L.nu("10"), L.lis(1, 2, 3)))', true);

test('var a = L.lis(1, 2, 3); L.ncdr(L.nu("0"), a) === a', true);
test('var a = L.cons(1, 2); var b = L.cons(10, L.cons(3, a)); ' +
     'L.ncdr(L.nu("2"), b) === a', true);
test('L.nilp(L.ncdr(L.nu("10"), L.lis(1, 2, 3)))', true);

test('L.iso(L.nrev(L.lis(1, 2, 3, 4)), L.lis(4, 3, 2, 1))', true);
test('var a = L.lis(1, 2, 3, 4); var b = L.lis(1, 2, 3, 4); ' +
     'L.nrev(a); L.iso(a, b)', false);
test('L.nilp(L.nrev(L.nil()))', true);


//// Number ////

test('L.typ(L.add())', "num");
test('L.dat(L.add())', "0");
test('L.typ(L.add(L.nu("1")))', "num");
test('L.dat(L.add(L.nu("1")))', "1");
test('L.typ(L.add(L.nu("1"), L.nu("2"), L.nu("3")))', "num");
test('L.dat(L.add(L.nu("1"), L.nu("2"), L.nu("3")))', "6");

test('L.typ(L.add1(L.nu("0")))', "num");
test('L.dat(L.add1(L.nu("0")))', "1");

test('L.typ(L.sub())', "num");
test('L.dat(L.sub())', "0");
test('L.typ(L.sub(L.nu("1")))', "num");
test('L.dat(L.sub(L.nu("1")))', "-1");
test('L.typ(L.sub(L.nu("1"), L.nu("2"), L.nu("3")))', "num");
test('L.dat(L.sub(L.nu("1"), L.nu("2"), L.nu("3")))', "-4");

test('L.typ(L.sub1(L.nu("0")))', "num");
test('L.dat(L.sub1(L.nu("0")))', "-1");

test('L.typ(L.mul())', "num");
test('L.dat(L.mul())', "1");
test('L.typ(L.mul(L.nu("2")))', "num");
test('L.dat(L.mul(L.nu("2")))', "2");
test('L.typ(L.mul(L.nu("2"), L.nu("3"), L.nu("4")))', "num");
test('L.dat(L.mul(L.nu("2"), L.nu("3"), L.nu("4")))', "24");

test('L.typ(L.div())', "num");
test('L.dat(L.div())', "1");
test('L.typ(L.div(L.nu("2")))', "num");
test('L.dat(L.div(L.nu("2")))', "0.5");
test('L.typ(L.div(L.nu("2"), L.nu("4"), L.nu("5")))', "num");
test('L.dat(L.div(L.nu("2"), L.nu("4"), L.nu("5")))', "0.1");


test('L.lt()', true);
test('L.lt(L.nu("1"))', true);
test('L.lt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4"))', true);
test('L.lt(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1"))', false);
test('L.lt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3"))', false);
test('L.lt(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1"))', false);
test('L.lt(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3"))', false);
test('L.lt(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4"))', false);
test('L.lt(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1"))', true);
test('L.lt(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4"))', true);
test('L.lt(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1"))', false);
test('L.lt(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4"))', false);
test('L.lt(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1"))', true);

test('L.gt()', true);
test('L.gt(L.nu("1"))', true);
test('L.gt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4"))', false);
test('L.gt(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1"))', true);
test('L.gt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3"))', false);
test('L.gt(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1"))', false);
test('L.gt(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3"))', false);
test('L.gt(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4"))', true);
test('L.gt(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1"))', false);
test('L.gt(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4"))', false);
test('L.gt(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1"))', true);
test('L.gt(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4"))', true);
test('L.gt(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1"))', false);

test('L.le()', true);
test('L.le(L.nu("1"))', true);
test('L.le(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4"))', true);
test('L.le(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1"))', false);
test('L.le(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3"))', true);
test('L.le(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1"))', false);
test('L.le(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3"))', true);
test('L.le(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4"))', false);
test('L.le(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1"))', true);
test('L.le(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4"))', true);
test('L.le(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1"))', false);
test('L.le(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4"))', false);
test('L.le(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1"))', true);

test('L.ge()', true);
test('L.ge(L.nu("1"))', true);
test('L.ge(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4"))', false);
test('L.ge(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1"))', true);
test('L.ge(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3"))', false);
test('L.ge(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1"))', true);
test('L.ge(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3"))', true);
test('L.ge(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4"))', true);
test('L.ge(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1"))', false);
test('L.ge(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4"))', false);
test('L.ge(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1"))', true);
test('L.ge(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4"))', true);
test('L.ge(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1"))', false);


//// String ////

test('L.typ(L.stf(L.st("test")))', "str");
test('L.dat(L.stf(L.st("test")))', "test");
test('L.typ(L.stf(L.sy("test")))', "str");
test('L.dat(L.stf(L.sy("test")))', "test");
test('L.typ(L.stf(L.st("test $1 $2 $3"), ' +
           'L.nu("34"), L.sy("t"), L.st("hey")))', "str");
test('L.dat(L.stf(L.st("test $1 $2 $3"), ' +
           'L.nu("34"), L.sy("t"), L.st("hey")))', "test 34 t \"hey\"");
test('L.typ(L.stf(L.sy("test $1 $2 $3"), ' +
           'L.nu("34"), L.sy("t"), L.st("hey")))', "str");
test('L.dat(L.stf(L.sy("test $1 $2 $3"), ' +
           'L.nu("34"), L.sy("t"), L.st("hey")))', "test 34 t \"hey\"");


//// Checkers ////

test('L.typ(L.chku(undefined))', "sym");
test('L.dat(L.chku(undefined))', "nil");
test('L.typ(L.chku(L.nil()))', "sym");
test('L.dat(L.chku(L.nil()))', "nil");
test('L.typ(L.chku(L.st("undefined")))', "str");
test('L.dat(L.chku(L.st("undefined")))', "undefined");

// everything except false is t
test('L.typ(L.chkb(false))', "sym");
test('L.dat(L.chkb(false))', "nil");
test('L.typ(L.chkb(true))', "sym");
test('L.dat(L.chkb(true))', "t");
test('L.typ(L.chkb(0))', "sym");
test('L.dat(L.chkb(0))', "t");
test('L.typ(L.chkb(null))', "sym");
test('L.dat(L.chkb(null))', "t");
test('L.typ(L.chkb(undefined))', "sym");
test('L.dat(L.chkb(undefined))', "t");

// should be same as above
test('L.typ(L.chrb(function (a){return a;})(false))', "sym");
test('L.dat(L.chrb(function (a){return a;})(false))', "nil");
test('L.typ(L.chrb(function (a){return a;})(true))', "sym");
test('L.dat(L.chrb(function (a){return a;})(true))', "t");
test('L.typ(L.chrb(function (a){return a;})(0))', "sym");
test('L.dat(L.chrb(function (a){return a;})(0))', "t");
test('L.typ(L.chrb(function (a){return a;})(null))', "sym");
test('L.dat(L.chrb(function (a){return a;})(null))', "t");
test('L.typ(L.chrb(function (a){return a;})(undefined))', "sym");
test('L.dat(L.chrb(function (a){return a;})(undefined))', "t");

test('L.bchk(L.nil())', false);
test('L.bchk(L.sy("t"))', true);
test('L.bchk(L.nu("0"))', true);
test('L.bchk(L.st("nil"))', true);
test('L.bchk(L.cons(1, 2))', true);

test('L.bchr(function (a){return a;})(L.nil())', false);
test('L.bchr(function (a){return a;})(L.sy("t"))', true);
test('L.bchr(function (a){return a;})(L.nu("0"))', true);
test('L.bchr(function (a){return a;})(L.st("nil"))', true);
test('L.bchr(function (a){return a;})(L.cons(1, 2))', true);


//// Parser ////

test('L.typ(L.prs1("(test . test test)"))', "ps");
test('L.dsj(L.gres(L.prs1("(test test)")))', "(test test)");
test('L.dsj(L.gres(L.prs1("(test . test test)")))', "(test . test test)");
test('L.dsj(L.gres(L.prs1("(. test)")))', "(. test)");

test('L.nilp(L.gres(L.plissec(")")))', true);
test('L.nilp(L.gres(L.plissec("]", "]")))', true);
test('L.iso(L.gres(L.plissec("test . test]", "]")), ' +
           'L.cons(L.sy("test"), L.sy("test")))',
       true);

test('L.iso(L.gres(L.psec("test test . test)")), ' +
           'L.lis(L.sy("test"), L.sy("test"), L.sy("."), L.sy("test")))',
       true);
test('L.nilp(L.gres(L.psec(")")))', true);

test('L.iso(L.gres(L.psecn("test test . test")), ' +
           'L.lis(L.sy("test"), L.sy("test"), L.sy("."), L.sy("test")))',
       true);
test('L.nilp(L.gres(L.psecn("")))', true);

test('L.dsj(L.gres(L.psecn("test test")))', "(test test)");
test('L.iso(L.gres(L.psecn("test test . test")), ' +
           'L.lis(L.sy("test"), L.sy("test"), L.sy("."), L.sy("test")))',
       true);
test('L.nilp(L.gres(L.psecn("")))', true);

test('L.dat(L.gres(L.prs1("/test/gi#|test|#")))', /test/gi, $.iso);

test('L.typ(L.car(L.gres(L.prs1("#[a b c]"))))', "sym");
test('L.dat(L.car(L.gres(L.prs1("#[a b c]"))))', "arr");
test('L.typ(L.car(L.gres(L.prs1("[a b c]"))))', "sym");
test('L.dat(L.car(L.gres(L.prs1("[a b c]"))))', "nfn");
test('L.typ(L.car(L.gres(L.prs1("{a b c}"))))', "sym");
test('L.dat(L.car(L.gres(L.prs1("{a b c}"))))', "obj");
test('L.typ(L.car(L.gres(L.prs1("#(a b c)"))))', "sym");
test('L.dat(L.car(L.gres(L.prs1("#(a b c)"))))', "#");

test('L.iso(L.prs("\'\'"), L.lis(L.sy("qt"), L.sy("\'")))', true);

test('L.iso(L.prs("({})"), L.lis(L.lis(L.sy("obj"))))', true);

runtests();

/*L.jn("*out*", function (a){
  ou(L.rp(L.str(a)));
  return [];
});

//sefn(cmb(out, dmp));

L.evlf("lib/lisp-compile-basic.lisp");

L.evlf("lisp-test.lisp");

run();*/
