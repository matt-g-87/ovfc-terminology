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


Phase 9
- When viewing on a phone in portrait mode, I want to increase the playing field size a bit, so lets see what we can do to minimize other things. 
 - One thing could be to remove the "trigger words, shown on the pitch" label for all views (PC and mobile), and then on mobile the "OVFC Terminology Trainer" title can fit one one line.
 - Another is that, when in a mobile resolution, Don't show the selected terminology title (e.g. Touch Tight) at the top, since its already displayed in the drop-down.
 - In mobile view only, what can we do to prevent the side-scrolling selection of Incorrect/Correct options, especially when there are 3 or more??
- For the incorrect/correct selection, lets make the "Correct" the default selection, and put it on the left.
- Make the default "Our Team" color, BLACK.

Phase 10
- Remove the speed control for now, from all views, to free up space
- When the view is mobile portrait, center the rewind, forward, play, etc. buttons

Phase 11
- In Mobile Landscape mode, the field is not visible at all. We should consider dedicating the right 40 to 50% of the screen to the field view, and the left side to the selection, controls, text, etc.

Phase 12
- Bring in all remaining glossary.md terms that we don't have yet. If you need clarification, we'll plan mode this

Phase 13
- For Compact-Incorrect, place defenders at: (0.23,0.09), (0.32,0.33), (0.70, 0.14), (0.57,0.55) and YOU d4 at (0.56,0.32)
- For any corner kicks, we should have an anotation above the the ball that its a corner kick (just like the one for throw ins)
- For Half-Turn, both incorrect and correct, put another defender at (0.40, 0.21) stationary for the entire sequence.
- For Touch-Tight correct, add some stages to the start where the red player tries to shake off the defender, but does so ineffectively; the defender stays close. Emphasize, that no matter where the attacker goes, the defender keeps eyes on them and stays tight.
- For Touch Tight, Incorrect 2 Marking Zone, Draw a wider yellow dashed circle around YOU that indicates the zone they are trying to cover, for seq 1 and 2.
- For touch tight, incorrect 1 standing off, from seq 2 to seq 3, players should move to: d1(0.47, 0.27), d2(0.74,0.43), a1 with ball (0.57,0.34), a2(0.83, 0.40), thrower (0.22, 0.34). Highlight that the attackers now have an unopposed attack several passing options. For sequence 3 to 4, have a1 shoot the ball to the goalies right corner, a1 moves to (0.57,0.24), ball to (0.58, 0.00), and highlight: Situation has become difficult to defend, attackers will have many options to attempt to score.
- Hunt (both scenarioes) needs to show us losing the ball when the opposing team takes it away from "YOU", then the coach yelling "HUNT"...then for CORRECT the player "YOU" goes back at it while the other person on our team COVERS during lost posession then moves forward to an open lane once we get the ball back. ... and for INCORRECT the players dropping back slightly and the opposing team having lots of space.
- For Shift, both versions, have the line of defenders start more to the right since the ball starts to the right. For correct, show the shift to the left. For the incorrect, show the right defender stationary, the middle defender drop back a bit towards the goalie a bit (diagonal), and the left defender move to pressure the attacker receiving the ball, but makes it only half way to them. Highlight that the defense is now spread out, and identify the holes that have been created.

Phase 14
- Evaluate the web app for High CPU usage and suggest improvements.
- For Hunt-Correct, the other teammate should cover at G(0.51, 0.41), and then breaks to 0.29, 0.54 once posession is won. Make the YOU player's poession definitive by having them break free of the opposing defender by a few more strides upward too. There is currently a bug with this, remember that Our Team is moving upward, not downward.

Phase 15
- For both Shift variants, put another attacker a3 at (0.49, 0.62). They remain there for the duration of both variants, unused.
- For Drop, start the scenarios as a red 2v1 overload, only 1 defender back, then the two opponent attackers with the advantage, then the two m1 and m2 are trailing (closer to midfield), where m1 and m2 have to catch up. In the correct scenario, they drop back at a fast pace, trying to keep up with the opposing attackers, who are moving towards the net, so show them all travelling at the same speed/total distance. Show how these defenders are sprinting, and then are able to assist and block passing lanes after D1 delays/jockeys the on ball attacker. In the Incorrect case, the m1 and m2 don't sprint back, they move 1/2 speed of the opponents back towards the goal line, and an overload 2v1 causes the sole defender to commit to the on ball attacker, a wide open pass to the other attacker, and then shoot score.
- Reduce the time between segments to 6 seconds instead of 8.

Phase 16
- Build a test suite that is able to capture the sequence visually, interpret what happened, and compare to what our intent is, to validate possible problems with our scenarios play-by-play implementation. The visual interpretation should watch the whole sequence and summarize whats happened, what players were there, who did what - all this without bias of the description. Then, take that summary and see if it matches the intent. If any issues are found, make a list of them and put them in audit.md for me to review. In the audit.md, also specify what the plan is to resolve them, in terms of corrections and new expected implementation, so I can review that as well.

Phase 17
- Look at audit.md and audit-flat.md, and amalgamate into a new audit-combined.md. Make sure that we don't lose any of the suggested ideas, and resolve issues where there are conflicts between the two md

Phase 18
- implement changes from audit-combined.md, but I want a way of looking at the old and the new scenarios. Maybe we just add a new copy of the new scenario and list it as "Title (new)" like "Skip (new)" if there is a new one. And then in the next phase I'll come back and tell you which one i like better.

Phase 19
We had made some (new) versions of the terminology, here I will list Keep and Revert for the new ones. If I say Keep, then we keep that (new) version. If they are in the revert list, then we go back to old. Remove the ones we don't want anymore.

