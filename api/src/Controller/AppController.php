<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;

final class AppController extends AbstractController
{
    #[Route('/flashes', name: 'app_app', methods: ['GET'])]
    public function flash(
        Request $request,
        #[MapQueryParameter] $key = null,
    ): JsonResponse
    {
        if (null === $key) {
            return $this->json($request->getSession()->getFlashBag()->all());
        }

        return $this->json($request->getSession()->getFlashBag()->get($key));
    }
}
