CREATE TABLE IF NOT EXISTS `Venda` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`Valor` float NOT NULL,
	`Status` varchar(20) NOT NULL,
	`DataPedido` date,
	`Pagamento` varchar(15),
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `Pedido` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`NomePedido` varchar(25),
	`NomeCliente` varchar(25),
	`Observacoes` text NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `Item` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`Nome` varchar(25) NOT NULL,
	`Valor` float NOT NULL,
	`Imagem` blob,
	`Venda` boolean NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `Funcionario` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`NomeCompleto` varchar(50) NOT NULL,
	`Email` varchar(256) NOT NULL,
	`CPF` varchar(11) NOT NULL,
	`Telefone` varchar(11) NOT NULL,
	`Cargo` varchar(20) NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `ProdutoEstoque` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`Nome` varchar(20) NOT NULL,
	`Categoria` varchar(10),
	`Quantidade` int NOT NULL,
	`Unidade` varchar(10),
	`CustoUn` float NOT NULL,
	`DataEntrega` date NOT NULL,
	`DataValidade` date NOT NULL,
	PRIMARY KEY (`id`)
);