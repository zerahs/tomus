<?php

namespace App\Entity;

class Word
{
    private $id;
    private $letters;
    private $nbLetters;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLetters(): ?string
    {
        return $this->letters;
    }

    public function setLetters(string $letters): self
    {
        $this->letters = $letters;

        return $this;
    }

    public function getNbLetters(): ?int
    {
        return $this->nbLetters;
    }

    public function setNbLetters(int $nbLetters): self
    {
        $this->nbLetters = $nbLetters;

        return $this;
    }
}
