<?php
if ($_SESSION['sessionid'] =='') {
	session_start();
	$_SESSION['sessionid'] = session_id();
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"> 

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"> 
<head>
<title>Protoviewer &alpha;</title> 
<meta http-equiv="Content-Type" content="text/xml; charset=UTF-8" /> 
<meta name="description" content="rioleo is the website of Rio Akasaka, with writings and musings on the latest web trends and life, advertising, design, fonts, and news." /> 
<meta name="keywords" content="web design, cURL, wordpress, AJAX, designer, domain name, pagerank" /> 
<meta name="author" content="Rio Akasaka" /> 
<meta name="robots" content="all" /> 
<meta name="verify-v1" content="tH+FVPvf706EPYtTv/TB9K64zwha4PL5doYLCitApuY=" /> 
<link rel="stylesheet" type="text/css" href="style.css" />  
<link rel="stylesheet" href="vs.css" />
<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/themes/base/jquery-ui.css" type="text/css" media="all" />
<link rel="stylesheet" href="http://static.jquery.com/ui/css/demo-docs-theme/ui.theme.css" type="text/css" media="all" />
<script type="text/javascript" src="lint/adsafe.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js" type="text/javascript"></script>

<!--[if IE]>
    <script type="text/javascript" src="svgweb/svg.js" data-path="svgweb"></script>
<![endif]-->
<script type="text/javascript" src="js/codemirror.js"></script>
<script type="text/javascript" src="js/mirrorframe.js"></script>
<script type="text/javascript" src="protovis-r3.2.js"></script>
<script type="text/javascript" src="json2.js"></script>
<script type="text/javascript" src="json/extra/firstrun.js"></script>
<script type="text/javascript" src="ajaxfileupload.js"></script>
<script type="text/javascript" src="json/us_lowres.js"></script>
<script type="text/javascript" src="json/centroid.js"></script>
<script type="text/javascript" src="brewercolors.js"></script>
<script type="text/javascript" src="jquery.editable.js"></script>
<script type="text/javascript" src="lint/fulljslint.js"></script>


<script type="text/javascript" src="prettyprint.js"></script>
</head> 
<body> 
 <div id="header">
	<div class="leftwrapper">
		<h1>proto/viewer</h1><small><em>a visual design environment for protovis</em></small>
	</div>
	<div class="rightwrapper">


	<div class="dataManipulation">
		<input type="button" class="debug hidden" value="debug OFF" />
		<input type="button" class="about" value="about" />
		<input type="button" class="save" value="save/restore" />
		<input type="button" class="dock" value="undock" />
		<input type="button" class="databuttons hidden hideViewData" value="hide data" />
		<input type="button" class="databuttons hidden reloadViewData" value="reload data" />
		<input type="button" class="databuttons hidden exportViewData" value="export data" />

	</div>
	</div>
</div>

<div class="errorsdisplay hidden"></div>
<div class="errorsdisplaytextarea hidden">
<textarea id="errorcode"></textarea>
</div>

<div id="dataViewer"></div>

<div id="aboutViewer" class="hidden">
<?php include("about.txt"); ?>
</div>

<div id="debugViewer" class="hidden"></div>

<div id="saveViewer" class="hidden">
<p><strong>Your session id is <form id="session" onSubmit="return false;"><input type="text" class="text" id="sessionid" value="<?php echo $_SESSION['sessionid']; ?>" /></form></strong>Save your workspace by holding on to your session id. Because the application is JavaScript-intensive, the application does not save your work for you.</p><input type="button" class="savedata" value="Save now &raquo;"> <input type="button" class="restoredata" value="Restore &raquo;"> <em><span class="sessionstatus"></span></em></p>

</div>


<div id="leftside">
<p><strong>Upload your own data</strong><br />
CSV (Excel/text), or text JSON (max 1MB) (<a href="#" id="samples">Samples</a>)<br />

<input type="hidden" name="MAX_FILE_SIZE" value="400" />
<input type="file" class="short" name="fileToUpload" id="fileToUpload" /> or URL: <input type="text" id="url" value="http://www.rioleo.org/protoviewer/json/dot.js" name="url" />
<br />or  curated: 

<select name="url" id="selector">
	<option value="http://www.rioleo.org/protoviewer/json/dot.js">dot</option>
	<option value="http://www.rioleo.org/protoviewer/json/numeric.js">numeric</option>
	<option value="http://www.rioleo.org/protoviewer/json/numeric3.js">grouped</option>
	<option value="http://www.rioleo.org/protoviewer/json/bullets.js">bullets</option>
	<option value="http://www.rioleo.org/protoviewer/json/barley.js">barley</option>
	<option value="http://www.rioleo.org/protoviewer/json/stacked.js">stacked</option>
	<option value="http://www.rioleo.org/protoviewer/json/us_stats.js">us_statistics</option>
</select>
<div id="datatype" class="hidden"></div>
<input type="button" name="submit" id="process" value="Load data" /> <input type="button" name="button" id="clear" value="Clear" /><img src="ajax-loaderlight.gif" class="hidden" id="loading" alt="Loading" /> <input type="submit" name="submit" class="hidden" id="view" value="View/modify data" />
</p>

<div class="debugViewer"></div>

<div id="plottypes" class="hidden">
<div class="clickable plottype dot"><img src="types/scatterpoint.jpg" alt="Scatter Plot" id="pointing" class="amazon thumb" /></div>
<div class="clickable plottype numeric"><img src="types/pie.jpg" alt="Pie Chart" id="pie" class="amazon thumb" /></div>
<div class="clickable plottype numeric"><img src="types/bar.jpg" alt="Bar Chart" id="bar" class="amazon thumb" /></div>
<div class="clickable plottype dot"><img src="types/scatter" id="scatter" alt="Scatterplot" class="amazon thumb" /></div>
<div class="clickable plottype dot"><img src="types/lineandstep.jpg" alt="Line and Step" id="lineandstep" class="amazon thumb" /></div>
<div class="clickable plottype dot"><img src="types/area.jpg" id="area" alt="Area Chart" class="amazon thumb" /></div>
<div class="clickable plottype stacked"><img src="types/stacked.jpg" id="stacked" alt="Stacked Chart" class="amazon thumb" /></div>
<div class="clickable plottype grouped"><img src="types/grouped.jpg" id="grouped" alt="Grouped Bar Chart" class="amazon thumb" /></div>
<div class="clickable plottype us_statistics"><img src="types/choropleth.jpg" id="choropleth" alt="Choropleth" class="amazon thumb" /></div>
<div class="clickable plottype us_statistics"><img src="types/symbol.jpg" id="symbol" alt="Symbol Map" class="amazon thumb" /></div>
</div>


 </div>
 
 
  <div id="middle">
  <div class="renderarea">
 <div id="center"><div id="fig">
   <script type="text/javascript">
	<?php include("scripts/burtin.js") ?>
   </script>
 </div></div>

   </div>
 </div>
 
  <div id="rightside">
	<div id="title">
	<h2 class="chartcodetype">Welcome</h2> 
	</div> 
	<div id="buttons"><input id="autoupdate" type="button" value="Auto update ON" /> <input id="manualupdate" class="hidden" type="button" value="Update" /> <input id="lookup" type="submit" value="Lookup" /> <input id="extract" type="submit" value="Save SVG" /></div>
<div style="clear:both;width:100%"></div>
    <p>

    <textarea id="code" class="code"><?php include("scripts/burtin.js") ?></textarea></p>

	<div class="block">
	<h3>Snippets</h3>
	
	<p>Snippets are pieces of reusable code you can add to your plot</p>
	<p><input type="button" class="snippet" id="text" value="Add text" /></p>
	</div>
	
	<div class="map block hidden">
	<h3>Map colors</h3>
	<p>Choose from available ColorBrewer combinations</p>
<p>Number of data classes</p>
<select id="dataclasses" name="dataclasses">
	<option value="1">1</option>
	<option value="2">2</option>
	<option value="3">3</option>
	<option value="4">4</option>
	<option value="5">5</option>
	<option value="6">6</option>
	<option selected value="7">7</option>
	<option value="8">8</option>
	<option value="8">9</option>
</select>
	<p>
<img src="colorbrewer/bugn.jpg" class="brew" />
<img src="colorbrewer/bupu.jpg" class="brew" />
<img src="colorbrewer/gnbu.jpg" class="brew" />
<img src="colorbrewer/orrd.jpg" class="brew" />
<img src="colorbrewer/pubu.jpg" class="brew" />
<img src="colorbrewer/pubugn.jpg" class="brew" />
<img src="colorbrewer/purd.jpg" class="brew" />
<img src="colorbrewer/rdpu.jpg" class="brew" />
<img src="colorbrewer/ylgn.jpg" class="brew" />
<img src="colorbrewer/ylgnbu.jpg" class="brew" />
<img src="colorbrewer/ylorbr.jpg" class="brew" />
<img src="colorbrewer/ylorrd.jpg" class="brew" />
</p>

	</div>


	<div id="syntax" class="hidden"></div>


 
 
 </div>
 
 <script type="text/javascript">

// Set autoUpdate to be true
var autoUpdate = 1;
var dock = 0;
var debugOn = 0;
var textarea = document.getElementById('code');
var dataTableOpen = 0;
var aboutOpen = 0;
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

// Update the Protovis code
function runCode() {
    $("#fig").html("");
    var head = document.getElementById("fig");
    var script = document.createElement("script");
    var content = editor.getCode();
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
		//runDebug();
		loadDataIntoViewer();
	    $("#view").show();	
		$("#plottypes").show();
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

// Put things into debugViewer
function runDebug() {
    $("#debugViewer").html("");
	$(".debugViewer").html("");
    var firstRow = data[0];
    var length = data[0].length;

	
    if (length != undefined) {
        // Todo: generalize this
        length = data[0][0].length;
        firstRow = data[0][0];
    }
    if (length === undefined) {
        for (property in firstRow) {
            //$(".debugViewer").append(property + "<br />");
        }
    } else {


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



$(".savedata").click(function() {


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
});

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
				$("#saveViewer").slideUp();
			});	

		  }
		});	
	  }
	});
}


