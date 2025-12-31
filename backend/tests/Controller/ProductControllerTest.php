<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProductControllerTest extends WebTestCase
{
    public function testGetProductsList()
    {
        $client = static::createClient();
        $client->request('GET', '/api/products');

        // Verifica que la ruta existe y responde 200
        $this->assertResponseIsSuccessful();

        $response = json_decode($client->getResponse()->getContent(), true);

        // Verifica la estructura del JSON que definimos
        $this->assertArrayHasKey('data', $response);
        $this->assertArrayHasKey('meta', $response);
    }

    public function testCreateProductInvalidData()
    {
        $client = static::createClient();
        // Enviamos un producto sin nombre para forzar error de validación
        $client->request('POST', '/api/products', [], [], [], json_encode([
            'price' => -10,
            'stock' => 'muchos'
        ]));

        $this->assertResponseStatusCodeSame(400);
    }
}
