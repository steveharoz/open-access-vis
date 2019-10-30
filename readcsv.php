<?php
$csv = array_map('str_getcsv', file($dataFilename));
array_walk($csv, function(&$a) use ($csv) {
  $a = array_combine($csv[0], $a);
});
array_shift($csv); # remove column header

foreach ($csv as &$value) {
    #print('<a href="' . $value['AuthorPDF'] . '">');
    print($value['ReviewVenue'] . ': ' . $value['Title']);
    if ($value['AuthorPDF'] !== "")
        print(' PDF. ');
    else
        print(' NOT FOUND. ');
    print($value['Authors']);
    if ($value['Preregistered'] !== "")
        print(' Preregistered');
    if ($value['DataCollectionMaterials'] !== "")
        print(' Open Materials');
    if ($value['Data'] !== "")
        print(' Open Data badge');
    if ($value['ComputationalMatrials'] !== "")
        print(' Open Materials');
    #print('</a>');
    #print_r($value);
    print("\n<br>\n");
}
?>