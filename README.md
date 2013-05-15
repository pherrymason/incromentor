jQuery Incromentor: an Input Number fallback/improver
=====================================================

Overview
--------
incromentor is a jQuery plugin that acts as a fallback for those browsers that still doesn't support the new HTML5 input number element.
Also adds an improvement allowing you to use a callback for every increment/decrement event. This is usefull when you need a non-linear step.


Requeriments
------------
incromentor requires jQuery >= 1.6.3


Usage
-----
Include in your site the jquery script prior to incromentor:

	<script type="text/javascript" src="jquery-1.6.3.min.js"></script>
	<script type="text/javascript" src="incromentor.js"></script>

Include also the stylesheet to customize the appearance of controls:

	<link href="incromentor.css" rel="stylesheet" type="text/css" />

To start using it:
	$('#the_input').incromentor();

Will simply add support for no-number-browsers.
Incromentor supports `max`, `min` and `step` html arguments, although these can be also configured from javascript using the options argument:

	$('#the_input').incromentor({
		max:0,
		min:10,
		step:5,
	});

Available options:
	* `max`:		Sets maximum value input element can contain. Increment control will be disabled after reaching maximum value 
					This parameter, if defined will override html max attribute.

	* `min`				:	Sets minimum value input element can contain. Decrement control will be disabled after reaching minimum value.
							This parameter, if defined will override html max attribute.

	* `step`			:	Decrement/Increment actions will substract/add 5 units to value. By default 1.
	* `class`			:	Class to be applied to the <span> that wraps buttons. Remember to define this key between double quotes!. 
							Default value is `incromentor`. `String`. Only used in non-number-browsers!
	* `more_text`		:	String to place inside increment button. Default is `&#9650`. Only used in non-number-browsers!
	* `less_text`		:	String to place inside decrement button. Default is `&#9660`. Only used in non-number-browsers!
	* `keyboard_input`	:	If false, values can only be introduced using UI. `Boolean`, Default `true`.
	* `stepUp`			:	Callback to be called when user wants to increment the value. If not defined, incromentor uses +`step`.
	* `stepDown`		:	Callback to be called when user wants to decrement the value. If not defined, incromentor uses -`step`.
	* `onStepUp`		:	Callback to be called after value has been incremented.
	* `onStepDown`		:	Callback to be called after value has been decremented.


You can configure a function for increment/decrement events:

	$('#the_input').incromentor({
		
		stepUp: function( current_value ){
			return current_value*2;
		}

		stepDown : function( current_value ){
			
			return (current_value==0)? 0:current_value/2;
		}

	});


Styling
-------
Incromentor adds the class `incromentor-wr` to every touched element. You can use include `incromentor.css` or create your own one.
However you can tell incromentor to set a different class name:

	$('#the_input').incromentor({
		"class":"my-class-name"		//Use double quotes between `class` as it's a javascript keyword!
	})