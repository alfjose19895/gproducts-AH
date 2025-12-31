<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251231022425 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // 1. Tabla de Productos (Incluye is_active para borrado lógico)
        $this->addSql('CREATE TABLE product (
        id INT AUTO_INCREMENT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description LONGTEXT DEFAULT NULL,
        price NUMERIC(10, 2) NOT NULL,
        stock INT NOT NULL,
        sku VARCHAR(50) NOT NULL,
        is_active TINYINT(1) DEFAULT 1 NOT NULL,
        UNIQUE INDEX UNIQ_D34A04ADF9038C4 (sku),
        PRIMARY KEY(id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // 2. Tabla de Pedidos (order es palabra reservada, usamos comillas)
        $this->addSql('CREATE TABLE `order` (
        id INT AUTO_INCREMENT NOT NULL,
        customer_id INT NOT NULL,
        total_price NUMERIC(10, 2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
        PRIMARY KEY(id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // 3. Tabla de Detalles del Pedido
        $this->addSql('CREATE TABLE order_item (
        id INT AUTO_INCREMENT NOT NULL,
        product_id INT NOT NULL,
        order_id INT NOT NULL,
        quantity INT NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL,
        INDEX IDX_52EA1F094584665A (product_id),
        INDEX IDX_52EA1F098D9F6D38 (order_id),
        PRIMARY KEY(id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // 4. Constraints (Relaciones)
        $this->addSql('ALTER TABLE order_item ADD CONSTRAINT FK_52EA1F094584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE order_item ADD CONSTRAINT FK_52EA1F098D9F6D38 FOREIGN KEY (order_id) REFERENCES `order` (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE `order`');
        $this->addSql('DROP TABLE order_item');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
