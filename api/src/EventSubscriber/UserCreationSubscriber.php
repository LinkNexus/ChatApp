<?php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\User;
use App\Security\EmailVerifier;
use App\Security\OTPAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Mime\Address;

final readonly class UserCreationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EmailVerifier $verifier,
        private EntityManagerInterface $entityManager,
        private Security $security
    )
    {}

    public function sendMail(ResponseEvent $event): void
    {
        $method = $event->getRequest()->getMethod();
        $responseContent = json_decode($event->getResponse()->getContent(), true);

        if (
            null === $responseContent ||
            !key_exists("@type", $responseContent) ||
            $responseContent['@type'] !== "User" ||
            Request::METHOD_POST !== $method ||
            $event->getResponse()->getStatusCode() !== Response::HTTP_CREATED
        ) {
            return;
        }

        /** @var User $user */
        $user = $this->entityManager->getRepository(User::class)->find($responseContent['id']);

        $this->verifier->sendEmailConfirmation(
            'auth.verify.email',
            $user,
            (new TemplatedEmail())
                ->to(new Address($user->getEmail(), $user->getName()))
                ->subject('Registration confirmation to InstaChat')
                ->htmlTemplate('auth/registration_email.html.twig')
        );

        $this->security->login($user, OTPAuthenticator::class, "main");
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => 'sendMail',
        ];
    }
}
