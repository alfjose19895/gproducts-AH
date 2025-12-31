<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }


    /**
     * @param string $search
     * @param bool $status
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function findBySearchAndStatus(string $search, bool $status, int $limit, int $offset): array
    {
        $qb = $this->createQueryBuilder('p')
            ->andWhere('p.isActive = :status')
            ->setParameter('status', $status);

        if (!empty($search)) {
            $qb->andWhere('p.name LIKE :search OR p.sku LIKE :search')
                ->setParameter('search', '%' . $search . '%');
        }

        return $qb->orderBy('p.id', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return Product[] Returns an array of Product objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Product
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
