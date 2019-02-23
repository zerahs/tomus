<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


/**
 * @Route("board")
 */
class BoardController extends AbstractController
{

    /**
     * @Route("", name="board_show")
     */
    public function showAction()
    {
        return $this->render('board/index.html.twig', [
        ]);
    }

    // public function todo get new word, return a word with a unique token from a timestamp sent by client, use this same token in next requests to check word{
    //     $em = $this->getDoctrine()->getManager();
    //     $word = $em->getRepository(Word::class)->find(1);
    // }

    /**
     * @Route("/check", name="board_check")
     */
    public function checkAction(Request $request)
    {
        if($request->getMethod() == Request::METHOD_POST ) {
            $data = json_decode($request->getContent(), true);
            if(!isset($data['word'])) {
                return new JsonResponse(["error"=>"invalid parameters"]);
            }
            $word = $data['word'];
            return new JsonResponse(["test"=>"tessdt"]);
        }

        return new JsonResponse(["error"=>"not post"]);
    }

    
}