Keep new:
Skip (new)
Turn (new)
Man On (new)
Time (new)
Weight (new)
Disperse (new)
Support (new)
Compact (new)

Revert to old, remove new:
Drive
Overloads
Passing angle
Secure
Goal Side

Remove altogther:
Remove Advanced platforms, both versions.


Phase 20: Corrections to Scenarios
-For Skip Incorrect, have the attacker try to dribble through the defensive line, to which one defender properly presses and the other covers, which stops the forward advance.
-For Drive, set up 4 defenders in two lines, back and mid. Mix in some offenseive players. Have the attacker starting to the side with the ball. Have the defenders tightly cover the other offensive players, which shows a CORRECT sign to play the ball up the side and push fast and hard up the side, carrying the ball forward. In the INCORRECT, the player starts up the side but incorrectly opts to pass the ball into the midst of the field to a covered teammate. This causes immediate pressure and the loss of the ball. Player should have "driven" the ball up the side.
- For Time Correct, have the rightmost defender step in to pressure the original attacker -- its this overcommit that the player SEES and they use their extra time to make a good pass to their rightmost teammate.
- For Time Incorrect, make it so the defender starts coming toward them, but they still have lots of time, and they panic and kick the ball downfield toward the net, rather than dribbling and deciding a better move.
- For Weight, put defender at G(0.36,0.41). For too heavy, make the pass go toward the keeper, such that in the subsequent stage, the keeper comes out and gets it first. the pass was too heavy because the ball wound up closer to the keeper and the keeper easily gets to it first. For too soft, make the pass get to where the teammate WAS before the run; insufficient power for a good through ball/lead pass.
- For Support, offense is offside. Add some more defenders. In the incorrect version, have the defenders block all passing lanes. In the correct version, have the attackers move up and give options where they move to create clear passing lanes that aren't obstructed by defenders.
- Rewrite Secure entirely. Have the attacker face 4 defenders: 1 is close in starting to pressure, the other three are goal side in a defensive line. Attacking teammates are still moving up the field. Best thing is for player to secure the ball away, backward from the pressing defender, while the attacking support is coming. Then they can start an attack. In the incorrect version, the player tries to drive the ball forward through the 4 defenders WHILE the attackers are coming up for support, but the drive is too soon and the ball is turned over in a tackle.
- For Compact Incorrect, move defender d2 to 0.47,0.10 for the entire duration.
- For Time (Correct) introduce a vision cone forward after the first touch and indicate that there is time to look and see the defenders and the pass opportunities.


Phase 21: More changes
- For "Turn", re-do the whole thing. Have the player start with the ball on the right side, near half, and heading up the side towards 3 defenders that are covering in a line and cheating right. Have 1 open attacker on the far left, moving up the field at the same time as the player. At stage 2, after moving up the field a bit, the player either (CORRECT) recognizes the defenders cheating right and turns the dribble to the center of the field. Then sees the available team mate and makes a pass. Highlight the effectiveness of the turn. In the incorrect case, the play drives up the sideline, the defenders cheat right even more and overload defend and take the ball.

Phase 22:
- For "Overloads" lets re-do the whole thing. Its a 3 on 3. Start off with the player to the left near midfield, moving up with the ball. There are two defenders starting to cheat to both pressure towards the player. The third defender hangs back deep center to cover. The other two attackers move forward, bypassing the pressure and get open. In correct, the player "recognizes" the possible overload - and "skips" the pressing defending line.. passes to the advancing attackers who now have a 2 on 1. Emphasize the recognition/creation of an overload scenario, then the 2v1 "uses" the overload: single defender commits to the on ball attacker, pass to the open man, scores. The incorrect version, the player tries to play straight through the 2 cheating defenders pressuring him, then loses the ball.

Phase 23:
- For Recycle/Reset: Small change for the Incorrect, the on-ball player should try to force dribble the ball through the traffic himself, which causes the turnover with the defensive overload, rather than the current through ball pass attempt.
- Man On, Correct: change the sentence "Don't turn into it." to "MAN ON - Don't turn into it."
- Passing angle, both: Add a second defender d2 at (0.42,0.31) so that the attacker isn't offside
- Weight (correct): between seq 1.0 and 2.0, the ball should end up at G(0.60, 0.34) which would be the goal-side foot of the other attacker. Adjust the line to point there too, and then the continuation in the following sequence should start from that spot.
- Re-do Bounce. Make it a 2v1 offensive balanced overload, 2 offense 1 defense. Your team mate starts with the ball on the left, you are on the right. The defender is back and center. The team mate starts with a pass to you. Make the "You" player have a cone pointed to top left corner, so that its obvious they can see the teammate and the defender. The defender reads this first pass: as the ball travels, the defender moves towards YOU. In the CORRECT version, you one touch bounce it back to your teammate to take advantage of the defender cheating towards YOU, the teammate then moves up the field for the break away. In the incorrect version, you try to dribble the ball up the side while the defender comes in for a challenge. This causes a DELAY and allows for other defenders to return (maybe start off with a third defender that is at midfield and trying to make it back)

Phase 24:
- For disperse (correct): split up the first major sequence into just the player's team dispersing, followed by a sequence where the opponent has to also disperse, which frees up many attack/passing lanes: draw lines to all three possible pass receivers to show the variety of lanes.
- For Support (correct): have a4 move to g(0.69, 0.64) and a3 move to (0.83, 0.52) during the transition from seq 1.0 to 2.0
- For Support (incorrect): have d2 move to (0.33,0.54) and d3 move to (0.69, 0.53) between 1.0 to 2.0 -- this blocks the passing lanes. Then show another sequence where the offensive options don't move, they don't support (find passing lanes). The player, with no support options is forced to try to take the ball up themselves but is stopped by the pressing d1.