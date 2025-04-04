<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\RegisterUserDto;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

readonly class RegisterUserProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface      $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function process(
        mixed     $data,
        Operation $operation,
        array     $uriVariables = [],
        array     $context      = []
    )
    {
        if (!$data instanceof RegisterUserDto) {
            return new JsonResponse([
                'status' => 400,
                'success' => false,
                'message' => 'Le format de données est incorrect'
            ], 400);
        }

        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data->email]);
        if ($existingUser) {
            return new JsonResponse([
                'status' => 400,
                'success' => false,
                'message' => 'Cette adresse email est déjà utilisée'
            ], 400);
        }

        $user = new User();
        $user->setEmail($data->email);
        $user->setRoles(['ROLE_USER']);
        $user->setFirstname($data->firstname);
        $user->setLastname($data->lastname);

        $hashedPassword = $this->passwordHasher->hashPassword($user, $data->password);
        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([
            'status' => 201,
            'success' => true,
            'message' => 'Utilisateur créé avec succès'
        ], 201);
    }
}
