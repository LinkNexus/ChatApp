<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250321002719 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE otprequest (id SERIAL NOT NULL, author_id INT NOT NULL, otp VARCHAR(6) NOT NULL, expire_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_64826423F675F31B ON otprequest (author_id)');
        $this->addSql('COMMENT ON COLUMN otprequest.expire_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE otprequest ADD CONSTRAINT FK_64826423F675F31B FOREIGN KEY (author_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE otprequest DROP CONSTRAINT FK_64826423F675F31B');
        $this->addSql('DROP TABLE otprequest');
    }
}
