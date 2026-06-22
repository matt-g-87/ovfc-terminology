Take a look at this glossary of soccer terms for a competitive kids soccer team. I want you to build an interactive web app, that covers this glossary. The important part is to list these terms so the players can learn these as trigger words or queues from coaches. The user could pick one of the terms and it would show the word, and the brief definition. Then show an interactive 2D pitch with red and blue players (red attacking, blue defending). We need to build a visualization engine for this where the players can move, and the ball can move. Each glossary term will show a representative game sequence where the players are demonstrating the term. For each term we should show 1 or 2 "bad" versions that don't do the word that we're trying to teach, and show why it fails. Then the "good" version that shows what is actually suppose to happen and annotate why it's good.

So this 2d engine should show a sequence, the bad and the good versions. It should go step by step, and pause to annotate.  The sequence should have a play/pause button with a track bar for the user to jump forward or backward. There should also be a "speed" slider for slower faster.

We should think of really good examples for each term in the glossary, and the examples should be definitively reflected in the rendering sequence. For example, a good one for "touch tight" would be defending a throw-in, where the defender hounds the mark, by staying close to them and in between them and the ball -- the poor example would be giving them too much space, defending a zone instead of a player.

Another good one is check in, check out... when attempting to receive a throw in or a free kick, simply standing still and getting blocked by a defender is poor version of play, where check in: the player attempts to move close to the ball, being followed by the opposing defender, then pivoting and exploding into free space, which tricks the defender a bit.

During planning you should come up with a written list of examples that you want to use for each glossary term. These should be shown in the description box for each sequence, with good vs. bad. Maybe the terms should be "CORRECT" vs "INCORRECT". If you can think of 2 solid INCORRECT styles of play then put both, but we need at least 1 SOLID Incorrect.

The field of play should indicate only 1 half or 2/3 of the field of play, so as to clearly indicate the net that the attackers are trying to get for. The goal should be at the top or bottom, and switch based on whether we are defending or attacking. 

Don't put 11 v 11, only put the representative players required. Not just who is involved, but maybe the defending keeper marked GK and some other defender/attacker pairing thats in an inconsequential location.

## Phase 2
I want the colors to be "our team" and "their team" , not necessarily Red = attacking, blue defeneding. Make the colors selectable: Our team: default Blue, their team: default red. Also, make sure the goalkeeper GK is the proper color: shouldn't always be blue - should match the color of the correct team.

