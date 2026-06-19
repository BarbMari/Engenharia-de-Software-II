<?php
    class connection {
        private $username = 'root';
        private $password = '';
        private $dbname = 'pizzaria';
        private $host = 'localhost';
        private $charset = 'utf8mb4';
 
        public function connect() {
            try {
                $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset};";
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ];
                return new PDO($dsn, $this->username, $this->password, $options);
            } catch (PDOException $e) {
                die("A conexão fez 'capuft' \n" . $e->getMessage());
            }
        }
    }
?>