<?php

namespace App\Controller\Api;

use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/checkout', name: 'api_checkout_')]
class CheckoutController extends AbstractController
{
    #[Route('/{id}/pay', name: 'pay', methods: ['POST'])]
    public function pay(
        int $id,
        OrderRepository $orderRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $order = $orderRepository->find($id);

        if (!$order) {
            return $this->json(['error' => 'Pedido no encontrado'], Response::HTTP_NOT_FOUND);
        }

        if ($order->getStatus() !== 'pending') {
            return $this->json([
                'error' => 'El pedido no puede ser pagado porque ya está ' . $order->getStatus()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // UC-O03: Simulación de lógica de pago
        // Aquí se conectaría con Stripe, PayPal, etc.
        $paymentSuccess = true;

        if ($paymentSuccess) {
            $order->setStatus('paid');
            $em->flush();

            return $this->json([
                'message' => 'Pago realizado con éxito',
                'orderId' => $order->getId(),
                'newStatus' => $order->getStatus()
            ], Response::HTTP_OK);
        }

        return $this->json(['error' => 'El pago ha sido rechazado'], Response::HTTP_PAYMENT_REQUIRED);
    }
}
