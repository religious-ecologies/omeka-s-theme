(function($) {
    var baseDomain = 'https://omeka.religiousecologies.org/api/';
        
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
            var propertiesIndex = $('#are-filters').data('properties-index');
            if (filterId > 0) {
                updateFilterSelect($(this), filterId, filterSelected, filterLabel, propertiesIndex);
            }
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
        
        // Check for active filters
        
        $('.filter-data').each(function() {
            var filterData = $(this);
            if (filterData.data('activeIds') !== "") {
                applyActiveFilters(filterData);
            }
        });
    });
    
    var populateChildFilter = function(resourceType, parentResourceType, heading, filterParam, filterId) {
        if ($('.filter-select[data-property-id="' + filterId + '"]').length > 0) {
          return;
        }
        console.log('populateChildFilter()');
        var newFilterSelect = $('[data-resource-type="template"]').clone();
        var newFilterSelectInput = newFilterSelect.find('select');
        var templateFilterKey = newFilterSelect.data('filter-key');
        var propertyId = $('.filter-data[data-resource-type="' + resourceType + '"]').data('property-id');
        var newFilterKey = templateFilterKey.replace('$TEMPLATE-ID', propertyId);
        newFilterSelect.attr('data-resource-type', resourceType);
        newFilterSelect.attr('data-property-id', filterId); 
        newFilterSelect.data('filterKey', newFilterKey);
        $('.filter-select[data-resource-type="' + parentResourceType + '"]').after(newFilterSelect);
        newFilterSelectInput.addClass('chosen-select').chosen(chosenOptions);
        
        var apiSearchUrl = baseDomain + 'items?' + filterParam;
        newFilterSelect.find('h4').text(heading);
        newFilterSelect.attr('data-updated', 'true');
        $.get(apiSearchUrl, function(data) {
            $.each(data, function() {
                newFilterSelectInput.append($('<option value="' + this['o:id'] + '">' + this['dcterms:title'][0]['@value'] + '</option>'));
                newFilterSelectInput.trigger('chosen:updated');
            });
        }).done(function() {
            childData = $('.filter-data[data-resource-type="' + resourceType + '"]');
            if (!childData.hasClass('applied')) {
                childData.addClass('applied');
                applyActiveFilters(childData);                  
            }                
        });
    };
    
    var updateFilterSelect = function(chosenSelect, filterId, filterSelected, filterLabel, propertiesIndex) {
        var selectedFilters = $('.selected-filters');
        var filterContainer = filterSelected.parents('.filter-select');
        var filterTemplate = filterContainer.data('filter-link-template');
        var filterLink = $(filterTemplate);
        var filterParam = filterContainer.data('filter-key') + '=' + filterId;
        var filterAnchor = filterLink.find('.filter-link');
        console.log('updateFilterSelect()');
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
        if (chosenSelect.parents('[data-resource-type="denomination-family"]').length > 0) {
          populateChildFilter('denomination', 'denomination-family', filterLabel, filterParam, filterId);
        }
        
        if (chosenSelect.parents('[data-resource-type="state-territory"]').length > 0) {
          populateChildFilter('county', 'state-territory', filterLabel, filterParam, filterId);
        }
        filterSelected.attr('disabled', true);
        
        chosenSelect.val('').trigger('chosen:updated');          
    };
    
    var applyActiveFilters = function(filterData) {
      var filterActivePropertyData = filterData.data('activeIds');
      console.log('applyActiveFilters()');
      if (!filterActivePropertyData) {
        return;
      }
      console.log(filterActivePropertyData);
      var propertyId = filterData.data('propertyId');
      var resourceType = filterData.data('resourceType');
      var parentResourceType = filterData.data('parentResourceType');
      var filterContainer = $('.filter-select[data-resource-type="' + resourceType + '"]');
      if (typeof(filterActivePropertyData) == 'string') {
        var activePropertyIds = filterActivePropertyData.split(',');
      } else {
        var activePropertyIds = [filterActivePropertyData];
      }
      $.each(activePropertyIds, function(index, value) {
        var filterOption = $('.filter-select option[value="' + value + '"]');
        var filterLabel = '';
        if (filterOption.length == 0) {
          $.get(baseDomain + 'items/' + value, function(data) {
            filterLabel = data[parentResourceType][0]['display_title'];
            var filterParam = $('.filter-select[data-resource-type="' + parentResourceType + '"]').data('filterKey');
            populateChildFilter(resourceType, parentResourceType, filterLabel, filterParam, propertyId);
          });
        }
        var filterContainer = $('.filter-select[data-resource-type="' + resourceType + '"]');
        var chosenSelect = filterContainer.find('.chosen-select').first();
        updateFilterSelect(chosenSelect, value, filterOption, filterLabel, $('#are-filters').data('properties-index'));                
      });
    };

})(jQuery)