// Load the data
$("#process").click(function () {
 	$("#fig").html("");
	$("#plottypes").hide();
	$(".errorsdisplay").slideUp(function() {
		$(this).html("");
	});
	$(".errorsdisplaytextarea").slideUp();
    if ($(".short").val() != "") {
        ajaxFileUpload();
        
    }
    else {

        url = "parseJSON.php?url=" + $("#url").val();
        $.getScript(url, function () {
            //runCode();
			//runDebug();
			loadDataIntoViewer();
        });
	    $("#view").show();
		var type = $("#datatype").html();
	
	    $(".plottype").hide();
		$("#plottypes").show();
		$("." + type).fadeIn();
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
$(".save").click(function () {	
	$("#saveViewer").slideToggle();
});

function loadDataIntoViewer() {
	var ppTable = prettyPrint(data);
	$("#dataViewer").html(ppTable);
}

// View the data
function viewData(location) {
	
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


function getContent(type, prettyname) {
	$.ajax({
	  type: "POST",
	  url: 'getContent.php',
	  data: "type=" + type,
	  success: function(data) {
	  	editor.setCode(data);
	  	runCode();	
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

//. Get the SVG
$("#samples").click(function() {
	var recipe =  window.open('','SVG content','width=600,height=600');

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
		$(this).val("undock");
		dock = 0;
		undockAll();
	} else {
		$(this).val("dock");
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
runPostCode();
</script>

<!-- Start of StatCounter Code -->
<script type="text/javascript">
var sc_project=6427597; 
var sc_invisible=0; 
var sc_security="e3ba0267"; 
</script>


<div id="JSLINT_" class="hidden">

<textarea id="JSLINT_INPUT"></textarea>

<input type="button" name="jslint" id="submitjslint" value="JSLint">

<div id="JSLINT_OUTPUT" style="text-align: left;">
</div>
<script>
"use strict";
ADSAFE.id("JSLINT_");
</script>

<script src="lint/fullinit_ui.js"></script>
<script>
"use strict";
ADSAFE.go("JSLINT_", function (dom, lib) {
    lib.init_ui(dom);
});
</script>

<script type="text/javascript"
src="http://www.statcounter.com/counter/counter.js"></script><noscript><div
class="statcounter"><a title="web statistics"
href="http://statcounter.com/free_web_stats.html"
target="_blank"><img class="statcounter"
src="http://c.statcounter.com/6427597/0/e3ba0267/0/"
alt="web statistics" ></a></div></noscript>
<!-- End of StatCounter Code -->
</body>
</html>
