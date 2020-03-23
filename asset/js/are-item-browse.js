(function($) {
    $(document).ready(function() {
        var filterSubmitButton = $('.filter-submit');
  
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
            if (filterId > 0) {
                var filterContainer = filterSelected.parents('.filter-select');
                var selectedFilters = filterContainer.find('.selected-filters');
                var filterTemplate = selectedFilters.data('filter-link-template');
                var filterLink = $(filterTemplate);
                var filterParam = selectedFilters.data('filter-key') + '=' + filterId;
                
                if (selectedFilters.find('[data-filter-param="' + filterParam + '"]').length == 0) {
                    var filterAnchor = filterLink.find('.filter-link');
                    filterAnchor.text(filterLabel).attr('data-filter-param', filterParam);
                    filterLink.appendTo(selectedFilters);
                    selectedFilters.removeClass('empty');              
                }                
            }
            filterId = 0;
            $(this).val('').trigger('chosen:updated');
        });
        
        $(document).on('click', '.clear-filter', function() {
            $(this).parents('li').remove();
        });
        
        // Build search query
        
        filterSubmitButton.click(function(e) {
            e.preventDefault();
            var currentQuery = filterSubmitButton.attr('href');
            currentQuery = currentQuery + "?";
            $('.filter-link').each(function() {
                var filterParam = $(this).data('filter-param');
                currentQuery = currentQuery + filterParam + "&";
            });
            console.log(currentQuery);
            window.location.href = currentQuery;
        });
    });
})(jQuery)