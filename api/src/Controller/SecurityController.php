<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/auth', name: 'auth.')]
final class SecurityController extends AbstractController
{
    #[Route('/is-registered', name: 'is_registered', methods: ['POST'])]
    public function isRegistered(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->findOneBy([
            'email' => $request->request->get('email'),
        ]);

        return $this->json(['isRegistered' => $user !== null]);
    }
}
