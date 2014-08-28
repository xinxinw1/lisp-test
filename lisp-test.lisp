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
    (when (no (x (evl a)))
      (= *allpass* nil)
      (prn "Failed: $1 -> $2" a st)))
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
  
  ;(err runtests "Testing")  4
  
)


