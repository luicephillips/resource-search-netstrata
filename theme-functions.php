<?php
//netstrata customization starts here

//disabling gutenberg
add_filter('use_block_editor_for_post', '__return_false', 10);

//The PHP WordPress Filter,

function filter_blogs() {
	$catIds = $_POST['catIds'];
	$tagIds = $_POST['tagIds'];
	$sortOrder = $_POST['sortOrder'];
	$page = (isset($_POST['pageNumber'])) ? $_POST['pageNumber'] : 0;
	$args = [
		'post_type' => 'post',
		'posts_per_page' => 4,
		'post_status'  => 'publish',
		'orderby'        => 'publish_date',
		'order'     => $sortOrder ,
		'paged'    => $page,
	];
	// project Category
	if (!empty($catIds)) {
		$args['tax_query'][] = [
			'taxonomy'      => 'category',
			'field'			=> 'term_id',
			'terms'         => $catIds,
			'operator'      => 'IN'
		];
	}
	// project tag 
	
	if (!empty($tagIds)) {
		$args['tax_query'][] = [
			'taxonomy'      => 'post_tag',
			'field'			=> 'term_id',
			'terms'         => $tagIds,
			'operator'      => 'IN'
		];
	}
	$response = '';
	$ajaxproducts = new WP_Query($args);
	if ( $ajaxproducts->have_posts() ) {
		ob_start();
		while ( $ajaxproducts->have_posts() ) : $ajaxproducts->the_post();
			$response = get_template_part('page-templates/page/content/content', 'page');
            //echo $response = get_the_ID().',';
		endwhile;
		$output = ob_get_contents();
		ob_end_clean();
	} else {
        $output = 'No projects found' ;
	}
		
    $counter = $ajaxproducts->max_num_pages;
	$result = [
		'total' => $counter,
		'html' => $output,
	];
	
	echo json_encode($result);
	wp_reset_postdata();
	exit;
}
add_action('wp_ajax_filter_blogs', 'filter_blogs');
add_action('wp_ajax_nopriv_filter_blogs', 'filter_blogs');
 

//portfoio filter code start

function filter_projects() {
	$response = array(		"status" => false,		"html" => "",	);	
	$catSlug = $_POST['portfoliocategory'];
    $page = (isset($_POST['pageNumber'])) ? $_POST['pageNumber'] : 0;
	$args = [
		'post_type' => 'portfolio',
		'orderby' => 'menu_order', 
		'order' => 'desc',
		'posts_per_page' => 4,
        'paged'    => $page,
	];
	// project Category
	if ((count($catSlug) >= 1) && !empty($catSlug)) {
		$args['tax_query'][] = [
			'taxonomy' => 'portfolio_category',
			'field'    => 'slug',
			'terms'    => $catSlug,
			'operator' => 'IN',
		];
	}	
	$ajaxprojects = new WP_Query($args);			
	$response['load_more'] = $page < $ajaxprojects->max_num_pages ? "true" : "false";	
	$response['next_page'] = $page+1;	
	$response['found_posts'] = $ajaxprojects->found_posts . " " . ( $ajaxprojects->found_posts <= 1 ? " result found" : " results found" ) ;			
	ob_start();
	if($ajaxprojects->have_posts()) 	{		
		$response['status'] = true;
		while($ajaxprojects->have_posts()) 		{ 			
			$ajaxprojects->the_post();
			get_template_part('page-templates/page/content/content', 'page');
		}
	}		
	$output = ob_get_contents();	
	$response['html'] = $output;	
	ob_get_clean();
	echo json_encode($response);
	exit;
  }
  add_action('wp_ajax_filter_projects', 'filter_projects');
  add_action('wp_ajax_nopriv_filter_projects', 'filter_projects');

  //portfoio filter code end


  //search form in resources
  function wpbsearchform( $form ) {
   
    $form = '<div id="search-container">
	<form role="search" method="get" id="resource_searchform" action="' . home_url( '/' ) . '" >
    <div><label class="screen-reader-text" for="s">' . __('Search for:') . '</label>
    <input type="text" value="' . get_search_query() . '" name="s" id="s" placeholder="Search the knowledge base"/>
    <input type="submit" id="resource_searchsubmit" value="'. esc_attr__('Search') .'" />
    </div>
    </form></div>';
   
    return $form;
}
   
add_shortcode('wpbsearch', 'wpbsearchform');



// search form ajax request function


function load_search_results() {
    $query = $_POST['query'];
    $content ='';
    $args = array(
        'post_type' => 'resources',
        'post_status' => 'publish',
        's' => $query
    );
    $search = new WP_Query( $args );
    
    //ob_start();
    if ( $search->have_posts() ) : 
		// $content .=
		// '<header class="page-header">
		// 	<h1 class="page-title">'.printf( __( 'Search Results for: %s'), get_search_query() ).'</h1>
		// </header>';

			while ( $search->have_posts() ) : $search->the_post();
			$post_id = get_the_ID();
			$content .= get_the_title($post_id);
			
				//get_template_part( 'content', get_post_format() );
			
			endwhile; 
	else :
		$content .= 'No posts found';
	endif;
	
	//$content = ob_get_clean();
	
	$return['html'] = $content;
      echo json_encode($return);
      die;
			
}

add_action( 'wp_ajax_load_search_results', 'load_search_results' );
add_action( 'wp_ajax_nopriv_load_search_results', 'load_search_results' );


// to return jsvoid(0) a tag

if(!function_exists('expLink')){
    function expLink($link){
        if($link == '#'){
            return 'javascript:void(0);';
        }
        return $link;
    }
}