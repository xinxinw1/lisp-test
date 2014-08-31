/***** Lisp Testing Devel *****/

/* require tools >= 3.0 */
/* require ajax */
/* require prec-math */
/* require lisp-tools */
/* require lisp-parse */
/* require lisp-exec */
/* require lisp-core */

var al = $.al;
var dmp = $.dmp;

var rpl = $.rpl;

var bot = $.bot;
var atth = $.atth;
var cmb = $.cmb;
var sefn = $.sefn;

var res = $("results");
var pg = $("page");

/*function run(){
  try {
    L.calsym("runtests");
  } catch (e){
    out(dmp(e));
  }
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

L.jn("*out*", function (a){
  ou(L.rp(L.str(a)));
  return [];
});

//sefn(cmb(out, dmp));

L.evlf("lib/lisp-compile-basic.lisp");

L.evlf("lisp-test.lisp");

run();*/
