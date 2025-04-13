<?php

namespace App\Controller;

use App\Entity\OTPRequest;
use App\Entity\User;
use App\Security\EmailVerifier;
use App\Security\OTPAuthenticator;
use App\Service\OTP\OTPService;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;

#[Route('/auth', name: 'auth.')]
final class SecurityController extends AbstractController
{
    public function __construct(
        private readonly OTPService $OTPService,
        private readonly EntityManagerInterface $entityManager,
        private readonly MailerInterface $mailer,
        private readonly EmailVerifier $emailVerifier
    )
    {}

    #[Route('/is-registered', name: 'is_registered', methods: ['POST'])]
    public function isRegistered(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $email = json_decode($request->getContent())->email;

        $user = $entityManager->getRepository(User::class)->findOneBy([
            'email' => $email,
        ]);

        if ($user instanceof User) {
            try {
                $this->sendOTP($email);
            } catch (TransportExceptionInterface $exception) {
                return $this->json(['error' => $exception->getMessage()], status: Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        return $this->json(['isRegistered' => $user !== null]);
    }

    #[Route('/token/generate', name: 'token.generate', methods: ['POST'])]
    public function generateOTP(Request $request): JsonResponse
    {
        try {
            $this->sendOTP(json_decode($request->getContent())->email);
        } catch (TransportExceptionInterface $exception) {
            return $this->json(['error' => $exception->getMessage()], status: Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json([ 'success' => true ]);
    }

    /**
     * @param string $email
     * @return JsonResponse
     * @throws TransportExceptionInterface
     */
    public function sendOTP(string $email): JsonResponse
    {
        $secret = md5($email);

        $lastRequest = $this->entityManager
            ->getRepository(OTPRequest::class)
            ->findLastOTPRequest($secret)
        ;

        if (null === $lastRequest || $lastRequest->getExpireAt() <= new \DateTimeImmutable()) {
            $otp = $this->OTPService->generateOTP($secret);


            $this->mailer->send(
                (new TemplatedEmail())
                    ->from(new Address('noreply@instachat.com', 'InstaChat Team'))
                    ->to($email)
                    ->subject('Authentication to InstaChat')
                    ->htmlTemplate('auth/otp_email.html.twig')
                    ->context([
                        'otp' => $otp,
                    ])
            );

            $expiryDate = (new \DateTimeImmutable())->add(new \DateInterval("PT55S"));
            $otpRequest = new OTPRequest();
            $otpRequest->setExpireAt($expiryDate);
            $otpRequest->setSecret($secret);
            $otpRequest->setOtp($otp);

            $this->entityManager->persist($otpRequest);
            $this->entityManager->flush();

            return $this->json(['success' => true]);
        }

        return $this->json([
            'otp' => $lastRequest->getOtp(),
        ]);
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function me(): JsonResponse
    {
        return $this->json(
            $this->getUser(),
            context: [
                'groups' => ['read.user']
            ]
        );
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(): void
    {
        throw new \LogicException("This method can be blank - it will be intercepted by the login");
    }

    #[Route('/logout', name: 'logout')]
    public function logout(): void
    {
        throw new \LogicException("This method can be blank - it will be intercepted by the logout");
    }

    #[Route('/verify/email', name: 'verify.email')]
    public function verifyUserEmail(Request $request, #[Autowire('%env(CLIENT_URL)%')] string $domain): RedirectResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        try {
            /** @var User $user */
            $user = $this->getUser();
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('error', $exception->getMessage());
            return $this->redirect("$domain/auth/register");
        }

        $this->addFlash('success', 'Your email has been verified.');
        return $this->redirect("$domain/auth");
    }

    #[Route("/connect/{service}")]
    public function connect(ClientRegistry $clientRegistry, string $service): RedirectResponse
    {
        if ($service === 'github') $scopes = ["user:email", "read:user"];
        else $scopes = ['https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

        $client = $clientRegistry->getClient($service);
        return $client->redirect($scopes);
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        HttpClientInterface $client,
        EmailVerifier $verifier,
        Security $security
    ): Response {
        $url = $request->getSchemeAndHttpHost() . '/api/users';
        $response = $client->request('POST', $url, [
            'body' => $request->getContent(),
            'headers' => [
                'Content-Type' => 'application/ld+json',
                'Accept' => 'application/ld+json'
            ]
        ]);

        if ($response->getStatusCode() !== Response::HTTP_CREATED) {
            return $this->json($response->getContent(), $response->getStatusCode(), $response->getHeaders());
        }

        $responseContent = json_decode($response->getContent(), true);

        /** @var User $user */
        $user = $this->entityManager->getRepository(User::class)
            ->find($responseContent['id']);

        $verifier->sendEmailConfirmation(
            'auth.verify.email',
            $user,
            (new TemplatedEmail())
                ->to(new Address($user->getEmail(), $user->getName()))
                ->subject('Registration confirmation to InstaChat')
                ->htmlTemplate('auth/registration_email.html.twig')
        );

        return $security->login($user, OTPAuthenticator::class);
    }
}
