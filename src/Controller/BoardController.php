<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

// @TODO - organise word functions in service instead of this controller (when we will inject managers etc)

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

    // public function @todo get new word, return a word with a unique token from a timestamp sent by client, use this same token in next requests to check word{
    //     $em = $this->getDoctrine()->getManager();
    //     $word = $em->getRepository(Word::class)->find(1);
    // }

    /**
     * @Route("/check", name="board_check")
     */
    public function checkAction(Request $request)
    {
        // @TODO : solution will be found from token sent in request
        $solution = 'dominos';
        if($request->getMethod() == Request::METHOD_POST ) {
            
            // Check data for word
            $data = json_decode($request->getContent(), true);
            if(!isset($data['word'])) {
                return new JsonResponse(["error"=>"missing parameter word"]);
            }

            // Check sent word against solution
            $word = $data['word'];
            dump( strlen($word), strlen($solution) );
            if(!is_string($word) || !is_string($solution) || strlen($word)!=strlen($solution)){
                return new JsonResponse(["error"=>"Invalid word or lengths don't match"]);
            }
            $solutionLetters = $solution;
            $diff = implode("", array_fill(0, strlen($word), "0")); // init with 0s
            // First loop finds same characters at the right index
            for($i=0; $i<strlen($word); $i++) {
                if($word[$i] == $solution[$i]) {
                    $diff[$i] = "2";
                    $solutionLetters[$i] = "0";
                }
            }
            // Second loop finds right character at the wrong index
            for($i=0; $i<strlen($word); $i++) {
                if( strpos($solutionLetters, $word[$i]) !== false ) {
                    $diff[$i] = "1";
                    $solutionLetters[$i] = "0";
                }
            }
            
            return new JsonResponse(["diff"=>$diff]);
        }

        return new JsonResponse(["error"=>"not post"]);
    }

    
}
