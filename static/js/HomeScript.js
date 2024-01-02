var Localita = {
	Loc: [],

	LoadLocalita: function (option) {
		$(option).each(function (i, v) {
			var loc = { key: v.value, text: v.text, distance: [] };
			var splitText = v.text.split(" ");
			loc.distance.push({ text: v.text, dist: 0 });

			if (splitText.length > 1) {
				$(splitText).each(function (i, v) {
					loc.distance.push({ text: v, dist: 0 });
				});
			}
			Localita.Loc.push(loc);
		});
	},

	LoadLocalitarOTTO: function (option) {
	    $(option).each(function (i, v) {
	        var nomeLoc = v.childNodes.item(0).nodeValue ;
	        var id = v.id;
	        var placeid = id.substr(8);
	        var loc = { key: placeid, text: nomeLoc, distance: [] };
	        var splitText = nomeLoc.split(" ");
	        loc.distance.push({ text: nomeLoc, dist: 0 });

	        if (splitText.length > 1) {
	            $(splitText).each(function (i, v) {
	                loc.distance.push({ text: v, dist: 0 });
	            });
	        }
	        Localita.Loc.push(loc);
	    });
	},



	ComputeDistance: function (searchValue) {
		var searchTexts = searchValue.split(" ");
		if (searchTexts > 1)
			searchTexts.push(searchValue);

		//per ogni località
		$(this.Loc).each(function (j, l) {
			//calcolo distanza di Lev
			$(l.distance).each(function (j, ld) {
				$(searchTexts).each(function (i, t) {

					ld.dist = Localita.levDist(t, ld.text);
				})
			});
		});
	},

	GetByDistance: function (dist) {

		var ret = [];
		$(this.Loc).each(function (i, l) {
			$(l.distance).each(function (i, v) {
				if (v.dist < dist) {
					ret.push({ key: l.key, text: l.text, dist: v.dist });
					return false;
				}
			})
		});

		ret.sort(function (a, b) {
			return a.dist - b.dist;
		});
		return ret;
	},

	GetExactString: function (searchValue) {

		var ret = [];
		$(this.Loc).each(function (i, v) {
            if (v.text == searchValue) {
                ret.push(v);
                return false;
            }
            else
            {
                var split = v.text.split(" ");
                $(split).each(function (c, s) {
                    if (s == searchValue) {
                        ret.push(v);
                        return false;
                    }
                });
            }
		});

		return ret;
	},

	GetStringContains: function (searchValue) {

		var ret = [];
		$(this.Loc).each(function (i, v) {
			if (v.text.indexOf(searchValue) >= 0) {
				ret.push(v);
			}
		});
		return ret;
	},

	levDist: function (s, t) {
		var d = []; //2d matrix

		// Step 1
		var n = s.length;
		var m = t.length;

		if (n == 0) return m;
		if (m == 0) return n;

		//Create an array of arrays in javascript (a descending loop is quicker)
		for (var i = n; i >= 0; i--) d[i] = [];

		// Step 2
		for (var i = n; i >= 0; i--) d[i][0] = i;
		for (var j = m; j >= 0; j--) d[0][j] = j;

		// Step 3
		for (var i = 1; i <= n; i++) {
			var s_i = s.charAt(i - 1);

			// Step 4
			for (var j = 1; j <= m; j++) {

				//Check the jagged ld total so far
				if (i == j && d[i][j] > 4) return n;

				var t_j = t.charAt(j - 1);
				var cost = (s_i == t_j) ? 0 : 1; // Step 5

				//Calculate the minimum
				var mi = d[i - 1][j] + 1;
				var b = d[i][j - 1] + 1;
				var c = d[i - 1][j - 1] + cost;

				if (b < mi) mi = b;
				if (c < mi) mi = c;

				d[i][j] = mi; // Step 6

				//Damerau transposition
				if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
					d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
				}
			}
		}

		// Step 7
		return d[n][m];
	}
};

function checkKeyPressed(event, valoredidef)
{
    //if (valoredidef == $("#Search").val())
    //{
    //    $("#Search").val("");
    //}
    if (event.keyCode == 13) // Premuto enter
        searchString();
}

