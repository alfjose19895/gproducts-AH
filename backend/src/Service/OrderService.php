<?php

namespace App\Service;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;

class OrderService
{
    private $em;
    private $productRepository;

    public function __construct(
        EntityManagerInterface $em,
        ProductRepository $productRepository
    ) {
        $this->em = $em;
        $this->productRepository = $productRepository;
    }

    public function createOrder(int $customerId, array $itemsData): Order
    {
        $order = new Order();

        // Seteo de campos básicos
        $order->setCustomerId($customerId);
        $order->setStatus('pending');

        if (method_exists($order, 'setCreatedAt')) {
            $order->setCreatedAt(new \DateTimeImmutable());
        }

        $total = 0;

        foreach ($itemsData as $item) {
            $product = $this->productRepository->find($item['id']);

            if (!$product) {
                throw new \Exception("Producto no encontrado: ID " . $item['id']);
            }

            if ($product->getStock() < $item['quantity']) {
                throw new \Exception("Stock insuficiente para: " . $product->getName());
            }

            $orderItem = new OrderItem();
            $orderItem->setProduct($product);
            $orderItem->setQuantity($item['quantity']);

            $price = (float)$product->getPrice();

            // Usamos unit_price como confirmaste antes
            if (method_exists($orderItem, 'setUnitPrice')) {
                $orderItem->setUnitPrice($price);
            }

            $orderItem->setOrder($order);

            // Actualizar stock
            $product->setStock($product->getStock() - $item['quantity']);

            $total += ($price * $item['quantity']);
            $this->em->persist($orderItem);
        }

        // --- CORRECCIÓN FINAL SEGÚN TU ERROR ---
        // Tu entidad espera setTotalPrice()
        if (method_exists($order, 'setTotalPrice')) {
            $order->setTotalPrice($total);
        } else {
            $order->setTotal($total);
        }

        $this->em->persist($order);
        $this->em->flush();

        return $order;
    }
}
