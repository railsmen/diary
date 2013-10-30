// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//= require jquery.min
//= require jquery-ui-1.10.3.custom
//= require_tree .

var DATA_SAVE_FREQUENCY = 5000;
var FLASH_HIDE_INTERVAL = 6000;
var flash_hide_timer;
jQuery('document').ready(function(){
    associateLinks();
    triggerAutoSave();
    loginCheck();
    jQuery(".datepicker").datepicker({
        dateFormat: 'yy-mm-dd'
    });
});

function associateLinks () {
    associateSaveLink();
    associateSignLinks();
    // associateOldEntriesLink();
}

function associateSaveLink(){
	jQuery('#save_li').live('click',function(e){
		e.preventDefault();
	    	savePost();
	});
}
function associateSignLinks(){
    jQuery('.sign_in').live('click',function(e){
        e.preventDefault();
        jQuery(this).addClass('sign_selected');
        jQuery(this).removeClass('sign_unselected');
        jQuery('.sign_up').removeClass('sign_selected');
        jQuery('.sign_up').addClass('sign_unselected');
        jQuery('.sign_ups').hide();
        jQuery('.sign_ins').show();
    });
    jQuery('.sign_up').live('click',function(e){
        e.preventDefault();
        jQuery(this).addClass('sign_selected');
        jQuery(this).removeClass('sign_unselected');
        jQuery('.sign_in').removeClass('sign_selected');
        jQuery('.sign_in').addClass('sign_unselected');
        jQuery('.sign_ups').show();
        jQuery('.sign_ins').hide();
    });
    jQuery('#old_entries_li').live('click',function(e){
        jQuery('.part2').animate({width:'80%'}, 500);
        jQuery('.part1').animate({width:'20%'}, 500);
    });
    jQuery('#hide').live('click',function(e){
        jQuery('#date_pik').val("");
        jQuery('.part2').animate({width:'100%'}, 500);
        jQuery('.part1').animate({width:'0%'}, 500);
    });
      jQuery('.post_links').live('click',function(e){
        getPost(jQuery(this).text())
    }); 
    jQuery('#search_date').live('click',function(e){
        var date = jQuery('#date_pik').val();
        if(date == ""){
            alert("No date selected")
        }
        else{
            getPost(date);
        }
    });
}
function savePost () {
    flash('Saving...');
    jQuery.ajax({
        url: '/save_post',
        type : 'POST',
        data:{
        	entry_text: jQuery('#entry_text').val()
        },
        success: function(data) {
         jQuery('#entry_text').attr('saved_data' , jQuery('#entry_text').val());
        	flash(data);
        },
        failure: function(error){
            flash(error);
        },
        error: function(error){
        	flash(error);
        },
        async:   true
    });
}

function getPost(date){

    jQuery.ajax({
            url: '/get_post',
            type : 'GET',
            data:{
                date: date
            },
            success: function(data) {
                jQuery('#entry_text').val(data.text);
            },
            failure: function(error){
                flash(error);
            },
            error: function(error){
                flash(error);
            },
        });
}

function listPost() {
    var text = jQuery('#text_search').val();
    if(text == ""){
        alert("No text entered.");
    }
    else{
        jQuery.ajax({
            url: '/posts',
            type : 'GET',
            data:{
                text: text
            },
            success: function(data) {
                jQuery('#list').text("");
                for(var i=0, len=data.text.length; i < len; i++){
                    jQuery("<li class='post_links'>"+data.text[i]+"</li>").appendTo('#list')
                }
            },
            failure: function(error){
                flash(error);
            },
            error: function(error){
                flash(error);
            },
        });
    }
}
function triggerAutoSave () {
    setInterval(checkDirtyAndSave, DATA_SAVE_FREQUENCY);
}

function checkDirtyAndSave() {
    if (jQuery('#entry_text').attr('saved_data') != jQuery('#entry_text').val()) {
        savePost();
    }
}

function flash (flash_str) {
    jQuery('#flash_tag').html(flash_str);
    if(!jQuery('#flash_tag').is(':visible')){
        jQuery('#flash_tag').slideDown();
    }
    clearTimeout(flash_hide_timer);
    flash_hide_timer = setTimeout(hide_flash, FLASH_HIDE_INTERVAL);
}
function hide_flash () {
    jQuery('#flash_tag').slideUp();
}

function loginCheck () {
    if(jQuery('#logged_in_user_id').val() != ''){
        jQuery('#gateway_div').hide();
        jQuery('#shutter').hide();
    }
}
