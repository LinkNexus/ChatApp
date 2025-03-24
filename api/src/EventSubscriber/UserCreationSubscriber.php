<?php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\User;
use App\Security\EmailVerifier;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Mime\Address;

final readonly class UserCreationSubscriber implements EventSubscriberInterface
{
    public function __construct(private EmailVerifier $verifier)
    {}

    public function sendMail(ViewEvent $event): void
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$user instanceof User && Request::METHOD_POST !== $method) {
            return;
        }

        dd($event);

        $this->verifier->sendEmailConfirmation(
            'auth.verify.email',
            $user,
            (new TemplatedEmail())
                ->to(new Address($user->getEmail(), $user->getName()))
                ->subject('Registration confirmation to InstaChat')
                ->htmlTemplate('auth/registration_email.html.twig')
        );
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'kernel.view' => ['sendMail', EventPriorities::POST_WRITE],
        ];
    }
}
