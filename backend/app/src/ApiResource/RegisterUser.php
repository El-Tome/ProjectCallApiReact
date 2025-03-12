<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\State\RegisterUserProcessor;
use App\Dto\RegisterUserDto;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/register',
            input: RegisterUserDto::class,
            processor: RegisterUserProcessor::class
        )
    ]
)]
class RegisterUser {}

