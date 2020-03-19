(function($) {
    $(document).ready(function() {
      // Chosen select population, taken from Omeka's admin.js
      
        $('.chosen-select').chosen(chosenOptions);

        // Along with CSS, this fixes a known bug where a Chosen dropdown at the
        // bottom of the page breaks layout.
        // @see https://github.com/harvesthq/chosen/issues/155#issuecomment-173238083
        $(document).on('chosen:showing_dropdown', '.chosen-select', function(e) {
            var chosenContainer = $(e.target).next('.chosen-container');
            var dropdown = chosenContainer.find('.chosen-drop');
            var dropdownTop = dropdown.offset().top - $(window).scrollTop();
            var dropdownHeight = dropdown.height();
            var viewportHeight = $(window).height();
            if (dropdownTop + dropdownHeight > viewportHeight) {
                chosenContainer.addClass('chosen-drop-up');
            }
        });
        $(document).on('chosen:hiding_dropdown', '.chosen-select', function(e) {
            $(e.target).next('.chosen-container').removeClass('chosen-drop-up');
        });
        
        $(document).on('change', '.chosen-select', function() {
            var filterSelected = $(this).find(':selected');
            var filterLabel = filterSelected.text();
            var filterId = filterSelected.val();

            var filterContainer = filterSelected.parents('.filter-select');
            var selectedFilters = filterContainer.find('.selected-filters');
            var filterTemplate = selectedFilters.data('filter-link-template');
            var filterLink = $(filterTemplate);
            
            if (selectedFilters.find('[data-filter-id="' + filterId + '"]').length == 0) {
                filterLink.find('.filter-link').text(filterLabel).attr('data-filter-id', filterId);
                filterLink.appendTo(selectedFilters);
                selectedFilters.removeClass('empty');              
            }
        });
        
        $(document).on('click', '.clear-filter', function() {
            $(this).parents('li').remove();
        });
    });
})(jQuery)