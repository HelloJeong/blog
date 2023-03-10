<?php
  $db_dsn = array( 
    'host' => 'localhost',
    'dbname' => 'firstDB',
    'charset' => 'utf8'
  );

  $dsn = 'mysql:'.http_build_query($db_dsn, '', ';');

  $db_user = 'root';
  $db_pass = '1234';

  $pdo = new PDO($dsn, $db_user, $db_pass);

  $result = array();

  $query = "SELECT * FROM user";
  
  $runQuery = $pdo->query($query);
  while($row = $runQuery->fetchAll(PDO::FETCH_ASSOC)) {
    $result[] = $row;
  }

  echo json_encode(["data"=>$result]);

?>