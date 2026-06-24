Take a look at this glossary of soccer terms for a competitive kids soccer team. I want you to build an interactive web app, that covers this glossary. The important part is to list these terms so the players can learn these as trigger words or queues from coaches. The user could pick one of the terms and it would show the word, and the brief definition. Then show an interactive 2D pitch with red and blue players (red attacking, blue defending). We need to build a visualization engine for this where the players can move, and the ball can move. Each glossary term will show a representative game sequence where the players are demonstrating the term. For each term we should show 1 or 2 "bad" versions that don't do the word that we're trying to teach, and show why it fails. Then the "good" version that shows what is actually suppose to happen and annotate why it's good.

So this 2d engine should show a sequence, the bad and the good versions. It should go step by step, and pause to annotate.  The sequence should have a play/pause button with a track bar for the user to jump forward or backward. There should also be a "speed" slider for slower faster.

We should think of really good examples for each term in the glossary, and the examples should be definitively reflected in the rendering sequence. For example, a good one for "touch tight" would be defending a throw-in, where the defender hounds the mark, by staying close to them and in between them and the ball -- the poor example would be giving them too much space, defending a zone instead of a player.

Another good one is check in, check out... when attempting to receive a throw in or a free kick, simply standing still and getting blocked by a defender is poor version of play, where check in: the player attempts to move close to the ball, being followed by the opposing defender, then pivoting and exploding into free space, which tricks the defender a bit.

During planning you should come up with a written list of examples that you want to use for each glossary term. These should be shown in the description box for each sequence, with good vs. bad. Maybe the terms should be "CORRECT" vs "INCORRECT". If you can think of 2 solid INCORRECT styles of play then put both, but we need at least 1 SOLID Incorrect.

The field of play should indicate only 1 half or 2/3 of the field of play, so as to clearly indicate the net that the attackers are trying to get for. The goal should be at the top or bottom, and switch based on whether we are defending or attacking. 

Don't put 11 v 11, only put the representative players required. Not just who is involved, but maybe the defending keeper marked GK and some other defender/attacker pairing thats in an inconsequential location.

## Phase 2
I want the colors to be "our team" and "their team" , not necessarily Red = attacking, blue defeneding. Make the colors selectable: Our team: default Blue, their team: default red. Also, make sure the goalkeeper GK is the proper color: shouldn't always be blue - should match the color of the correct team.

## Phase 3
### Bugs/Improvements needed:
- When using this in "Phone view" on chrome, at 400x800, the rendered soccer pitch changes size when we select different terminology items like "Switch" to "Overloads"
- For the term selection area, each term doesn't need to have a colorized bullet point anymore, or a bullet point at all
- The term selection should switch to a drop-down I think when using on a phone? Side scrolling sucks
- pitch rendering: The small penalty kick partial circle outside the goal box currently, overlaps the outer goalie box, i think its meant to actually terminate at the box.
- For throw-ins, the ball should start on the edge of the pitch, and have a little annotation above it that says "Opponent Throw" or similar
- When you hit play on any sequence, it should automatically cycle through each of the stages and play until completion. each step or stage should pause for 8 seconds, but should scale with the "speed" selection. When paused, there should be a Forward and Back button next to the play pause button, that is used to play the sequence forward and stop on on the next step, or backward and stop on the previous step.

### Individual sequency term issues
Ensure to update the scenario sequence dialogue/annotations with the new scenario details:
- For touch tight-Incorrect standing off scenario, the receiving opponent player runs away from the net when receiving the ball in the first portion, which is wrong, lets have him just control the ball. Also in that first part have the goal side defender back up a bit towards the net to really show weak defending/giving too much space. In the following part have the attacker walk in and shoot the ball hard and score, left corner
- For touch tight-Incorrect, marking the zone scenario, In the second and third parts of the scenario have the defender trail the attacker, but unable to keep up. 
- For Press-Incorrect standing off, Don't have the attacker losing the ball or heavy touching the ball. Instead, have the attacker (in posession) move the ball towards the net, and the defender continues to back off, not pressuring the attacker. Then create the remaining scenario in a way where the attackers have a striking opportunity because there was no pressure.
-- For Press-Correct, have the defender pressure the opponent, and in the second part, this causes a heavy touch/loose ball, which the defender capitializes on and takes possession
-- In the press-correct scenario, have the other defender perform a proper "cover"
- In the Cover-Incorrect, both dive in scene, during the first part of the scene, make both defeneders truly pressure the attacker with the ball. Make the on-ball attacker start wide left, with a teammate wide right, trailing. The two defenders both pressure the on-ball attacker, which gives an easy switch pass in the second sequence to his attacker on the right, who moves in and scores with the two over-committed defenders trailing, but out of position
- The cover-correct,cover behind scenario is great! Add another section to the end where the defender that recovered the ball moves the ball to the side and the defending team mate moves to the wing, right at the edge to look for the pass.
- For "Goal Side, Incorrect - Ball-watching" have the defender slowly trail but can't keep up with the sprinting attacker. Add a final sequence where the attacker scores.
- For both Goal Side Correct and Incorrect, there should be a second defender loosely standing off the original on-ball attacker, applying a bit of pressure, forcing the pass that occurs.
- For "Delay, Incorrect Diving In" In the second part of the sequence, have overcommited defender still slowly trail the attacker, but doesn't catch up.
- For "Delay, Correct Delay & Jockey", In the third part of the sequency, Have the attacker and the delaying defender, continue to move to the left side wide, while the returining defender moves further toward the goal to cover.
- For Check In, Check out, correct version, the attacking player isn't currently moving toward the ball. Have them move toward the throw in, then in the second part, run towards the goal. Show the defender as being slowly catching up but unable.
- For "Switch, Incorrect" Show multiple sequences of the attacker trying to move the ball solo, and the two defenders ganging-up, and eventually taking the ball, while the attacker's team mate is wide open.
- For "Switch, correct" have the first sequence show the on-ball attacker moving up the right line with the ball, and the two defenders pressing towards him from the net. The second sequence, the attacker "switches" and passes the ball to the open man. Even add a third covering defender to really emphasize the overloaded defense.
- For Half Turn scenarios, add a 120 degree vision cone that represents where the player is looking.


