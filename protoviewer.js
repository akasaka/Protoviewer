
// Set autoUpdate to be true
var autoUpdate = 1;
var dock = 0;
var hiddenvars = 0;
var debugOn = 0;
var textarea = document.getElementById('code');
var dataTableOpen = 0;
var aboutOpen = 0;
var variablesToUse = new Array();
var variableTypes = new Array();
var pseudovars = new Array();
var allslices = new Array();
// Lookup behavior
$("#lookup").click(function() {
	var type = editor.selection();
	lookupSyntax(type);
	$("#syntax").slideDown();
	$("#syntax").html("<img src='ajax-loader.gif'>");
});

var autocompleteManagement = function (e)
  {
	if (autoUpdate) {
	 	var content = editor.getCode();
	 	if (content.indexOf("script") == -1 && content.indexOf("alert") == -1 && content.indexOf("src") == -1) {
	 		runCode();	
	 	} else {
	 		alert("Invalid string found");
	 	}	
	} else {

	}
};

// Setup CodeMirror
var editor = CodeMirror.fromTextArea("code", {
    height: "350px",
    content: textarea.value,
    parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
    stylesheet: "css/jscolors.css",
    path: "js/",
    autoMatchParens: true,
    lineNumbers: true,
    continuousScanning: 5000, 
    cursorActivity :autocompleteManagement
});

// Some extra stuff to do after the vis has been rendered
function runPostCode() {
  vis.event("click", pv.Behavior.point());
  vis.add(pv.Mark)
    .extend(view)
    .def("active", -1)
    .event("point", function()  { viewData(this.index); return this.active(this.index).parent; })
    .event("unpoint", function()  { return this.active(-1).parent; });

  vis.render();
}
function goToLabel(index) {
	editor.jumpToLine(allslices[index - 1]);
}

// Update the Protovis code
function runCode() {
	hiddenvars = 0;
	allslices = Array();
    $("#fig").html("");
    var head = document.getElementById("fig");
    var script = document.createElement("script");
    var content = editor.getCode();
    var savedcontent = editor.getCode();
    var match = content.match(/\nvis.add\(pv.Label\)/);
    var search = content.search(/\nvis.add\(pv.Label\)/);
	while (match) {
	  hiddenvars++
	  // Count newlines
	  slice = content.slice(0, search);
	  allslices.push(slice.split(/\n/g).length);
	  content = content.replace(match, "\nvar x" + hiddenvars + " = vis.add(pv.Label)\n.def(\"index\", " + hiddenvars +")\n.events(\"all\")\n.event(\"click\", function() { goToLabel("+ hiddenvars + "); })");
	
	  match = content.match(/\nvis.add\(pv.Label\)/);
	  var search = content.search(/\nvis.add\(pv.Label\)/);

	}
	script.text = content;
    head.appendChild(script);
	runPostCode();
}


// When you change a curated set
$('#selector').change(function() {
	$("#url").val($('#selector').val());
	$("#datatype").html($("#selector option:selected").text());
});

// When you click manual update
$('#manualupdate').click(function () {
    runCode();
});

// When you click Auto Update
$('#autoupdate').click(function () {
    if (autoUpdate) {
		autoUpdate = 0
		$(this).val("Auto update OFF");
		$("#manualupdate").fadeIn();
	} else {
		autoUpdate = 1
		$(this).val("Auto update ON");
		$("#manualupdate").fadeOut();
	}
});


$("#random").click(function () {
    url = "json/dot.js";
    $.getJSON(url, function (response) {
        runCode();
    });
});