function searchString() {
	//ripristino situazione pulita
	setErrorLabel();
	//setOptions(Localita.Loc);

	//controllo che ci sia effettivamente qualcosa da cercare
	var searchValue = $("#Search").val();
	if (searchValue == "")
		return;

	var toSearch = searchValue.toUpperCase();
     
	//cerco uno stringa identica
	var selectOption = Localita.GetExactString(toSearch);
	 
	var errorMsg = "";
	//se non la trovo cerco una stringa simile
	if (selectOption.length == 0) {
		 

		//una stringa che contenga quanto scritto
		selectOption = Localita.GetStringContains(toSearch);

		//se ancora non la trovo provo con il calcolo della distanza di Levenshtein 
		if (selectOption.length == 0) {
			Localita.ComputeDistance(toSearch);
			selectOption = Localita.GetByDistance(4);
		}
	}

	//se ancora non ho trovato nulla,
	//segnalo errore e rinuncio
	if (selectOption.length == 0) {
	    $("#stationError").html("Nessuna corrispondenza trovata");
		return;
	}

	//imposto le possibili localita trovate nella combo ed eventulmente il messaggio di errore
	setOptions(selectOption);
	setErrorLabel(errorMsg);
}

function validatePlaceForm() {

    $("#placeError").empty();

    return true;
     

  //  $("#placeError").html("Devi selezionare almeno un Monitor per poter procedere ...");
    //return false;
}


function setOptions(selectedOption) {
	if (selectedOption.length > 0) {

	    var stringOption = "";
	    //selectedOption.sort(function (a, b) {
            
	    //    return a.text > b.text;
	    //});
	    
 		$(selectedOption).each(function (i, v) {
			stringOption = stringOption +
				"<option value='" + v.key + "'>" + v.text + "</option>";

			console.log(v.key + " - " + v.text + " - " + v.dist);
		});

		$("#ElencoLocalita").empty();
		$("#ElencoLocalita").html(stringOption);
	    //$("#ElencoLocalita").focus();
		focusOnElencoLocalita();
	}
}

function setOptionsrOTTO(selectedOption) {
	if (selectedOption.length > 0) {

	    var stringOption = "";
	    var ul = document.getElementById("cb1-list");
	    ul.innerHTML = "";
	    var count = 0;
	    var firstLi = null;
		$(selectedOption).each(function (i, v) {
		    var li = document.createElement("li");
		    li.appendChild(document.createTextNode(v.text));
		    li.setAttribute("id", "cb1-opt_" + v.key); // added line
		    li.setAttribute("role", "option");
		    li.setAttribute("role", "listitem");
		    li.setAttribute("class", "cb_option");
		    li.setAttribute("tabindex", "-1");
		    //li.click(function (e) {
		    //    return cb1.handleOptionClick($(this), e);
		    //});
		    if (count == 1)
		    {
		        firstLi = li;
		    }
		    count++;
		    ul.appendChild(li);

		    stringOption = stringOption +
               "<li id='cb1-opt_"+v.key+"' role='option' class='cb_option' role='listitem' tabindex='-1'>"+v.text+"</li>";
				//"<option value='" + v.key + "'>" + v.text + "</option>";

			console.log(v.key + " - " + v.text + " - " + v.dist);
		});

		//$("#cb1-list").empty();
		//$("#cb1-list").html(stringOption);
		var elemento = $(selectedOption)[0];
		var option = $("#cb1-opt_" + elemento.key);
		cb1.selectOption(option);
	  // The jQuery object of the option list
		var listali = $('cb1-list').find('li');
        listali.click(function (e) {
		        return cb1.handleOptionClick(cb1, e);
		    });
		//cb1.selectOption(firstLi);
		//cb1.bindHandlers();
        
	}
}

function setErrorLabel(msg) {
    $("#stationError").empty();

	if (msg != "" && msg != "undefined")
	    $("#stationError").html(msg);
}
var cb1 = null;
$(document).ready(function () {
    Localita.LoadLocalita("#ElencoLocalita option");
    //Localita.LoadLocalita("#cb1-list li");
     //cb1 = new combobox('cb1', false);

});

/* preso da internet */
var g_combo = null;  // set to active combobox for blur function

//$(document).ready(function () {

