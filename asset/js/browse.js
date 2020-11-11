(function($) {
    $(document).ready(function() {
      
        if (localStorage.getItem('are_browse_control_mobile_open')) {
            toggleBrowseControls();
        }
      
        $('.layout-toggle button').click(function() {
            $('.layout-toggle button:disabled').removeAttr('disabled');
            $(this).attr('disabled', true);
            $('.resources').toggleClass('resource-list').toggleClass('resource-grid');
            $('.resources .resource').toggleClass('media-object');
            $('.resource-meta, .resource-image').toggleClass('media-object-section');

        });
        
        $('.browse-toggle').click(function() {
            toggleBrowseControls();
            localStorage.setItem('are_browse_control_mobile_open', true);
        });
    });
    
    var toggleBrowseControls = function() {
        $('.browse-controls').toggleClass('open closed');
        $(this).toggleClass('open closed');
    };
  
})(jQuery)