<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class ExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $request = $event->getRequest();
        
        // Vérifier si la requête attend une réponse JSON
        $isApiRequest = in_array('application/json', $request->getAcceptableContentTypes()) || 
                        in_array('application/ld+json', $request->getAcceptableContentTypes()) ||
                        str_starts_with($request->getPathInfo(), '/api/');
        
        if (!$isApiRequest) {
            return;
        }
        
        // Vérifier si l'exception contient un message JSON des processeurs
        $message = $exception->getMessage();
        $decodedMessage = json_decode($message, true);
        
        if (json_last_error() === JSON_ERROR_NONE && 
            is_array($decodedMessage) && 
            isset($decodedMessage['status']) && 
            isset($decodedMessage['success']) && 
            isset($decodedMessage['message'])) {
            
            // C'est un message JSON valide de nos processeurs, on l'utilise directement
            $response = new JsonResponse($decodedMessage, $decodedMessage['status']);
            $event->setResponse($response);
            return;
        }
        
        $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR;
        $responseMessage = 'Une erreur interne est survenue.';
        
        // Personnaliser le message en fonction du type d'exception
        if ($exception instanceof AccessDeniedException) {
            $statusCode = Response::HTTP_FORBIDDEN;
            $responseMessage = 'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource. Veuillez vous connecter ou vérifier vos permissions.';
        } elseif ($exception instanceof AuthenticationException) {
            $statusCode = Response::HTTP_UNAUTHORIZED;
            $responseMessage = 'Authentification requise. Veuillez vous connecter pour accéder à cette ressource.';
        } elseif ($exception instanceof HttpExceptionInterface) {
            $statusCode = $exception->getStatusCode();
            
            // Personnaliser les messages pour les codes HTTP courants
            switch ($statusCode) {
                case Response::HTTP_NOT_FOUND:
                    $responseMessage = 'La ressource demandée n\'existe pas.';
                    break;
                case Response::HTTP_METHOD_NOT_ALLOWED:
                    $responseMessage = 'La méthode HTTP utilisée n\'est pas autorisée pour cette ressource.';
                    break;
                case Response::HTTP_BAD_REQUEST:
                    $responseMessage = 'La requête est invalide ou mal formée.';
                    break;
                default:
                    $responseMessage = $exception->getMessage() ?: 'Une erreur est survenue.';
            }
        }
        
        // Créer une réponse JSON avec des informations détaillées
        $response = new JsonResponse([
            'status' => $statusCode,
            'success' => false,
            'message' => $responseMessage,
            'error' => [
                'type' => get_class($exception),
                'path' => $request->getPathInfo(),
                'method' => $request->getMethod(),
            ]
        ], $statusCode);
        
        $event->setResponse($response);
    }
} 