function loadAll(id) {
	url = "loadAll.php?id="+id;
	$.getScript(url, function (returneddata) {
				
	});
}
function ajaxFileUpload() {
    //starting setting some animation when the ajax starts and completes
    $("#loading").ajaxStart(function () {
        $(this).show();
    }).ajaxComplete(function () {
        $(this).hide();
    });

    $.ajaxFileUpload({
        url: 'doajaxfileupload.php',
        secureuri: false,
        fileElementId: 'fileToUpload',
        dataType: 'json',
        success: function (data, status) {
            if (typeof(data.error) != 'undefined') {
                if (data.error != '') {
                    alert(data.error);
                } else {
                    alert(data.msg);
                }
				//jscallback();
            }
			url = "parseData.php";
			        $.getScript(url, function (returneddata) {
						$("#JSLINT_INPUT").html(returneddata);
						$("#submitjslint").click();
			        });
        },
        error: function (data, status, e) {
            alert(e);
        }
    })

    return false;

}
// jslint callback

function jscallback() {
	var htm = $("#JSLINT_OUTPUT").html();
	// No errors
	if (htm.indexOf("Error:") == -1 && htm.indexOf("Problem") == -1) {

		//runCode();
		runDebug();
		loadDataIntoViewer();
	    //$("#view").show();	
		//$("#plottypes").show();
	} else {
		$(".errorsdisplay").html(htm);
		$("#errorcode").html($("#JSLINT_INPUT").html());
		$(".errorsdisplay, .errorsdisplaytextarea").slideDown(function() {
			$("#errorcode").height($(".errorsdisplay").height() - 30);	
		});

		var erroreditor = CodeMirror.fromTextArea("errorcode", {
		    parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
		    stylesheet: "css/jscolors.css",
		    path: "js/",
			lineNumbers: true,
		    autoMatchParens: true
		});

	
	}
}
// Clear the data 
$("#clear").click(function () {
	$(".short").replaceWith("<input type='file' class='short' name='fileToUpload' id='fileToUpload' />");
});




function countProperties(obj) {
	  var prop;
	  var propCount = 0;
	  
	  for (prop in obj) {
	    propCount++;
	  }
	  return propCount;
}

function isDate(dateStr) {
	
	var datePat = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
	var matchArray = dateStr.match(datePat); // is the format ok?
	var newformat = false;
	if (matchArray == null) {
			var datePat = /^(\d{1,2})(\/|-)(\w{3})(\/|-)(\d{4})$/;
			var matchArray = dateStr.match(datePat); // is the format ok?
			if (matchArray != null) {
				newformat = true;
			} else {		
				return false;
			}	
	}
	if (newformat) {
		return true;
	} else {
		month = matchArray[1]; // p@rse date into variables
		day = matchArray[3];
		year = matchArray[5];
	
		if (month < 1 || month > 12) { // check month range
		alert("Month must be between 1 and 12.");
		return false;
		}
		
		if (day < 1 || day > 31) {
		alert("Day must be between 1 and 31.");
		return false;
		}
		
		if ((month==4 || month==6 || month==9 || month==11) && day==31) {
		alert("Month "+month+" doesn`t have 31 days!")
		return false;
		}
		
		if (month == 2) { // check for february 29th
		var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
		if (day > 29 || (day==29 && !isleap)) {
		alert("February " + year + " doesn`t have " + day + " days!");
		return false;
		}
	}
}
return true; // date is valid
}

// Source: http://pietschsoft.com/post/2008/01/14/JavaScript-intTryParse-Equivalent.aspx
function tryParseInt(str,defaultValue) {     
	var retValue = defaultValue;    
	if(str!=null) {         
		if(str.length>0) {             
			if (!isNaN(str)){                 
				retValue = parseInt(str);             
			}         
		}     
	}     
	return retValue; 
}

