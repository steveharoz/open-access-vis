<?php
$csv = array_map('str_getcsv', file('2018/openaccessvis2018.csv'));
array_walk($csv, function(&$a) use ($csv) {
  $a = array_combine($csv[0], $a);
});
array_shift($csv); # remove column header

foreach ($csv as &$value) {
    #print('<a href="' . $value['AuthorPDF'] . '">');
    print($value['ReviewVenue'] . ': ' . $value['Title'] . ' ' . $value['Authors']);
    if ($value['AuthorPDF'] !== "")
        print(' PDF');
    if ($value['SourceMaterials'] !== "")
        print(' Open Materials badge');
    if ($value['Data'] !== "")
        print(' Open Data badge');
    if ($value['Preregistered'] !== "")
        print(' Preregistered badge');
    #print('</a>');
    #print_r($value);
    print("\n<br>\n");
}
?>