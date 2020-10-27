(function($) {
    $(document).ready(function() {      
      if ($('body').hasClass('home')) {
        $('.home #blocks').masonry({
          // options
          itemSelector: '#blocks > div:not(#home-intro)',
          columnWidth: '#blocks > div:not(#home-intro)',
          gutter: 16
        });
      }
    });      
})(jQuery)