<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct()
    {}

    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $user->setEmail('user1@example.com');
        $user->setName('First User');
        $user->setIsVerified(true);
        $manager->persist($user);

        UserFactory::createMany(30);

        $manager->flush();
    }
}
