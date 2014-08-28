;;;; Lisp Test Suite ;;;;

(var *tests* #[])

(mac test (a x)
  `(psh (lis ',a (tfn ,x) ',x) *tests*))

(var *allpass* t)
(def runtests ()
  (= *allpass* t)
  (prn "Running tests...")
  (prn)
  (each (a x st) *tests*
    (let res (evl a)
      (when (no (x res))
        (= *allpass* nil)
        (prn "Failed: $1 -> $2 != $3" a res st))))
  (if *allpass* (prn "Passed all tests!")))

(bytwo tests test)

;;; Tests ;;;

(tests
  
  ((fn ((o a 3)) a) nil)    nil
  ((fn ((o a 3)) a) 5)      5
  
  `(#g ,`a #g)              [is (_ 0) (_ 2)]
  
  ((fn (a) a))              nil
  ((fn (a b c) c))          nil
  ((fn ((a b)) b))          nil
  
  (proc (lns "test" "" "" "test"))
    "test\n\n\ntest"
    
  (proc (flns "test" "" "" "test"))
    "test\ntest"
  
  (proc (ind 2 "test" (lvl "test" "hey")))
    "  test\n  test\n  hey"
  
  (proc (lin "test" (lvl "test" "hey" (lvl "test"))))
    "testtest\n    hey\n    test"
  
  (proc (ind 2 (lin "test" (lvl "test" "hey"))))
    "  testtest\n      hey"
  
  ;(err runtests "Testing")  4
  
)


