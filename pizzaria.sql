-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 28/06/2026 às 04:11
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

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
-- Estrutura para tabela `funcionario`
--

CREATE TABLE `funcionario` (
  `id` int(11) NOT NULL,
  `NomeCompleto` varchar(50) NOT NULL,
  `Email` varchar(256) NOT NULL,
  `CPF` varchar(11) NOT NULL,
  `Telefone` varchar(11) NOT NULL,
  `Cargo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `funcionario`
--

INSERT INTO `funcionario` (`id`, `NomeCompleto`, `Email`, `CPF`, `Telefone`, `Cargo`) VALUES
(1, 'Heitor Rauber Scussiato', 'scussiatoh@gmail.com', '12345678901', '49988587906', 'Gerente'),
(2, 'Fulano', 'fulano@gmail.com', '123123131', '3216554', 'alguma coisa');

-- --------------------------------------------------------

--
-- Estrutura para tabela `item`
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
-- Despejando dados para a tabela `item`
--

INSERT INTO `item` (`id`, `Nome`, `Valor`, `Imagem`, `Venda`, `Resumo`, `Igredientes`, `Tipo`) VALUES
(1, 'Pizza Margherita', 39.9, 'https://placehold.co/400x300?text=Pizza+Margherita', 0, 'Clássica italiana', 'Molho de tomate, mussarela, manjericão, azeite', 'Salgada'),
(2, 'Pizza Calabresa', 42.9, 'https://placehold.co/400x300?text=Pizza+Calabresa', 1, 'A mais pedida da casa', 'Molho de tomate, mussarela, calabresa, cebola', 'Salgada'),
(3, 'Pizza Quatro Queijos', 45.9, 'https://placehold.co/400x300?text=Pizza+4+Queijos', 0, 'Para quem ama queijo', 'Mussarela, provolone, parmesão, catupiry', 'Salgada'),
(4, 'Pizza Portuguesa', 44.9, 'https://placehold.co/400x300?text=Pizza+Portuguesa', 0, 'Recheio completo', 'Presunto, ovos, cebola, ervilha, mussarela', 'Salgada'),
(5, 'Pizza Frango Catupiry', 43.9, 'https://placehold.co/400x300?text=Pizza+Frango+Catupiry', 1, 'Cremosa e saborosa', 'Frango desfiado, catupiry, milho', 'Salgada'),
(6, 'Coca-Cola 2L', 12, 'https://placehold.co/400x300?text=Coca-Cola+2L', 0, 'Refrigerante gelado', 'Água gaseificada, açúcar, corante caramelo', 'Bebida'),
(7, 'Guaraná 2L', 10, 'https://placehold.co/400x300?text=Guarana+2L', 0, 'Refrigerante nacional', 'Água gaseificada, extrato de guaraná', 'Bebida'),
(8, 'Suco de Laranja', 8, 'https://placehold.co/400x300?text=Suco+de+Laranja', 0, 'Suco natural', 'Laranja, água, açúcar', 'Bebida'),
(9, 'Petit Gateau', 18, 'https://placehold.co/400x300?text=Petit+Gateau', 1, 'Sobremesa quentinha', 'Chocolate, manteiga, ovos, sorvete', 'Sobremesa'),
(11, 'pizza goxtosa hmm', 8001.5, 'https://static.wikia.nocookie.net/pizzatower/images/e/e1/Spr_vspizzaface_0.png/revision/latest/scale-to-width-down/250?cb=20230128141846', 1, 'teste kkkkkk', 'Mussarela\r\nTomate\r\nAzeitona\r\nAlho\r\nMilho\r\nFilé Mignon\r\nTomate\r\nRúcula', 'Salgada'),
(12, 'pizza goxtosa hmm 2', 8001.5, 'https://recipesbyclare.com/cdn-cgi/image/fit=cover,width=1280,height=1280,format=auto/assets/images/1747742682989-ae0zopfm.webp', 1, 'teste kkkkkk 2', '\r\n', 'Doce'),
(13, 'pizza goxtosa hmm 3', 0.5, 'https://www.image2url.com/r2/default/images/1782234523195-b31dd0b0-e69f-4fbd-904f-ca3a90a36834.png', 1, 'pizza de viadagem', '5 Queijos\r\nPesto\r\nAtum\r\nBacon\r\nCalabresa\r\nFilé Mignon\r\nFrango Desfiado\r\nOvo\r\nPepperoni\r\nPresunto', 'Vegetariana'),
(14, 'pizza goxtosa hmm testew', 0, '', 1, '', '', '');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedido`
--

CREATE TABLE `pedido` (
  `id` int(11) NOT NULL,
  `NomePedido` varchar(25) DEFAULT NULL,
  `NomeCliente` varchar(25) DEFAULT NULL,
  `Observacoes` text NOT NULL,
  `Pagamento` text NOT NULL,
  `Itens` text NOT NULL,
  `Valor` float NOT NULL,
  `Status` varchar(20) NOT NULL DEFAULT 'Pendente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pedido`
--

INSERT INTO `pedido` (`id`, `NomePedido`, `NomeCliente`, `Observacoes`, `Pagamento`, `Itens`, `Valor`, `Status`) VALUES
(1, 'PEDIDO-6a359f8f103d7', '68764', '4', 'PIX', 'Pizza 1, Pizza 2, Pizza 3', 50.5, 'Concluido'),
(2, 'PEDIDO-6679119', 'TEste', 'Memes, tipos de carinhas são', 'pix', 'pizza goxtosa hmm 2, pizza goxtosa hmm 3, ', 8002, 'Concluido'),
(3, 'PEDIDO-9394744', '', '', 'pix', 'Pizza Margherita, Pizza Calabresa', 0, 'Concluido'),
(4, 'PEDIDO-d56e625e81d0', 'ALex', 'Sem azeitona', 'aVista', 'Pizza Margherita, pizza goxtosa hmm 3,', 40.4, 'Concluido'),
(5, 'PEDIDO-0c03f3c55251', 'alex', '', 'credito', 'Pizza Margherita,', 39.9, 'Concluido'),
(6, 'PEDIDO-6aacbbe9055f', 'alex', '', 'pix', 'Pizza Margherita,', 39.9, 'Concluido'),
(7, 'PEDIDO-4fe5cba674a0', 'Junior', 'Sem azeitona', 'credito', 'pizza goxtosa hmm 2, pizza goxtosa hmm 3,', 8002, 'Concluido');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtoestoque`
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
-- Estrutura para tabela `venda`
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
-- Despejando dados para a tabela `venda`
--

INSERT INTO `venda` (`id`, `IdPedido`, `Valor`, `Status`, `DataPedido`, `Pagamento`) VALUES
(1, 1, 292.3, 'Processando', '2026-06-19', 'credito'),
(2, 0, 40.4, 'Processando', '2026-06-28', 'aVista'),
(3, 0, 39.9, 'Processando', '2026-06-28', 'credito'),
(4, 0, 39.9, 'Processando', '2026-06-28', 'pix'),
(5, 0, 8002, 'Processando', '2026-06-28', 'credito');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `funcionario`
--
ALTER TABLE `funcionario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Índices de tabela `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Índices de tabela `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `produtoestoque`
--
ALTER TABLE `produtoestoque`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Índices de tabela `venda`
--
ALTER TABLE `venda`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Venda_fk1` (`IdPedido`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `funcionario`
--
ALTER TABLE `funcionario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `produtoestoque`
--
ALTER TABLE `produtoestoque`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `venda`
--
ALTER TABLE `venda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
