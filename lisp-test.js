/***** Lisp Testing Devel *****/

/* require tools >= 3.0 */
/* require ajax */
/* require prec-math */
/* require lisp-tools */
/* require lisp-parse */
/* require lisp-exec */
/* require lisp-core */

var udf = undefined;

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
function test(a, x){
  return psh([a, tfn(x), x], tests);
}

var allpass = true;
var fail = false;
function runtests(){
  allpass = true;
  out("Running tests...");
  out("");
  var a, x, st, res;
  for (var i = 0; i < tests.length; i++){
    a = tests[i][0];
    x = tests[i][1];
    st = tests[i][2];
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
      out(stf("Failed: $1 -> $2 != $3", a, res, st));
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

//// Tests ////

test('123', 123);

test('L.typ(L.sy("test"))', "sym");
test('L.dat(L.sy("test"))', "test");

test('L.typ(L.car(L.cons(L.sy("test"), L.nu("253"))))', "sym");
test('L.dat(L.car(L.cons(L.sy("test"), L.nu("253"))))', "test");

test('L.typ(L.cdr(L.cons(L.sy("test"), L.nu("253"))))', "num");
test('L.dat(L.cdr(L.cons(L.sy("test"), L.nu("253"))))', "253");

test('var a = L.mk("test", {a: 3, b: 4, type: "hey"}); L.typ(a)', "test");
test('var a = L.mk("test", {a: 3, b: 4, type: "hey"}); L.rep(a, "a")', 3);
test('var a = L.mk("test", {a: 3, b: 4, type: "hey"}); L.tag(a, "type", "hey"); L.typ(a)', "hey");
test('var a = L.mk("test", {a: 3, b: 4, type: "hey"}); L.det(a, "type"); L.typ(a)', udf);
test('var a = L.mk("test", {a: 3, b: 4, type: "hey"}); L.det(a, "type"); L.tagp(a)', false);

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

test('L.is(L.sy("nil"), L.sy("nil"))', true);
test('L.is(L.st("nil"), L.st("nil"))', true);
test('L.is(L.sy("nil"), L.st("nil"))', false);
test('L.is(L.sy("nil"), L.sy("nill"))', false);
test('L.is(L.nu("345"), L.nu("345"))', true);
test('L.is(L.nu("345"), L.nu("346"))', false);
test('L.is(L.rx(/test/g), L.rx(/test/g))', true);
test('L.is(L.cons(L.nu("34"), L.nu("52")), L.cons(L.nu("34"), L.nu("52")))',
       false);
test('var a = L.cons(L.nu("34"), L.nu("52")); L.is(a, a)',
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

test('L.inp(L.nu("345"), L.nu("34"), L.sy("test"), L.rx(/test/g), L.st("hey"))',
       false);
test('L.inp(L.nu("345"), L.nu("34"), L.sy("test"), L.rx(/test/g), L.nu("345"))',
       true);


runtests();

/*L.jn("*out*", function (a){
  ou(L.rp(L.str(a)));
  return [];
});

//sefn(cmb(out, dmp));

L.evlf("lib/lisp-compile-basic.lisp");

L.evlf("lisp-test.lisp");

run();*/
