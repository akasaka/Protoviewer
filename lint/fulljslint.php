<?php
$data = $_POST["data"];
?>

<script src="adsafe.js"></script> 
<script src="json2.js"></script> 

<script src="fulljslint.js"></script>

<div id="JSLINT_">

<textarea id="JSLINT_INPUT"></textarea>

    <input type="button" name="jslint" value="JSLint">

<div id="JSLINT_OUTPUT" style="text-align: left;">
</div>


<script>
"use strict";
ADSAFE.id("JSLINT_");
</script>

<script src="fullinit_ui.js"></script>
<script>
"use strict";
ADSAFE.go("JSLINT_", function (dom, lib) {
    lib.init_ui(dom);
});
</script>

</div>