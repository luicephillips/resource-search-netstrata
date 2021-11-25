<?php
/**
 * Template Name: resource search
 * 
 */

 get_header(); 

?>


<style>
    .resource-search{
        margin : 100px;
    }
</style>
<div class="container resource-search">
    <?php echo do_shortcode('[wpbsearch]'); ?>
</div>
<div class="resource-search-posts" id="content"></div>





<?php
 get_footer();