// Put things into debugViewer
function runDebug() {
    $("#debugViewer").html("");
	$(".debugViewer").html("");
	var predictions = $("<strong>Predictions</strong> - check to use (<a class='help' href='#'>help</a>)<br />");
	predictions.bind("click", function() {
		viewHelp("predictions");
	});
	$(".debugViewer").append(predictions);
    var firstRow = data[0];
    var length = data[0].length;

    if (length != undefined) {
        // Todo: generalize this
        length = data[0][0].length;
        firstRow = data[0][0];
		// It could also be an array of numbers
    }
    if (length === undefined) {
    	counter = 0;
    	
        for (property in firstRow) {
        	date = "";
        	number = "";
        	// If the property is a string:
        		if (isNaN(data[0][property])) {
		        	if (isDate(data[0][property]) && isDate(data[1][property])) {
		        		date = "selected";
		        	} 
		        	if (tryParseInt(data[0][property].replace(",", ""), 0) != 0) {
		        		number = "selected";	
		        	}
        		} else {
        			number = "selected";
        		}
        	var select = $("<div id='selecttype'><select class='typeselector' id='type" + counter + "'><option value='nominal'>category</option><option " + number + " value='quantitative'>number</option><option " + date + " value='date'>date</option></select></div>");
        	var input = $("<div id='chooseselection'><input type='checkbox' id='"+ counter + "' name='usedata' class='usedata' value='" + property + "' /></div>");

            $(".debugViewer").append(property + "<br />");
            $(".debugViewer").append(select.html());
            $(".debugViewer").append(input.html() + "<br />");

            $(".debugViewer").find(".usedata:last").bind("click", function() {

            	// Allow users to order
            	if ($(this).attr("checked")) {
        	
            		if (!($(this).val() in variablesToUse)) {
            			variablesToUse.push($(this).val());
            			pseudovars.push("pv" + $(this).attr("id"));
            			variableTypes.push($("#type" + $(this).attr("id")).val());
            		}	
            	} else {
            		
            		var idx = variablesToUse.indexOf($(this).val());
            		if (idx != -1) {
            			variablesToUse.splice(idx, 1);
            			variableTypes.splice(idx, 1);
            			pseudovars.splice(idx, 1);
            		}	
            	}
            	checkAll();
            });
        	counter++;
        	
        	//$(".debugViewer").append(data[0][property]);
        	//$(".debugViewer").append(data[1][property]);
        	
        }
    } else {


    }
}

function checkAll() {
	//variablesToUse = new Array();
	$("#selectedvars").remove();
	$(".clickable").hide();
	$(".debugViewer").append("<div id='selectedvars'>Variables selected:<br />" + variablesToUse + "<br /><br /></div>");

	var numbers = countItems(variableTypes, "quantitative");
	var categories = countItems(variableTypes, "nominal");
	var dates = countItems(variableTypes, "date");

	// Where all the decision making happens
	if (numbers != undefined) {
		if (numbers == 2) {		
			$(".n2").show();
		}
		if (numbers >= 1 && categories >= 2) {		
			$(".stackedbars").show();		
		}
		if (numbers >= 1 && categories == 1) {		
			alert("Showing grouped bars");	
		}
	}
	if (dates != undefined) {
		if (dates == 1 && categories >= 1) {		
			alert("Showing candlestick, discrete");	
		}
	}
	
}

$(".restoredata").click(function() {
	var sid = $("#sessionid").val();
	$.ajax({
	  type: "POST",
	  url: 'doSession.php',
	  data: "type=restore&id="+sid,
	  success: function(data) {
		$(".sessionstatus").html(data).show();
		$(".sessionstatus").effect('highlight', null, 500, function() {
			$(this).fadeOut();
			$("#saveViewer").slideUp();
		});
	  }
	});

        url = "restoreSession.php";
        $.getScript(url, function () {

        });
	$.ajax({
	  type: "POST",
	  url: 'saveCode.php',
	  data: "type=restore",
	  success: function(data) {
	  	editor.setCode(data);
	  }
	});
});

function saveAll() {
	saveLoc()


	// Save code
	var code = editor.getCode();
	$.ajax({
	  type: "POST",
	  url: 'saveCode.php',
	  data: "type=save&data="+encodeURIComponent(code),
	  success: function(data) {
		//$(".sessionstatus").html(data);	
	  }
	});
}

