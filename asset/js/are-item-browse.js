(function($) {
    $(document).ready(function() {
        var filterSubmitButton = $('.filter-submit');
        var filterSelectTemplate = $('[data-resource-type="template"]');
        var baseDomain = 'https://omeka.religiousecologies.org/api/items?';
        
        var populateChildFilter = function(resourceType, parentResourceType, heading, filterParam) {
            var newFilterSelect = filterSelectTemplate.clone();
            var newFilterSelectInput = newFilterSelect.find('select');
            newFilterSelect.attr('data-resource-type', resourceType); // resource type is 'denomination'
            var templateFilterKey = newFilterSelect.data('filter-key');
            var propertyId = $('.' + resourceType + '-id.filter-data').data('property-id');
            var newFilterKey = templateFilterKey.replace('$TEMPLATE-ID', propertyId);
            newFilterSelect.data('filterKey', newFilterKey);
            $('.filter-select[data-resource-type="' + parentResourceType + '"]').after(newFilterSelect); // parentResourceType is 'denomination-family'
            newFilterSelectInput.addClass('chosen-select').chosen(chosenOptions);
            
            var apiSearchUrl = baseDomain + filterParam;
            newFilterSelect.find('h4').text(heading);
            newFilterSelect.attr('data-updated', "true");
            $.get(apiSearchUrl, function(data) {
                $.each(data, function() {
                    newFilterSelectInput.append($('<option value="' + this['o:id'] + '">' + this['dcterms:title'][0]['@value'] + '</option>'));
                    newFilterSelectInput.trigger('chosen:updated');
                });
            });
        };

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
            var propertiesIndex = $('#are-filters').data('properties-index');
            if (filterId > 0) {
                var filterContainer = filterSelected.parents('.filter-select');
                var selectedFilters = $('.selected-filters');
                var filterTemplate = filterContainer.data('filter-link-template');
                var filterLink = $(filterTemplate);
                var filterParam = filterContainer.data('filter-key') + '=' + filterId;
                var filterAnchor = filterLink.find('.filter-link');
                if (filterParam.indexOf('INDEX') > -1) {
                  var indexString = 'INDEX';
                  indexString = new RegExp(indexString, 'g');
                  if (typeof propertiesIndex !== 'undefined') {
                    propertiesIndex = propertiesIndex + 1;                    
                    filterLink.data('index', propertiesIndex);
                  } else {
                    propertiesIndex = 0;
                    filterLink.data('index', 0);
                  }
                  $('#are-filters').data('properties-index', propertiesIndex);
                  filterParam = filterParam.replace(indexString, propertiesIndex);
                }
                filterAnchor.text(filterLabel);
                filterAnchor.attr({
                  'data-filter-param': filterParam,
                  'data-filter-id': filterId,
                  'data-resource-type': filterContainer.data('resource-type')
                });
                filterLink.appendTo(selectedFilters);
                selectedFilters.parents('#filter-query').removeClass('empty');              

    
                if ($(this).parents('[data-resource-type="denomination-family"]').length > 0) {
                  populateChildFilter('denomination', 'denomination-family', filterLabel, filterParam);
                }
                
                if ($(this).parents('[data-resource-type="state-territory"]').length > 0) {
                  populateChildFilter('county', 'state-territory', filterLabel, filterParam);
                }
            }
            filterId = 0;
            filterSelected.attr('disabled', true);
            
            $(this).val('').trigger('chosen:updated');
        });
        
        $(document).on('change', '[name="joiner"]', function() {
            var joinerSelect = $(this);
            var filterLink = joinerSelect.next('.filter-link');
            var filterParam = filterLink.data('filter-param');
            var joinerRegex = new RegExp(/(\[joiner\]\=).+?(?=\&)/);
            var newParam = filterParam.replace(joinerRegex, '[joiner]=' + joinerSelect.val());
            filterLink.data('filter-param', newParam);
        });
        
        $(document).on('click', '.clear-filter', function() {
            var filterLink = $(this).prev('a');
            var filterId = filterLink.data('filter-id');
            var filterResourceType = filterLink.data('resource-type');
            var filterContainer = $('.filter-select[data-resource-type="' + filterResourceType + '"]');
            var filterParam = filterLink.data('filter-param');
            filterContainer.find('option[value="' + filterId + '"]').attr('disabled', false);
            filterContainer.find('.chosen-select').trigger('chosen:updated');
            filterLink.parents('li').remove();
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
            window.location.href = currentQuery;
        });
    });
})(jQuery)