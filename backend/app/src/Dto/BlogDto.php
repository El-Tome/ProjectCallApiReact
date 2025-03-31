<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class BlogDto
{
    #[Assert\NotBlank]
    public string $title;

    #[Assert\NotBlank]
    public string $content;
}

