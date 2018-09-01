<?php
$fileContent = file_get_contents('./' . $jsFilename, true);
echo "<script> \r\n" . $fileContent . " \r\n </script> \r\n";
?>