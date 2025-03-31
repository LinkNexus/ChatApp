<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250328210229 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE message (id SERIAL NOT NULL, from_user_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_B6BD307F2130303A ON message (from_user_id)');
        $this->addSql('CREATE TABLE message_to_receiver (message_id INT NOT NULL, user_id INT NOT NULL, PRIMARY KEY(message_id, user_id))');
        $this->addSql('CREATE INDEX IDX_909E4CC1537A1329 ON message_to_receiver (message_id)');
        $this->addSql('CREATE INDEX IDX_909E4CC1A76ED395 ON message_to_receiver (user_id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F2130303A FOREIGN KEY (from_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE message_to_receiver ADD CONSTRAINT FK_909E4CC1537A1329 FOREIGN KEY (message_id) REFERENCES message (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE message_to_receiver ADD CONSTRAINT FK_909E4CC1A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE message DROP CONSTRAINT FK_B6BD307F2130303A');
        $this->addSql('ALTER TABLE message_to_receiver DROP CONSTRAINT FK_909E4CC1537A1329');
        $this->addSql('ALTER TABLE message_to_receiver DROP CONSTRAINT FK_909E4CC1A76ED395');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE message_to_receiver');
    }
}
