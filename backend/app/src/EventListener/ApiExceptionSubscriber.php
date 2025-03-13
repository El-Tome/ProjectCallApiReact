<?php

namespace App\EventListener;

use ApiPlatform\Exception\FilterValidationException;
use ApiPlatform\Symfony\Validator\Exception\ValidationException;
use ApiPlatform\Validator\Exception\ValidationException as LegacyValidationException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;

class ApiExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => ['onKernelException', 100], // Priorité plus élevée que ExceptionListener
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $request = $event->getRequest();
        
        // Ne traiter que les requêtes API
        if (!str_starts_with($request->getPathInfo(), '/api/')) {
            return;
        }
        
        // Gérer les erreurs de validation
        if ($exception instanceof ValidationException || $exception instanceof LegacyValidationException) {
            $violations = $exception->getConstraintViolationList();
            $response = $this->createViolationResponse($violations);
            $event->setResponse($response);
            return;
        }
        
        // Gérer les erreurs de filtres
        if ($exception instanceof FilterValidationException) {
            $response = new JsonResponse([
                'status' => Response::HTTP_BAD_REQUEST,
                'success' => false,
                'message' => 'Paramètres de filtre invalides',
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
            $event->setResponse($response);
            return;
        }
        
        // Gérer les erreurs de désérialisation
        if ($exception instanceof NotEncodableValueException) {
            $response = new JsonResponse([
                'status' => Response::HTTP_BAD_REQUEST,
                'success' => false,
                'message' => 'Format de données invalide. Veuillez vérifier votre JSON.',
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
            $event->setResponse($response);
            return;
        }
    }
    
    private function createViolationResponse(ConstraintViolationListInterface $violations): JsonResponse
    {
        $errors = [];
        
        /** @var ConstraintViolationInterface $violation */
        foreach ($violations as $violation) {
            $propertyPath = $violation->getPropertyPath();
            $message = $violation->getMessage();
            
            $errors[$propertyPath] = $message;
        }
        
        return new JsonResponse([
            'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
            'success' => false,
            'message' => 'Validation échouée. Veuillez corriger les erreurs suivantes.',
            'errors' => $errors,
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
} 