//    var cb1 = new combobox('cb1', false);
//}); // end ready

//
// keyCodes() is an object to contain keycodes needed for the application
//
function keyCodes() {
    // Define values for keycodes
    this.backspace = 8;
    this.tab = 9;
    this.enter = 13;
    this.esc = 27;

    this.space = 32;
    this.pageup = 33;
    this.pagedown = 34;
    this.end = 35;
    this.home = 36;

    this.up = 38;
    this.down = 40;

    this.del = 46;

} // end keyCodes

//
// Function combobox() is a class for an ARIA-enabled combobox widget
//
// @param (id string) id is the id of the div containing the combobox. Text input must have role="combobox".
//
// @param (editable boolean) editable is true if the edit box should be editable; false if read-only.
//
// @return N/A
//
function combobox(id, editable) {

    // Define the object properties

    this.$id = $('#' + id);  // The jQuery object of the div containing the combobox
    this.editable = editable;  // True if the edit box is editable
    this.keys = new keyCodes();

    // Store jQuery objects for the elements of the combobox
    this.$edit = $('#' + id + '-edit');  // The jQuery object of the edit box
    this.$button = $('#' + id + '-button');  // The jQuery object of the button
    this.$list = $('#' + id + '-list');  // The jQuery object of the option list
    this.$options = this.$list.find('li');  // An array of jQuery objects for the combobox options

    this.$selected; // the current value of the combobox
    this.$focused; // the currently selected option in the combo list
    this.timer = null; // stores the close list timer that is set when combo looses focus

    // Initalize the combobox
    this.init();

    // bind event handlers for the widget
    this.bindHandlers();

} // end combobox constructor


//
// Function init() is a member function to initialize the combobox elements. Hides the list
// and sets ARIA attributes
//
// @return N/A
//
combobox.prototype.init = function () {

    // Hide the list of options
    this.$list.hide().attr('aria-expanded', 'false');

    // If the edit box is to be readonly, aria-readonly must be defined as true
    if (this.editable == false) {
        this.$edit.attr('aria-readonly', 'true');
    }

    // Set initial value for the edit box
    this.$selected = this.$options.filter('.selected');

    if (this.$selected.length > 0) {
        this.$edit.val(this.$selected.text());
    }

} // end initCombo()

//
// Function bindHandlers() is a member function to bind event handlers for the combobox elements
//
// @return N/A
//
combobox.prototype.bindHandlers = function () {

    var thisObj = this;

    ///////////////// bind handlers for the button /////////////////////////

    this.$button.click(function (e) {
        return thisObj.handleButtonClick($(this), e);
    });

    this.$button.mouseover(function (e) {
        return thisObj.handleButtonMouseOver($(this), e);
    });

    this.$button.mouseout(function (e) {
        return thisObj.handleButtonMouseOut($(this), e);
    });

    this.$button.mousedown(function (e) {
        return thisObj.handleButtonMouseDown($(this), e);
    });

    this.$button.mouseup(function (e) {
        return thisObj.handleButtonMouseUp($(this), e);
    });

    ///////////////// bind listbox handlers /////////////////////////

    this.$options.click(function (e) {
        return thisObj.handleOptionClick($(this), e);
    });

    this.$list.focus(function (e) {
        return thisObj.handleComboFocus($(this), e);
    });

    this.$list.blur(function (e) {
        return thisObj.handleComboBlur($(this), e);
    });

    this.$options.focus(function (e) {
        return thisObj.handleComboFocus($(this), e);
    });

    this.$options.blur(function (e) {
        return thisObj.handleComboBlur($(this), e);
    });

    ///////////////// bind editbox handlers /////////////////////////

    this.$edit.keydown(function (e) {
        return thisObj.handleEditKeyDown($(this), e);
    });

    this.$edit.keypress(function (e) {
        return thisObj.handleEditKeyPress($(this), e);
    });

    this.$edit.blur(function (e) {
        return thisObj.handleComboBlur($(this), e);
    });

} // end bindHandlers()

//
// Function isOpen() is a member function to get the current state of the list box
//
// @return (boolean) returns true if list box is open; false if it is not
//
combobox.prototype.isOpen = function () {

    if (this.$list.attr('aria-expanded') == 'true') {
        return true;
    }
    else {
        return false;
    }

} // end isOpen

