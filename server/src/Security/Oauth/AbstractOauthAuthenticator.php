<?php

namespace App\Security\Oauth;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use KnpU\OAuth2ClientBundle\Security\Authenticator\OAuth2Authenticator;
use League\OAuth2\Client\Provider\GithubResourceOwner;
use League\OAuth2\Client\Provider\GoogleUser;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;

abstract class AbstractOauthAuthenticator extends OAuth2Authenticator
{
    public function __construct(
        private readonly ClientRegistry $clientRegistry,
        private readonly EntityManagerInterface $entityManager,
        #[Autowire('%env(DOMAIN_URL)%')] private readonly string $domainUrl
    )
    {}

    abstract protected function getKey(): string;

    public function supports(Request $request): ?bool
    {
        return
            "auth_check" === $request->attributes->get("_route") &&
            $request->get("service") === $this->getKey();
    }

    public function authenticate(Request $request): Passport
    {
        $client = $this->clientRegistry->getClient($this->getKey());
        $accessToken = $this->fetchAccessToken($client);

        return new SelfValidatingPassport(
            new UserBadge($accessToken->getToken(), function () use ($accessToken, $client) {
                $resourceOwner = $client->fetchUserFromToken($accessToken);
                $email = $resourceOwner->getEmail();

                $existingUser = $this->entityManager->getRepository(User::class)
                    ->findOneBy([
                        "{$this->getKey()}Id" => $resourceOwner->getId()
                    ]);

                if ($existingUser) return $existingUser;

                $user = $this->entityManager->getRepository(User::class)
                    ->findOneBy([ "email" => $email ]);

                if (null === $user) {
                    $user = new User();
                }

                if (!$user->getName()) {
                    $user->setName($resourceOwner->getName());
                }

                $user->setEmail($email);

                if ($this->getKey() === "github") $user->setGithubId($resourceOwner->getId());
                else $user->setGoogleId($resourceOwner->getId());

                $this->entityManager->persist($user);
                $this->entityManager->flush();

                return $user;
            })
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return new RedirectResponse($this->domainUrl);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new RedirectResponse("{$this->domainUrl}/auth");
    }
}
