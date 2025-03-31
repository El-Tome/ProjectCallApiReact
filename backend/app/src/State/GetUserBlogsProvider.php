<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\BlogRepository;
use Symfony\Bundle\SecurityBundle\Security;

class GetUserBlogsProvider implements ProviderInterface
{
    public function __construct(
        private readonly BlogRepository $blogRepository,
        private readonly Security $security
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return [];
        }

        return $this->blogRepository->findByUser($user);
    }
} 