<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['product:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "El nombre no puede estar vacío")]
    #[Groups(['product:read'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['product:read'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Assert\NotBlank]
    #[Assert\PositiveOrZero(message: "El precio debe ser un número positivo")]
    #[Groups(['product:read'])]
    private ?string $price = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Type(type: 'integer')]
    #[Assert\PositiveOrZero(message: "El stock no puede ser negativo")]
    #[Groups(['product:read'])]
    private ?int $stock = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Assert\NotBlank]
    #[Groups(['product:read'])]
    private ?string $sku = null;

    #[ORM\Column(options: ["default" => true])]
    #[Groups(['product:read'])]
    private ?bool $isActive = true;

    // --- GETTERS Y SETTERS ---

    public function getId(): ?int { return $this->id; }

    public function getName(): ?string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): self { $this->description = $description; return $this; }

    public function getPrice(): ?string { return $this->price; }
    public function setPrice(string $price): self { $this->price = $price; return $this; }

    public function getStock(): ?int { return $this->stock; }
    public function setStock(int $stock): self { $this->stock = $stock; return $this; }

    public function getSku(): ?string { return $this->sku; }
    public function setSku(string $sku): self { $this->sku = $sku; return $this; }

    public function isIsActive(): ?bool { return $this->isActive; }
    public function setIsActive(bool $isActive): self { $this->isActive = $isActive; return $this; }
}
