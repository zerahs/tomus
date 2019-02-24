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
    // }

    /**
     * @Route("/word-fetch", name="board_word_fetch")
     */
    public function wordFetchAction(Request $request)
    {
        if($request->getMethod() != Request::METHOD_POST ) {
            return new JsonResponse(["error"=>"Invalid method"]);
        }

        $data = json_decode($request->getContent(), true);
        if(!isset($data['nb_cols'])) {
            return new JsonResponse(["error"=>"missing parameter word"]);
        }

        $em = $this->getDoctrine()->getManager();
        $nbCols = $data['nb_cols'];

        $conn = $em->getConnection();
        $sql = 'SELECT letters from word where CHAR_LENGTH(letters) = :nbCols order by RAND() limit 1';
        $stmt = $conn->prepare($sql);
        $stmt->execute(['nbCols' => $nbCols]);
        $res = $stmt->fetch();
        
        return new JsonResponse(["word"=>$res['letters']]);
    }

    private function removeUnwantedChars($str)
    {
        $unwanted_array = array(    'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
                                    'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U',
                                    'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c',
                                    'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
                                    'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y' );
        $str = strtr( $str, $unwanted_array );
        return $str;
    }

    /**
     * @Route("/word-check", name="board_word_check")
     */
    public function wordCheckAction(Request $request)
    {
        if($request->getMethod() != Request::METHOD_POST ) {
            return new JsonResponse(["error"=>"Invalid method"]);
        }
        
        // @TODO : solution will be found from token sent in request
        // $solution = 'dominos';
            
        // Check data for word
        $data = json_decode($request->getContent(), true);
        if(!isset($data['word'])) {
            return new JsonResponse(["error"=>"missing parameter word"]);
        }
        if(!isset($data['solution'])) {
            return new JsonResponse(["error"=>"missing parameter solution"]);
        }

        // Sanitize word and solution
        $word = $data['word'];
        $solution = $data['solution'];
        if(!is_string($word) || !is_string($solution)){
            return new JsonResponse(["error"=>"Invalid word or solution"]);
        }
        $word = strtolower($word);
        $solution = $this->removeUnwantedChars($solution);
        if(strlen($word) != strlen($solution)){
            return new JsonResponse(["error"=>"Lengths don't match"]);
        }
        
        // @TODO check word is in dictionary
        
        $solutionPool = $solution;
        $wordPool = $word;
        $diff = implode("", array_fill(0, strlen($word), "0")); // init with 0s
        // First loop finds same characters at the right index
        for($i=0; $i<strlen($word); $i++) {
            if($word[$i] == $solution[$i]) {
                $diff[$i] = "2";
                $solutionPool[$i] = "0";
                $wordPool[$i] = "1";
            }
        }

        // Second loop finds right character at the wrong index
        for($i=0; $i<strlen($wordPool); $i++) {
            $pos = strpos($solutionPool, $wordPool[$i]);
            if( $pos !== false ) {
                $diff[$i] = "1";
                $solutionPool[$pos] = "0";
            }
            dump($wordPool[$i].' '.$wordPool.' '.$solutionPool);
        }
        
        return new JsonResponse(["diff"=>$diff]);
        
    }

    
}