$(".savedata").click(function() {

	saveAll();
});

$(".sharedata").click(function() {

	$(this).before("Give it a name: <input id='sharename' name='name' value='' type='text' /> <input id='makepublic' name='makepublic' type='checkbox'> Add to gallery? ");
	$(this).val("Finish sharing!");

	$(this).unbind();
	$(this).bind("click", function() {
		saveShare();
	});
	$(this).removeClass("sharedata");
	$(this).addClass("smooth");

});

$(".finishshare").click(function() {
	
	saveShare();
	
});
function saveSVG(id) {
	var svg = vis.scene[0].canvas.innerHTML 
	$.ajax({
	  type: "POST",
	  url: 'saveSVG.php',
	  data: "svg="+svg+"&id="+id,
	  success: function(data) {
	  }
	});
}
function bindAll() {
	$(".gallery").click(function() {
		alert($(this).attr("id"));
	});	
}
function saveShare() {
	var title = $("#sharename").val();
	var id = randomPassword(10);
	var public = $("#makepublic").is(':checked');
	saveAll();
	saveSVG(id);
	// Save data and everything else
	$.ajax({
	  type: "POST",
	  url: 'saveData.php',
	  data: "id="+id+"&title="+title+"&public="+public,
	  success: function(data) {
		$(".smooth").after(data);	
		$(".smooth").addClass("sharedata");	
		$(".sharedata").removeClass(".smooth");

	  }
	});
}
function randomPassword(length)
{
  chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  pass = "";
  for(x=0;x<length;x++)
  {
    i = Math.floor(Math.random() * 62);
    pass += chars.charAt(i);
  }
  return pass;
}
function saveLoc() {


	var lp = $('#leftside').position();
	var lleft = lp.left;
	var ltop = lp.top;
	var rp = $('#rightside').position();
	var rleft = rp.left;
	var rtop = rp.top;
	var mp = $('#middle').position();
	var mleft = mp.left;
	var mtop = mp.top;
	var hp = $('#header').position();
	var hleft = hp.left;
	var htop = hp.top;
	$.ajax({
	  type: "POST",
	  url: 'doSession.php',
	  data: "type=indiv&lleft="+lleft+"&ltop="+ltop+"&litem=leftside&rleft="+rleft+"&rtop="+rtop+"&ritem=rightside&mleft="+mleft+"&mtop="+mtop+"&mitem=middle&hleft="+hleft+"&htop="+htop+"&hitem=header",
	  success: function(data) {
		var sid = '<?php echo $_SESSION['sessionid']; ?>';
		$.ajax({
		  type: "POST",
		  url: 'doSession.php',
		  data: "type=save&id="+sid,
		  success: function(data) {
			$(".sessionstatus").html(data).show();
			$(".sessionstatus").effect('highlight', null, 500, function() {
				$(this).fadeOut();
			
			});	

		  }
		});	
	  }
	});
}


// Load the data
$("#process").click(function () {
 	$("#fig").html("");
	variablesToUse = new Array();
	variableTypes = new Array();
	pseudovars = new Array();
 	$(".debugViewer").html("");
	$("#selectedvars").html("");
 	editor.setCode("This area will update once you have made a selection of the data you want to draw.");
	$(".clickable").hide();
	$(".errorsdisplay").slideUp(function() {
		$(this).html("");
	});
	$(".errorsdisplaytextarea").slideUp();
	
	// If file uploading
    if ($(".short").val() != "") {
        ajaxFileUpload();
        
    }
    else {

        url = "parseJSON.php?url=" + $("#url").val();
        $.getScript(url, function () {
            //runCode();
			runDebug();
			loadDataIntoViewer();
        });
	    $("#view").show();
		var type = $("#datatype").html();
		//alert(type);
		if (type == "us_statistics") {
			$("." + type).fadeIn();
		}
		if (type == "numeric") {
			$("." + type).fadeIn();
		}
		if (type == "grouped") {
			$("." + type).fadeIn();
		}
		if (type == "stacked") {
			$("." + type).fadeIn();
		}
	    //$(".plottype").hide();
		//$("#plottypes").show();
		//$("." + type).fadeIn();
    }

   


    return false;
});

