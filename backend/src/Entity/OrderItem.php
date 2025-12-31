<?php

namespace App\Entity;

use App\Repository\OrderItemRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: OrderItemRepository::class)]
class OrderItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['order:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Product::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['order:read'])]
    private ?Product $product = null;

    #[ORM\ManyToOne(targetEntity: Order::class, inversedBy: 'orderItems')]
    #[ORM\JoinColumn(nullable: false)]
    // No ponemos Group 'order:read' aquí para evitar recursión infinita hacia Order
    private ?Order $order = null;

    #[ORM\Column]
    #[Groups(['order:read'])]
    private ?int $quantity = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Groups(['order:read'])]
    private ?string $unitPrice = null;

    public function getId(): ?int { return $this->id; }
    public function getProduct(): ?Product { return $this->product; }
    public function setProduct(?Product $product): self { $this->product = $product; return $this; }
    public function getOrder(): ?Order { return $this->order; }
    public function setOrder(?Order $order): self { $this->order = $order; return $this; }
    public function getQuantity(): ?int { return $this->quantity; }
    public function setQuantity(int $quantity): self { $this->quantity = $quantity; return $this; }
    public function getUnitPrice(): ?string { return $this->unitPrice; }
    public function setUnitPrice(string $unitPrice): self { $this->unitPrice = $unitPrice; return $this; }
}
