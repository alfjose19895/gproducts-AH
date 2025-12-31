<?php

namespace App\Tests\Controller;

use App\Entity\Order;
use App\Entity\Product;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class CheckoutControllerTest extends WebTestCase
{
    public function testPayOrderSuccessfully()
    {
        $client = static::createClient();
        $container = static::getContainer();
        $em = $container->get('doctrine.orm.entity_manager');

        // 1. Crear un pedido de prueba manualmente en la DB de test
        $order = new Order();
        $order->setCustomerId(1);
        $order->setTotalPrice("100.00");
        $order->setStatus('pending');

        $em->persist($order);
        $em->flush();

        // 2. Llamar al endpoint de pago
        $client->request('POST', sprintf('/api/checkout/%d/pay', $order->getId()));

        $this->assertResponseIsSuccessful();

        // 3. Verificar que en la DB el estado cambió a 'paid'
        $em->refresh($order);
        $this->assertEquals('paid', $order->getStatus());

        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('paid', $response['newStatus']);
    }
}
