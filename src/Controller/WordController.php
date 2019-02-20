<?php

namespace App\Controller;

use App\Entity\Word;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class WordController extends AbstractController
{

    /**
     * @Route("/word", name="word")
     */
    public function showAction()
    {
        $em = $this->getDoctrine()->getManager();

        $word = $em->getRepository(Word::class)->find(1);

        
        return $this->render('word/index.html.twig', [
            'word' => $word,
        ]);
    }
}
