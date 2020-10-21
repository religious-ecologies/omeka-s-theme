var baseDomain = 'http://localhost/religious-ecologies';
var basePath = '/mare/partial/';
var baseUrl = baseDomain + basePath;
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
                })
                  .done(function() {  
                    setupScheduleLinks();
                  });              
            });

        });
        
        filteredContentContainer.on('click', '.schedule-list .pagination a', function(e) {
          e.preventDefault();
          $.get($(this).attr('href'), function(data) {
              $('.schedule-list').replaceWith($(data));
          })
            .done(function() {
              setupScheduleLinks();
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
        
        var setupScheduleLinks = function() {
          $('.schedule-list .pagination a, a.schedule-link').each(function() {
            var scheduleLink = $(this);
            var originalHref = scheduleLink.attr('href');
            scheduleLink.attr('href', baseDomain + originalHref);
          });
        }
      }
      
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