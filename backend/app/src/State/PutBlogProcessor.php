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
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

readonly class PutBlogProcessor implements ProcessorInterface
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
            $errorMessage = json_encode([
                'status' => 400,
                'success' => false,
                'message' => 'Le format de données est incorrect'
            ]);
            throw new BadRequestHttpException($errorMessage);
        }

        if (empty($uriVariables['id'])) {
            $errorMessage = json_encode([
                'status' => 400,
                'success' => false,
                'message' => 'L\'id du blog est obligatoire'
            ]);
            throw new BadRequestHttpException($errorMessage);
        }

        // Récupérer l'utilisateur actuellement authentifié
        $user = $this->security->getUser();

        // Vérifier si l'utilisateur est authentifié
        if (!$user instanceof User) {
            $errorMessage = json_encode([
                'status' => 401,
                'success' => false,
                'message' => 'Vous devez être connecté pour modifier un blog'
            ]);
            throw new AccessDeniedException($errorMessage);
        }

        // Récupérer le blog
        $blog = $this->entityManager->getRepository(Blog::class)->find($uriVariables['id']);

        if (!$blog) {
            $errorMessage = json_encode([
                'status' => 404,
                'success' => false,
                'message' => 'Aucun blog trouvé avec l\'id '. $uriVariables['id']
            ]);
            throw new NotFoundHttpException($errorMessage);
        }

        // Vérifier si le blog appartient bien à l'utilisateur connecté
        if ($blog->getAuthor()!== $user) {
            $errorMessage = json_encode([
                'status' => 403,
                'success' => false,
                'message' => 'Vous ne pouvez modifier un blog que si vous êtes son auteur'
            ]);
            throw new AccessDeniedException($errorMessage);
        }

        // Mise à jour du blog
        $blog->setTitle($data->title);
        $blog->setContent($data->content);
        $blog->setDateUpdate(new DateTime());

        $this->entityManager->flush();

        return $blog;
    }
}