<?php
$fileContent = file_get_contents('./' . $dataFilename, true);
echo "<script> var dataString = `" . $fileContent . "`; </script> \r\n";
?>