temp = 0;

// Toggle debug viewer
$(".debug").click(function () {
	if (debugOn) {
		debugOn = 0;
		$(this).val("debug OFF");
		$("#debugViewer").hide();
	} else {
		debugOn = 1;
		$(this).val("debug ON");
		$("#debugViewer").show();	
	}
});

$(".about").click(function () {	
	$("#aboutViewer").slideToggle();

});

$(".gallery").click(function () {	
	$("#galleryViewer").slideToggle();
});

$(".save").click(function () {	
	$("#saveViewer").slideToggle();
});

function loadDataIntoViewer() {
	var ppTable = prettyPrint(data);
	$("#dataViewer").html(ppTable);
}

// View the data
function viewData(location) {
	var c = editor.getSearchCursor("view", true, true);
	if(c.findNext()) { 
    c.select(); 
	} 

    if (!dataTableOpen) {
		loadDataIntoViewer();
        $(".databuttons").fadeIn();
        $("#dataViewer").animate({
            height: "200px"
        });
        $(".2").bind("click", function () {
            // This is done multiple times but the last one is what we want.
            var index = ($(this).parent().find(".1:first").html());
		
        });
        dataTableOpen = 1;
		$(".2").editable("save.php", { 

		});
    }

    if (location == undefined) {

    } else {

        $(".1").each(function () {

            if ($(this).html() == location) {
                $(this).effect("highlight", {}, 4000);

                $('#dataViewer').animate({
                    scrollTop: temp + $(this).position().top - 100
                });
                temp = temp + $(this).position().top - 100;
            }
        });
    }
}

// Reload the data
$("#view, .reloadViewData").click(function () {
    dataTableOpen = 0;
    viewData();
});


// Hide the data
$(".hideViewData").click(function() {
	$("#dataViewer").animate({ 
        height: "0px"
      });
	dataTableOpen = 0;
	$(".databuttons").fadeOut();
});

function countItems(a, s) {
	counter = 0;
    for (x = 0; x < a.length; x++) {
    	if (a[x] == s) {
    		counter++;
    	}
    }
    return counter;
}


// Do all the backend stuff
function uglifyData(code) {
	var len = variablesToUse.length;
	var types = variableTypes;

	for(var i=1; i<=len; i++) {
		reg = new RegExp('\\|quantitative'+i+'\\|', 'gi');
		code = code.replace(reg, variablesToUse[i-1])
	}

	for(var i=1; i<=len; i++) {
		maxval = 0;

		for(var j=0; j<data.length; j++) {
			// Sanitize data
			if (variableTypes[i-1] == "quantitative") {
				// Check if the data is indeed numerical:
				curval = data[j][variablesToUse[i-1]];
				if (!isNaN(curval)) {
					if (parseFloat(curval) > parseFloat(maxval)) {
							maxval = curval;
		
					}
				} else {
					// It's a string containing numbers?
					curval = curval.replace(",", "");
				 	data[j][variablesToUse[i-1]] = curval;
					if (tryParseInt(curval, 0) != 0)	{
						if (parseFloat(curval) > parseFloat(maxval)) {
							maxval = curval;
		
						}
					}
				}
			}
		}
		reg = new RegExp('\\|maxquantitative'+i+'\\|', 'gi');
		code = code.replace(reg, parseInt(Math.ceil(maxval)))
	}
	editor.setCode(code);
	runCode();	
//alert("here");

}

function getContent(type, prettyname) {
	$.ajax({
	  type: "POST",
	  url: 'getContent.php',
	  data: "type=" + type,
	  success: function(data) {
		uglifyData(data);
		$(".chartcodetype").html(prettyname);	
	  }
	});
}

