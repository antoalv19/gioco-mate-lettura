# CONTENT_GUIDE.md

## Research Summary

This repository contains JSON-ready Italian content for a browser-based educational game for a 5-year-old child. The design emphasizes short instructions, concrete objects, visual support, repetition, immediate feedback, and progressive difficulty.

## Files

- `fun-facts.json`: 100 child-safe facts across dinosaurs, space, sea, animals, and underwater archaeology/shipwrecks.
- `math-addition.json`: 60 addition exercises, 20 per difficulty.
- `math-subtraction.json`: 60 subtraction exercises, 20 per difficulty.
- `reading.json`: esercizi di lettura con lettere, sillabe, parole minuscole e brevi frasi abbinate a immagini.
- `writing.json`: 80 writing items with syllables and masked-word completion.
- `practice-lessons.json`: 32 guided mini-lessons, 8 each for addition, subtraction, reading, and writing.

## Educational Design Principles

1. Use concrete visual representations for early numeracy. Addition should be shown as “putting together”; subtraction as “taking away”.
2. Use small quantities first, then progressively increase number range and answer choices.
3. Include subitizing tasks for very small groups, because children benefit from recognizing small quantities without counting every object.
4. Encourage counting all, counting on, starting from the larger number, and counting backward.
5. Use fingers and manipulatives as acceptable supports rather than errors.
6. Use short, explicit instructions and immediate feedback.
7. Reduce cognitive load: one task per screen, few answer options, large tap targets, no unnecessary text.
8. For Italian literacy, use uppercase, common vowels/consonants, open syllables, and concrete regular words.
9. Use syllable support in reading and writing because Italian orthography is relatively transparent and syllables are practical early units.
10. Use spaced repetition and adaptive review: recycle missed items soon, then later.

## Content Expansion Rules

When adding new items:
- Keep child-facing Italian short and concrete.
- Validate JSON syntax.
- Keep IDs unique.
- Ensure `correctAnswer` appears in `answers`.
- Do not duplicate answer choices.
- Keep subtraction non-negative.
- Keep `difficulty` exactly one of: `facile`, `medio`, `difficile`.
- Keep facts neutral, positive, non-frightening, and sourced.
- Prefer authoritative sources: NASA, ESA, NOAA, UNESCO, Natural History Museum, Smithsonian, National Geographic Kids, San Diego Zoo, public education resources.

## Suggested Runtime Logic

Use manual content for curated reading, writing, lessons, and facts. Use dynamic generation for extra math fluency once the child understands the task, but constrain generated questions by difficulty and validate answer options before display.

## Validation Performed

The current dataset was checked for:
- Valid JSON parse.
- Unique IDs per file.
- Correct answers present in answer arrays.
- No duplicate answer choices.
- Non-negative subtraction results.
- Required difficulty labels.
- Required counts per requested category.
