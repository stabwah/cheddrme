$(function() {
  var $yeti = $('#yeti');
  var $transitionList = $('#transitionList');

  $('#transitioner').click(function() {
    MotionUI.animateIn($yeti, $transitionList.val());
  });
});
