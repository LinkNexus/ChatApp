<?php

namespace App\Security;

use App\Entity\User;
use App\Service\OTP\OTPService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\CustomCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Serializer\SerializerInterface;

final class OTPAuthenticator extends AbstractAuthenticator
{

    public function __construct(
        private readonly OTPService $OTPService,
        private readonly SerializerInterface $serializer
    )
    {}

    public function supports(Request $request): ?bool
    {
        $requestData = json_decode($request->getContent());
        return $request->attributes->get('_route') === "auth.login" &&
            $request->isMethod('POST') &&
            $requestData !== null &&
            isset($requestData->otp);
    }

    public function authenticate(Request $request): Passport
    {
        $data = json_decode($request->getContent());
        $otp = $data->otp;
        $userIdentifier = $data->email;

        if (null === $otp) {
            throw new CustomUserMessageAuthenticationException('No OTP Code provided');
        }

        return new Passport(
            new UserBadge($userIdentifier),
            new CustomCredentials(
                function (string $credentials, UserInterface $user): bool {
                    return $this->OTPService->verifyOTP($credentials, md5($user->getUserIdentifier()));
                },
                $otp
            )
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        /**
         * @var User $user
         */
        $user = $token->getUser();

        return new JsonResponse(
            $this->serializer->serialize($user, 'json', ['groups' => ['read.user']]),
            Response::HTTP_OK,
            json: true
        );
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse([
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData()),
        ], Response::HTTP_UNAUTHORIZED);
    }
}
