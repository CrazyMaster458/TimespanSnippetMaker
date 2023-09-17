<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <?php
            // try {
            //     $pdo = new PDO("mysql:host=localhost;dbname=mydatabase", "username", "password");
            //     echo "Connected successfully";
            // } catch (PDOException $e) {
            //     echo "Connection failed: " . $e->getMessage();
            // }
            $pdo = new PDO("mysql:host=localhost;dbname=mydatabase", "username", "password");

            $stmt = $pdo->query('SELECT * FROM hashtag');
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo $results;
        ?>
    </div>
</body>
</html>
