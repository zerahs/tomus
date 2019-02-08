<?php

namespace App\Entity;

class Word
{
    private $id;

    private $letters;

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
}
