<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Dto\BlogDto;
use App\State\PostBlogProcessor;
use App\Repository\BlogRepository;
use App\State\GetUserBlogsProvider;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\State\PutBlogProcessor;
use ApiPlatform\Metadata\Link;

#[ORM\Entity(repositoryClass: BlogRepository::class)]
#[ApiResource(
    operations: [
        new Post(
            security: "is_granted('ROLE_USER')",
            input: BlogDto::class,
            processor: PostBlogProcessor::class
        ),
        new Put(
            security: "is_granted('ROLE_USER') and object.getAuthor() == user",
            input: BlogDto::class,
            processor: PutBlogProcessor::class
        ),
        new Get(normalizationContext: ['groups' => ['blog:read', 'user:read']]),
        new GetCollection(normalizationContext: ['groups' => ['blog:read', 'user:read']]),
        new Delete(security: "is_granted('ROLE_USER') and object.getAuthor() == user")
    ],
    normalizationContext: ['groups' => ['blog:read']]
)]
#[ApiResource(
    uriTemplate: '/user/blogs',
    operations: [
        new GetCollection(
            security: "is_granted('ROLE_USER')",
            provider: GetUserBlogsProvider::class,
            normalizationContext: ['groups' => ['blog:read', 'user:read']],
            name: 'get_user_blogs'
        )
    ]
)]
class Blog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['blog:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['blog:read'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['blog:read'])]
    private ?string $content = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['blog:read'])]
    private ?\DateTimeInterface $dateAdd = null;

    #[ORM\ManyToOne(inversedBy: 'blogs')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['blog:read'])]
    private ?User $author = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['blog:read'])]
    private ?\DateTimeInterface $dateUpdate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getDateAdd(): ?\DateTimeInterface
    {
        return $this->dateAdd;
    }

    public function setDateAdd(\DateTimeInterface $dateAdd): static
    {
        $this->dateAdd = $dateAdd;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }

    public function getDateUpdate(): ?\DateTimeInterface
    {
        return $this->dateUpdate;
    }

    public function setDateUpdate(\DateTimeInterface $dateUpdate): static
    {
        $this->dateUpdate = $dateUpdate;

        return $this;
    }
}
