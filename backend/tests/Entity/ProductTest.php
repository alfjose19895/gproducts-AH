<?php

namespace App\Tests\Entity;

use App\Entity\Product;
use PHPUnit\Framework\TestCase;

class ProductTest extends TestCase
{
    public function testProductInitialState()
    {
        $product = new Product();

        // Verificamos que por defecto un producto nazca activo (Borrado lógico)
        $this->assertTrue($product->isIsActive());
    }

    public function testSettersAndGetters()
    {
        $product = new Product();
        $product->setName("Teclado Mecánico")
            ->setPrice("85.50")
            ->setStock(10);

        $this->assertEquals("Teclado Mecánico", $product->getName());
        $this->assertEquals("85.50", $product->getPrice());
        $this->assertEquals(10, $product->getStock());
    }
}
