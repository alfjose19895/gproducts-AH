<?php

namespace App\Controller\Api;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/products', name: 'api_products_')]
class ProductController extends AbstractController
{
    /**
     * UC-P01: Listar productos (Catálogo)
     * Endpoint: GET /api/products?search=&page=
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request, ProductRepository $productRepository): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $search = $request->query->get('search', '');
        $limit = 10;
        $offset = ($page - 1) * $limit;

        // Buscamos solo productos activos (Borrado lógico)
        $products = $productRepository->findBySearchAndStatus(
            $search,
            true, // isActive
            $limit,
            $offset
        );

        return $this->json([
            'data' => $products,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'search' => $search,
                'count' => count($products)
            ]
        ], Response::HTTP_OK, [], ['groups' => 'product:read']);
    }

    /**
     * UC-P02: Crear producto (Solo Admin simulado)
     * Endpoint: POST /api/products
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): JsonResponse {
        try {
            $product = $serializer->deserialize($request->getContent(), Product::class, 'json');

            // Validaciones (Asserts definidos en la Entidad)
            $errors = $validator->validate($product);
            if (count($errors) > 0) {
                return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
            }

            $em->persist($product);
            $em->flush();

            return $this->json($product, Response::HTTP_CREATED, [], ['groups' => 'product:read']);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Error al procesar la solicitud',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
