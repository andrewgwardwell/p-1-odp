(function($){
    $(document).ready( function() {
        //slideshow on the homepage
        $('.home .slides').slick({
            arrows: false,
            dots: true
        });
        //make filters special
        [].slice.call( document.querySelectorAll( '.home select.cs-select' ) ).forEach( function(el) {	
          new SelectFx(el, {onChange: function(val) {
            if(val == 'principles' || val == 'courses' || val == 'instructors'){
                $('.filter-box').removeClass('active');
                $('#'+val+'-select').parents('.filter-box').addClass('active');
                $('.display-area').html($('.never-show').html());
            } else {
                var type = $('#type-select');
                var typeVal = type.val();
                var cards = [];
                $('.display-area').html('');
                if(val == 'all'){
                    $('.display-area').html($('.never-show').html());
                } else {
                    var target = $('.never-show [data-'+typeVal+'="'+val+'"]');
                    if(target.length > 0){
                        target.each(function(index, el){
                            cards.push(el.outerHTML);
                        });
                        $('.display-area').html(cards.join(''));
                    } else {
                        $('.display-area').html('No results. Please, filter again.');
                    }
                }
            }
          },
          toggleCall: function(e){
              var open = e._isOpen();
              if(open){
                $(e.selEl).parent().addClass('opened-toggle');
              } else {
                $(e.selEl).parent().removeClass('opened-toggle');
              }
          }
        });
      });
    //make filters special for the url switching page
      [].slice.call( document.querySelectorAll( '.url-filters select.cs-select' ) ).forEach( function(el) {	
                new SelectFx(el, {onChange: function(val) {
                  if(val == 'principles' || val == 'courses' || val == 'instructors'){
                      $('.filter-box').removeClass('active');
                      $('#'+val+'-select').parents('.filter-box').addClass('active');               
                  } else {
                    window.location.href = val;
                  }
                },
                toggleCall: function(e){
                    var open = e._isOpen();
                    if(open){
                      $(e.selEl).parent().addClass('opened-toggle');
                    } else {
                      $(e.selEl).parent().removeClass('opened-toggle');
                    }
                }
              });
            });
    });
})(jQuery);