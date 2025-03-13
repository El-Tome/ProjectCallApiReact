<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\BlogDto;
use App\Entity\Blog;
use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

readonly class PostBlogProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security               $security
    ) {}

    public function process(
        mixed     $data,
        Operation $operation,
        array     $uriVariables = [],
        array     $context      = []
    ): mixed
    {   
        if (!$data instanceof BlogDto) {
            return new JsonResponse([
                'status' => 400,
                'success' => false,
                'message' => 'Le format de données est incorrect'
            ], 400);
        }

        // Récupérer l'utilisateur actuellement authentifié
        $user = $this->security->getUser();
        
        // Vérifier si l'utilisateur est authentifié
        if (!$user instanceof User) {
            return new JsonResponse([
                'status' => 401,
                'success' => false,
                'message' => 'Vous devez être connecté pour créer un blog'
            ], 401);
        }

        $blog = new Blog();
        $blog->setTitle($data->title);
        $blog->setContent($data->content);
        
        // Définir automatiquement les dates
        $currentDateTime = new DateTime();
        $blog->setDateAdd($currentDateTime);
        $blog->setDateUpdate($currentDateTime);
        
        
        $blog->setAuthor($user);

        $this->entityManager->persist($blog);
        $this->entityManager->flush();

        return $blog;
    }
}