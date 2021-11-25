	//filter code for blogs
    var pageNumber = 1;

    jQuery('.filter-link').on('click', function(e) {
        e.preventDefault();
        var pageNumber = 1;
        jQuery(this).parent().parent().find('a').removeClass('activeFilter');
        jQuery(this).addClass('activeFilter');
        jQuery('#more_blog_posts').removeClass('activeLoadmore');
        jQuery('#more_prev_posts').removeClass('activeLoadprev');
        //editFilterInputs(jQuery('#filters-' + jQuery(this).data('type')), jQuery(this).data('id'));
        filterBlogs();
    });

    function editFilterInputs(inputField, value) {
        const currentFilters = inputField.val().split(',');
        const newFilter = value.toString();

        if (currentFilters.includes(newFilter)) {
            const i = currentFilters.indexOf(newFilter);
            currentFilters.splice(i, 1);
            inputField.val(currentFilters);
        } else {
            inputField.val(inputField.val() + ',' + newFilter);
        }
    }


    function filterBlogs() {
        if(jQuery('#more_blog_posts').hasClass('activeLoadmore')){
            pageNumber++;
        } else if (jQuery('#more_prev_posts').hasClass('activeLoadprev')) {
			pageNumber--;
		}
		else {
            pageNumber = 1;
        }
        var catIds = jQuery('.cat-list li a.activeFilter').attr('data-id');
        var tagIds = jQuery('.tag-list li a.activeFilter').attr('data-id');
        var sortOrder = jQuery('.sort-list li a.activeFilter').attr('data-id');
        // const catIds = jQuery('#filters-category').val().split(',');
        // const tagIds = jQuery('#filters-tag').val().split(',');
        // const sortOrder = jQuery('#filters-order').val().split(',');
        
        jQuery.ajax({
            type: 'POST',
            url: 'https://staging.project-progress.net/projects/netstarta/wp-admin/admin-ajax.php',
            dataType: 'json',
            data: {
                action: 'filter_blogs',
                catIds,
                tagIds,
                sortOrder,
                pageNumber,
            },
            success: function(res) {
            console.log(res.total);
            // if(jQuery('#more_blog_posts').hasClass('activeLoadmore')){
            //     jQuery(".project-tiles").append(res.html);
            // } else{
                jQuery('.project-tiles').html(res.html);

            //}
            if(res.total == pageNumber){
                jQuery("#more_blog_posts").hide();
            } else{
                jQuery("#more_blog_posts").show();
            }
			if(pageNumber > 1){
				jQuery("#more_prev_posts").show();
			} else {
				jQuery("#more_prev_posts").hide();
			}
            //jQuery('#result-count').html(res.total);
            },
            error: function(err) {
            console.error(err);
            }
        })
    }


    //load more 
    jQuery("#more_blog_posts").on("click",function(){ // When btn is pressed.
    $("#more_blog_posts").attr("disabled",true); // Disable the button, temp.
    jQuery(this).addClass('activeLoadmore');
    filterBlogs();
	jQuery('#more_prev_posts').removeClass('activeLoadprev');
    });

    //load previous 
    jQuery("#more_prev_posts").on("click",function(){ // When btn is pressed.
		$("#more_prev_posts").attr("disabled",true); // Disable the button, temp.
		jQuery(this).addClass('activeLoadprev');
		jQuery('#more_blog_posts').removeClass('activeLoadmore');
		filterBlogs();
    });
	if(pageNumber > 1){
		jQuery("#more_prev_posts").show();
	} else {
		jQuery("#more_prev_posts").hide();
	}



        //filter code for portfolio
        
        jQuery('.portfolio-cat-item').on('click', function() {
            pageNumber = 1;
            var catItemclicked = jQuery(this).data('slug');

            jQuery('#filters-category').val(catItemclicked);
            
            jQuery('.portfolio-cat-item').removeClass('active');
            jQuery(this).addClass('active');
            jQuery.ajax({
                type: 'POST',
                url: 'https://staging.project-progress.net/projects/netstarta/wp-admin/admin-ajax.php',
                dataType: 'JSON',
                data: {
                action: 'filter_projects',
                portfoliocategory: catItemclicked,
                },
                success: function(data) {
                                       
                    $(".project-tiles-portfolio").html( data.html );
                    
                    if( data.load_more == "false" )
                    { 
                        $("#more_posts").hide();
                    } else {
                        $("#more_posts").show(); 
                    }
                
                
                }
            })
    
        });
    
    //load more projects

    
    function load_projects(){
        pageNumber++;
        var catIDclicked = jQuery('#filters-category').val();
        var str = '&pageNumber=' + pageNumber + '&action=filter_projects' + '&portfoliocategory=' + catIDclicked;										
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: 'https://staging.project-progress.net/projects/netstarta/wp-admin/admin-ajax.php',
            data: str,
            success: function(data)
            {               
                $(".project-tiles-portfolio").append( data.html );
                if( data.load_more == "false" )
                {						
                    $("#more_posts").hide();
                } else {
                    $("#more_posts").show();
                }					
                
            },
            error : function(jqXHR, textStatus, errorThrown) {
                // $loader.html(jqXHR + " :: " + textStatus + " :: " + errorThrown);
            }

        });
        return false;
    }

    //load more 
    jQuery("#more_posts").on("click",function(){ // When btn is pressed.
    $("#more_posts").attr("disabled",true); // Disable the button, temp.
    load_projects();
    jQuery(this).insertAfter('.project-tiles-portfolio'); // Move the 'Load More' button to the end of the the newly added posts.
    });

