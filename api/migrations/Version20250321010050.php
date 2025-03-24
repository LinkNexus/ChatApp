<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250321010050 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE otprequest DROP CONSTRAINT fk_64826423f675f31b');
        $this->addSql('DROP INDEX idx_64826423f675f31b');
        $this->addSql('ALTER TABLE otprequest ADD email VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE otprequest DROP author_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE otprequest ADD author_id INT NOT NULL');
        $this->addSql('ALTER TABLE otprequest DROP email');
        $this->addSql('ALTER TABLE otprequest ADD CONSTRAINT fk_64826423f675f31b FOREIGN KEY (author_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_64826423f675f31b ON otprequest (author_id)');
    }
}