Phase 4
- Throw ins should have a player circle on the sideline; the thrower should be visible. Generally, they will only just slightly move into play for the rest of the sequence, unless I indicate otherwise.
- Instead of showing 3.4s / 5.8s for a sequence, it makes more sense to show "1 / 5" for step 1 of 5.
- I want the progress bar to continuously be visibily moving while playing even when we're paused. Combine this with little orange highlights on the progress bar when we've started a new sequence; which are the locations of the jump forward/backward points.
- Make the vision cone easier to see; it blends in with the green field too much.
- For all scenarios, there is a specific player on the field that is on Our Team that we are focussing on. Lets put the word "YOU" in there, similar how we put GK.
- Evaluate which other glossary terms and scenarios would directly benefit from the 120 degree vision cone. Don't go overboard.


Phase 5
- For scenario Press:Correct, in the last sequence the ball should move up with the "You" now that YOU are in possesion, for some reason it moves backward.
- Change any gender He/She into They or gender neutral
- For scenario Cover: Correct, In the third segment the opponent attacker should move a bit towards the YOU player, and the opponents should slowly and poorly follow their marks throughout the remainder of the sequence, standing off a bit.
- For scenario Half Turn: Correct, the YOU player should be left (270 degrees) at the start and when the receive the ball. Make them stand to the right a bit more. Their teammate attacker should be to the left a bit more. The defender should actually start between the goal and the receiving player, and attack to the right and cheat to the right when the defender presses. The YOU will receive the ball, having seen the defender, and will quickly offload to their open player with a through ball. Add segments at the start where we clearly identify with a drawn sight-line that the receiving player (YOU) can see the original on-ball passer, the defender marking them, and the opportunity through ball to their down-field teammate.

Phase 6
- Add a hidden debug mode. When debug is turned on, I can select and I can drag and move the circles around when the rendering is paused. On-screen on the field or next to the field, show me the details of my selection: identifier, position coordinates, direction facing (if applicable), which sequence I'm in (1, 2, 1.1, 1.2, decimal if between 1 and 2.). This will help me tell you where to move things when I want adjustments.

Phase 7
- Lets change compact to a corner kick defense. For incorrect: Put 5 defenders spread to far out, and 4 attackers right in front of the net ready to score, corner comes in to an attacker, there is a quick pass to an open attacker and they score; receiving the corner was easy because there were many options, the pass was easy because there was no compact unit blocking passing lanes, and the goal. Correct: Defense is compacted: 1 defender on the near post, the other on the far post, the rest of the players marked...pass comes in and defenders can move to intercept, boot it out of the box.
- Between the second-last and last stage of "Goal side, incorrect", have the YOU player turn their clockwise to face the goal (down).
- Goal-side correct should talk about taking away the "through pass" opportunity, as well as the defender having more time to defend against a pass.
- For Delay, incorrect and correct, the returning defender should be moving towards defending the goal in every part of the sequence, never standing still.
- In debug mode, make the "selection details" info box text-selectable so I can copy and paste it.
- Look at ottawavalleyfootballclub.ca 's black and gold trim colors. Re-do the webpages theme colors to match
- For Touch Tight, Incorrect - marking the zone, The starting position for YOU d1 should be G(0.21, 0.27), for sequence 1.0 and 2.0. d1 should move to G(0.33,0.29) from seq 2 to 3, and then stay there until the end. Change a1 to move to G(0.59,0.27) between seq 2.0 to 3.0 (while holding the ball). From 3.0 on they can do a run in and shoot to the goalie's right side and score.

Phase 8
- For Goal Side, incorrect and correct, d2 should start at (0.24, 0.39), then move, and at seq 2.0 be at (0.23, 0.42), then at seq 3.0 be at (0.20,0.45) and stay there til end.
- In Overloads-Correct, change the phrase from "Release the free player" to "Pass to the open attacker"
- In "Half-turn, correct" change the phrase from "First-time through ball..." to "one-touch pass into space for your open teammate"
- We have an icon in the top left, change it to the favicon from ottawavalleyfootballclub.ca