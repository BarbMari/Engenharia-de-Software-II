-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 28/06/2026 às 04:24
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
(1, 'Pizza Margherita', 39.9, 'https://placehold.co/400x300?text=Pizza+Margherita', 1, 'Clássica italiana', 'Molho de tomate, mussarela, manjericão, azeite', 'Salgada'),
(2, 'Pizza Calabresa', 42.9, 'https://placehold.co/400x300?text=Pizza+Calabresa', 1, 'A mais pedida da casa', 'Molho de tomate, mussarela, calabresa, cebola', 'Salgada'),
(3, 'Pizza Quatro Queijos', 45.9, 'https://placehold.co/400x300?text=Pizza+4+Queijos', 1, 'Para quem ama queijo', 'Mussarela, provolone, parmesão, catupiry', 'Salgada'),
(4, 'Pizza Portuguesa', 44.9, 'https://placehold.co/400x300?text=Pizza+Portuguesa', 1, 'Recheio completo', 'Presunto, ovos, cebola, ervilha, mussarela', 'Salgada'),
(5, 'Pizza Frango Catupiry', 43.9, 'https://placehold.co/400x300?text=Pizza+Frango+Catupiry', 1, 'Cremosa e saborosa', 'Frango desfiado, catupiry, milho', 'Salgada'),
(6, 'Coca-Cola 2L', 12, 'https://placehold.co/400x300?text=Coca-Cola+2L', 1, 'Refrigerante gelado', 'Água gaseificada, açúcar, corante caramelo', 'Bebida'),
(7, 'Guaraná 2L', 10, 'https://placehold.co/400x300?text=Guarana+2L', 1, 'Refrigerante nacional', 'Água gaseificada, extrato de guaraná', 'Bebida'),
(8, 'Suco de Laranja', 8, 'https://placehold.co/400x300?text=Suco+de+Laranja', 1, 'Suco natural', 'Laranja, água, açúcar', 'Bebida'),
(9, 'Petit Gateau', 18, 'https://placehold.co/400x300?text=Petit+Gateau', 1, 'Sobremesa quentinha', 'Chocolate, manteiga, ovos, sorvete', 'Sobremesa'),
(15, 'Pizza Pepperoni', 46.9, 'https://placehold.co/400x300?text=Pepperoni', 1, 'Irresistível e picante', 'Molho de tomate, mussarela, pepperoni fatiado', 'Salgada'),
(16, 'Pizza Bacon', 45.9, 'https://placehold.co/400x300?text=Bacon', 1, 'Crocante e defumada', 'Molho de tomate, mussarela, bacon crocante, cebola caramelizada', 'Salgada'),
(17, 'Pizza Atum', 44.9, 'https://placehold.co/400x300?text=Atum', 1, 'Leve e saborosa', 'Molho de tomate, mussarela, atum, cebola, azeitona', 'Salgada'),
(18, 'Pizza Presunto', 41.9, 'https://placehold.co/400x300?text=Presunto', 1, 'Clássica e simples', 'Molho de tomate, mussarela, presunto', 'Salgada'),
(19, 'Pizza Frango Bacon', 47.9, 'https://placehold.co/400x300?text=Frango+Bacon', 1, 'A queridinha da casa', 'Frango desfiado, bacon, catupiry, milho, mussarela', 'Salgada'),
(20, 'Pizza Carne Seca', 49.9, 'https://placehold.co/400x300?text=Carne+Seca', 1, 'Sabor do nordeste', 'Carne seca desfiada, catupiry, cebola, mussarela', 'Salgada'),
(21, 'Pizza Strogonoff', 48.9, 'https://placehold.co/400x300?text=Strogonoff', 1, 'Cremosa e diferente', 'Frango ao molho strogonoff, mussarela, batata palha', 'Salgada'),
(22, 'Pizza Vegetariana', 43.9, 'https://placehold.co/400x300?text=Vegetariana', 1, 'Leve e nutritiva', 'Molho de tomate, mussarela, brócolis, pimentão, milho, ervilha', 'Vegetariana'),
(23, 'Pizza Rúcula Tomate', 44.9, 'https://placehold.co/400x300?text=Rucula+Tomate', 1, 'Fresca e sofisticada', 'Molho pesto, mussarela, tomate cereja, rúcula, parmesão', 'Vegetariana'),
(24, 'Pizza Palmito', 43.9, 'https://placehold.co/400x300?text=Palmito', 1, 'Suave e delicada', 'Molho de tomate, mussarela, palmito, azeitona, cebola', 'Vegetariana'),
(25, 'Pizza Alho e Azeite', 40.9, 'https://placehold.co/400x300?text=Alho+Azeite', 1, 'Simples e aromática', 'Azeite, alho, mussarela, tomate, manjericão', 'Vegetariana'),
(26, 'Pizza Espinafre', 44.9, 'https://placehold.co/400x300?text=Espinafre', 1, 'Nutritiva e gostosa', 'Espinafre, ricota, alho, mussarela, noz-moscada', 'Vegetariana'),
(27, 'Pizza Nutella', 47.9, 'https://placehold.co/400x300?text=Nutella', 1, 'A favorita das crianças', 'Nutella, morango fatiado, banana', 'Doce'),
(28, 'Pizza Romeu e Julieta', 44.9, 'https://placehold.co/400x300?text=Romeu+Julieta', 1, 'Clássico brasileiro', 'Mussarela, goiabada cremosa', 'Doce'),
(29, 'Pizza Brigadeiro', 46.9, 'https://placehold.co/400x300?text=Brigadeiro', 1, 'Puro chocolate', 'Brigadeiro, granulado, leite condensado', 'Doce'),
(30, 'Pizza Banana c/ Canela', 44.9, 'https://placehold.co/400x300?text=Banana+Canela', 1, 'Quentinha e reconfortante', 'Banana, canela, açúcar, leite condensado, mussarela', 'Doce'),
(31, 'Pizza Morango c/ Creme', 45.9, 'https://placehold.co/400x300?text=Morango+Creme', 1, 'Fresca e irresistível', 'Creme de leite, morango, leite condensado, granulado', 'Doce'),
(32, 'Coca-Cola 600ml', 7, 'https://placehold.co/400x300?text=Coca+600ml', 1, 'Gelada e refrescante', 'Água gaseificada, açúcar, corante caramelo', 'Bebida'),
(33, 'Pepsi 600ml', 6.5, 'https://placehold.co/400x300?text=Pepsi+600ml', 1, 'Refrescante e leve', 'Água gaseificada, açúcar, corante caramelo', 'Bebida'),
(34, 'Guaraná Antarctica 600ml', 6.5, 'https://placehold.co/400x300?text=Guarana+600ml', 1, 'O sabor do Brasil', 'Água gaseificada, extrato de guaraná, açúcar', 'Bebida'),
(35, 'Fanta Laranja 600ml', 6.5, 'https://placehold.co/400x300?text=Fanta+600ml', 1, 'Frutal e gelada', 'Água gaseificada, suco de laranja, açúcar', 'Bebida'),
(36, 'Água Mineral 500ml', 3.5, 'https://placehold.co/400x300?text=Agua+500ml', 1, 'Pura e natural', 'Água mineral natural', 'Bebida'),
(37, 'Água com Gás 500ml', 4, 'https://placehold.co/400x300?text=Agua+Gas', 1, 'Levemente gaseificada', 'Água mineral gaseificada', 'Bebida'),
(38, 'Suco de Maracujá', 9, 'https://placehold.co/400x300?text=Suco+Maracuja', 1, 'Natural e refrescante', 'Maracujá, água, açúcar', 'Bebida'),
(39, 'Suco de Abacaxi', 9, 'https://placehold.co/400x300?text=Suco+Abacaxi', 1, 'Tropical e gelado', 'Abacaxi, água, açúcar, hortelã', 'Bebida'),
(40, 'Suco de Uva', 9, 'https://placehold.co/400x300?text=Suco+Uva', 1, 'Doce e natural', 'Uva, água, açúcar', 'Bebida'),
(41, 'Cerveja Heineken 600ml', 16, 'https://placehold.co/400x300?text=Heineken', 1, 'Gelada e refrescante', 'Água, malte, lúpulo', 'Bebida'),
(42, 'Cerveja Brahma 600ml', 12, 'https://placehold.co/400x300?text=Brahma', 1, 'A número 1', 'Água, malte, lúpulo, arroz', 'Bebida'),
(43, 'Vinho Tinto Taça', 18, 'https://placehold.co/400x300?text=Vinho+Tinto', 1, 'Encorpado e sofisticado', 'Uva tinta, sulfitos', 'Bebida'),
(44, 'Vinho Branco Taça', 18, 'https://placehold.co/400x300?text=Vinho+Branco', 1, 'Suave e aromático', 'Uva branca, sulfitos', 'Bebida');

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
(7, 'PEDIDO-4fe5cba674a0', 'Junior', 'Sem azeitona', 'credito', 'pizza goxtosa hmm 2, pizza goxtosa hmm 3,', 8002, 'Concluido'),
(9, 'PEDIDO-7f241825aa03', 'Mônica', 'Sem palmito', 'debito', 'pizza goxtosa hmm 3,', 0.5, 'Concluido'),
(10, 'PEDIDO-e38171fddd35', 'Luan', '', 'aVista', 'pizza goxtosa hmm,', 8001.5, 'Concluido');

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
(5, 0, 8002, 'Processando', '2026-06-28', 'credito'),
(6, 9, 0.5, 'Processando', '2026-06-28', 'debito'),
(7, 10, 8001.5, 'Processando', '2026-06-28', 'aVista');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de tabela `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `produtoestoque`
--
ALTER TABLE `produtoestoque`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `venda`
--
ALTER TABLE `venda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
