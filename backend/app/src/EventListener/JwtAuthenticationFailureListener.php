<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationFailureResponse;
use Symfony\Component\HttpFoundation\Response;

class JwtAuthenticationFailureListener
{
    public function onAuthenticationFailureResponse(AuthenticationFailureEvent $event): void
    {
        $response = $event->getResponse();
        
        if ($response instanceof JWTAuthenticationFailureResponse) {
            $data = [
                'status' => Response::HTTP_UNAUTHORIZED,
                'success' => false,
                'message' => 'Identifiants invalides. Veuillez vérifier votre email et mot de passe.',
                'error' => [
                    'type' => 'authentication_error',
                ]
            ];
            
            $response->setData($data);
        }
    }
} 