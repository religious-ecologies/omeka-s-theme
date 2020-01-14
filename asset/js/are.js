var denominationFamilyFilterUrl = 'https://omeka.religiousecologies.org/mare/partial/denomination-families-nav';
var denominationFilterUrl = 'https://omeka.religiousecologies.org/mare/partial/denominations-nav?denomination-family-id=';
var locationFamilyFilterUrl = 'http://omeka.religiousecologies.org/mare/partial/states-territories-nav';
var locationFilterUrl = 'http://omeka.religiousecologies.org/mare/partial/counties-nav?state-territory-id=';

(function($) {
    $(document).ready(function() {
      
      var denominations = $('body').hasClass('denominations');
      var locations = $('body').hasClass('locations');
      if (denominations || locations) {
        var filterContainer = $('#are-filters');
        var areFamilyFilterUrl = (denominations) ? denominationFamilyFilterUrl : locationFamilyFilterUrl;
        var areFilterUrl = (denominations) ? denominationFilterUrl : locationFilterUrl;
        
        $.get(areFamilyFilterUrl, function(data) {
            filterContainer.html(data);
        })
          .done(function() {
            $('#are-filters li').addClass('are-family').wrapInner('<a href="#" class="are-filter-link"></a>');            
          });
          
        filterContainer.on('click', '.are-family a', function() {
          var areFilter = $(this).parent('li');
          if (!areFilter.hasClass('populated')) {
            createFilter(areFilter, areFilter.data('item-id'));
            areFilter.addClass('populated');
          }
          areFilter.toggleClass('collapse');
        });

        var createFilter = function(filterLi,filterId) {
          var filterUrl = areFilterUrl + filterId;
          $.get(filterUrl, function(data) {
            filterLi.append(data);
          });
        };
      }          
    });
})(jQuery)