//
// Function closeList() is a member function to close the list box if it is open
//
// @param (restore booleam) restore is true if function should restore higlight to stored list selection
//
// @return N/A
//
combobox.prototype.closeList = function (restore) {

    var $curOption = this.$options.filter('.selected');

    if (restore == true) {
        $curOption = this.$selected;

        // remove the selected class from the other list items
        this.$options.removeClass('selected');

        // add selected class to the stored selection
        $curOption.addClass('selected');
    }

    this.$list.hide().attr('aria-expanded', 'false');

} // end closeList()

//
// Function openList() is a member function to open the list box if it is closed
//
// @param (restore booleam) restore is true if function should restore higlight to stored list selection
//
// @return N/A
//
combobox.prototype.openList = function (restore) {

    var $curOption = this.$options.filter('.selected');

    if (restore == true) {

        if (this.$selected.length == 0) {
            // select the first item
            this.selectOption(this.$options.first());
            $curOption = this.$selected;
        }
        else {
            $curOption = this.$selected;
        }

        // remove the selected class from the other list items
        this.$options.removeClass('selected');

        // add selected class to the stored selection
        $curOption.addClass('selected');
    }

    this.$list.show().attr('aria-expanded', 'true');

    // scroll to the currently selected option
    this.$list.scrollTop(this.calcOffset($curOption));

} // end openList();

//
// Function toggleList() is a member function to toggle the display of the combobox options.
//
// @param (restore booleam) restore is true if toggle should restore higlight to stored list selection
//
// Return N/A
//
combobox.prototype.toggleList = function (restore) {

    if (this.isOpen() == true) {

        this.closeList(restore);
    }
    else {
        this.openList(restore);
    }

} // end toggleList()

//
// Function selectOption() is a member function to select a new combobox option.
// The jQuery object for the new option is stored and the selected class is added
//
// @param ($id object) $id is the jQuery object of the new option to select
//
// @return N/A
// 
combobox.prototype.selectOption = function ($id) {

    // If there is a selected option, remove the selected class from it
    if (this.$selected.length > 0) {
        this.$selected.removeClass('selected');
    }

    // add the selected class to the new option
    $id.addClass('selected');

    // set active descendant for the new option
    this.$edit.attr('aria-activedescendant', $id.attr('id'));

    // store the newly selected option
    this.$selected = $id;

    // update the edit box
    this.$edit.val($id.text());
    var id = $id.attr('id');
    var placeid = id.substr(8);
   
    var placeidElem = document.getElementById("placeid");
    placeidElem.value = placeid;
} // end selectOption

//
// Function calcOffset() is a member function to calculate the pixel offset of a list option from the top
// of the list
//
// @param ($id obj) $id is the jQuery object of the option to scroll to
//
// @return (integer) returns the pixel offset of the option
//
combobox.prototype.calcOffset = function ($id) {
    var offset = 0;
    var selectedNdx = this.$options.index($id);

    for (var ndx = 0; ndx < selectedNdx; ndx++) {
        offset += this.$options.eq(ndx).outerHeight();
    }

    return offset;

} // end calcOffset

//
// Function handleButtonClick() is a member function to consume button click events. This handler prevents
// clicks on the button from reloading the page. This could also be done by adding 'onclick="false";' to the
// button HTML markup.
//
// @param (e object) e is the event object associated with the event
//
// @param ($id object) $id is the jQuery object for the element firing the event
//
// @return (boolean)  returns false;
//
combobox.prototype.handleButtonClick = function ($id, e) {

    e.stopPropagation();
    return false;

} // end handleButtonClick();

//
// Function handleButtonMouseOver() is a member function to process button mouseover events
//
// @param (e object) e is the event object associated with the event
//
// @param ($id object) $id is the jQuery object for the element firing the event
//
// @return (boolean)  returns false;
//
combobox.prototype.handleButtonMouseOver = function ($id, e) {

    // change the button image to reflect the highlight state
    $id.find('img').attr('src', 'http://www.oaa-accessibility.org/media/examples/images/button-arrow-down-hl.png');

    e.stopPropagation();
    return false;

} // end handleButtonMouseOver();

