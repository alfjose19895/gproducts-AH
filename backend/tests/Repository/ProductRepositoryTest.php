<?php

namespace App\Tests\Repository;

use App\Entity\Product;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ProductRepositoryTest extends KernelTestCase
{
    private $entityManager;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()->get('doctrine')->getManager();
    }

    public function testFindBySearchAndStatus()
    {
        // 1. Crear productos específicos para el test
        $p1 = new Product();
        $p1->setName('Monitor Gaming')->setSku('MON-001')->setPrice("200")->setStock(5)->setIsActive(true);

        $p2 = new Product();
        $p2->setName('Teclado')->setSku('TEC-002')->setPrice("50")->setStock(5)->setIsActive(false); // Inactivo

        $this->entityManager->persist($p1);
        $this->entityManager->persist($p2);
        $this->entityManager->flush();

        $repository = $this->entityManager->getRepository(Product::class);

        // 2. Probar búsqueda por nombre
        $results = $repository->findBySearchAndStatus('Gaming', true, 10, 0);
        $this->assertCount(1, $results);
        $this->assertEquals('Monitor Gaming', $results[0]->getName());

        // 3. Probar que no devuelve inactivos
        $resultsInactivos = $repository->findBySearchAndStatus('Teclado', true, 10, 0);
        $this->assertCount(0, $resultsInactivos);
    }
}
