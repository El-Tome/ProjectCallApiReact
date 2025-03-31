<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UpdateUserDto
{
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email;

    public ?string $password = null;

    #[Assert\NotBlank]
    public ?string $firstname = null;
    
    #[Assert\NotBlank]
    public ?string $lastname = null;
} 