//
// Function handleButtonMouseOut() is a member function to process button mouseout events
//
// @param (e object) e is the event object associated with the event
//
// @param ($id object) $id is the jQuery object for the element firing the event
//
// @return (boolean)  returns false;
//
combobox.prototype.handleButtonMouseOut = function ($id, e) {

    // reset image to normal state
    $id.find('img').attr('src', 'http://www.oaa-accessibility.org/media/examples/images/button-arrow-down.png');

    e.stopPropagation();
    return false;

} // end handleButtonMouseOut();

//
// Function handleButtonMouseDown() is a member function to process button mousedown events
//
// @param (e object) e is the event object associated with the event
//
// @param ($id object) $id is the jQuery object for the element firing the event
//
// @return (boolean)  returns false;
//
combobox.prototype.handleButtonMouseDown = function ($id, e) {

    // change the button image to reflect the pressed state
    $id.find('img').attr('src', 'http://www.oaa-accessibility.org/media/examples/images/button-arrow-down-pressed-hl.png');

    // toggle the display of the option list
    this.toggleList(true);

    // Set focus on the edit box
    this.$edit.focus();

    e.stopPropagation();
    return false;

} // end handleButtonMouseDown();

//
// Function handleButtonMouseUp() is a member function to process button mouseup events
//
// @param (e object) e is the event object associated with the event
//
// @param ($id object) $id is the jQuery object for the element firing the event
//
// @return (boolean)  returns false;
//
combobox.prototype.handleButtonMouseUp = function ($id, e) {

    // reset button image
    $id.find('img').attr('src', 'http://www.oaa-accessibility.org/media/examples/images/button-arrow-down-hl.png');

    e.stopPropagation();
    return false;

} // end handleButtonMouseUp();


//
// Function handleEditKeyDown() is a member function to process keydown events for
// the edit box.
//
// @param (e object) e is the event object associated with the event
//
// @param ($id object) $id is the jQuery object for the element firing the event
//
// @return (boolean) Returns false if consuming; true if not processing
//
combobox.prototype.handleEditKeyDown = function ($id, e) {

    var $curOption = this.$options.filter('.selected');
    var curNdx = this.$options.index($curOption);

    if (e.altKey && (e.keyCode == this.keys.up || e.keyCode == this.keys.down)) {

        this.toggleList(true);

        e.stopPropagation();
        return false;
    }

    switch (e.keyCode) {
        case this.keys.backspace:
        case this.keys.del: {
            // prevent the edit box from being changed
            this.$edit.val(this.$selected.text());

            e.stopPropagation();
            return false;
        }
        case this.keys.tab: {

            // store the current selection
            this.selectOption($curOption);


            if (this.isOpen() == true) {
                // Close the option list
                this.closeList(false);
            }

            // allow tab to propagate
            return true;
        }
        case this.keys.esc: {
            // Do not change combobox value

            if (this.isOpen() == true) {
                // Close the option list
                this.closeList(true);
            }

            e.stopPropagation();
            return false;
        }
        case this.keys.enter: {

            if (this.isOpen() == true) {
                // store the current selection
                this.selectOption($curOption);

                // Close the option list
                this.closeList(false);
            }
            else {
                this.openList(false);
            }

            e.stopPropagation();
            return false;
        }
        case this.keys.up: {

            // move to the previous item in the list

            // if the list is expanded and this isn't the first item
            // move to the next item in the list

            if (curNdx > 0) {

                var $prev = this.$options.eq(curNdx - 1);

                if (this.isOpen() == true) {
                    // remove the selected class from the current selection
                    $curOption.removeClass('selected');

                    // Add the selected class to the new selection
                    $prev.addClass('selected');

                    // Set activedescendent for new option
                    this.$edit.attr('aria-activedescendant', $prev.attr('id'));

                    // scroll the list window to the new option
                    this.$list.scrollTop(this.calcOffset($prev));
                }
                else {
                    // store the new selection
                    this.selectOption($prev);
                }

            }

            e.stopPropagation();
            return false;
        }
        case this.keys.down: {

            // if the list is expanded and there are more items,
            // move to the next item in the list

            if (curNdx < this.$options.length - 1) {

                var $next = this.$options.eq(curNdx + 1);

                if (this.isOpen() == true) {
                    // remove the selected class from the current selection
                    $curOption.removeClass('selected');

                    // Add the selected class to the new selection
                    $next.addClass('selected');

                    // Set activedescendent for new option
                    this.$edit.attr('aria-activedescendant', $next.attr('id'));

                    // scroll the list window to the new option
                    this.$list.scrollTop(this.calcOffset($next));
                }
                else {
                    // store the new selection
                    this.selectOption($next);
                }
            }

            e.stopPropagation();
            return false;
        }
        case this.keys.home: {
            // select the first list item if the list is open

            if (this.isOpen() == true) {

                var $first = this.$options.first();

                // remove the selected class from the current selection
                $curOption.removeClass('selected');

                // Add the selected class to the new selection
                $first.addClass('selected');

                // scroll the list window to the new option
                this.$list.scrollTop(0);

                // Set activedescendent for new option
                this.$edit.attr('aria-activedescendant', $first.attr('id'));
            }

            e.stopPropagation();
            return false;
        }
        case this.keys.end: {
            // select the last list item if the list is open

            if (this.isOpen() == true) {

                var $last = this.$options.last();

                // remove the selected class from the current selection
                $curOption.removeClass('selected');

                // Add the selected class to the new selection
                $last.addClass('selected');

                // scroll the list window to the new option
                this.$list.scrollTop(this.calcOffset($last));

                // Set activedescendent for new option
                this.$edit.attr('aria-activedescendant', $last.attr('id'));
            }

            e.stopPropagation();
            return false;
        }
    }

    return true;

} // end handleEditKeyDown()