function lookupSyntax(type) {
	$.ajax({
	  type: "POST",
	  url: 'lookup.php',
	  data: "type=" + type,
	  success: function(data) {
		$("#syntax").html(data);
		$("#syntax").slideDown();
	  }
	});
}


function setSession(id) {
	$.ajax({
	  type: "POST",
	  url: 'setSession.php',
	  data: "id=" + id,
	  success: function(data) {
		window.location.reload()
	  }
	});
}

// Sets the user session

$("#session").submit(function() {
	setSession($("#sessionid").val());
	return false;
});

function viewHelp(content) {
	if (content == "predictions") {
		var recipe =  window.open('','Help with data','width=600,height=600');
	
	    var html = '<?php include("help.txt") ?>';
	    recipe.document.open();
	    recipe.document.write(html);
	    recipe.document.close();
	
	    return false;
	}
}

//. Get the SVG
$("#samples").click(function() {
	var recipe =  window.open('','Samples','width=600,height=600');

    var html = '<?php include("samples.txt") ?>';
    recipe.document.open();
    recipe.document.write(html);
    recipe.document.close();

    return false;
});

//. Get the SVG
$("#extract").click(function() {
	var recipe =  window.open('','SVG content','width=600,height=600');

    var html = '<html><head><title>SVG content</title></head><body>Save the following into a blank text file and save as .svg<div id="content"><textarea cols="70" rows="30">' + vis.scene[0].canvas.innerHTML + '</textarea></div></body></html>';
    recipe.document.open();
    recipe.document.write(html);
    recipe.document.close();

    return false;
});

// Render the suggestions
$(".clickable").click(function() {
	var type = $(this).find("img").attr("id");

	if (type == "choropleth") {
		$(".map").show();
	}

	var name = $(this).find("img").attr("alt");
	getContent(type, name);
});

// Load the snippets
$(".snippet").click(function() {
	var codeid = $(this).attr("id");
	$.ajax({
	  type: "POST",
	  url: 'getSnippet.php',
	  data: "type=" + codeid,
	  success: function(data) {
			var content = editor.getCode();	
			content = content.replace("vis.render();", "");
			content += data;
			content += "\n\nvis.render();";
			editor.setCode(content);
			editor.jumpToLine(editor.lastLine())
			runCode();
	  }
	});
})

// Dock everything
function dockAll() {
	$("#leftside").draggable();
	$("#rightside").draggable();
	$("#middle").draggable();
	$("#dataViewer").resizable();
	$(".ui-icon ui-icon-gripsmall-diagonal-se").css("float", "left;");
}
// Dock everything
function undockAll() {
	$("#leftside").draggable("destroy");
	$("#rightside").draggable("destroy");
	$("#middle").draggable("destroy");
	$("#dataViewer").resizable("destroy");
}

$(".dock").click(function() {
	if (dock) {
		$(this).html("Undock");
		dock = 0;
		undockAll();
	} else {
		$(this).html("Dock");
		dock = 1;
		dockAll();
	}
});
$(".brew").click(function() {
	var src = $(this).attr("src");

	$(".brew").css("border", "3px solid #08306b");
	$(this).css("border", "3px solid #fff");

	var hue = $(this).attr("src").split("/")[1].split(".")[0];
	var dataclasses = $("#dataclasses").val();	
	var colorstring = JSON.stringify(gvcolors[hue+dataclasses]);

	$.ajax({
	  type: "POST",
	  url: 'getColors.php',
	  data: "hue=" + hue + "&classes=" + dataclasses + "&colorstring=" + colorstring,
	  success: function(data) {
			var content = editor.getCode();	
			content = content.replace("vis.render();", "");
			content += data;
			content += "\n\nvis.render();";
			editor.setCode(content);
			editor.jumpToLine(editor.lastLine())
			runCode();
	  }
	});
});

$("#datatype").html($("#selector option:selected").text());
