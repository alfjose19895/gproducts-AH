<?php

namespace App\Tests\Service;

use App\Entity\Product;
use App\Entity\Order;
use App\Service\OrderService;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class OrderServiceTest extends TestCase
{
    private $entityManager;
    private $productRepository;
    private $orderService;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->productRepository = $this->createMock(ProductRepository::class);
        $this->orderService = new OrderService($this->entityManager, $this->productRepository);
    }

    public function testCreateOrderSuccess()
    {
        $product = new Product();
        $product->setName('Laptop')->setStock(10)->setIsActive(true)->setPrice("1000");

        $this->productRepository->method('find')->willReturn($product);

        // Verificamos que se llame a persist al menos dos veces (Order y OrderItem)
        $this->entityManager->expects($this->atLeastOnce())->method('persist');
        $this->entityManager->expects($this->once())->method('flush');

        $items = [['id' => 1, 'quantity' => 2]];
        $order = $this->orderService->createOrder(1, $items);

        $this->assertInstanceOf(Order::class, $order);
        $this->assertEquals(8, $product->getStock()); // Verifica que restó el stock
        $this->assertEquals("2000", $order->getTotalPrice());
    }

    public function testExceptionWhenStockInsufficient()
    {
        $product = (new Product())->setName('Mouse')->setStock(1)->setIsActive(true);
        $this->productRepository->method('find')->willReturn($product);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Stock insuficiente");

        $this->orderService->createOrder(1, [['id' => 1, 'quantity' => 10]]);
    }
}
