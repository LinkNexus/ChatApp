<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\MessageRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final readonly class DiscussionMessagesProvider implements ProviderInterface
{
    public function __construct(private Security $security, private MessageRepository $repository)
    {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        /** @var Request $request */
        $request = $context['request'];
        $receiverId = $request->get('receiverId');
        $limit = $request->get('limit', 10);
        $offset = $request->get('offset', 0);
        $userId = $this->security->getUser()->getId();

        // Retrieve the state from somewhere
        return $this->repository->findAllByDiscussion($receiverId, $userId, $offset, $limit);
    }
}