//
// Function handleEditKeyPress() is a member function to process keypress events for
// the edit box. Needed for browsers that use keypress events to manipulate the window.
//
// @param (e object) e is the event object associated with the event
//
// @param ($id object) $id is the jQuery object for the element firing the event
//
// @return (boolean) Returns false if consuming; true if not processing
//
combobox.prototype.handleEditKeyPress = function ($id, e) {

    var curNdx = this.$options.index($id);

    if (e.altKey && (e.keyCode == this.keys.up || e.keyCode == this.keys.down)) {
        e.stopPropagation();
        return false;
    }

    switch (e.keyCode) {
        case this.keys.esc:
        case this.keys.enter: {

            e.stopPropagation();
            return false;
        }
    }

    return true;

} // end handleOptionKeyPress()

//
// Function handleOptionClick() is a member function to process click events for
// the combobox.
//
// @param (e object) e is the event object associated with the event
//
// @param ($id object) $id is the jQuery object for the element firing the event
//
// @return (boolean) Returns false
//
combobox.prototype.handleOptionClick = function ($id, e) {

    // select the clicked item
    this.selectOption($id);

    // set focus on the edit box
    //this.$edit.focus();
    
    // close the list
    this.closeList(false);

    e.stopPropagation();
    return false;

} // end handleOptionClick()

//
// Function handleComboFocus() is a member function to process focus events for
// the list box
//
// @param (e object) e is the event object associated with the event
//
// @param ($id object) $id is the jQuery object for the element firing the event
//
// @return (boolean) Returns true
//
combobox.prototype.handleComboFocus = function ($id, e) {

    if (g_combo != null) {
        window.clearTimeout(g_combo.timer);
    }

    // Set focus on the edit box
    this.$edit.focus();

    return true;

} // end handleComboFocus()

//
// Function handleComboBlur() is a member function to process blur events for
// the combobox
//
// @param (e object) e is the event object associated with the event
//
// @param ($id object) $id is the jQuery object for the element firing the event
//
// @return (boolean) Returns true
//
combobox.prototype.handleComboBlur = function ($id, e) {

    // store the currently selected value
    this.$selected = this.$options.filter('.selected');

    // update the edit box
    this.$edit.val(this.$selected.text());

    g_combo = this;

    // close the list box
    if (this.isOpen() == true) {
        this.timer = window.setTimeout(function () { g_combo.closeList(false); }, 40);
    }

    return true;

} // end handleComboBlur()

function focusOnElencoLocalita()
{
    $("#ElencoLocalita").focus();
}