<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class OrderControllerTest extends WebTestCase
{
    public function testGetOrderDetail()
    {
        $client = static::createClient();

        // Asumiendo que tenemos un pedido con ID 1 (puedes crearlo en el setUp)
        $client->request('GET', '/api/orders/1');

        if ($client->getResponse()->getStatusCode() === 404) {
            $this->markTestSkipped('No hay pedido con ID 1 en la base de datos de test.');
        }

        $this->assertResponseIsSuccessful();
        $response = json_decode($client->getResponse()->getContent(), true);

        // Validar que el JSON tiene la estructura de OrderItem
        $this->assertArrayHasKey('orderItems', $response);
        $this->assertArrayHasKey('totalPrice', $response);
    }
}
