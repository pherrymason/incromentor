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

			// Check if max attr is defined
			var t = this.$element.attr('max');
			if( t===undefined && this.options.max )
			{
				this.$element.attr('max', this.options.max );
			}
			else
				this.options.max = this.$element.attr('max');


			t = this.$element.attr('min');
			if( t===undefined && this.options.min )
			{
				this.$element.attr('min', this.options.min );
			}
			else
				this.options.min = this.$element.attr('min');

			t = this.$element.attr('step');
			if( t===undefined && this.options.step )
			{
				this.$element.attr('step', this.options.step );
			}
			else
				this.options.step = this.$element.attr('step');


			var $wrapper = $('<span class="incromentor-wr"/>');
			

			this.$btn_up 	= $( '<a href="#up" class="incromentor-up">' + this.options.more_text + '</a>' );
			this.$btn_down	= $( '<a href="#down" class="incromentor-down">' + this.options.less_text + '</a>' );

			this.$element.wrap( $wrapper );
			

			
			if( Modernizr.inputtypes.number && $this.attr('type')==='number' )
			{
				var that = this;
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

				var that = this;
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
			var $this = $(event.target);
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

			if( current_val<this.options.max )
			{
				if( $.isFunction( this.options.stepUp ) )
				{
					current_val = this.options.stepUp( current_val );
				}
				else
					current_val += this.options.step;

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
					current_val -= this.options.step;

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
	}


	$.fn.incromentor.defaults = {
		"class"			: "incromentor",
		more_text		: '&#9650',
		less_text		: '&#9660',
		step			: 1,
		max : 65355,
		min : 0,
//		step :null,
		keyboard_input	: true,						// ???
//		stepUp			: _calculate_step_up,		// function that calculates next step
//		stepDown		: _calculate_step_down,		// function that calculates previous step
		onStepUp 		: function(){},				// function to execute after stepping up
		onStepDown		: function(){},				// function to execute after stepping down
	}

})( jQuery );