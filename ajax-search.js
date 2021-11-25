jQuery(document).on( 'submit', 'form#resource_searchform', function(e) {
    var $form = jQuery(this);
    var $input = $form.find('input[name="s"]');
    var query = $input.val();
    var $content = jQuery('#content')
    
    jQuery.ajax({
        type : 'post',
        url : myAjax.ajaxurl,
        dataType : 'json',
        data : {
            action : 'load_search_results',
            query : query
        },
        beforeSend: function() {
            $input.prop('disabled', true);
            $content.addClass('loading');
        },
        success : function( result ) {
            $input.prop('disabled', false);
            $content.removeClass('loading');
            console.log(result.html);
            jQuery('#content').html( result.html );
        }
    });
    
    return false;
})

