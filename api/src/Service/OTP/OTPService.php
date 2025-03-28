<?php

namespace App\Service\OTP;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

use Tzsk\Otp\Otp;
use function otp;

final class OTPService
{
    private ?Otp $otp = null;

    public function __construct(
        #[Autowire('kernel.project_dir')] private string $projectDir
    )
    {
        $this->otp = otp(sprintf('/%s/src/Service/OTP/temp', $this->projectDir));
    }

    public function generateOTP(string $secret): string
    {
        return $this->otp->digits(6)->expiry(1)->generate($secret);
    }

    public function verifyOTP(string $otp, string $secret): bool
    {
        return $this->otp->digits(6)->expiry(1)->match($otp, $secret);
    }
}
