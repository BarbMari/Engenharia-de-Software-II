-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 19-Jun-2026 às 22:01
-- Versão do servidor: 10.4.27-MariaDB
-- versão do PHP: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `pizzaria`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `funcionario`
--

CREATE TABLE `funcionario` (
  `id` int(11) NOT NULL,
  `NomeCompleto` varchar(50) NOT NULL,
  `Email` varchar(256) NOT NULL,
  `CPF` varchar(11) NOT NULL,
  `Telefone` varchar(11) NOT NULL,
  `Cargo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `Nome` varchar(25) NOT NULL,
  `Valor` float NOT NULL,
  `Imagem` text DEFAULT NULL,
  `Venda` tinyint(1) NOT NULL,
  `Resumo` text DEFAULT NULL,
  `Igredientes` text DEFAULT NULL,
  `Tipo` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `item`
--

INSERT INTO `item` (`id`, `Nome`, `Valor`, `Imagem`, `Venda`, `Resumo`, `Igredientes`, `Tipo`) VALUES
(1, 'Pizza Margherita', 39.9, 'https://placehold.co/400x300?text=Pizza+Margherita', 0, 'Clássica italiana', 'Molho de tomate, mussarela, manjericão, azeite', 'Pizza'),
(2, 'Pizza Calabresa', 42.9, 'https://placehold.co/400x300?text=Pizza+Calabresa', 1, 'A mais pedida da casa', 'Molho de tomate, mussarela, calabresa, cebola', 'Pizza'),
(3, 'Pizza Quatro Queijos', 45.9, 'https://placehold.co/400x300?text=Pizza+4+Queijos', 0, 'Para quem ama queijo', 'Mussarela, provolone, parmesão, catupiry', 'Pizza'),
(4, 'Pizza Portuguesa', 44.9, 'https://placehold.co/400x300?text=Pizza+Portuguesa', 0, 'Recheio completo', 'Presunto, ovos, cebola, ervilha, mussarela', 'Pizza'),
(5, 'Pizza Frango Catupiry', 43.9, 'https://placehold.co/400x300?text=Pizza+Frango+Catupiry', 1, 'Cremosa e saborosa', 'Frango desfiado, catupiry, milho', 'Pizza'),
(6, 'Coca-Cola 2L', 12, 'https://placehold.co/400x300?text=Coca-Cola+2L', 0, 'Refrigerante gelado', 'Água gaseificada, açúcar, corante caramelo', 'Bebida'),
(7, 'Guaraná 2L', 10, 'https://placehold.co/400x300?text=Guarana+2L', 0, 'Refrigerante nacional', 'Água gaseificada, extrato de guaraná', 'Bebida'),
(8, 'Suco de Laranja', 8, 'https://placehold.co/400x300?text=Suco+de+Laranja', 0, 'Suco natural', 'Laranja, água, açúcar', 'Bebida'),
(9, 'Petit Gateau', 18, 'https://placehold.co/400x300?text=Petit+Gateau', 1, 'Sobremesa quentinha', 'Chocolate, manteiga, ovos, sorvete', 'Sobremesa'),
(10, 'Pão de Alho', 15, 'https://placehold.co/400x300?text=Pao+de+Alho', 0, 'Entrada tradicional', 'Pão francês, alho, manteiga, ervas', 'Entrada');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pedido`
--

CREATE TABLE `pedido` (
  `id` int(11) NOT NULL,
  `NomePedido` varchar(25) DEFAULT NULL,
  `NomeCliente` varchar(25) DEFAULT NULL,
  `Observacoes` text NOT NULL,
  `Pagamento` text NOT NULL,
  `Itens` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `pedido`
--

INSERT INTO `pedido` (`id`, `NomePedido`, `NomeCliente`, `Observacoes`, `Pagamento`, `Itens`) VALUES
(1, 'PEDIDO-6a359f8f103d7', '68764', '4', 'PIX', 'Pizza 1, Pizza 2, Pizza 3');

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtoestoque`
--

CREATE TABLE `produtoestoque` (
  `id` int(11) NOT NULL,
  `Nome` varchar(20) NOT NULL,
  `Categoria` varchar(10) DEFAULT NULL,
  `Quantidade` int(11) NOT NULL,
  `Unidade` varchar(10) DEFAULT NULL,
  `CustoUn` float NOT NULL,
  `DataEntrega` date NOT NULL,
  `DataValidade` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `venda`
--

CREATE TABLE `venda` (
  `id` int(11) NOT NULL,
  `IdPedido` int(11) NOT NULL,
  `Valor` float NOT NULL,
  `Status` varchar(20) NOT NULL,
  `DataPedido` date NOT NULL,
  `Pagamento` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `venda`
--

INSERT INTO `venda` (`id`, `IdPedido`, `Valor`, `Status`, `DataPedido`, `Pagamento`) VALUES
(1, 1, 292.3, 'Processando', '2026-06-19', 'credito');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `funcionario`
--
ALTER TABLE `funcionario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Índices para tabela `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Índices para tabela `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Pedido_fk4` (`Itens`);

--
-- Índices para tabela `produtoestoque`
--
ALTER TABLE `produtoestoque`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Índices para tabela `venda`
--
ALTER TABLE `venda`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Venda_fk1` (`IdPedido`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `funcionario`
--
ALTER TABLE `funcionario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `produtoestoque`
--
ALTER TABLE `produtoestoque`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `venda`
--
ALTER TABLE `venda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `Pedido_fk4` FOREIGN KEY (`Itens`) REFERENCES `item` (`id`);

--
-- Limitadores para a tabela `venda`
--
ALTER TABLE `venda`
  ADD CONSTRAINT `Venda_fk1` FOREIGN KEY (`IdPedido`) REFERENCES `pedido` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
