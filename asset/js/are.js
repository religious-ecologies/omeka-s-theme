var baseUrl = 'https://omeka.religiousecologies.org/mare/partial/';
var denominationFamilyFilterUrl = baseUrl + 'denomination-families-nav';
var denominationFilterUrl = baseUrl + 'denominations-nav?denomination-family-id=';
var denominationUrl = baseUrl + 'denomination?denomination-id=';
var denominationSchedulesUrl = baseUrl + 'denomination-schedules?denomination-id=';
var locationFamilyFilterUrl = baseUrl + 'states-territories-nav';
var locationFilterUrl = baseUrl + 'counties-nav?state-territory-id=';
var locationUrl = baseUrl + 'county?county-id=';
var locationSchedulesUrl = baseUrl + 'county-schedules?county-id=';


(function($) {
    $(document).ready(function() {
      
      // During the wireframing process, we're targeting pages that have
      // "denominations" and "locations" as their slugs.
      
      var denominations = $('body').hasClass('denominations');
      var locations = $('body').hasClass('locations');
      if (denominations || locations) {
        var filterContainer = $('#are-filters');
        var filteredContentContainer = $('.are-filtered-content');
        var areFamilyFilterUrl = (denominations) ? denominationFamilyFilterUrl : locationFamilyFilterUrl;
        var areFilterUrl = (denominations) ? denominationFilterUrl : locationFilterUrl;
        var areContentUrl = (denominations) ? denominationUrl : locationUrl;
        var areSchedulesUrl = (denominations) ? denominationSchedulesUrl : locationSchedulesUrl; 
        
        // Populate the filters with ajax 
        $.get(areFamilyFilterUrl, function(data) {
            filterContainer.html(data);
        })
          .done(function() {
            $('#are-filters li').addClass('are-family').wrapInner('<a href="#" class="are-filter-link"></a>');            
          });
          
        filterContainer.on('click', '.are-family > a', function(e) {
          e.preventDefault();
          var areFilter = $(this).parent('li');
          if (!areFilter.hasClass('populated')) {
            createFilter(areFilter, areFilter.data('item-id'));
            areFilter.addClass('populated');
          }
          areFilter.toggleClass('collapse');
        });
        
        filterContainer.on('click', '.are-filter', function(e) {
          e.preventDefault();
          var filterId = $(this).data('item-id');
          $.get(areContentUrl + filterId, function(data) {
            filteredContentContainer.html(data);
          })
            .done(function() {
                $.get(areSchedulesUrl + filterId, function(data) {
                  var schedules = data;
                  filteredContentContainer.append(schedules);
                });              
            });

        });

        var createFilter = function(filterLi,filterId) {
          var filterUrl = areFilterUrl + filterId;
          $.get(filterUrl, function(data) {
            filterLi.append(data);
          })
            .done(function() {
              $('#are-filters li li').addClass('are-filter').wrapInner('<a href="#" class="are-filter-link"></a>');     
            });
        };
      }          
    });
})(jQuery)