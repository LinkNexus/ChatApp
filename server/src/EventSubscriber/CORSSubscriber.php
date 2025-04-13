<?php

namespace App\EventSubscriber;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final readonly class CORSSubscriber implements EventSubscriberInterface
{

    public function __construct(#[Autowire('%env(CLIENT_URL)%')] private string $clientUrl)
    {}

    public function setCorsHeaders(ResponseEvent $event): void
    {
        $response = $event->getResponse();
        $response->headers->set('Access-Control-Allow-Origin', $this->clientUrl);
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => 'setCorsHeaders',
        ];
    }
}
