(function($) {
  $(document).ready(function() {

      $('[href="#content-start"]').keydown(function(e) {
        if (e.keyCode == 13) {
          $('#content-start').focus();
        }
      });
  });
})(jQuery)