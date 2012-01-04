/*
	Plugin to add controls to increment/decrement the numeric value
	of an input text.
*/
(function( $ ) {

	$.fn.incromentor = function( options ){
		
		return this.each( function(){
			
			var $this = $(this),
				data = $this.data('incromentor');
			
			if( !data )
			{
				//Init item
				data = {
				//	min			: 0,
				//	max			: 65535,
				//	step		: 1,
					"class"			: 'incromentor',
					more_text			: '&#9650',
					less_text		: '&#9660',
					keyboard_input	: true,
					stepUp			: _calculate_step_up,		//function that calculates next step
					stepDown		: _calculate_step_down,		//function that calculates previous step
					onStepUp 		: function(){},				//function to execute after stepping up
					onStepDown		: function(){},				//function to execute after stepping down
					previous		: $this.val()				//Previous value
				};

				var t = $this.attr('max');
				if( t===undefined && options.max )
				{
					$this.attr('max',options.max);
				}
				else
					data.max = ( t===undefined )? null:t;

				t = $this.attr('min');
				if( t===undefined && options.min )
				{
					$this.attr('min',options.min);
				}
				else
					data.min = (t===undefined)? null:t;

				t = $this.attr('step');
				if( t===undefined && options.step )
				{
					$this.attr('step',options.step );
				}
				else
					data.step = (t===undefined)? 1:t;

				data.min = parseInt( data.min, 10 );
				data.max = parseInt( data.max, 10 );
				data.toolset = $('<span/>',{
										"class":data["class"]
										});
				data.toolset.up		= $('<button type="button">'+data.more_text+'</button>' ).attr({"class":"btn"});
				data.toolset.down	= $('<button type="button">'+data.less_text+'</button>' ).attr({"class":"btn"});

				if( Modernizr.inputtypes.number )
				{
					$this.bind('change', function(e){
						
						var $this		= $(e.target),
							 data		= $this.data('incromentor'),
							 current	= parseInt( $this.val(), 10 );

						if( data.previous > $this.val() )
						{
							//Value decremented
							$this.val( data.previous );
							$this.trigger( 'incromentor.stepdown' );
						}
						else if( data.previous < $this.val() )
						{
							//Value incremented
							$this.val( data.previous );
							$this.trigger( 'incromentor.stepup' );
						}

						e.preventDefault();
					});
				}
				else
				{
					data.toolset.append( data.toolset.up );
					data.toolset.append( data.toolset.down );

					data.toolset.up.click( function(){
						$this.trigger( 'incromentor.stepup' );
					});

					data.toolset.down.click( function(){
						$this.trigger( 'incromentor.stepdown' );
					});

					$this.wrap( '<span style="position:relative;display:inline-block;"></span>' );
					$this.after( data.toolset );
					$this.bind( 'keydown', _keyboard_handle );
				}

				

				$this.bind( 'incromentor.stepup', _step_up );
				$this.bind( 'incromentor.stepdown', _step_down );

				$this.bind('incromentor.onstepup', function(){ data.onStepUp(); } );
				$this.bind('incromentor.onstepdown', function(){ data.onStepDown(); } );

				data = $.extend( data, options );

				$this.data('incromentor', data );
			}
		});
	}


	function _keyboard_handle( e )
	{
		var $this = $(e.target);
		// ↑ ↓ keys
		if( e.keyCode===38 )
		{
			$this.trigger( 'incromentor.stepup' );
		}

		if( e.keyCode===40 )
		{
			$this.trigger( 'incromentor.stepdown' );
		}

		if( $this.data('incromentor').keyboard_input===false )
		{
			e.preventDefault();
		}
	}


	function _buttons_state( value, data )
	{
		data.toolset.up.attr('disabled', ( value == data.max ) );
		data.toolset.down.attr('disabled', ( value == data.min ) );		
	}


	function _step_up(){

		var $this	= $(this),
		data		= $this.data('incromentor'),
		value		= null,
		current_val	= parseInt( $this.val(), 10 );

		if( $.isFunction( data.stepUp ) && current_val<data.max )
		{
			value = data.stepUp( current_val );

			$this.val( value );
			data.previous = parseInt( $this.val(), 10 );
			$this.data('increment', data );
			$this.trigger('incromentor.onstepup' );
		}

		_buttons_state( $this.val(), data );
	}



	function _step_down(){

		var $this	= $(this),
		data		= $this.data('incromentor'),
		value		= null,
		current_val	= parseInt( $this.val(), 10 );

		if( $.isFunction( data.stepDown ) && current_val>data.min )
		{
			value = data.stepDown( $this.val() );

			$this.val( value );
			data.previous = parseInt( $this.val(), 10 );
			$this.data('increment', data );
			$this.trigger('incromentor.onstepdown' );
		}

		_buttons_state( $this.val(), data );
	}

		


		function _calculate_step_up( current_value )
		{
			//console.log( 'incrementing '+current_value + '+'+this.step );
			return current_value + this.step;
		}


		function _calculate_step_down( current_value )
		{
			//console.log( 'decrementing '+current_value + '-'+this.step );
			return current_value - this.step;
		}


})( jQuery );