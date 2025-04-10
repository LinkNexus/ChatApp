<?php

namespace App\Security\Oauth;

final class GoogleAuthenticator extends AbstractOauthAuthenticator
{
    protected function getKey(): string
    {
        return 'google';
    }
}
