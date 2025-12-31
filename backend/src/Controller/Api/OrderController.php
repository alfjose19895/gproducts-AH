<?php

namespace App\Controller\Api;

use App\Entity\Order;
use App\Service\OrderService;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/orders', name: 'api_orders_')]
class OrderController extends AbstractController
{
    private OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * UC-O01: Crear pedido
     * Recibe customerId e items del frontend
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['customerId']) || !isset($data['items'])) {
            return $this->json(['error' => 'Datos incompletos'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $order = $this->orderService->createOrder(
                (int) $data['customerId'],
                $data['items']
            );

            return $this->json([
                'id' => $order->getId(),
                'message' => 'Pedido creado correctamente'
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * UC-O04: Listar todos los pedidos (Para el módulo de Pedidos)
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(OrderRepository $orderRepository): JsonResponse
    {
        $orders = $orderRepository->findBy([], ['id' => 'DESC']); // Los más recientes primero

        $data = array_map(function($order) {
            return [
                'id'     => $order->getId(),
                'status' => $order->getStatus(),
                // Verificamos si usa getTotalPrice() o getTotal() según tu entidad
                'total'  => method_exists($order, 'getTotalPrice') ? (float)$order->getTotalPrice() : (float)$order->getTotal(),
                'createdAt' => $order->getCreatedAt() ? $order->getCreatedAt()->format('Y-m-d H:i') : null,
            ];
        }, $orders);

        return $this->json($data);
    }

    /**
     * UC-O02: Ver detalle de un pedido específico
     * Mapeado exacto para OrderDetail.tsx
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, OrderRepository $orderRepository): JsonResponse
    {
        $order = $orderRepository->find($id);

        if (!$order) {
            return $this->json(['error' => "El pedido #$id no existe."], Response::HTTP_NOT_FOUND);
        }

        $items = [];
        foreach ($order->getOrderItems() as $item) {
            $items[] = [
                'productName' => $item->getProduct() ? $item->getProduct()->getName() : 'Producto desconocido',
                'quantity'    => $item->getQuantity(),
                'price'       => method_exists($item, 'getUnitPrice') ? (float)$item->getUnitPrice() : (float)$item->getPrice(),
            ];
        }

        return $this->json([
            'id'        => $order->getId(),
            'status'    => $order->getStatus(),
            'total'     => method_exists($order, 'getTotalPrice') ? (float)$order->getTotalPrice() : (float)$order->getTotal(),
            'createdAt' => $order->getCreatedAt() ? $order->getCreatedAt()->format('Y-m-d H:i:s') : null,
            'items'     => $items
        ], Response::HTTP_OK);
    }

    /**
     * UC-O03: Pago simulado / Checkout
     */
    #[Route('/{id}/checkout', name: 'checkout', methods: ['POST'])]
    public function checkout(int $id, OrderRepository $orderRepository, EntityManagerInterface $em): JsonResponse
    {
        $order = $orderRepository->find($id);

        if (!$order) {
            return $this->json(['error' => 'Pedido no encontrado'], Response::HTTP_NOT_FOUND);
        }

        // Cambiamos el estado a pagado
        $order->setStatus('paid');
        $em->flush();

        return $this->json([
            'message' => '¡Pago realizado con éxito!',
            'status'  => 'paid'
        ]);
    }
}
