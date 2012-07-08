/*
	Plugin to add controls to increment/decrement the numeric value
	of an input text.
*/
(function( $ ) {


	var Incromentor = function( $elm, options ){

		this.$element	= $elm;
		this.options	= $.extend( {}, $.fn.incromentor.defaults, options );
		this.previous	= null;
		this.init();
	};


	Incromentor.prototype = {

		init : function(){

		//	this.options.min = ( typeof(this.options.min)=="undefined" )? 0:this.options.min;
		//	this.options.max = ( typeof(this.options.max)=="undefined" )? 65355:this.options.max;

			// Check if max attr is defined
			var attr = this.$element.attr('max');
			if( !this.options.max && typeof(attr)=='undefined' )
			{
				this.options.max = 65355;
			}
			else if( typeof(attr)!='undefined' )
			{
				this.options.max = parseInt(attr,10);
			}

			attr = this.$element.attr('min');
			if( !this.options.min && typeof(attr)=='undefined' )
			{
				this.options.min = 0;
			}
			else if( typeof(attr)!='undefined' )
			{
				this.options.min = parseInt(attr,10);
			}


			attr = this.$element.attr('step');
			if( !this.options.step && typeof(attr)=='undefined' )
			{
				this.options.step = 1;
			}
			else if( typeof(attr)!='undefined' )
			{
				this.options.step = parseInt(attr,10);
			}


			var $wrapper = $('<span class="'+this.options['class']+'"/>');
			this.$btn_up 	= $( '<a href="#up" class="incromentor-up">' + this.options.more_text + '</a>' );
			this.$btn_down	= $( '<a href="#down" class="incromentor-down">' + this.options.less_text + '</a>' );

			this.$element.css({'margin':0});
			this.$element.wrap( $wrapper );
			

			
			var that = this;
			if( Modernizr.inputtypes.number && this.$element.attr('type')==='number' )
			{
				this.$element.bind('change', function(event){
					
					var current	= parseInt( that.$element.val(), 10 );

					if( that.previous > current )
					{
						//Value decremented
						that.$element.val( that.previous );
						that.$element.trigger( 'incromentor.stepdown' );
					}
					else if( that.previous < current )
					{
						//Value incremented
						that.$element.val( data.previous );
						that.$element.trigger( 'incromentor.stepup' );
					}

					event.preventDefault();
				});
			}
			else
			{
				$wrapper = this.$element.parent();
				$wrapper.append( this.$btn_up ).append( this.$btn_down );

				this.$btn_up.click( function(){
					that.$element.trigger('incromentor.stepup');
				});
				this.$btn_down.click( function(){
					that.$element.trigger('incromentor.stepdown');
				});
				this.$element.bind( 'keydown', $.proxy( this._keyboard_handle, this ) );
			}

			this.$element.bind('incromentor.stepup', $.proxy( this._step_up, this ) );
			this.$element.bind('incromentor.stepdown', $.proxy( this._step_down, this ) );

			this.$element.bind( 'incromentor.onstepup', $.proxy( this.options['onStepUp'], this ) );
			this.$element.bind( 'incromentor.onstepdown', $.proxy( this.options['onStepDown'], this ) );
		},

		_keyboard_handle : function( event )
		{
			// ↑ ↓ keys
			if( event.keyCode===38 )
			{
				this.$element.trigger( 'incromentor.stepup' );
			}

			if( event.keyCode===40 )
			{
				this.$element.trigger( 'incromentor.stepdown' );
			}

			if( this.options.keyboard_input===false )
			{
				event.preventDefault();
			}
		},

		_buttons_state : function( value )
		{
			this.$btn_up.attr('disabled', (value==this.options.max) );
			this.$btn_down.attr('disabled', (value==this.options.min) );
		},

		_step_up : function(event){

			var current_val	= parseInt( this.$element.val(), 10 );
			current_val = isNaN(current_val)? this.options.min:current_val;

			if( current_val<this.options.max )
			{
				if( $.isFunction( this.options.stepUp ) )
				{
					current_val = this.options.stepUp( current_val );
				}
				else
				{
					current_val += this.options.step;
				}

				this.$element.val( current_val );
				this.previous = current_val;
				this.$element.trigger('incromentor.onstepup' );
			}

			this._buttons_state( current_val );
		},

		_step_down : function(event){

			var current_val	= parseInt( this.$element.val(), 10 );

			if( current_val>this.options.min )
			{
				if( $.isFunction( this.options.stepDown ) )
				{
					current_val = this.options.stepDown( current_val );
				}
				else
				{
					current_val -= this.options.step;
				}

				this.$element.val( current_val );
				this.previous = current_val;
				this.$element.trigger('incromentor.onstepdown' );
			}

			this._buttons_state( current_val );
		},

		onStepUp : function(event){

		},

		onStepDown : function(event){

		}

	};






	$.fn.incromentor = function( options ){
		
		return this.each( function(){
			
			var $this = $(this),
				data = $this.data('incromentor');
			
			if( !data )
			{
				data = new Incromentor( $this, options );
				$this.data( 'incromentor', data );
			}
		});
	};


	$.fn.incromentor.defaults = {
		"class"			: "incromentor-wr",
		more_text		: '&#9650',
		less_text		: '&#9660',
		step			: 1,
//		max : 65355,
//		min : 0,
//		step :null,
		keyboard_input	: true,						// ???
//		stepUp			: _calculate_step_up,		// function that calculates next step
//		stepDown		: _calculate_step_down,		// function that calculates previous step
		onStepUp 		: function(){},				// function to execute after stepping up
		onStepDown		: function(){}				// function to execute after stepping down
	};

})( jQuery );