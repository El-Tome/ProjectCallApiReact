<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UpdateUserProfileProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly Security $security,
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ?User
    {
        // Récupérer l'utilisateur connecté
        $user = $this->security->getUser();
        
        if (!$user instanceof User) {
            throw new \LogicException('L\'utilisateur doit être une instance de User.');
        }

        // Mettre à jour les informations de l'utilisateur
        $user->setEmail($data->email);
        $user->setFirstname($data->firstname);
        $user->setLastname($data->lastname);

        // Si un nouveau mot de passe est fourni, le hasher et le définir
        if ($data->password) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data->password);
            $user->setPassword($hashedPassword);
        }

        // Sauvegarder les modifications
        $this->entityManager->flush();

        return $user;
    }
} 